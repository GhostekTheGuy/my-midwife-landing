"use client"

import { BlurFade } from "@/components/ui/blur-fade"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Czym jest MyMidwife?",
    answer: "MyMidwife to innowacyjna platforma cyfrowa łącząca kobiety z doświadczonymi i zweryfikowanymi położnymi. Oferujemy bezpieczną przestrzeń do komunikacji, dostęp do rzetelnej wiedzy medycznej tworzonej przez ekspertów oraz zaawansowane narzędzia do monitorowania zdrowia w czasie ciąży. Nasza aplikacja umożliwia łatwe wyszukiwanie położnych, umawianie wizyt, prowadzenie dzienniczka objawów oraz utrzymywanie stałego kontaktu z wybraną specjalistką. Wszystko w jednym miejscu, z pełnym poszanowaniem prywatności i bezpieczeństwa danych.",
  },
  {
    question: "Czy aplikacja będzie na iOS i Android?",
    answer: "Tak, planujemy wydanie dedykowanych aplikacji mobilnych na iOS i Android. Jednak najpierw wypuścimy pilotaż w wersji webowej, która będzie dostępna na wszystkich urządzeniach - telefonach, tabletach i komputerach. Wersja webowa pozwoli nam zebrać cenne opinie użytkowników i dopracować funkcjonalności przed premierą aplikacji mobilnych. Dedykowane aplikacje na iOS i Android pojawią się w kolejnym etapie rozwoju platformy.",
  },
  {
    question: "Czy będzie możliwość umawiania położnej na NFZ?",
    answer: "Tak, będzie taka możliwość w przypadku klinik i placówek medycznych współpracujących z MyMidwife. Platforma będzie wspierać umawianie wizyt zarówno w ramach opieki prywatnej, jak i na NFZ. W przypadku wizyt na NFZ, możliwość umawiania będzie dostępna dla klinik, które mają podpisane umowy z Narodowym Funduszem Zdrowia i zdecydują się na integrację z naszą platformą. To pozwoli pacjentkom na łatwe i wygodne zarządzanie wizytami w jednym miejscu, niezależnie od formy finansowania opieki.",
  },
]

export function FAQSection() {
  return (
    <div 
      id="faq"
      className="relative z-10 w-full max-w-[828px] mx-auto px-4 sm:px-6 py-12 sm:py-20"
    >
      <div className="flex flex-col gap-[43px] w-full">
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="flex flex-col gap-7 text-center">
            <p className="text-[#989898] text-sm">
              Najczęściej zadawane pytania.
            </p>

            <h2 className="text-[32px] sm:text-[40px] md:text-[56px] font-bold text-[#0b0b0b] tracking-tight px-4 sm:px-0">
              Masz pytania?
            </h2>

            <p className="text-[#414141] text-base sm:text-lg md:text-xl max-w-[655px] mx-auto px-4 sm:px-0">
              Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące MyMidwife.
            </p>
          </div>
        </BlurFade>

        {/* FAQ Accordion */}
        <BlurFade delay={0.2}>
          <div className="w-full">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-base sm:text-lg font-normal text-[#0b0b0b] text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </BlurFade>
      </div>
    </div>
  )
}



