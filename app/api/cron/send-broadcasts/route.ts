import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { supabase } from "@/lib/supabase"
import { wrapInBrandLayout } from "@/lib/email-templates"

export const maxDuration = 60

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.FROM_EMAIL ?? "MyMidwife <onboarding@resend.dev>"
const TEST_EMAIL_OVERRIDE = process.env.TEST_EMAIL_OVERRIDE

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Find draft broadcasts whose scheduled_at has passed
  const now = new Date().toISOString()
  const { data: drafts, error } = await supabase
    .from("broadcasts")
    .select("*")
    .eq("status", "draft")
    .not("scheduled_at", "is", null)
    .lte("scheduled_at", now)
    .order("scheduled_at", { ascending: true })

  if (error || !drafts?.length) {
    return NextResponse.json({ message: "No scheduled broadcasts due" })
  }

  const results = []

  for (const broadcast of drafts) {
    // Mark as sending
    await supabase
      .from("broadcasts")
      .update({ status: "sending" })
      .eq("id", broadcast.id)

    // Deduplication: find recipients who already got this subject
    const { data: sameBroadcasts } = await supabase
      .from("broadcasts")
      .select("id")
      .eq("subject", broadcast.subject)

    const sameBroadcastIds = (sameBroadcasts ?? []).map((b: any) => b.id)
    let excludeIds = new Set<string>()
    if (sameBroadcastIds.length > 0) {
      const { data: alreadySent } = await supabase
        .from("broadcast_recipients")
        .select("submission_id")
        .in("broadcast_id", sameBroadcastIds)
        .limit(10000)
      excludeIds = new Set((alreadySent ?? []).map((r: any) => r.submission_id))
    }

    // Build subscriber query
    let query = supabase.from("form_submissions").select("id, email").limit(10000)

    if (broadcast.target_user_type) {
      query = query.eq("user_type", broadcast.target_user_type)
    }
    if (broadcast.target_demo_testing) {
      query = query.eq("demo_testing", true)
    }
    if (broadcast.target_city) {
      const cities = broadcast.target_city.split(",").map((c: string) => c.trim()).filter(Boolean)
      if (cities.length === 1) {
        query = query.ilike("city", `%${cities[0]}%`)
      } else if (cities.length > 1) {
        query = query.or(cities.map((c: string) => `city.ilike.%${c}%`).join(","))
      }
    }

    const { data: allSubscribers, error: subError } = await query
    let subscribers = (allSubscribers ?? []).filter((sub) => !excludeIds.has(sub.id))

    if (subError || !subscribers?.length) {
      await supabase.from("broadcasts").update({ status: "failed" }).eq("id", broadcast.id)
      results.push({ id: broadcast.id, error: "No subscribers found" })
      continue
    }

    const wrappedHtml = wrapInBrandLayout(broadcast.body_html)
    let sentCount = 0
    let failedCount = 0

    const BATCH_SIZE = 2
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      if (i > 0) await new Promise((r) => setTimeout(r, 1500))

      const batch = subscribers.slice(i, i + BATCH_SIZE)
      const sendResults = await Promise.allSettled(
        batch.map((sub) =>
          resend.emails.send({
            from: FROM_EMAIL,
            to: TEST_EMAIL_OVERRIDE ?? sub.email,
            subject: broadcast.subject,
            html: wrappedHtml,
          })
        )
      )

      const successfulRecipients: { broadcast_id: string; submission_id: string }[] = []
      for (let j = 0; j < sendResults.length; j++) {
        const result = sendResults[j]
        if (result.status === "fulfilled" && result.value.data) {
          sentCount++
          successfulRecipients.push({ broadcast_id: broadcast.id, submission_id: batch[j].id })
        } else {
          failedCount++
        }
      }

      if (successfulRecipients.length > 0) {
        await supabase.from("broadcast_recipients").insert(successfulRecipients)
      }
    }

    await supabase
      .from("broadcasts")
      .update({ status: "sent", sent_count: sentCount, failed_count: failedCount, sent_at: new Date().toISOString() })
      .eq("id", broadcast.id)

    results.push({ id: broadcast.id, sent_count: sentCount, failed_count: failedCount })
  }

  return NextResponse.json({ sent: results })
}
