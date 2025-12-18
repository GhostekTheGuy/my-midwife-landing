"use client"

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { Testimonial } from "@/components/ui/testimonial";
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid";
import { useJoinModal } from "@/contexts/join-modal-context";
import { testimonials } from "@/lib/testimonials-data";

// Distribute testimonials evenly across 4 columns
const firstColumn = [testimonials[0], testimonials[4], testimonials[8], testimonials[12], testimonials[16]];
const secondColumn = [testimonials[1], testimonials[5], testimonials[9], testimonials[13], testimonials[17]];
const thirdColumn = [testimonials[2], testimonials[6], testimonials[10], testimonials[14], testimonials[18]];
const fourthColumn = [testimonials[3], testimonials[7], testimonials[11], testimonials[15], testimonials[19]];

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

