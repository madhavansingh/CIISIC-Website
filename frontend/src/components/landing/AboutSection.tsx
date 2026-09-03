import React from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const steps = [
    "Industries submit real business challenges.",
    "Challenges are routed to the appropriate CII Excellence Cell.",
    "Faculty mentor multidisciplinary student teams.",
    "Students develop innovative, research-backed solutions.",
    "Industries evaluate solutions for implementation and future collaboration."
  ];

  return (
    <section id="about-ciisic" className="py-16 sm:py-24 md:py-28 bg-[#faf8f4] relative overflow-hidden scroll-mt-20 border-t border-[#e8e4dc]">
      {/* Decorative vector background */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-[#edf4f0]/60 filter blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#fef6e7]/40 filter blur-3xl pointer-events-none"></div>

      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Heading and detailed bullet list */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-semibold tracking-wide">
                About CIISIC
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-[1.15] text-[#063028] font-serif">
                One Platform. Endless Possibilities.
              </h2>
            </div>
            
            <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
              CIISIC is the official collaboration platform developed under the CII Industry–Academia Excellence Initiative, designed to connect industries with students, faculty experts, and partner institutions through a structured innovation ecosystem.
            </p>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-600 uppercase tracking-wider">The Collaboration Flow</h3>
              <ul className="space-y-4">
                {steps.map((step, idx) => (
                  <li key={idx} className="flex gap-4 items-start group">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf4f0] text-[#063028] text-sm font-bold border border-[#e2ece6] group-hover:bg-[#063028] group-hover:text-white transition-all duration-300">
                      {idx + 1}
                    </span>
                    <span className="text-base sm:text-lg text-stone-800 font-medium leading-relaxed pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-stone-200 pt-6">
              <p className="text-[#063028] text-base sm:text-lg font-sans font-medium leading-relaxed">
                “CIISIC transforms classroom knowledge into real-world impact while strengthening the connection between industry and academia.”
              </p>
            </div>
          </div>

          {/* Right Column: Premium Visual Classroom-to-Impact Pathway Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
            <div className="bg-white border border-stone-200/90 p-6 sm:p-8 rounded-2xl sm:rounded-[28px] w-full max-w-[500px] flex flex-col justify-between relative overflow-hidden shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#063028] via-[#0d382d] to-[#c48825]"></div>
              
              <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider text-center mb-6 font-sans">
                Transformation Pathway
              </h3>

              <div className="space-y-4">
                {/* Pathway Step 1 */}
                <div className="bg-[#faf8f4] border border-stone-200/80 p-5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf4f0] text-[#063028] font-bold text-xs shrink-0">
                      IN
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#063028]">Industry Input</h4>
                  </div>
                  <p className="text-sm text-stone-700 mt-2 font-normal leading-relaxed">
                    Corporate partners upload operational challenges, technical bottlenecks, or research-intensive goals to the platform.
                  </p>
                </div>

                {/* Connection Indicator */}
                <div className="flex justify-center items-center py-0.5">
                  <div className="h-5 w-[1.5px] border-l-2 border-dashed border-stone-300"></div>
                </div>

                {/* Pathway Step 2 */}
                <div className="bg-[#faf8f4] border border-stone-200/80 p-5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fef6e7] text-[#c48825] font-bold text-xs shrink-0">
                      MID
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#063028]">Excellence Matching</h4>
                  </div>
                  <p className="text-sm text-stone-700 mt-2 font-normal leading-relaxed">
                    CII reviews the proposal and maps it to the specialized Excellence Cell hosted by a regional partner academic institution.
                  </p>
                </div>

                {/* Connection Indicator */}
                <div className="flex justify-center items-center py-0.5">
                  <div className="h-5 w-[1.5px] border-l-2 border-dashed border-stone-300"></div>
                </div>

                {/* Pathway Step 3 */}
                <div className="bg-[#faf8f4] border border-stone-200/80 p-5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf4f0] text-[#063028] font-bold text-xs shrink-0">
                      OUT
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#063028]">Innovation Output</h4>
                  </div>
                  <p className="text-sm text-stone-700 mt-2 font-normal leading-relaxed">
                    Faculty-guided student innovators develop prototype solutions, running low-risk validation pilots.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
