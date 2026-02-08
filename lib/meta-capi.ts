import { createHash } from "node:crypto"

interface MetaLeadEventParams {
  email: string
  eventSourceUrl: string
  clientUserAgent: string
  eventId: string
}

function sha256Hash(value: string): string {
  return createHash("sha256")
    .update(value.toLowerCase().trim())
    .digest("hex")
}

export async function sendLeadEvent(params: MetaLeadEventParams): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE

  if (!pixelId || !accessToken) {
    console.warn("[Meta CAPI] Missing META_PIXEL_ID or META_CAPI_ACCESS_TOKEN. Skipping event.")
    return
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: params.eventSourceUrl,
        event_id: params.eventId,
        user_data: {
          em: [sha256Hash(params.email)],
          client_user_agent: params.clientUserAgent,
        },
      },
    ],
  }

  if (testEventCode) {
    payload.test_event_code = testEventCode
  }

  const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`[Meta CAPI] HTTP ${response.status}: ${errorBody}`)
    } else {
      console.log("[Meta CAPI] Lead event sent successfully")
    }
  } catch (error) {
    console.error("[Meta CAPI] Failed to send event:", error)
  }
}
