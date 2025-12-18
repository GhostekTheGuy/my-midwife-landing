'use client'

import { useState, useEffect } from 'react'
import { Testimonial } from './testimonial'
import { testimonials } from '@/lib/testimonials-data'
import { cn } from '@/lib/utils'

interface RotatingTestimonialProps {
  className?: string
  rotationInterval?: number
  indexOffset?: number
  disableHeightOffset?: boolean
}

// Different vertical offsets for testimonials to create varied heights
const heightOffsets = [0, -40, 20, -60, 30, -30, 50, -20, 40, -50]

export function RotatingTestimonial({ 
  className = "w-[232px]",
  rotationInterval = 5000,
  indexOffset = 0,
  disableHeightOffset = false
}: RotatingTestimonialProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    
    const interval = setInterval(() => {
      setIsVisible(false)
      
      // setTimeout needed here to synchronize content change with CSS fade-out animation
      // This ensures smooth visual transition without content flickering
      // Alternative would require CSS animation events which are less reliable
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        setIsVisible(true)
      }, 500) // Match transition duration
    }, rotationInterval)

    return () => {
      clearInterval(interval)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [rotationInterval])

  const displayIndex = (currentIndex + indexOffset) % testimonials.length
  const testimonial = testimonials[displayIndex]
  const heightOffset = disableHeightOffset ? 0 : heightOffsets[displayIndex % heightOffsets.length]

  return (
    <div
      className="transition-opacity duration-500 ease-in-out"
      style={{
        opacity: isVisible ? 1 : 0,
        marginTop: `${heightOffset}px`,
        transition: disableHeightOffset 
          ? 'opacity 500ms ease-in-out' 
          : 'opacity 500ms ease-in-out, margin-top 500ms ease-in-out'
      }}
    >
      <Testimonial
        quote={testimonial.quote}
        author={testimonial.author}
        className={cn(className, testimonial.className)}
      />
    </div>
  )
}

