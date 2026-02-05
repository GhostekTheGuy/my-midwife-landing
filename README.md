# MyMidwife

A landing page for **MyMidwife** — a platform connecting women with certified midwives in Poland. Built with Next.js, React, and Supabase.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI / shadcn/ui
- **Animations:** Motion (Framer Motion), Lottie
- **Forms:** React Hook Form + Zod validation
- **Database:** Supabase (PostgreSQL)
- **State Management:** Zustand
- **Analytics:** Vercel Analytics, PostHog
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_POSTHOG_KEY=<your-posthog-key>
NEXT_PUBLIC_POSTHOG_HOST=<your-posthog-host>
```

### Development

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
app/
  page.tsx              # Main landing page
  layout.tsx            # Root layout with providers
  api/submit-form/      # Form submission API endpoint
components/
  ui/                   # Reusable UI components (shadcn/ui)
  animate-ui/           # Custom animated components
  navbar.tsx            # Navigation bar
  join-modal.tsx        # Sign-up form modal
  footer.tsx            # Footer with team & socials
  faq-section.tsx       # FAQ accordion
  testimonials-section.tsx
hooks/                  # Custom React hooks
stores/                 # Zustand state stores
lib/                    # Utilities (Supabase client, helpers)
public/                 # Static assets (images, logos, icons)
```

## Key Features

- Dual-audience design with dedicated sections for patients and midwives
- Responsive layout (mobile, tablet, desktop)
- Sign-up form with Zod validation and Supabase persistence
- Accessible UI via Radix UI primitives
- Smooth animations and transitions
- Polish language UI targeting the Polish market

## Team

- **Joanna Romaniuk** — CEO / Founder
- **Bartek Switala**
- **Hubert Kolejko**
- **Piotr Preciuk**
