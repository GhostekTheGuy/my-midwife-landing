"use client"

import { useState } from "react"
import { Menu, X, ArrowRight } from "lucide-react"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { cn } from "@/lib/utils"
import { useJoinModal } from "@/contexts/join-modal-context"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openModal } = useJoinModal()

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen)
  }

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 pt-4 sm:pt-8 pb-4 sm:pb-6 bg-gradient-to-b from-white to-white/0">
      <div className="flex justify-center px-4 sm:px-6">
          <div className="bg-[#0b0b0b] rounded-[10px] p-2 sm:p-[7px] flex items-center justify-between sm:justify-center gap-3 sm:gap-[23px] shadow-lg w-full sm:w-auto max-w-full sm:max-w-none">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-[#e352ad] rounded-lg p-2 w-9 h-9 flex items-center justify-center">
                <img 
                  src="/logo_biel@10x 1.png" 
                  alt="Logo" 
                  className="w-5 h-5"
                />
              </div>
            </div>

            {/* Nav links - Desktop */}
            <div className="hidden sm:flex items-center gap-[23px]">
              <a href="#o-nas" className="text-white text-sm hover:text-[#e352ad] transition-colors">
                Wyzwanie
              </a>
              <a href="#pacjentki" className="text-white text-sm hover:text-[#e352ad] transition-colors">
                Pacjentki
              </a>
              <a href="#polozne" className="text-white text-sm hover:text-[#e352ad] transition-colors">
                Położne
              </a>
            </div>

            {/* Button - Desktop */}
            <div className="hidden sm:block">
              <RainbowButton 
                variant="outline"
                size={undefined}
                className="text-[#0b0b0b] rounded-[11px] px-[11px] text-sm whitespace-nowrap group/button"
                onClick={openModal}
              >
                <span>Dołącz teraz</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover/button:translate-x-1" />
              </RainbowButton>
            </div>

            {/* Button - Mobile */}
            <div className="sm:hidden">
              <RainbowButton 
                variant="outline"
                size={undefined}
                className="text-[#0b0b0b] rounded-[11px] px-2 text-xs whitespace-nowrap"
                onClick={openModal}
              >
                Dołącz teraz
              </RainbowButton>
            </div>

            {/* Hamburger Menu Button - Mobile */}
            <button
              onClick={toggleMenu}
              className="sm:hidden text-white p-2 hover:text-[#e352ad] transition-colors cursor-pointer"
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
              href="#o-nas"
              onClick={closeMenu}
              className="text-white text-sm hover:text-[#e352ad] transition-colors py-2"
            >
              Wyzwanie
            </a>
            <a
              href="#pacjentki"
              onClick={closeMenu}
              className="text-white text-sm hover:text-[#e352ad] transition-colors py-2"
            >
              Pacjentki
            </a>
            <a
              href="#polozne"
              onClick={closeMenu}
              className="text-white text-sm hover:text-[#e352ad] transition-colors py-2"
            >
              Położne
            </a>
          </div>
        </div>
    </nav>
  )
}



