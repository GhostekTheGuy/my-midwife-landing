import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL

const USER_TYPE_LABELS: Record<string, string> = {
  patient: "Pacjentka",
  midwife: "Położna",
}

interface NotifyPayload {
  userType: string
  email: string
  city: string
  demoTesting?: boolean
}

export async function notifyNewSubmission(data: NotifyPayload) {
  if (!NOTIFICATION_EMAIL) {
    console.warn("NOTIFICATION_EMAIL not set, skipping notification")
    return
  }

  const label = USER_TYPE_LABELS[data.userType] ?? data.userType

  await resend.emails.send({
    from: "MyMidwife <onboarding@resend.dev>",
    to: NOTIFICATION_EMAIL,
    subject: `Nowy wniosek: ${label} z ${data.city}`,
    html: `
      <h2>Nowe zgłoszenie na MyMidwife</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;">
        <tr><td style="padding:8px 16px;font-weight:bold;">Typ</td><td style="padding:8px 16px;">${label}</td></tr>
        <tr><td style="padding:8px 16px;font-weight:bold;">Email</td><td style="padding:8px 16px;">${data.email}</td></tr>
        <tr><td style="padding:8px 16px;font-weight:bold;">Miasto</td><td style="padding:8px 16px;">${data.city}</td></tr>
        <tr><td style="padding:8px 16px;font-weight:bold;">Demo testing</td><td style="padding:8px 16px;">${data.demoTesting ? "Tak" : "Nie"}</td></tr>
      </table>
    `,
  })
}
