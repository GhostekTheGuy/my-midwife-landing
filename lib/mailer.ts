import { Resend } from "resend"
import { getEmailTemplate } from "./email-templates"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL ?? "MyMidwife <onboarding@resend.dev>"
const TEST_EMAIL_OVERRIDE = process.env.TEST_EMAIL_OVERRIDE

type UserType = "patient" | "midwife"

function resolveRecipient(to: string): string {
  if (TEST_EMAIL_OVERRIDE) {
    console.log(`[TEST MODE] Redirecting email from ${to} to ${TEST_EMAIL_OVERRIDE}`)
    return TEST_EMAIL_OVERRIDE
  }
  return to
}

export async function sendDripEmail(
  to: string,
  userType: UserType,
  emailKey: string
) {
  const template = await getEmailTemplate(userType, emailKey)
  if (!template) {
    console.error(`No template found for ${userType}/${emailKey}`)
    return null
  }

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: resolveRecipient(to),
    subject: template.subject,
    html: template.body_html,
  })

  return result
}
