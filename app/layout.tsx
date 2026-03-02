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
  title: "MyMidwife – Znajdź położną online | Wsparcie w ciąży i porodzie",
  description:
    "Połącz się ze sprawdzoną położną online. Czat 24/7, dzienniczek ciąży i rzetelna wiedza ekspertów. Bezpiecznie. Prywatnie. Na Twoich zasadach.",
  metadataBase: new URL("https://mymidwife.pl"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MyMidwife – Twoja położna zawsze pod ręką",
    description:
      "Zweryfikowane położne online. Wsparcie w ciąży, przygotowanie do porodu i opieka w połogu – kiedy tego potrzebujesz.",
    url: "https://mymidwife.pl",
    siteName: "MyMidwife",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MyMidwife – platforma łącząca kobiety w ciąży z położnymi online",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyMidwife – Znajdź położną online",
    description:
      "Zweryfikowane położne. Czat 24/7. Bezpieczna ciąża i poród.",
    images: ["/og-image.jpg"],
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "name": "MyMidwife Sp. z o.o.",
                  "url": "https://mymidwife.pl",
                  "logo": "https://mymidwife.pl/icon.svg",
                  "description": "Platforma łącząca kobiety w ciąży ze zweryfikowanymi położnymi online",
                  "taxID": "5372694237",
                  "sameAs": [
                    "https://www.instagram.com/mymidwife.pl/",
                    "https://www.linkedin.com/company/mymidwife"
                  ],
                  "founder": {
                    "@type": "Person",
                    "name": "Joanna Romaniuk",
                    "jobTitle": "CEO & Founder"
                  }
                },
                {
                  "@type": "WebApplication",
                  "name": "MyMidwife",
                  "url": "https://mymidwife.pl",
                  "description": "Znajdź położną online – czat 24/7, dzienniczek ciąży i rzetelna wiedza ekspertów",
                  "applicationCategory": "HealthApplication",
                  "operatingSystem": "Web",
                  "inLanguage": "pl",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "PLN",
                    "availability": "https://schema.org/PreOrder"
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "MyMidwife Sp. z o.o."
                  }
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Czym jest MyMidwife?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "MyMidwife to innowacyjna platforma cyfrowa łącząca kobiety z doświadczonymi i zweryfikowanymi położnymi. Oferujemy bezpieczną przestrzeń do komunikacji, dostęp do rzetelnej wiedzy medycznej tworzonej przez ekspertów oraz zaawansowane narzędzia do monitorowania zdrowia w czasie ciąży."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Czy mogę skontaktować się z położną online przez MyMidwife?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Tak, MyMidwife umożliwia kontakt z położną online przez czat 24/7. Możesz szybko zadać pytanie swojej położnej i otrzymać profesjonalną poradę o każdej porze dnia i nocy."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Czy aplikacja będzie na iOS i Android?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Tak, planujemy wydanie dedykowanych aplikacji mobilnych na iOS i Android. Najpierw wypuścimy pilotaż w wersji webowej dostępnej na wszystkich urządzeniach. Dedykowane aplikacje pojawią się w kolejnym etapie rozwoju platformy."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Czy będzie możliwość umawiania położnej na NFZ?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Tak, platforma będzie wspierać umawianie wizyt zarówno w ramach opieki prywatnej, jak i na NFZ. Możliwość umawiania wizyt na NFZ będzie dostępna dla klinik współpracujących z MyMidwife."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Jak znaleźć położną w moim mieście?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "W MyMidwife przeglądasz zweryfikowane profile położnych z Twojej okolicy, czytasz opinie innych pacjentek i wybierasz specjalistkę dopasowaną do Twoich potrzeb. Wyszukiwarka uwzględnia lokalizację, specjalizacje i dostępność."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Ile kosztuje korzystanie z MyMidwife?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Rejestracja na platformie MyMidwife jest bezpłatna. Szczegółowy cennik usług zostanie opublikowany wraz z pełnym uruchomieniem platformy. Dołącz do listy oczekujących, aby otrzymać informacje jako pierwsza."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Jak przygotować się do porodu z MyMidwife?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "MyMidwife oferuje dostęp do sprawdzonych materiałów edukacyjnych tworzonych przez ekspertów, dzienniczek objawów do monitorowania ciąży oraz stały kontakt z położną, która pomoże Ci przygotować się do porodu świadomie i bez stresu."
                      }
                    }
                  ]
                }
              ]
            }),
          }}
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
