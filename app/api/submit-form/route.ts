import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

interface FormSubmission {
  userType: "patient" | "midwife"
  email: string
  city: string
  privacyConsent: boolean
  demoTesting?: boolean
}

async function saveSubmission(data: FormSubmission) {
  const { data: submission, error } = await supabase
    .from("form_submissions")
    .insert({
      user_type: data.userType,
      email: data.email,
      city: data.city,
      privacy_consent: data.privacyConsent,
      demo_testing: data.demoTesting || false,
    })
    .select()
    .single()

  if (error) {
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
    
    // Provide more specific error messages
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

