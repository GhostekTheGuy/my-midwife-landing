import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { supabase } from "@/lib/supabase"
import { wrapInBrandLayout } from "@/lib/email-templates"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.FROM_EMAIL ?? "MyMidwife <onboarding@resend.dev>"
const TEST_EMAIL_OVERRIDE = process.env.TEST_EMAIL_OVERRIDE

export async function POST(request: NextRequest) {
  // Verify secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Find the oldest broadcast in "draft" status
  const { data: broadcast, error: fetchError } = await supabase
    .from("broadcasts")
    .select("*")
    .eq("status", "draft")
    .order("created_at", { ascending: true })
    .limit(1)
    .single()

  if (fetchError || !broadcast) {
    return NextResponse.json({ message: "No pending broadcasts" })
  }

  // Mark as sending
  await supabase
    .from("broadcasts")
    .update({ status: "sending" })
    .eq("id", broadcast.id)

  // Build subscriber query
  let query = supabase
    .from("form_submissions")
    .select("email")
    .eq("demo_testing", false)

  if (broadcast.target_user_type) {
    query = query.eq("user_type", broadcast.target_user_type)
  }
  if (broadcast.target_city) {
    query = query.ilike("city", broadcast.target_city)
  }

  const { data: subscribers, error: subError } = await query

  if (subError || !subscribers?.length) {
    await supabase
      .from("broadcasts")
      .update({ status: "failed" })
      .eq("id", broadcast.id)

    return NextResponse.json({
      error: "No subscribers found",
      detail: subError?.message,
    })
  }

  const wrappedHtml = wrapInBrandLayout(broadcast.body_html)

  let sentCount = 0
  let failedCount = 0

  // Send in batches of 10 to respect rate limits
  const BATCH_SIZE = 10
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE)

    const results = await Promise.allSettled(
      batch.map((sub) =>
        resend.emails.send({
          from: FROM_EMAIL,
          to: TEST_EMAIL_OVERRIDE ?? sub.email,
          subject: broadcast.subject,
          html: wrappedHtml,
        })
      )
    )

    for (const result of results) {
      if (result.status === "fulfilled" && result.value.data) {
        sentCount++
      } else {
        failedCount++
      }
    }
  }

  // Update broadcast status
  await supabase
    .from("broadcasts")
    .update({
      status: "sent",
      sent_count: sentCount,
      failed_count: failedCount,
      sent_at: new Date().toISOString(),
    })
    .eq("id", broadcast.id)

  return NextResponse.json({
    broadcast_id: broadcast.id,
    sent_count: sentCount,
    failed_count: failedCount,
    total_subscribers: subscribers.length,
  })
}
