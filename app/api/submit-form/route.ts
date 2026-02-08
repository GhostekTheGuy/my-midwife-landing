import { NextRequest, NextResponse, after } from "next/server"
import { supabase } from "@/lib/supabase"
import { z } from "zod"
import { sendLeadEvent } from "@/lib/meta-capi"

// Server-side validation schema (lightweight check)
const formSubmissionSchema = z.object({
  userType: z.enum(["patient", "midwife"]),
  email: z.string().email(),
  city: z.string().min(1),
  privacyConsent: z.literal(true),
  demoTesting: z.boolean().optional(),
})

type FormSubmission = z.infer<typeof formSubmissionSchema>

class DuplicateEmailError extends Error {
  readonly code = "DUPLICATE_EMAIL"
  constructor(message = "Ten adres email jest już zarejestrowany") {
    super(message)
  }
}

async function saveSubmission(data: FormSubmission) {
  // Normalize email before insert
  const normalizedEmail = data.email.toLowerCase().trim()
  const normalizedCity = data.city.trim()

  // Direct insert - let database handle uniqueness constraint
  // This is faster than checking existence first
  const { data: submission, error } = await supabase
    .from("form_submissions")
    .insert({
      user_type: data.userType,
      email: normalizedEmail,
      city: normalizedCity,
      privacy_consent: data.privacyConsent,
      demo_testing: data.demoTesting ?? false,
    })
    .select("id")
    .single()

  if (error) {
    // Check for unique constraint violation (PostgreSQL error code 23505)
    if (
      error.code === "23505" ||
      error.message?.toLowerCase().includes("duplicate") ||
      error.message?.toLowerCase().includes("unique") ||
      error.message?.includes("violates unique constraint")
    ) {
      throw new DuplicateEmailError()
    }
    throw error
  }

  return submission
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract Meta CAPI metadata before Zod validation
    const { _meta, ...formData } = body

    // Fast server-side validation with Zod
    const validationResult = formSubmissionSchema.safeParse(formData)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Nieprawidłowe dane formularza", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const submission = await saveSubmission(validationResult.data)

    // Schedule Meta CAPI Lead event to run after response is sent
    if (_meta?.eventSourceUrl && _meta?.clientUserAgent && _meta?.eventId) {
      after(async () => {
        await sendLeadEvent({
          email: validationResult.data.email,
          eventSourceUrl: _meta.eventSourceUrl,
          clientUserAgent: _meta.clientUserAgent,
          eventId: _meta.eventId,
        })
      })
    }

    return NextResponse.json(
      { success: true, message: "Form submitted successfully", data: submission },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("Failed to submit form:", error)

    // Handle duplicate email error
    if (error instanceof DuplicateEmailError) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }

    // Handle other errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Wystąpił błąd podczas przetwarzania formularza" },
      { status: 500 }
    )
  }
}
