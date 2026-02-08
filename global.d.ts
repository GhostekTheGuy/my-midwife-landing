// Meta Pixel (Facebook Pixel) Type Declarations

interface Window {
  fbq: (
    command: "track" | "trackCustom" | "init",
    eventName: string,
    parameters?: Record<string, unknown>
  ) => void
  _fbq: typeof Window.prototype.fbq
}
