import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div
      className="min-h-screen bg-[#f0f2ef] relative overflow-hidden"
      style={{
        backgroundImage: "url(/background1.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Navigation */}
      <nav className="relative z-10 pt-8 pb-6">
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

            <Button className="bg-white text-[#0b0b0b] hover:bg-[#ffffff]/90 rounded-[11px] px-6">
              Bądź na bieżąco →
            </Button>
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
          <h1 className="text-7xl md:text-8xl font-bold text-[#0b0b0b] mb-6 tracking-tight">MyMidwife</h1>

          {/* Description */}
          <p className="text-[#0b0b0b] text-lg max-w-2xl mx-auto mb-4">
            MyMidwife to platforma łącząca przyszłe mamy z ekspertkami.{" "}
            <span className="text-[#e352ad]">Bezpieczeństwo, wiedzą i wsparcie w jednej aplikacji.</span>
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Button className="bg-[#0b0b0b] text-white hover:bg-[#414141] rounded-[11px] px-8 py-6 text-base">
              Jestem pacjentką
            </Button>
            <Button className="bg-[#eac9df] text-[#0b0b0b] hover:bg-[#e352ad]/30 rounded-[11px] px-8 py-6 text-base">
              Jestem położną
            </Button>
          </div>

          {/* Trust section */}
          <div className="mb-12">
            <p className="text-sm text-[#989a98] mb-4">Zaufali nam:</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-[#0b0b0b] font-semibold text-sm">BraveCamp</div>
              <div className="text-[#0b0b0b] font-semibold text-sm">UAM INNOVATION HUB</div>
              <div className="text-[#0b0b0b] font-semibold text-sm">Innovation Hub</div>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative w-full max-w-md mx-auto">
            <div className="relative aspect-[9/19] w-full">
              {/* Phone frame */}
              <div className="absolute inset-0 bg-[#0b0b0b] rounded-[3rem] shadow-2xl p-3">
                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#0b0b0b] rounded-b-3xl h-7 w-32 z-10" />
                </div>
              </div>

              {/* Hand holding phone */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[110%] h-[60%] pointer-events-none">
                <img
                  src="/placeholder.svg?height=400&width=350"
                  alt=""
                  className="w-full h-full object-contain opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
