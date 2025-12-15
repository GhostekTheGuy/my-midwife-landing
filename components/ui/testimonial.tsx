import { cn } from "@/lib/utils"

interface TestimonialProps {
  quote: string
  author: string
  className?: string
}

export function Testimonial({ quote, author, className }: TestimonialProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[#EEE] rounded-2xl p-4 flex flex-col gap-[13px]",
        className
      )}
    >
      <p className={cn(
        "text-[#989898] text-sm leading-relaxed text-left",
        className?.includes("text-white") && "text-white/90"
      )}>
        {quote}
      </p>
      <p className={cn(
        "text-black text-sm font-medium text-left",
        className?.includes("text-white") && "text-white"
      )}>
        {author}
      </p>
    </div>
  )
}

