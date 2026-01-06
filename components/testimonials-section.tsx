"use client"

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { Testimonial } from "@/components/ui/testimonial";
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid";
import { useJoinModalStore } from "@/stores/join-modal-store";

const testimonials = [
  {
    quote: "Pełny szacunek za pomysł, realizację i wizję! To ukłon w stronę naszych pacjentek, które jako osoby młode szukają położnych na grupach dla mam. Aplikacja będzie super!!",
    author: "~ Ania, Położna",
    className: "bg-[#e352ad] text-white border-transparent"
  },
  {
    quote: "Super ta aplikacja. Myślę, że pacjentki będą chętnie korzystać. Mam nadzieję, że nam też to ułatwi pracę. Trzymam kciuki!",
    author: "~ Aga, Położna",
    className: "bg-white"
  },
  {
    quote: "Super pomysł i brawo za inicjatywę! Powodzenia, czekam na wersję gotową do pracy.",
    author: "~ Anna, Położna",
    className: "bg-[#e69fcd] text-white border-transparent"
  },
  {
    quote: "Wygląda bardzo ciekawie i super pomysł! Powodzenia!",
    author: "~ Monika, Położna",
    className: "bg-white"
  },
  {
    quote: "Ekstra pomysł! Trzymam kciuki!",
    author: "~ Ada, Pacjentka",
    className: "bg-white"
  },
  {
    quote: "Genialna sprawa!!! Powodzenia!",
    author: "~ Kasia, Pacjentka",
    className: "bg-[#e352ad] text-white border-transparent"
  },
  {
    quote: "Super! Gratuluję. Oby jak najszybciej była dostępna!",
    author: "~ Diana, Pacjentka",
    className: "bg-white"
  },
  {
    quote: "Świetny pomysł. Powodzenia.",
    author: "~ Wiesia, Położna",
    className: "bg-[#e69fcd] text-white border-transparent"
  },
  {
    quote: "Brawo, genialny pomysł!",
    author: "~ Maria, Położna",
    className: "bg-white"
  },
  {
    quote: "Jestem pod wrażeniem!",
    author: "~ Gosia, Położna",
    className: "bg-white"
  },
  {
    quote: "Wizja MyMidwife to dokładnie to, czego potrzebuje nowoczesne położnictwo. Przeniesienie komunikacji z Messengera do profesjonalnej aplikacji to strzał w dziesiątkę.",
    author: "~ Asia, Położna",
    className: "bg-[#e352ad] text-white border-transparent"
  },
  {
    quote: "Jako położna widzę ogromny potencjał w uporządkowaniu historii pacjentki w jednym miejscu. To może zaoszczędzić nam godziny pracy administracyjnej.",
    author: "~ Maria, Położna",
    className: "bg-white"
  },
  {
    quote: "Czekam na taką platformę! Szukanie sprawdzonej położnej w internecie to dziś loteria. Taka aplikacja da nam, mamom, ogromne poczucie bezpieczeństwa.",
    author: "~ Magda, Pacjentka",
    className: "bg-[#e69fcd] text-white border-transparent"
  },
  {
    quote: "Pomysł na ułatwienie kontaktu z pacjentką w ciąży jest genialny. To nie tylko wygoda, to przede wszystkim lepsza opieka.",
    author: "~ Ewa, Położna",
    className: "bg-white"
  },
  {
    quote: "Jeśli ta aplikacja faktycznie pomoże mi lepiej organizować wizyty patronażowe, to wchodzę w to od razu po premierze.",
    author: "~  Magda, Położna",
    className: "bg-white"
  },
  {
    quote: "Nareszcie ktoś pomyślał o cyfryzacji pracy położnych. Zapowiada się narzędzie, które realnie podniesie standard naszej pracy.",
    author: "~ Paulina, Położna",
    className: "bg-[#e69fcd] text-white border-transparent"
  },
  {
    quote: "Młode mamy żyją w smartfonach. MyMidwife to wyjście naprzeciw ich oczekiwaniom. Bardzo potrzebujemy takiego łącznika.",
    author: "~ Karolina, Położna",
    className: "bg-white"
  },
  {
    quote: "Trzymam kciuki za realizację! Możliwość szybkiego podglądu parametrów pacjentki przed wizytą brzmi jak marzenie każdego medyka.",
    author: "~ Natalia, Położna",
    className: "bg-[#e352ad] text-white border-transparent"
  },
  {
    quote: "To wygląda na projekt, który w końcu uporządkuje chaos informacyjny, z jakim mierzą się kobiety w pierwszej ciąży.",
    author: "~ Ola, Pacjentka",
    className: "bg-white"
  },
  {
    quote: "Gratuluję odwagi w cyfryzacji tak ważnego obszaru. To projekt z misją, którego bardzo brakowało na polskim rynku.",
    author: "~ Basia, Położna",
    className: "bg-white"
  }
];

const firstColumn = [testimonials[0], testimonials[1], testimonials[2], testimonials[3], testimonials[4]];
const secondColumn = [testimonials[5], testimonials[6], testimonials[7], testimonials[8], testimonials[9]];
const thirdColumn = [testimonials[10], testimonials[11], testimonials[12], testimonials[13], testimonials[14]];
const fourthColumn = [testimonials[15], testimonials[16], testimonials[17], testimonials[18], testimonials[19]];

export function TestimonialsSection() {
  const { openModal } = useJoinModalStore()
  
  return (
    <div 
      className="relative z-10 w-full max-w-[828px] mx-auto px-4 sm:px-6 py-12 sm:py-20 overflow-hidden"
    >
      <div className="flex flex-col gap-[43px] w-full">
        {/* Header */}
        <div className="flex flex-col gap-7 text-center">
          <p className="text-[#989898] text-sm">
            Co mówią o pomyśle?
          </p>

          <h2 className="text-[32px] sm:text-[40px] md:text-[56px] font-bold text-[#0b0b0b] tracking-tight px-4 sm:px-0">
            Opinie naszej społeczności
          </h2>
        </div>

        {/* Marquee Grid */}
        <div className="relative flex h-[625px] w-full flex-row items-center justify-center gap-4 overflow-hidden">
          <div className="h-full flex-1 min-w-0">
            <Marquee vertical pauseOnHover className="[--duration:20s] [--gap:1rem]">
              {firstColumn.map((review, i) => (
                <Testimonial key={i} {...review} className={cn("w-full", review.className)} />
              ))}
            </Marquee>
          </div>

          <div className="h-full flex-1 min-w-0 hidden sm:block">
            <Marquee vertical reverse pauseOnHover className="[--duration:25s] [--gap:1rem]">
              {secondColumn.map((review, i) => (
                <Testimonial key={i} {...review} className={cn("w-full", review.className)} />
              ))}
            </Marquee>
          </div>

          <div className="h-full flex-1 min-w-0 hidden md:block">
            <Marquee vertical pauseOnHover className="[--duration:22s] [--gap:1rem]">
              {thirdColumn.map((review, i) => (
                <Testimonial key={i} {...review} className={cn("w-full", review.className)} />
              ))}
            </Marquee>
          </div>

          <div className="h-full flex-1 min-w-0 hidden lg:block">
            <Marquee vertical reverse pauseOnHover className="[--duration:24s] [--gap:1rem]">
              {fourthColumn.map((review, i) => (
                <Testimonial key={i} {...review} className={cn("w-full", review.className)} />
              ))}
            </Marquee>
          </div>

          {/* Gradients */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#FEFBFD] to-transparent"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#FEFBFD] to-transparent"></div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-4">
          <LiquidButton 
            className="bg-[#0b0b0b] text-white hover:text-white border border-[#989898] rounded-[11px] px-4 sm:px-[13px] py-2 sm:py-[11px] text-sm sm:text-base w-full sm:w-auto h-auto [--liquid-button-background-color:#414141] [--liquid-button-color:#0b0b0b]"
            onClick={openModal}
          >
            Dołącz teraz
          </LiquidButton>
        </div>
      </div>
    </div>
  );
}

