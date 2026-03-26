import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { broadcast_id, scheduled_at } = await request.json()

  if (!broadcast_id) {
    return NextResponse.json({ error: "Missing broadcast_id" }, { status: 400 })
  }

  const { error } = await supabase
    .from("broadcasts")
    .update({ scheduled_at: scheduled_at || null })
    .eq("id", broadcast_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, scheduled_at })
}
