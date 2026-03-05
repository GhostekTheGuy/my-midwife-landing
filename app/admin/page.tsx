"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"

interface Broadcast {
  id: string
  subject: string
  body_html: string
  target_user_type: string | null
  target_city: string | null
  status: string
  sent_count: number
  failed_count: number
  created_at: string
  sent_at: string | null
}

interface SendResult {
  broadcast_id: string
  sent_count: number
  failed_count: number
  total_subscribers: number
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "#989898" }}>Ładowanie...</div>}>
      <AdminContent />
    </Suspense>
  )
}

function AdminContent() {
  const searchParams = useSearchParams()
  const secret = searchParams.get("secret")

  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, SendResult>>({})
  const [limit, setLimit] = useState("")
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = useState("")

  const fetchBroadcasts = useCallback(async () => {
    if (!secret) return
    const res = await fetch(`/api/admin/broadcasts?secret=${secret}`)
    if (res.ok) {
      const data = await res.json()
      setBroadcasts(data)
    }
    setLoading(false)
  }, [secret])

  useEffect(() => {
    fetchBroadcasts()
  }, [fetchBroadcasts])

  if (!secret) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Brak dostępu</h1>
        <p style={{ color: "#989898" }}>Dodaj ?secret=TWOJ_SECRET do URL</p>
      </div>
    )
  }

  async function handleSend(broadcastId: string) {
    if (!confirm("Na pewno wysłać ten broadcast?")) return
    setSending(broadcastId)
    const limitParam = limit ? `&limit=${limit}` : ""
    const res = await fetch(`/api/send-broadcast?${limitParam}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}` },
    })
    const data = await res.json()
    if (data.broadcast_id) {
      setResults((prev) => ({ ...prev, [broadcastId]: data }))
    }
    setSending(null)
    fetchBroadcasts()
  }

  async function handlePreview(id: string) {
    if (previewId === id) {
      setPreviewId(null)
      return
    }
    const res = await fetch(`/api/preview-email?secret=${secret}&broadcast=${id}`)
    const html = await res.text()
    setPreviewHtml(html)
    setPreviewId(id)
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0b0b0b", margin: 0 }}>MyMidwife Mail</h1>
          <p style={{ color: "#989898", fontSize: 14, margin: "4px 0 0" }}>Panel wysyłki broadcastów</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ fontSize: 13, color: "#989898" }}>Limit:</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="brak"
            style={{ width: 70, padding: "6px 10px", border: "1px solid #EEE", borderRadius: 8, fontSize: 14 }}
          />
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#989898" }}>Ładowanie...</p>
      ) : broadcasts.length === 0 ? (
        <p style={{ color: "#989898" }}>Brak broadcastów. Dodaj w Supabase Table Editor.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {broadcasts.map((b) => (
            <div key={b.id} style={{ border: "1px solid #EEE", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: b.status === "draft" ? "#FFF3E0" : b.status === "sent" ? "#E8F5E9" : b.status === "sending" ? "#E3F2FD" : "#FFEBEE",
                      color: b.status === "draft" ? "#E65100" : b.status === "sent" ? "#2E7D32" : b.status === "sending" ? "#1565C0" : "#C62828",
                    }}>
                      {b.status}
                    </span>
                    <span style={{ fontSize: 11, color: "#989898", background: "#F5F5F5", padding: "2px 8px", borderRadius: 4 }}>
                      {b.target_user_type ?? "wszyscy"}
                    </span>
                    {b.target_city && (
                      <span style={{ fontSize: 11, color: "#989898", background: "#F5F5F5", padding: "2px 8px", borderRadius: 4 }}>
                        {b.target_city}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0b0b0b", margin: 0 }}>{b.subject}</h3>
                  {b.sent_at && (
                    <p style={{ fontSize: 12, color: "#989898", margin: "4px 0 0" }}>
                      Wysłano: {new Date(b.sent_at).toLocaleString("pl-PL")} – {b.sent_count} ok, {b.failed_count} błędów
                    </p>
                  )}
                  {results[b.id] && (
                    <p style={{ fontSize: 12, color: "#2E7D32", margin: "4px 0 0", fontWeight: 600 }}>
                      Wysłano {results[b.id].sent_count}/{results[b.id].total_subscribers}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handlePreview(b.id)}
                    style={{
                      padding: "8px 16px", border: "1px solid #EEE", borderRadius: 8,
                      background: previewId === b.id ? "#F5F5F5" : "#fff", cursor: "pointer", fontSize: 13,
                    }}
                  >
                    {previewId === b.id ? "Zamknij" : "Podgląd"}
                  </button>
                  {b.status === "draft" && (
                    <button
                      onClick={() => handleSend(b.id)}
                      disabled={sending === b.id}
                      style={{
                        padding: "8px 16px", border: "none", borderRadius: 8,
                        background: "#e352ad", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
                        opacity: sending === b.id ? 0.6 : 1,
                      }}
                    >
                      {sending === b.id ? "Wysyłam..." : "Wyślij"}
                    </button>
                  )}
                </div>
              </div>
              {previewId === b.id && (
                <div style={{ borderTop: "1px solid #EEE" }}>
                  <iframe
                    srcDoc={previewHtml}
                    style={{ width: "100%", height: 600, border: "none" }}
                    title="Preview"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
