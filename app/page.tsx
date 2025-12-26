"use client"

import Image from "next/image"
import { RippleButton } from "@/components/ui/ripple-button"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid"
import { RotatingTestimonial } from "@/components/ui/rotating-testimonials"
import { BlurFade } from "@/components/ui/blur-fade"
import { UserSearch, MessageCircle, ClipboardList, BookOpen, Eye, Calendar, FileText } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useJoinModalStore } from "@/stores/join-modal-store"
import dynamic from "next/dynamic"

const TestimonialsSection = dynamic(() => import("@/components/testimonials-section").then(mod => ({ default: mod.TestimonialsSection })), {
  ssr: true,
})

const Footer = dynamic(() => import("@/components/footer").then(mod => ({ default: mod.Footer })), {
  ssr: true,
})

export default function Home() {
  const { openModal } = useJoinModalStore()
  
  return (
    <div className="min-h-screen bg-[#FEFBFD] relative">
      {/* Background - Full Page */}
      <div 
        className="fixed top-0 left-0 w-full h-full z-0"
        style={{
          backgroundImage: "url(/background.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />
      
      {/* Navigation */}
      <Navbar />

      {/* Main Section */}
      <main className="relative z-10 w-full flex flex-col items-center">
        
        {/* Hero Content */}
        <div className="w-full max-w-7xl px-4 sm:px-6 pt-12 sm:pt-16 pb-12 sm:pb-20">
          <div className="text-center mb-12">
            <BlurFade delay={0.1}>
              <p className="text-sm text-[#989a98] mb-4 tracking-wide">
                #medtech #mhealth #startup
              </p>
            </BlurFade>

            {/* Headline */}
            <BlurFade delay={0.2}>
              <h1 className="text-[48px] sm:text-[64px] md:text-[132px] font-bold text-[#0b0b0b] mb-0 tracking-tight px-4 sm:px-0">MyMidwife</h1>
            </BlurFade>

            {/* Description */}
            <BlurFade delay={0.3}>
              <p className="text-[rgba(65,65,65,1)] text-base sm:text-lg md:text-[24px] max-w-2xl mx-auto mb-4 px-4 sm:px-0">
                MyMidwife to platforma łącząca kobiety z ekspertkami.{" "}
                <span className="text-[rgba(230,159,205,1)]">Bezpieczeństwo, wiedza i wsparcie w jednej aplikacji.</span>
              </p>
            </BlurFade>

            <BlurFade delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 text-[rgba(10,10,10,1)] px-4 sm:px-0">
                <LiquidButton 
                  className="bg-[#0b0b0b] text-white hover:text-white rounded-[11px] px-4 sm:px-[11px] py-2 sm:py-[11px] text-sm sm:text-base border-0 w-full sm:w-auto h-auto [--liquid-button-background-color:#414141] [--liquid-button-color:#0b0b0b]"
                  onClick={openModal}
                >
                  Dołącz teraz
                </LiquidButton>
                <LiquidButton
                  className="bg-[#eac9df] text-white hover:text-white rounded-[11px] px-4 sm:px-[11px] py-2 sm:py-[11px] text-sm sm:text-base border-0 w-full sm:w-auto h-auto [--liquid-button-background-color:#e352ad] [--liquid-button-color:#eac9df]"
                  onClick={() => window.open("https://mymidwife.vercel.app/", "_blank")}
                >
                  Sprawdź demo
                </LiquidButton>
              </div>
            </BlurFade>

            {/* Trust section */}
            <BlurFade delay={0.5}>
              <div className="mb-12">
                <p className="text-sm text-[#989a98] mb-4">Partnerzy:</p>
                <div className="flex items-center justify-center gap-8 flex-wrap">
                  <Image
                    src="/co-logos/logos1.png"
                    alt="BraveCamp"
                    width={120}
                    height={20}
                    className="h-5 opacity-40 object-contain"
                    loading="lazy"
                  />
                  <Image
                    src="/co-logos/logos2.png"
                    alt="UAM INNOVATION HUB"
                    width={120}
                    height={20}
                    className="h-5 opacity-40 object-contain"
                    loading="lazy"
                  />
                  <Image
                    src="/co-logos/logos3.png"
                    alt="Innovation Hub"
                    width={120}
                    height={20}
                    className="h-5 opacity-40 object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </BlurFade>

            {/* Phone mockup with testimonials */}
            <BlurFade delay={0.6}>
              <div className="relative w-full max-w-7xl mx-auto">
                <div className="flex items-center justify-center gap-8 flex-wrap lg:flex-nowrap">
                  {/* Left testimonial */}
                  <div className="hidden lg:block relative z-20">
                    <RotatingTestimonial 
                      className="w-[232px]"
                      rotationInterval={5000}
                      indexOffset={0}
                    />
                  </div>

                  {/* Phone image */}
                  <div className="flex-shrink-0 relative z-10 w-full lg:w-auto">
                    <div className="relative w-full max-w-full lg:max-w-md mx-auto overflow-hidden lg:overflow-visible">
                      <Image
                        src="/images/Group 3.webp"
                        alt="MyMidwife App Interface"
                        width={1034}
                        height={1600}
                        className="h-auto w-full max-w-[517px] sm:max-w-[400px] md:max-w-[500px] scale-[2] lg:scale-[2] lg:max-w-none mx-auto"
                        style={{
                          marginTop: '112px',
                          marginBottom: '112px',
                          paddingTop: '0px',
                          paddingBottom: '0px',
                        }}
                        priority
                        quality={85}
                        sizes="(max-width: 640px) 800px, (max-width: 768px) 1000px, 1034px"
                        loading="eager"
                      />
                      {/* White gradient fade at bottom - mobile only */}
                      <div 
                        className="lg:hidden absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-30"
                        style={{
                          background: 'linear-gradient(to bottom, transparent 0%, rgba(254, 251, 253, 0.3) 30%, rgba(254, 251, 253, 0.7) 60%, rgba(254, 251, 253, 1) 100%)',
                        }}
                      />
                      {/* White gradient fade at right - mobile only */}
                      <div 
                        className="lg:hidden absolute top-0 right-0 bottom-0 w-32 pointer-events-none z-30"
                        style={{
                          background: 'linear-gradient(to right, transparent 0%, rgba(254, 251, 253, 0.3) 30%, rgba(254, 251, 253, 0.7) 60%, rgba(254, 251, 253, 1) 100%)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Right testimonial */}
                  <div className="hidden lg:block lg:-mt-[100px] relative z-20">
                    <RotatingTestimonial 
                      className="w-[232px]"
                      rotationInterval={5000}
                      indexOffset={1}
                    />
                  </div>
                </div>

                {/* Mobile testimonial - below phone image */}
                <div className="lg:hidden mt-8 relative z-20">
                  <div className="flex justify-center min-h-[181px]">
                    <RotatingTestimonial 
                      className="w-full max-w-[232px]"
                      rotationInterval={5000}
                      indexOffset={2}
                      disableHeightOffset={true}
                    />
                  </div>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>

        {/* Problems Section */}
        <div id="o-nas" className="relative z-10 w-full max-w-[828px] px-4 sm:px-6 py-12 sm:py-20">
          <div className="flex flex-col gap-[43px] w-full">
            {/* Header */}
            <div className="flex flex-col gap-7 text-center">
              <p className="text-[#989898] text-sm">
                Problem, który widzimy na co dzień.
              </p>

              <h2 className="text-[32px] sm:text-[40px] md:text-[56px] font-bold text-[#0b0b0b] tracking-tight px-4 sm:px-0">
                Trzy główne wyzwania
              </h2>

              <p className="text-[#414141] text-base sm:text-lg md:text-xl max-w-[655px] mx-auto px-4 sm:px-0">
                Zidentyfikowaliśmy kluczowe problemy, z którymi mierzą się kobiety i położne w systemie opieki okołoporodowej.
              </p>
            </div>

            {/* Three problem cards */}
            <div className="flex flex-col md:flex-row gap-[18px] w-full max-w-[828px] mx-auto text-left">
              {/* Problem 1: Niepewność */}
              <div className="flex flex-col gap-[17px] w-full md:w-[232px]">
                <div className="w-full h-[200px] sm:h-[240px] md:h-[274px] rounded-2xl overflow-hidden bg-gray-200 relative">
                  <Image
                    src="/stock/problem/problem1.jpg"
                    alt="Niepewność"
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 232px"
                  />
                </div>
                <h3 className="text-base sm:text-[19px] font-bold text-[#0b0b0b]">
                  Niepewność
                </h3>
                <p className="text-[#989898] text-sm leading-relaxed max-w-full md:max-w-[197px]">
                  Kobiet w wyborze odpowiedniej położnej i brak zaufanych informacji.
                </p>
              </div>

              {/* Problem 2: Niewykorzystana wiedza */}
              <div className="flex flex-col gap-[17px] w-full md:w-[232px]">
                <div className="w-full h-[200px] sm:h-[240px] md:h-[274px] rounded-2xl overflow-hidden bg-gray-200 relative">
                  <Image
                    src="/stock/problem/problem2.avif"
                    alt="Niewykorzystana wiedza"
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 232px"
                  />
                </div>
                <h3 className="text-base sm:text-[19px] font-bold text-[#0b0b0b]">
                  Niewykorzystana wiedza
                </h3>
                <p className="text-[#989898] text-sm leading-relaxed max-w-full md:max-w-[197px]">
                  Potencjał edukacyjny i ekspercki położnych nie dociera do pacjentek.
                </p>
              </div>

              {/* Problem 3: Brak kontaktu */}
              <div className="flex flex-col gap-[17px] w-full md:w-[232px]">
                <div className="w-full h-[200px] sm:h-[240px] md:h-[274px] rounded-2xl overflow-hidden bg-gray-200 relative">
                  <Image
                    src="/stock/problem/problem3.avif"
                    alt="Brak kontaktu"
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 232px"
                  />
                </div>
                <h3 className="text-base sm:text-[19px] font-bold text-[#0b0b0b]">
                  Brak kontaktu
                </h3>
                <p className="text-[#989898] text-sm leading-relaxed max-w-full md:max-w-[197px]">
                  Brak platformy umożliwiającej łatwy kontakt i wsparcie 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - Dla przyszłych mam */}
        <div id="pacjentki" className="relative z-10 w-full max-w-[828px] px-4 sm:px-6 py-12 sm:py-20 overflow-hidden">
          <div className="flex flex-col gap-[43px] w-full max-w-full">
            {/* Header */}
            <div className="flex flex-col gap-7 text-left">
              <p className="text-[#989898] text-sm">
                Dla przyszłych mam.
              </p>

              <h2 className="text-[32px] sm:text-[40px] md:text-[56px] font-bold text-[#0b0b0b] tracking-tight px-4 sm:px-0">
                Zadbaj o spokój<br />
                i bezpieczeństwo
              </h2>

              <p className="text-[#414141] text-base sm:text-lg md:text-xl max-w-[828px] px-4 sm:px-0">
                Ciąża to czas pełen pytań. MyMidwife to Twoja osobista asystentka, która zamienia niepewność w wiedzę, a stres w poczucie bezpieczeństwa.
              </p>
            </div>

            {/* Features Grid */}
            <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 sm:gap-[17px] w-full">
              {/* Left side - 4 feature cards in 2x2 grid */}
              <div className="grid grid-responsive-cards gap-4 sm:gap-[17px] w-full lg:flex-1 lg:min-w-0">
                {/* Card 1: Znajdź idealną Położną */}
                <div className="w-full min-w-0">
                  <div className="bg-white border border-[#EEE] rounded-2xl p-[17px] flex flex-col gap-[10px] w-full h-auto min-h-[250px]">
                    <div className="flex flex-col gap-[80px] sm:gap-[120px] lg:gap-[115px] w-full h-auto">
                      <div className="w-[25px] h-[25px] rounded-lg border border-[#EEE] flex items-center justify-center">
                        <UserSearch className="w-4 h-4 text-[#0b0b0b]" />
                      </div>
                      <h3 className="text-base font-normal text-[#0b0b0b]">
                        Znajdź idealną Położną
                      </h3>
                    </div>
                    <p className="text-[14px] font-normal text-[#989898] leading-relaxed w-full">
                      Koniec z szukaniem po omacku. Przeglądaj zweryfikowane profile, czytaj opinie i wybierz specjalistkę, której zaufasz w 100%.
                    </p>
                  </div>
                </div>

                {/* Card 2: Wsparcie 24/7 na Czacie */}
                <div className="w-full min-w-0">
                  <div className="bg-white border border-[#EEE] rounded-2xl p-[17px] flex flex-col gap-[10px] w-full h-auto min-h-[250px]">
                    <div className="flex flex-col gap-[80px] sm:gap-[120px] lg:gap-[115px] w-full h-auto">
                      <div className="w-[25px] h-[25px] rounded-lg border border-[#EEE] flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-[#0b0b0b]" />
                      </div>
                      <h3 className="text-base font-normal text-[#0b0b0b]">
                        Wsparcie 24/7 na Czacie
                      </h3>
                    </div>
                    <p className="text-[14px] font-normal text-[#989898] leading-relaxed w-full">
                      Masz pytania, które nie mogą czekać? Szybki kontakt z Twoją położną to gwarancja spokoju i profesjonalnej porady o każdej porze.
                    </p>
                  </div>
                </div>

                {/* Card 3: Dzienniczek objawów */}
                <div className="w-full min-w-0">
                  <div className="bg-white border border-[#EEE] rounded-2xl p-[17px] flex flex-col gap-[10px] w-full h-auto min-h-[250px]">
                    <div className="flex flex-col gap-[80px] sm:gap-[120px] lg:gap-[150px] w-full h-auto">
                      <div className="w-[25px] h-[25px] rounded-lg border border-[#EEE] flex items-center justify-center">
                        <ClipboardList className="w-4 h-4 text-[#0b0b0b]" />
                      </div>
                      <h3 className="text-base font-normal text-[#0b0b0b]">
                        Dzienniczek objawów
                      </h3>
                    </div>
                    <p className="text-[14px] font-normal text-[#989898] leading-relaxed w-full">
                      Monitoruj wagę, ciśnienie i nastrój w jednym miejscu. Aplikacja dba o historię Twojego zdrowia, byś Ty nie musiała o tym pamiętać.
                    </p>
                  </div>
                </div>

                {/* Card 4: Rzetelna wiedza (różowe tło) */}
                <div className="w-full min-w-0">
                  <div className="bg-[#e352ad] border border-[#EEE] rounded-2xl p-[17px] flex flex-col gap-[10px] w-full h-auto min-h-[250px]">
                    <div className="flex flex-col gap-[80px] sm:gap-[120px] lg:gap-[128px] w-full h-auto">
                      <div className="w-[25px] h-[25px] rounded-lg border border-[#EEE] flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-base font-normal text-white">
                        Rzetelna wiedza
                      </h3>
                    </div>
                    <p className="text-[14px] font-normal text-[#D9D9D9] leading-relaxed w-full">
                      Dostęp do sprawdzonych materiałów edukacyjnych tworzonych przez ekspertów. Przygotuj się do porodu świadomie i bez mitów.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Image */}
              <div className="w-full lg:w-auto lg:flex-shrink-0 lg:h-auto">
                <div className="w-full lg:w-[330px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-full rounded-2xl overflow-hidden relative mt-4 lg:mt-0">
                  <Image
                    src="/stock/img/preg1.png"
                    alt="Ciąża"
                    fill
                    className="object-cover rounded-2xl"
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 330px"
                  />
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-center sm:justify-start">
              <LiquidButton 
                className="bg-[#0b0b0b] text-white hover:text-white border border-[#989898] rounded-[11px] px-4 sm:px-[13px] py-2 sm:py-[11px] text-sm sm:text-base w-full sm:w-auto h-auto [--liquid-button-background-color:#414141] [--liquid-button-color:#0b0b0b]"
                onClick={openModal}
              >
                Dołącz teraz
              </LiquidButton>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="relative z-10 w-full max-w-[828px] px-4 sm:px-6 py-12 sm:py-20">
          <div className="flex flex-col items-center gap-[33px] w-full max-w-[655px] mx-auto">
            {/* Quote Text */}
            <p className="text-[#0b0b0b] text-xl sm:text-2xl md:text-[32px] font-normal text-center leading-relaxed">
              "Łączymy kobiety z położnymi – prosto, wygodnie i bez stresu."
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-[14px]">
              {/* Avatar */}
              <div className="w-[69px] h-[69px] rounded-full overflow-hidden flex-shrink-0 relative">
                <Image
                  src="/stock/img/1764706067560.jpeg"
                  alt="Joanna Romaniuk"
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="69px"
                />
              </div>

              {/* Author Details */}
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#414141] text-base font-normal">
                  Joanna Romaniuk
                </p>
                <p className="text-[#989898] text-sm font-normal">
                  CEO, Founder MyMidwife
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* For Midwives Section - Dla Położnych */}
        <div id="polozne" className="relative z-10 w-full max-w-[828px] px-4 sm:px-6 py-12 sm:py-20 overflow-hidden">
          <div className="flex flex-col gap-[43px] w-full max-w-[828px]">
            {/* Header */}
            <div className="flex flex-col gap-7 text-left">
              <p className="text-[#989898] text-sm">
                Dla Położnych.
              </p>

              <h2 className="text-[32px] sm:text-[40px] md:text-[56px] font-bold text-[#0b0b0b] tracking-tight px-4 sm:px-0">
                Promocja kompetencji<br />
                i łatwiejsza organizacja
              </h2>

              <p className="text-[#414141] text-base sm:text-lg md:text-xl max-w-[655px] px-4 sm:px-0">
                Buduj swoją markę osobistą, zarządzaj wizytami i utrzymuj profesjonalne relacje z pacjentkami w jednej aplikacji.
              </p>
            </div>

            {/* Features Grid - Reversed Layout */}
            <div className="flex flex-col lg:flex-row-reverse gap-4 sm:gap-[17px] w-full">
              {/* Right side - 4 feature cards in 2x2 grid */}
              <div className="grid grid-responsive-cards gap-4 sm:gap-[17px] w-full lg:flex-1 lg:min-w-0 lg:max-h-[642px]">
                {/* Card 1: Widoczność (różowe tło) */}
                <div className="w-full min-w-0 max-h-[313px]">
                  <div className="bg-[#e352ad] border border-[#EEE] rounded-2xl p-[17px] flex flex-col gap-[10px] w-full h-auto min-h-[250px]">
                    <div className="flex flex-col gap-[80px] sm:gap-[120px] lg:gap-[150px] w-full h-auto">
                      <div className="w-[25px] h-[25px] rounded-lg border border-[#EEE] flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-base font-normal text-white">
                        Widoczność
                      </h3>
                    </div>
                    <p className="text-[14px] font-normal text-[#D9D9D9] leading-relaxed w-full">
                      Dotrzyj do pacjentek szukających profesjonalnej opieki w Twojej okolicy.
                    </p>
                  </div>
                </div>

                {/* Card 2: Kalendarz */}
                <div className="w-full min-w-0">
                  <div className="bg-white border border-[#EEE] rounded-2xl p-[17px] flex flex-col gap-[10px] w-full h-auto min-h-[250px]">
                    <div className="flex flex-col gap-[80px] sm:gap-[120px] lg:gap-[150px] w-full h-auto">
                      <div className="w-[25px] h-[25px] rounded-lg border border-[#EEE] flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-[#0b0b0b]" />
                      </div>
                      <h3 className="text-base font-normal text-[#0b0b0b]">
                        Kalendarz
                      </h3>
                    </div>
                    <p className="text-[14px] font-normal text-[#989898] leading-relaxed w-full">
                      Zarządzaj dostępnością i umówionymi wizytami bez chaosu.
                    </p>
                  </div>
                </div>

                {/* Card 3: Komunikacja */}
                <div className="w-full min-w-0">
                  <div className="bg-white border border-[#EEE] rounded-2xl p-[17px] flex flex-col gap-[10px] w-full h-auto min-h-[250px]">
                    <div className="flex flex-col gap-[80px] sm:gap-[120px] lg:gap-[150px] w-full h-auto">
                      <div className="w-[25px] h-[25px] rounded-lg border border-[#EEE] flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-[#0b0b0b]" />
                      </div>
                      <h3 className="text-base font-normal text-[#0b0b0b]">
                        Komunikacja
                      </h3>
                    </div>
                    <p className="text-[14px] font-normal text-[#989898] leading-relaxed w-full">
                      Oddziel życie prywatne od zawodowego dzięki dedykowanemu czatowi.
                    </p>
                  </div>
                </div>

                {/* Card 4: Materiały */}
                <div className="w-full min-w-0">
                  <div className="bg-white border border-[#EEE] rounded-2xl p-[17px] flex flex-col gap-[10px] w-full h-auto min-h-[250px]">
                    <div className="flex flex-col gap-[80px] sm:gap-[120px] lg:gap-[150px] w-full h-auto">
                      <div className="w-[25px] h-[25px] rounded-lg border border-[#EEE] flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#0b0b0b]" />
                      </div>
                      <h3 className="text-base font-normal text-[#0b0b0b]">
                        Materiały
                      </h3>
                    </div>
                    <p className="text-[14px] font-normal text-[#989898] leading-relaxed w-full">
                      Udostępniaj swoje materiały edukacyjne i buduj autorytet eksperta.
                    </p>
                  </div>
                </div>
              </div>

              {/* Left side - Image */}
              <div className="w-full lg:w-auto lg:flex-shrink-0">
                <div className="w-full lg:w-[330px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[642px] rounded-2xl overflow-hidden relative mt-4 lg:mt-0">
                  <Image
                    src="/stock/img/preg2.png"
                    alt="Ciąża"
                    fill
                    className="object-cover rounded-2xl"
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 330px"
                  />
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-center sm:justify-start">
              <LiquidButton 
                className="bg-[#0b0b0b] text-white hover:text-white border border-[#989898] rounded-[11px] px-4 sm:px-[13px] py-2 sm:py-[11px] text-sm sm:text-base w-full sm:w-auto h-auto [--liquid-button-background-color:#414141] [--liquid-button-color:#0b0b0b]"
                onClick={openModal}
              >
                Dołącz teraz
              </LiquidButton>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div id="blog">
          <TestimonialsSection />
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  )
}
