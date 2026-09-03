import React from 'react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      title: "Industry Challenge Submission",
      desc: "Industry partner submits a challenge detailing operational bottlenecks, technical requirements, or research goals through CIISIC."
    },
    {
      title: "Administrative Review & Validation",
      desc: "The challenge is reviewed by the CII Industry–Academia Excellence Initiative to verify scope and requirements."
    },
    {
      title: "Specialized Cell Mapping",
      desc: "The approved challenge is routed and mapped to the relevant CII Excellence Cell and partner academic institution based on domain expertise."
    },
    {
      title: "Student Team Selection",
      desc: "Multidisciplinary student teams choose active challenges aligned with their academic background, expertise, and research interests."
    },
    {
      title: "Faculty Mentorship & Oversight",
      desc: "Distinguished faculty mentors guide the student teams through research, experimentation, and regular review cycles."
    },
    {
      title: "Prototype & Solution Development",
      desc: "Teams collaborate to build functional prototypes, compile detailed feasibility reports, or deliver practical, research-backed solutions."
    },
    {
      title: "Industry Evaluation & Implementation",
      desc: "Corporate sponsors evaluate project outcomes, prototypes, and reports for direct implementation or future collaborative partnerships."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#faf8f4] border-t border-[#e8e4dc] scroll-mt-20">
      <div className="max-w-[900px] mx-auto px-6 sm:px-8">
        
        {/* Header Block */}
        <div className="text-left max-w-3xl mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-semibold tracking-wide">
            Our Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063028] tracking-tight leading-tight font-serif">
            From Challenge to Solution
          </h2>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
            A structured, transparent pathway connecting industry requirements with guided academic research and student innovation.
          </p>
        </div>

        {/* Robust Flexbox-based Vertical Timeline (No fragile absolute alignments) */}
        <div className="space-y-0">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4 sm:gap-6 items-stretch group text-left">
              
              {/* Left Column: Number Node and Continuous Connecting Line */}
              <div className="flex flex-col items-center shrink-0">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white border-2 border-[#063028] flex items-center justify-center shadow-xs group-hover:bg-[#063028] transition-all duration-300">
                  <span className="text-xs sm:text-sm font-bold text-[#063028] group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                </div>
                {/* Connector line - shown only for intermediate steps */}
                {idx < steps.length - 1 && (
                  <div className="w-[1.5px] bg-stone-200 flex-grow my-2"></div>
                )}
              </div>

              {/* Right Column: Step Title & Description */}
              <div className="pb-8 sm:pb-12 space-y-1 sm:space-y-1.5">
                <h4 className="text-lg sm:text-xl font-bold text-[#063028] font-serif group-hover:text-[#c48825] transition-colors pt-0.5">
                  {step.title}
                </h4>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
