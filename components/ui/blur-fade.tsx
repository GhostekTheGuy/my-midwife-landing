"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface BlurFadeProps {
  children: React.ReactNode
  delay?: number
  inView?: boolean
  className?: string
}

export function BlurFade({ children, delay = 0, inView = true, className }: BlurFadeProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!inView) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true)
            }, delay * 1000)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [delay, inView])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible
          ? "opacity-100 blur-0 translate-y-0"
          : "opacity-0 blur-md translate-y-4",
        className
      )}
      style={{
        transitionDelay: `${delay * 1000}ms`,
      }}
    >
      {children}
    </div>
  )
}

