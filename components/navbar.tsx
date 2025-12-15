"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen)
  }

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 pt-4 sm:pt-8 pb-4 sm:pb-6 bg-gradient-to-b from-[#FEFBFD] to-[#FEFBFD]/0">
      <BlurFade delay={0} inView>
        <div className="flex justify-center px-4 sm:px-6">
          <div className="bg-[#0b0b0b] rounded-[10px] p-2 sm:p-[7px] flex items-center justify-between sm:justify-center gap-3 sm:gap-[23px] shadow-lg w-full sm:w-auto max-w-full sm:max-w-none">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-[#e352ad] rounded-lg p-2 w-9 h-9 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
            </div>

            {/* Nav links - Desktop */}
            <div className="hidden sm:flex items-center gap-[23px]">
              <a href="#" className="text-white text-sm hover:text-[#e352ad] transition-colors">
                O nas
              </a>
              <a href="#" className="text-white text-sm hover:text-[#e352ad] transition-colors">
                Zespół
              </a>
              <a href="#" className="text-white text-sm hover:text-[#e352ad] transition-colors">
                Blog
              </a>
              <a href="#" className="text-white text-sm hover:text-[#e352ad] transition-colors">
                FAQ
              </a>
            </div>

            {/* Button - Desktop */}
            <div className="hidden sm:block">
              <RainbowButton 
                variant="outline"
                size={undefined}
                className="text-[#0b0b0b] rounded-[11px] px-[11px] text-sm whitespace-nowrap"
              >
                Dołącz teraz →
              </RainbowButton>
            </div>

            {/* Button - Mobile */}
            <div className="sm:hidden">
              <RainbowButton 
                variant="outline"
                size={undefined}
                className="text-[#0b0b0b] rounded-[11px] px-2 text-xs whitespace-nowrap"
              >
                Dołącz teraz
              </RainbowButton>
            </div>

            {/* Hamburger Menu Button - Mobile */}
            <button
              onClick={toggleMenu}
              className="sm:hidden text-white p-2 hover:text-[#e352ad] transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "sm:hidden fixed inset-x-0 top-[88px] bg-[#0b0b0b] rounded-b-[10px] mx-4 shadow-lg transition-all duration-300 ease-in-out overflow-hidden",
            isMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col gap-4 p-4">
            <a
              href="#"
              onClick={closeMenu}
              className="text-white text-sm hover:text-[#e352ad] transition-colors py-2"
            >
              O nas
            </a>
            <a
              href="#"
              onClick={closeMenu}
              className="text-white text-sm hover:text-[#e352ad] transition-colors py-2"
            >
              Zespół
            </a>
            <a
              href="#"
              onClick={closeMenu}
              className="text-white text-sm hover:text-[#e352ad] transition-colors py-2"
            >
              Blog
            </a>
            <a
              href="#"
              onClick={closeMenu}
              className="text-white text-sm hover:text-[#e352ad] transition-colors py-2"
            >
              FAQ
            </a>
          </div>
        </div>
      </BlurFade>
    </nav>
  )
}



