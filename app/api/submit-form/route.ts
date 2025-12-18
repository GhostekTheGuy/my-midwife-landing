import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { z } from "zod"

// Server-side validation schema (lightweight check)
const formSubmissionSchema = z.object({
  userType: z.enum(["patient", "midwife"]),
  email: z.string().email(),
  city: z.string().min(1),
  privacyConsent: z.literal(true),
  demoTesting: z.boolean().optional(),
})

type FormSubmission = z.infer<typeof formSubmissionSchema>

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
      const duplicateError = new Error("Ten adres email jest już zarejestrowany")
      ;(duplicateError as any).code = "DUPLICATE_EMAIL"
      throw duplicateError
    }
    throw error
  }

  return submission
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Fast server-side validation with Zod
    const validationResult = formSubmissionSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Nieprawidłowe dane formularza", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const submission = await saveSubmission(validationResult.data)

    return NextResponse.json(
      { success: true, message: "Form submitted successfully", data: submission },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error({ error: "Failed to submit form", error })
    
    // Handle duplicate email error
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "DUPLICATE_EMAIL"
    ) {
      return NextResponse.json(
        {
          error: (error as { message: string }).message || "Ten adres email jest już zarejestrowany",
        },
        { status: 409 }
      )
    }
    
    // Handle other errors
    if (error && typeof error === "object" && "message" in error) {
      return NextResponse.json(
        { error: (error as { message: string }).message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "Wystąpił błąd podczas przetwarzania formularza" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data: submissions, error } = await supabase
      .from("form_submissions")
      .select("*")
      .order("submitted_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ submissions }, { status: 200 })
  } catch (error: unknown) {
    console.error({ error: "Failed to read submissions", error })
    
    if (error && typeof error === "object" && "message" in error) {
      return NextResponse.json(
        { error: (error as { message: string }).message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

