import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, GraduationCap, Users, Brain, ShieldCheck, Lock, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-[#faf8f4] border-b border-[#e8e4dc]">
      
      {/* Subtle Bottom-Left Contour Lines */}
      <div className="absolute left-0 bottom-0 w-80 h-32 pointer-events-none opacity-40">
        <svg viewBox="0 0 300 120" fill="none" className="w-full h-full stroke-stone-300/60">
          <path d="M-20 100 Q 80 40 180 80 T 320 60" strokeWidth="1" />
          <path d="M-20 115 Q 100 65 200 95 T 320 85" strokeWidth="1" />
        </svg>
      </div>

      {/* Top-Right Matrix Dot Grid */}
      <div className="absolute top-8 right-12 w-56 h-48 pointer-events-none hidden md:block z-0">
        <div className="w-full h-full bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:18px_18px] opacity-40"></div>
      </div>

      {/* Bottom-Right Deep Forest Green Curved Solid Wave */}
      <div className="absolute bottom-0 right-0 w-[420px] sm:w-[500px] md:w-[600px] h-[260px] sm:h-[320px] pointer-events-none z-0">
        <svg viewBox="0 0 500 260" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path 
            d="M 500 0 Q 340 70 240 160 T 0 260 L 500 260 Z" 
            fill="#063028" 
          />
        </svg>
      </div>

      {/* Main Hero Container */}
      <section id="hero" className="pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 relative z-10 scroll-mt-24">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-18 items-center">
            
            {/* Left Column: Typography matching screenshot */}
            <div className="lg:col-span-6 space-y-6 text-left relative z-10">
              
              {/* Eyebrow: Temple Icon + POWERED BY CII */}
              <div className="flex items-center gap-2 text-[#c48825] font-bold text-xs tracking-wider uppercase">
                {/* Pantheon / Classical Temple Icon */}
                <svg className="w-4 h-4 fill-current text-[#c48825] shrink-0" viewBox="0 0 24 24">
                  <path d="M2 8.5L12 3L22 8.5V10H2V8.5ZM4 19H7V11H4V19ZM10 19H14V11H10V19ZM17 19H20V11H17V19ZM2 21H22V20H2V21Z" />
                </svg>
                <span>POWERED BY CII</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#063028] tracking-tight leading-[1.12] font-serif">
                Where industry<br />
                challenges meet<br />
                student <span className="text-[#c48825]">innovation</span>
              </h1>
              
              {/* Dual Quotes / Taglines */}
              <div className="space-y-1.5 text-[#a6711c] text-lg sm:text-xl lg:text-[22px] font-sans font-bold italic leading-snug tracking-tight">
                <p>&quot;Every challenge has the potential to inspire innovation.&quot;</p>
                <p>&quot;Every student has the potential to create change.&quot;</p>
              </div>
              
              {/* Body Description */}
              <p className="text-stone-700 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Whether you are an industry partner seeking innovative solutions, a student looking for meaningful projects, or an institution committed to applied research and collaboration, CII provides a structured pathway to turn ideas into impact.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3.5 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/problem-statements"
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[#063028] hover:bg-[#04201a] transition-all duration-200 shadow-sm active:scale-98 whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4 text-[#c48825]" />
                    <span>Explore Problem Statements</span>
                  </Link>

                  <Link
                    to="/industry/login"
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-xl text-sm font-bold text-[#063028] bg-white border border-stone-300 hover:bg-stone-50 hover:border-[#063028]/40 transition-all duration-200 shadow-2xs active:scale-98 whitespace-nowrap"
                  >
                    <Building2 className="w-4 h-4 text-[#063028]" />
                    <span>Register as Industry</span>
                  </Link>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-600 pt-0.5">
                  <span>CII Platform Official?</span>
                  <Link
                    to="/admin/login"
                    className="inline-flex items-center gap-1 font-bold text-[#063028] hover:text-[#c48825] transition-colors hover:underline"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-[#c48825]" />
                    <span>Go to Admin Portal &rarr;</span>
                  </Link>
                </div>
              </div>

            </div>

            {/* Right Column: Collaboration Pillars Card */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end w-full z-10">
              <div className="bg-white rounded-[24px] sm:rounded-[28px] border border-stone-200/90 w-full max-w-[560px] p-6 sm:p-8 lg:p-9 shadow-xl text-left flex flex-col justify-between">
                
                {/* Header */}
                <div className="space-y-2 mb-7 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-bold text-[#063028] uppercase tracking-wider font-sans">
                    COLLABORATION PILLARS
                  </h3>
                  <p className="text-sm text-stone-600 font-normal leading-relaxed">
                    A unified framework connecting research, industry, and next-generation talent to safely prototype real-world solutions.
                  </p>
                </div>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6 sm:gap-y-7 mb-7 sm:mb-8">
                  
                  {/* Pillar 1: Industry */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-full bg-[#edf4f0] text-[#063028] flex items-center justify-center shrink-0">
                      <Building2 className="h-6 w-6 stroke-[1.75]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#063028] text-base sm:text-lg leading-tight font-sans">Industry</h4>
                      <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                        Share real-world problems and drive student prototypes.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 2: Academia */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-full bg-[#edf4f0] text-[#063028] flex items-center justify-center shrink-0">
                      <GraduationCap className="h-6 w-6 stroke-[1.75]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#063028] text-base sm:text-lg leading-tight font-sans">Academia</h4>
                      <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                        Provide deep domain mentorship and research oversight.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 3: Students */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-full bg-[#edf4f0] text-[#063028] flex items-center justify-center shrink-0">
                      <Users className="h-6 w-6 stroke-[1.75]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#063028] text-base sm:text-lg leading-tight font-sans">Students</h4>
                      <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                        Apply technical talent to solve complex industrial issues.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 4: AI Hub */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-full bg-[#edf4f0] text-[#063028] flex items-center justify-center shrink-0">
                      <Brain className="h-6 w-6 stroke-[1.75]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#063028] text-base sm:text-lg leading-tight font-sans">AI Hub</h4>
                      <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                        Co-create, iterate, and deploy secure enterprise solutions.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Bottom Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-stone-200/80">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f4f6f4] text-stone-800 text-xs sm:text-sm font-medium rounded-lg border border-stone-200/80">
                    <ShieldCheck className="h-4 w-4 text-[#063028]" />
                    <span>Unified Platform</span>
                  </span>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f4f6f4] text-stone-800 text-xs sm:text-sm font-medium rounded-lg border border-stone-200/80">
                    <Lock className="h-4 w-4 text-[#063028]" />
                    <span>Secure Matching</span>
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
};

