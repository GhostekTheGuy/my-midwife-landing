import { RippleButton } from "@/components/ui/ripple-button"
import { RainbowButton } from "@/components/ui/rainbow-button"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f0f2ef] relative">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url(/background.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 pt-8 pb-6 bg-gradient-to-b from-[#f0f2ef] to-[#f0f2ef]/0">
        <div className="flex justify-center px-6">
          <div className="bg-[#0b0b0b] rounded-[10px] p-[7px] inline-flex items-center gap-[23px] shadow-lg">
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

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-[23px]">
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

            <RainbowButton 
              variant="outline"
              size={undefined}
              className="text-[#0b0b0b] rounded-[11px] px-[11px]"
            >
              Bądź na bieżąco →
            </RainbowButton>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center mb-12">
          <p className="text-sm text-[#989a98] mb-4 tracking-wide">
            #medtech #mhealth #startup
          </p>

          {/* Headline */}
          <h1 className="text-[64px] md:text-[132px] font-bold text-[#0b0b0b] mb-0 tracking-tight">MyMidwife</h1>

          {/* Description */}
          <p className="text-[rgba(65,65,65,1)] text-[24px] max-w-2xl mx-auto mb-4">
            MyMidwife to platforma łącząca kobiety z ekspertkami.{" "}
            <span className="text-[rgba(230,159,205,1)]">Bezpieczeństwo, wiedzą i wsparcie w jednej aplikacji.</span>
          </p>

          <div className="flex items-center justify-center gap-4 mb-8 text-[rgba(10,10,10,1)]">
            <RippleButton 
              rippleColor="rgba(255, 255, 255, 0.5)"
              className="bg-[#0b0b0b] text-white hover:bg-[#414141] rounded-[11px] px-[11px] py-[11px] text-base border-0"
            >
              Jestem pacjentką
            </RippleButton>
            <RippleButton 
              rippleColor="rgba(227, 82, 173, 0.4)"
              className="bg-[#eac9df] text-[#0b0b0b] hover:bg-[#e352ad]/30 rounded-[11px] px-[11px] py-[11px] text-base border-0"
            >
              Jestem położną
            </RippleButton>
          </div>

          {/* Trust section */}
          <div className="mb-12">
            <p className="text-sm text-[#989a98] mb-4">Partnerzy:</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <img
                src="/co-logos/logos1.png"
                alt="BraveCamp"
                className="h-5 opacity-40 object-contain"
              />
              <img
                src="/co-logos/logos2.png"
                alt="UAM INNOVATION HUB"
                className="h-5 opacity-40 object-contain"
              />
              <img
                src="/co-logos/logos3.png"
                alt="Innovation Hub"
                className="h-5 opacity-40 object-contain"
              />
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative w-full max-w-md mx-auto">
            <img
              src="/images/Group 3.png"
              alt="MyMidwife App Interface"
              className="h-auto scale-[2]"
              style={{
                width: '634px',
                paddingTop: '139px',
                paddingBottom: '139px',
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
