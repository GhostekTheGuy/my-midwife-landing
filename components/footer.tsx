"use client"

import Image from "next/image"
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid"
import { Instagram, Linkedin } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useJoinModal } from "@/contexts/join-modal-context"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Footer() {
  const { openModal } = useJoinModal()
  
  return (
    <footer className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-12 sm:pt-20">
      <div className="relative w-full overflow-hidden rounded-[20px] bg-gradient-to-b from-[#E155AC] to-[#FEFBFD] min-h-[400px] flex flex-col items-center justify-between pt-12 sm:pt-16 pb-8">
        
        {/* Background Stripes Overlay */}
        <div className="absolute inset-0 w-full h-full pointer-events-none flex justify-between">
             {/* Left side stripes */}
             <div className="flex h-full">
                <div className="w-[80px] sm:w-[150px] h-full bg-gradient-to-r from-white/20 to-transparent mix-blend-overlay opacity-50"></div>
                <div className="w-[150px] sm:w-[300px] h-full bg-gradient-to-r from-white/10 to-transparent mix-blend-overlay opacity-30"></div>
             </div>
             {/* Right side stripes */}
             <div className="flex h-full">
                <div className="w-[150px] sm:w-[300px] h-full bg-gradient-to-l from-white/10 to-transparent mix-blend-overlay opacity-30"></div>
                <div className="w-[80px] sm:w-[150px] h-full bg-gradient-to-l from-white/20 to-transparent mix-blend-overlay opacity-50"></div>
             </div>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[800px] px-6 mx-auto flex flex-col gap-10 sm:gap-14">
            
            {/* Top Section: CTA + Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
                <h3 className="text-[#0b0b0b] text-lg sm:text-[22px] font-normal tracking-tight text-center sm:text-left">
                    Dołącz do naszej kobiecej społeczności.
                </h3>
                <LiquidButton 
                    className="bg-[#0b0b0b] text-white hover:text-white border-0 rounded-[12px] px-6 py-2.5 h-[44px] text-sm font-medium whitespace-nowrap [--liquid-button-background-color:#414141] [--liquid-button-color:#0b0b0b]"
                    onClick={openModal}
                >
                    Dołącz teraz
                </LiquidButton>
            </div>

            {/* Middle Section: Team + Socials */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
                {/* Team */}
                <TooltipProvider delayDuration={200}>
                    <div id="zespol" className="flex items-center gap-3">
                        <span className="text-[#414141] text-[15px] font-normal">Zespół:</span>
                        <div className="flex -space-x-2">
                            {[
                                { src: "/stock/img/1764706067560.jpeg", name: "Joanna Romaniuk", role: "CEO" },
                                { src: "/stock/img/Ellipse 3.png", name: "Bartek Świtała", role: "Backend Developer" },
                                { src: "/stock/img/Ellipse 4.png", name: "Hubert Kolejko", role: "Product Designer" },
                                { src: "/stock/img/Ellipse 5.png", name: "Piotr Pręciuk", role: "Fullstack Developer" }
                            ].map((member, i) => (
                                <Tooltip key={i}>
                                    <TooltipTrigger asChild>
                                        <div className="w-[34px] h-[34px] rounded-full overflow-hidden grayscale border border-[#E69FCD] relative cursor-pointer hover:grayscale-0 transition-all duration-200">
                                            <Image src={member.src} alt={member.name} fill className="object-cover" loading="lazy" sizes="34px" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="font-medium">{member.name}</p>
                                            <p className="text-xs text-white/80">{member.role}</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                </TooltipProvider>

                {/* Socials */}
                <div className="flex items-center gap-3 text-[#414141]">
                     <Link href="#" className="hover:text-black transition-colors">
                        <Linkedin className="w-[22px] h-[22px]" />
                     </Link>
                     <Link href="#" className="hover:text-black transition-colors">
                        <Instagram className="w-[22px] h-[22px]" />
                     </Link>
                </div>
            </div>

        </div>

        {/* Bottom Section: Huge Logo + Copyright */}
        <div className="relative z-10 w-full flex flex-col items-center mt-8 sm:mt-12 px-4">
             <h1 className="text-[64px] sm:text-[100px] md:text-[140px] lg:text-[170px] font-medium leading-[0.8] tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-b from-[#414141] to-[#A7A7A7] select-none text-center mix-blend-multiply opacity-90 px-1.5 mt-0 mb-0 pb-8">
                MyMidwife
             </h1>
             <p className="text-[#666666] text-xs sm:text-[13px] mt-6 sm:mt-8 font-medium">
                © 2025 MyMidwife
             </p>
        </div>

      </div>
    </footer>
  )
}
