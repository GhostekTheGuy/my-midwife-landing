import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

interface FormSubmission {
  userType: "patient" | "midwife"
  email: string
  city: string
  privacyConsent: boolean
  demoTesting?: boolean
}

async function checkEmailExists(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("form_submissions")
    .select("id")
    .eq("email", email.toLowerCase().trim())
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error({ error: "Error checking email existence", error })
    // If there's an error checking, we'll allow the insert to proceed
    // The unique constraint in the database will catch duplicates
    return false
  }

  return data !== null
}

async function saveSubmission(data: FormSubmission) {
  // Check if email already exists
  const emailExists = await checkEmailExists(data.email)
  if (emailExists) {
    const error = new Error("Ten adres email jest już zarejestrowany")
    ;(error as any).code = "DUPLICATE_EMAIL"
    throw error
  }

  const { data: submission, error } = await supabase
    .from("form_submissions")
    .insert({
      user_type: data.userType,
      email: data.email.toLowerCase().trim(),
      city: data.city.trim(),
      privacy_consent: data.privacyConsent,
      demo_testing: data.demoTesting || false,
    })
    .select()
    .single()

  if (error) {
    // Check if it's a unique constraint violation
    if (error.code === "23505" || error.message?.includes("duplicate") || error.message?.includes("unique")) {
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

    // Validate required fields
    if (!body.userType || !body.email || !body.city || body.privacyConsent !== true) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate userType
    if (!["patient", "midwife"].includes(body.userType)) {
      return NextResponse.json(
        { error: "Invalid user type" },
        { status: 400 }
      )
    }

    const submission = await saveSubmission({
      userType: body.userType,
      email: body.email,
      city: body.city,
      privacyConsent: body.privacyConsent,
      demoTesting: body.demoTesting || false,
    })

    return NextResponse.json(
      { success: true, message: "Form submitted successfully", data: submission },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error({ error: "Failed to submit form", error })
    
    // Handle duplicate email error
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "DUPLICATE_EMAIL") {
      return NextResponse.json(
        { error: (error as { message: string }).message || "Ten adres email jest już zarejestrowany" },
        { status: 409 }
      )
    }
    
    // Provide more specific error messages
    if (error && typeof error === "object" && "message" in error) {
      // Check for PostgreSQL unique constraint violation
      const errorMessage = (error as { message: string }).message
      if (errorMessage.includes("duplicate") || errorMessage.includes("unique") || errorMessage.includes("23505")) {
        return NextResponse.json(
          { error: "Ten adres email jest już zarejestrowany" },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
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

