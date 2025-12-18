"use client"

import { useState, useEffect } from "react"
import { Menu, X, ArrowRight } from "lucide-react"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { cn } from "@/lib/utils"
import { useJoinModal } from "@/contexts/join-modal-context"
import Confetti from "react-confetti"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })
  const { openModal } = useJoinModal()

  useEffect(() => {
    // Small delay to ensure smooth animation
    const timer = requestAnimationFrame(() => {
      setIsVisible(true)
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen)
  }

  function closeMenu() {
    setIsMenuOpen(false)
  }

  function onLogoClick() {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
    }, 3000)
  }

  return (
    <>
      {showConfetti && windowDimensions.width > 0 && windowDimensions.height > 0 && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          colors={["#e352ad", "#ff69b4", "#ff1493", "#ffb6c1", "#ffc0cb", "#eac9df"]}
          numberOfPieces={200}
          recycle={false}
          gravity={0.3}
          initialVelocityY={20}
        />
      )}
      <nav className={cn(
        "sticky top-0 z-50 pt-4 sm:pt-8 pb-4 sm:pb-6 bg-gradient-to-b from-white to-white/0 transition-all duration-700 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 -translate-y-8"
      )}>
        <div className="flex justify-center px-4 sm:px-6">
            <div className={cn(
              "bg-[#0b0b0b] rounded-[10px] p-2 sm:p-[7px] flex items-center justify-between sm:justify-center gap-3 sm:gap-[23px] shadow-lg w-full sm:w-auto max-w-full sm:max-w-none",
              isVisible && "animate-navbar-bounce"
            )}>
              {/* Logo */}
              <div className="flex items-center">
                <button
                  onClick={onLogoClick}
                  className="bg-[#e352ad] rounded-lg p-2 w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-[#d1429d] transition-colors"
                  aria-label="Logo"
                >
                  <img 
                    src="/logo_biel@10x 1.png" 
                    alt="Logo" 
                    className="w-5 h-5"
                  />
                </button>
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
    </>
  )
}



