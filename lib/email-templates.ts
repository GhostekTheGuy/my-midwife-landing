import { supabase } from "./supabase"

export interface EmailTemplate {
  subject: string
  body_html: string
}

type UserType = "patient" | "midwife"

const BRAND_COLOR = "#E87461"

function wrapInLayout(bodyHtml: string): string {
  return `
    <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a1a;">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="color:${BRAND_COLOR};font-size:24px;margin:0;">MyMidwife</h1>
      </div>
      ${bodyHtml}
      <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e5e5e5;text-align:center;color:#888;font-size:12px;">
        <p>MyMidwife &mdash; Twoja polozna w zasiegu reki</p>
      </div>
    </div>
  `
}

export async function getEmailTemplate(
  userType: UserType,
  emailKey: string
): Promise<EmailTemplate | null> {
  const { data, error } = await supabase
    .from("email_templates")
    .select("subject, body_html")
    .eq("user_type", userType)
    .eq("email_key", emailKey)
    .eq("active", true)
    .single()

  if (error || !data) {
    console.error(`No template found for ${userType}/${emailKey}:`, error?.message)
    return null
  }

  return {
    subject: data.subject,
    body_html: wrapInLayout(data.body_html),
  }
}

export function wrapInBrandLayout(bodyHtml: string): string {
  return wrapInLayout(bodyHtml)
}

export const DRIP_SCHEDULE = [
  { key: "welcome", delayDays: 0 },
  { key: "day3", delayDays: 3 },
  { key: "day7", delayDays: 7 },
] as const
