"use client"

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { Testimonial } from "@/components/ui/testimonial";
import { RippleButton } from "@/components/ui/ripple-button";
import { useJoinModal } from "@/contexts/join-modal-context";

const testimonials = [
  {
    quote: "Aplikacja MyMidwife całkowicie zmieniła sposób, w jaki wspieram moje pacjentki. Wszystkie informacje są w jednym miejscu.",
    author: "~ Anna, Położna",
    className: "bg-[#e352ad] text-white border-transparent"
  },
  {
    quote: "Jako położna doceniam możliwość szybkiego dostępu do historii pacjentki. To oszczędza mnóstwo czasu.",
    author: "~ Maria, Położna",
    className: "bg-white"
  },
  {
    quote: "MyMidwife to nie tylko aplikacja - to prawdziwe wsparcie dla kobiet w ciąży. Pacjentki czują się bezpieczniej.",
    author: "~ Katarzyna, Położna",
    className: "bg-[#e69fcd] text-white border-transparent"
  },
  {
    quote: "Platforma jest intuicyjna i łatwa w obsłudze. Moje pacjentki chętnie z niej korzystają.",
    author: "~ Joanna, Położna",
    className: "bg-white"
  },
  {
    quote: "Jako doświadczona położna widzę ogromny potencjał w MyMidwife. To przyszłość opieki.",
    author: "~ Ewa, Położna",
    className: "bg-white"
  },
  {
    quote: "Aplikacja pomaga mi lepiej organizować pracę i dbać o każdą pacjentkę indywidualnie.",
    author: "~ Magdalena, Położna",
    className: "bg-white"
  },
  {
    quote: "MyMidwife ułatwia komunikację z pacjentkami i pozwala na szybkie reagowanie na ich potrzeby.",
    author: "~ Agnieszka, Położna",
    className: "bg-white"
  },
  {
    quote: "Jestem pod wrażeniem, jak aplikacja wspiera zarówno położne, jak i kobiety w ciąży.",
    author: "~ Barbara, Położna",
    className: "bg-[#e69fcd] text-white border-transparent"
  },
  {
    quote: "Dzięki MyMidwife mogę lepiej planować wizyty i monitorować stan zdrowia moich pacjentek.",
    author: "~ Monika, Położna",
    className: "bg-white"
  },
  {
    quote: "Aplikacja jest niezwykle pomocna w zarządzaniu dokumentacją i komunikacji z pacjentkami. Polecam ją wszystkim koleżankom.",
    author: "~ Paulina, Położna",
    className: "bg-white"
  },
  {
    quote: "MyMidwife to rewolucja w opiece położniczej. Wszystko w jednym miejscu, łatwe w użyciu i profesjonalne.",
    author: "~ Karolina, Położna",
    className: "bg-[#e352ad] text-white border-transparent"
  },
  {
    quote: "Jako młoda położna doceniam możliwość budowania relacji z pacjentkami przez aplikację. To przyszłość opieki.",
    author: "~ Natalia, Położna",
    className: "bg-white"
  }
];

const firstColumn = [testimonials[0], testimonials[1], testimonials[2]];
const secondColumn = [testimonials[3], testimonials[4], testimonials[5]];
const thirdColumn = [testimonials[6], testimonials[7], testimonials[8]];
const fourthColumn = [testimonials[9], testimonials[10], testimonials[11]];

export function TestimonialsSection() {
  const { openModal } = useJoinModal()
  
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
          <RippleButton 
            rippleColor="rgba(255, 255, 255, 0.5)"
            className="bg-[#0b0b0b] text-white border border-[#989898] rounded-[11px] px-4 sm:px-[13px] py-2 sm:py-[11px] text-sm sm:text-base w-full sm:w-auto"
            onClick={openModal}
          >
            Dołącz teraz
          </RippleButton>
        </div>
      </div>
    </div>
  );
}

