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

  // Find broadcast by ID or take oldest draft
  const broadcastId = request.nextUrl.searchParams.get("id")
  let broadcastQuery = supabase.from("broadcasts").select("*")

  if (broadcastId) {
    broadcastQuery = broadcastQuery.eq("id", broadcastId)
  } else {
    broadcastQuery = broadcastQuery.eq("status", "draft").order("created_at", { ascending: true })
  }

  const { data: broadcast, error: fetchError } = await broadcastQuery.limit(1).single()

  if (fetchError || !broadcast) {
    return NextResponse.json({ message: "No pending broadcasts" })
  }

  if (broadcast.status === "sending") {
    return NextResponse.json({ error: "Broadcast is currently being sent", status: broadcast.status }, { status: 400 })
  }

  // Mark as sending
  await supabase
    .from("broadcasts")
    .update({ status: "sending" })
    .eq("id", broadcast.id)

  // Find ALL recipients who already received a broadcast with the same subject (any status)
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
  let query = supabase
    .from("form_submissions")
    .select("id, email, city")
    .limit(10000)

  if (broadcast.target_user_type) {
    query = query.eq("user_type", broadcast.target_user_type)
  }
  if (broadcast.target_demo_testing) {
    query = query.eq("demo_testing", true)
  }
  if (broadcast.target_city) {
    // Support comma-separated city list with OR matching (each wrapped in %...%)
    const cities = broadcast.target_city.split(",").map((c: string) => c.trim()).filter(Boolean)
    if (cities.length === 1) {
      query = query.ilike("city", `%${cities[0]}%`)
    } else if (cities.length > 1) {
      query = query.or(cities.map((c: string) => `city.ilike.%${c}%`).join(","))
    }
  }

  const { data: allSubscribers, error: subError } = await query

  // Filter out subscribers who already received this broadcast subject
  let subscribers = (allSubscribers ?? []).filter((sub) => !excludeIds.has(sub.id))

  // Optional send limit from query param (e.g. ?limit=12)
  const sendLimit = request.nextUrl.searchParams.get("limit")
  if (sendLimit) {
    subscribers = subscribers.slice(0, parseInt(sendLimit, 10))
  }

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

  // Send in batches of 2 with delay to respect Resend rate limits (free tier: ~2/sec)
  const BATCH_SIZE = 2
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    if (i > 0) await new Promise((r) => setTimeout(r, 1500))

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

    const successfulRecipients: { broadcast_id: string; submission_id: string }[] = []

    for (let j = 0; j < results.length; j++) {
      const result = results[j]
      if (result.status === "fulfilled" && result.value.data) {
        sentCount++
        successfulRecipients.push({
          broadcast_id: broadcast.id,
          submission_id: batch[j].id,
        })
      } else {
        const errorDetail = result.status === "fulfilled"
          ? JSON.stringify(result.value.error)
          : result.reason?.message ?? result.reason
        console.error(`[broadcast] Failed to send to ${batch[j].id}:`, errorDetail)
        failedCount++
      }
    }

    // Batch insert all successful recipients at once
    if (successfulRecipients.length > 0) {
      await supabase.from("broadcast_recipients").insert(successfulRecipients)
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
