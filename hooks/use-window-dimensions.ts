"use client"

import { useEffect, useState } from "react"

interface WindowDimensions {
  width: number
  height: number
}

/**
 * Hook to track window dimensions for responsive features like confetti.
 * Returns { width: 0, height: 0 } during SSR to prevent hydration mismatches.
 */
export function useWindowDimensions(): WindowDimensions {
  const [dimensions, setDimensions] = useState<WindowDimensions>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return dimensions
}
