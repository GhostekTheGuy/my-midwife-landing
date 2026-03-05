import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getEmailTemplate, wrapInBrandLayout } from "@/lib/email-templates"

function htmlPage(content: string) {
  return new NextResponse(content, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}

function previewWrapper(subject: string, emailHtml: string) {
  return `<div style="background:#f5f5f5;padding:20px;font-family:sans-serif;">
    <div style="max-width:600px;margin:0 auto;">
      <div style="background:#fff;padding:12px 16px;border-radius:8px 8px 0 0;border-bottom:1px solid #eee;">
        <p style="margin:0;color:#989898;font-size:13px;">Temat: <strong style="color:#0b0b0b;">${subject}</strong></p>
      </div>
      ${emailHtml}
    </div>
  </div>`
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userType = request.nextUrl.searchParams.get("type") as
    | "patient"
    | "midwife"
    | null
  const emailKey = request.nextUrl.searchParams.get("key")
  const broadcastId = request.nextUrl.searchParams.get("broadcast")

  // Preview broadcast by ID from database
  if (broadcastId) {
    const { data: broadcast, error } = await supabase
      .from("broadcasts")
      .select("subject, body_html")
      .eq("id", broadcastId)
      .single()

    if (error || !broadcast) {
      return htmlPage(`<h1>Nie znaleziono broadcastu</h1><p>ID: ${broadcastId}</p>`)
    }

    const html = wrapInBrandLayout(broadcast.body_html)
    return htmlPage(previewWrapper(broadcast.subject, html))
  }

  // Preview welcome template
  if (userType && emailKey) {
    const template = await getEmailTemplate(userType, emailKey)

    if (!template) {
      return htmlPage(`<h1>Nie znaleziono szablonu</h1><p>type=${userType}, key=${emailKey}</p>`)
    }

    return htmlPage(previewWrapper(template.subject, template.body_html))
  }

  // Index page — list all previews
  const { data: broadcasts } = await supabase
    .from("broadcasts")
    .select("id, subject, target_user_type, status, created_at")
    .order("created_at", { ascending: false })

  const broadcastLinks = broadcasts?.map(
    (b) =>
      `<li style="margin:8px 0;">
        <a href="?secret=${secret}&broadcast=${b.id}">${b.subject}</a>
        <span style="color:#989898;font-size:12px;"> — ${b.target_user_type ?? "wszyscy"} (${b.status})</span>
      </li>`
  ).join("") ?? "<li>Brak broadcastów</li>"

  return htmlPage(
    `<div style="font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
      <h2>Preview emaili MyMidwife</h2>
      <h3>Welcome:</h3>
      <ul>
        <li><a href="?secret=${secret}&type=patient&key=welcome">Pacjentka</a></li>
        <li><a href="?secret=${secret}&type=midwife&key=welcome">Położna</a></li>
      </ul>
      <h3>Broadcasty:</h3>
      <ul>${broadcastLinks}</ul>
    </div>`
  )
}
