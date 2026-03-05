import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("broadcasts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Fetch recipient counts per broadcast and user type
  const { data: recipients } = await supabase
    .from("broadcast_recipients")
    .select("broadcast_id, form_submissions(user_type)")
    .limit(10000)

  const recipientCounts: Record<string, { patient: number; midwife: number }> = {}
  for (const r of recipients ?? []) {
    const bid = r.broadcast_id
    if (!recipientCounts[bid]) recipientCounts[bid] = { patient: 0, midwife: 0 }
    const userType = (r as any).form_submissions?.user_type
    if (userType === "patient") recipientCounts[bid].patient++
    else if (userType === "midwife") recipientCounts[bid].midwife++
  }

  // Count all emails sent today via Resend (daily limit)
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayISO = todayStart.toISOString()

  const [
    { count: broadcastsToday },
    { count: dripToday },
    { count: submissionsToday },
  ] = await Promise.all([
    supabase.from("broadcast_recipients").select("*", { count: "exact", head: true }).gte("sent_at", todayISO),
    supabase.from("sent_emails").select("*", { count: "exact", head: true }).gte("sent_at", todayISO),
    supabase.from("form_submissions").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
  ])

  // Each form submission = welcome email + admin notification = 2 emails via sent_emails + notify
  // sent_emails already counts welcome/drip, submissionsToday counts notification emails
  const sentToday = (broadcastsToday ?? 0) + (dripToday ?? 0) + (submissionsToday ?? 0)

  const enriched = (data ?? []).map((b: any) => ({
    ...b,
    recipient_counts: recipientCounts[b.id] ?? { patient: 0, midwife: 0 },
  }))

  return NextResponse.json({ broadcasts: enriched, daily_limit: 100, sent_today: sentToday ?? 0 })
}
