import { NextRequest, NextResponse } from "next/server"
import { getEmailTemplate, wrapInBrandLayout } from "@/lib/email-templates"

export async function GET(request: NextRequest) {
  // Verify secret
  const secret = request.nextUrl.searchParams.get("secret")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userType = request.nextUrl.searchParams.get("type") as
    | "patient"
    | "midwife"
    | null
  const emailKey = request.nextUrl.searchParams.get("key")
  const mode = request.nextUrl.searchParams.get("mode") // "template" or "broadcast"

  // Broadcast preview: render raw HTML in brand layout
  if (mode === "broadcast") {
    const subject = request.nextUrl.searchParams.get("subject") ?? "Test broadcast"
    const bodyHtml = request.nextUrl.searchParams.get("body")

    if (!bodyHtml) {
      return new NextResponse(
        "<h1>Brak parametru body</h1><p>Dodaj ?body=&lt;html&gt; do URL</p>",
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      )
    }

    const html = wrapInBrandLayout(decodeURIComponent(bodyHtml))
    return new NextResponse(
      `<div style="background:#f5f5f5;padding:20px;font-family:sans-serif;">
        <div style="max-width:600px;margin:0 auto;">
          <div style="background:#fff;padding:12px 16px;border-radius:8px 8px 0 0;border-bottom:1px solid #eee;">
            <p style="margin:0;color:#989898;font-size:13px;">Temat: <strong style="color:#0b0b0b;">${subject}</strong></p>
          </div>
          ${html}
        </div>
      </div>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    )
  }

  // Template preview
  if (!userType || !emailKey) {
    return new NextResponse(
      `<div style="font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
        <h2>Preview emaili MyMidwife</h2>
        <h3>Welcome - pacjentka:</h3>
        <a href="?secret=${secret}&type=patient&key=welcome">Podgląd</a>
        <h3>Welcome - położna:</h3>
        <a href="?secret=${secret}&type=midwife&key=welcome">Podgląd</a>
        <hr style="margin:24px 0;"/>
        <h3>Broadcast (własny HTML):</h3>
        <code>?secret=${secret}&mode=broadcast&subject=Temat&body=&lt;h2&gt;Treść&lt;/h2&gt;</code>
      </div>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    )
  }

  const template = await getEmailTemplate(userType, emailKey)

  if (!template) {
    return new NextResponse(
      `<h1>Nie znaleziono szablonu</h1><p>type=${userType}, key=${emailKey}</p>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    )
  }

  return new NextResponse(
    `<div style="background:#f5f5f5;padding:20px;font-family:sans-serif;">
      <div style="max-width:600px;margin:0 auto;">
        <div style="background:#fff;padding:12px 16px;border-radius:8px 8px 0 0;border-bottom:1px solid #eee;">
          <p style="margin:0;color:#989898;font-size:13px;">Temat: <strong style="color:#0b0b0b;">${template.subject}</strong></p>
        </div>
        ${template.body_html}
      </div>
    </div>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  )
}
