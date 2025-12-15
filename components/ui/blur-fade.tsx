"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface BlurFadeProps {
  children: ReactNode
  delay?: number
  className?: string
  inView?: boolean
  variant?: "default" | "slideUp" | "slideDown" | "slideLeft" | "slideRight"
}

export function BlurFade({
  children,
  delay = 0,
  className,
  inView = true,
  variant = "default",
}: BlurFadeProps) {
  const [isVisible, setIsVisible] = useState(!inView)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!inView) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame instead of setTimeout for better performance
          const startTime = performance.now()
          function checkDelay() {
            const elapsed = performance.now() - startTime
            if (elapsed >= delay * 1000) {
              setIsVisible(true)
            } else {
              requestAnimationFrame(checkDelay)
            }
          }
          requestAnimationFrame(checkDelay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay, inView])

  const variants = {
    default: "",
    slideUp: "translate-y-4",
    slideDown: "-translate-y-4",
    slideLeft: "translate-x-4",
    slideRight: "-translate-x-4",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-300 ease-out",
        isVisible
          ? "opacity-100 blur-0 translate-x-0 translate-y-0"
          : `opacity-0 blur-md ${variants[variant]}`,
        className
      )}
      style={{
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}








