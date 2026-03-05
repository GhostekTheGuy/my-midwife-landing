import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { sendDripEmail } from "@/lib/mailer"
import { DRIP_SCHEDULE } from "@/lib/email-templates"

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const results: Array<{ email: string; emailKey: string; success: boolean }> =
    []

  // For each drip step (skip welcome - it's sent immediately)
  for (const step of DRIP_SCHEDULE) {
    if (step.key === "welcome") continue

    // Find subscribers who:
    // 1. Signed up at least `delayDays` ago
    // 2. Haven't received this email yet
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - step.delayDays)

    const { data: eligibleSubscribers, error } = await supabase
      .from("form_submissions")
      .select(
        `
        id,
        email,
        user_type,
        submitted_at
      `
      )
      .lte("submitted_at", cutoffDate.toISOString())
      .eq("demo_testing", false)

    if (error) {
      console.error(`Error fetching subscribers for ${step.key}:`, error)
      continue
    }

    if (!eligibleSubscribers?.length) continue

    // Get already sent emails for this step
    const { data: alreadySent } = await supabase
      .from("sent_emails")
      .select("submission_id")
      .eq("email_key", step.key)

    const sentIds = new Set(alreadySent?.map((s) => s.submission_id) ?? [])

    // Filter to only those who haven't received this email
    const toSend = eligibleSubscribers.filter((sub) => !sentIds.has(sub.id))

    for (const subscriber of toSend) {
      try {
        const result = await sendDripEmail(
          subscriber.email,
          subscriber.user_type as "patient" | "midwife",
          step.key
        )

        if (result?.data) {
          // Record that we sent this email
          await supabase.from("sent_emails").insert({
            submission_id: subscriber.id,
            email_key: step.key,
          })

          results.push({
            email: subscriber.email,
            emailKey: step.key,
            success: true,
          })
        } else {
          results.push({
            email: subscriber.email,
            emailKey: step.key,
            success: false,
          })
        }
      } catch (err) {
        console.error(
          `Failed to send ${step.key} to ${subscriber.email}:`,
          err
        )
        results.push({
          email: subscriber.email,
          emailKey: step.key,
          success: false,
        })
      }
    }
  }

  return NextResponse.json({
    processed: results.length,
    successful: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
  })
}
