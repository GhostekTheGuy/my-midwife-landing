import { supabase } from "./supabase"

export interface EmailTemplate {
  subject: string
  body_html: string
}

type UserType = "patient" | "midwife"

function wrapInLayout(bodyHtml: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin:0;padding:0;background-color:#FEFBFD;">
      <div style="font-family:'Inter Tight',system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;background-color:#ffffff;">
        <!-- Header -->
        <div style="padding:32px 24px;text-align:center;">
          <a href="https://mymidwife.pl" style="text-decoration:none;">
            <img src="https://mymidwife.pl/mail_logo.png" alt="MyMidwife" width="220" style="max-width:220px;height:auto;" />
          </a>
        </div>
        <!-- Content -->
        <div style="padding:36px 32px;color:#0b0b0b;">
          ${bodyHtml}
        </div>
        <!-- Footer -->
        <div style="text-align:center;padding:0;">
          <img src="https://mymidwife.pl/mail_bottom.png" alt="MyMidwife – platforma łącząca przyszłe mamy z ekspertkami" width="600" style="width:100%;max-width:600px;height:auto;display:block;" />
        </div>
        <!-- Social -->
        <div style="text-align:center;padding:20px 24px 28px;background-color:#FEFBFD;">
          <table align="center" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="padding:0 10px;">
                <a href="https://www.instagram.com/mymidwife.pl/" style="text-decoration:none;">
                  <img src="https://cdn.jsdelivr.net/gh/dmhendricks/signature-social-icons@master/icons/round-flat-filled/35px/instagram.png" alt="Instagram" width="28" height="28" style="display:block;" />
                </a>
              </td>
              <td style="padding:0 10px;">
                <a href="https://www.facebook.com/profile.php?id=61587394923370" style="text-decoration:none;">
                  <img src="https://cdn.jsdelivr.net/gh/dmhendricks/signature-social-icons@master/icons/round-flat-filled/35px/facebook.png" alt="Facebook" width="28" height="28" style="display:block;" />
                </a>
              </td>
              <td style="padding:0 10px;">
                <a href="https://www.linkedin.com/company/mymidwife/" style="text-decoration:none;">
                  <img src="https://cdn.jsdelivr.net/gh/dmhendricks/signature-social-icons@master/icons/round-flat-filled/35px/linkedin.png" alt="LinkedIn" width="28" height="28" style="display:block;" />
                </a>
              </td>
            </tr>
          </table>
          <p style="color:#989898;font-size:11px;margin:12px 0 0 0;font-family:'Inter Tight',system-ui,sans-serif;">MyMidwife Sp. z o.o. &bull; <a href="https://mymidwife.pl" style="color:#e352ad;text-decoration:none;">mymidwife.pl</a></p>
        </div>
      </div>
    </body>
    </html>
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