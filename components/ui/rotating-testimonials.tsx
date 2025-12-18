'use client'

import { useState, useEffect } from 'react'
import { Testimonial } from './testimonial'

interface TestimonialData {
  quote: string
  author: string
}

export const testimonials: TestimonialData[] = [
  {
    quote: "Aplikacja MyMidwife całkowicie zmieniła sposób, w jaki wspieram moje pacjentki. Wszystkie informacje są w jednym miejscu, a komunikacja jest niezwykle prosta.",
    author: "~ Anna, Położna"
  },
  {
    quote: "Jako położna doceniam możliwość szybkiego dostępu do historii pacjentki. To oszczędza mnóstwo czasu i pozwala mi skupić się na tym, co najważniejsze - na opiece.",
    author: "~ Maria, Położna"
  },
  {
    quote: "MyMidwife to nie tylko aplikacja - to prawdziwe wsparcie dla kobiet w ciąży. Widzę, jak moje pacjentki czują się bezpieczniej i bardziej pewnie.",
    author: "~ Katarzyna, Położna"
  },
  {
    quote: "Platforma jest intuicyjna i łatwa w obsłudze. Moje pacjentki chętnie z niej korzystają, a ja mam wszystko pod kontrolą.",
    author: "~ Joanna, Położna"
  },
  {
    quote: "Jako doświadczona położna widzę ogromny potencjał w MyMidwife. To przyszłość opieki okołoporodowej w Polsce.",
    author: "~ Ewa, Położna"
  },
  {
    quote: "Aplikacja pomaga mi lepiej organizować pracę i dbać o każdą pacjentkę indywidualnie. To narzędzie, którego brakowało na rynku.",
    author: "~ Magdalena, Położna"
  },
  {
    quote: "MyMidwife ułatwia komunikację z pacjentkami i pozwala na szybkie reagowanie na ich potrzeby. To rewolucja w opiece położniczej.",
    author: "~ Agnieszka, Położna"
  },
  {
    quote: "Jestem pod wrażeniem, jak aplikacja wspiera zarówno położne, jak i kobiety w ciąży. To kompleksowe rozwiązanie dla całego sektora.",
    author: "~ Barbara, Położna"
  },
  {
    quote: "Dzięki MyMidwife mogę lepiej planować wizyty i monitorować stan zdrowia moich pacjentek. To nieocenione wsparcie w codziennej pracy.",
    author: "~ Monika, Położna"
  },
  {
    quote: "Aplikacja jest niezwykle pomocna w zarządzaniu dokumentacją i komunikacji z pacjentkami. Polecam ją wszystkim koleżankom po fachu.",
    author: "~ Paulina, Położna"
  }
]

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
        className={className}
      />
    </div>
  )
}

