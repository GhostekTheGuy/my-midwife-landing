import type React from "react"
import type { Metadata } from "next"
import { Inter_Tight } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { JoinModalWrapper } from "@/components/join-modal-wrapper"
import { PrivacyModalWrapper } from "@/components/privacy-modal-wrapper"
import "./globals.css"

const _interTight = Inter_Tight({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "MyMidwife - Łączymy kobiety z ekspertkami",
  description:
    "Platforma łącząca kobiety z ekspertkami położniczymi. Bezpieczeństwo, wiedza i wsparcie w jednej aplikacji.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <head>
        <link
          rel="preload"
          href="/images/Group 3-optimized.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1630333014765477');
fbq('track', 'PageView');
            `.trim(),
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1630333014765477&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={`font-sans antialiased ${_interTight.className} overflow-x-hidden`}>
        {children}
        <JoinModalWrapper />
        <PrivacyModalWrapper />
        <Analytics />
      </body>
    </html>
  )
}
