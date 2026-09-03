import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ArrowUpRight, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ChallengeAreasSection: React.FC = () => {
  const domains = [
    "Marketing & Brand Strategy",
    "People & Finance Solutions",
    "Engineering Excellence",
    "Design Innovation",
    "Healthcare & Pharma",
    "Artificial Intelligence",
    "Agriculture & Sustainability",
    "Manufacturing",
    "Digital Transformation",
    "Supply Chain",
    "Business Operations",
    "Smart Cities & Urban Innovation"
  ];

  return (
    <section id="challenge-areas" className="py-24 bg-[#faf8f4] border-t border-[#e8e4dc] scroll-mt-20">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12 space-y-20">
        
        {/* Main Section: Domains Grid + Flyer Poster split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Descriptions and Grid of Domains */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-semibold tracking-wide">
                Challenge Areas
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063028] tracking-tight leading-tight font-serif">
                Every Industry Challenge Creates an Opportunity
              </h2>
              <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
                The CII Industry–Academia Excellence Initiative welcomes challenges from diverse sectors and connects them with the most relevant Excellence Cell, academic institution, faculty experts, and student innovators.
              </p>
            </div>

            {/* Grid of Domains */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {domains.map((domain, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 bg-white border border-stone-200/90 p-4 rounded-xl shadow-xs hover:border-[#063028] transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-[#c48825] shrink-0"></div>
                  <span className="text-sm sm:text-base text-stone-800 font-semibold leading-normal">{domain}</span>
                </div>
              ))}
            </div>

            {/* CTA Submit Button */}
            <div className="pt-2">
              <Link
                to="/industry/login"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white bg-[#063028] hover:bg-[#04201a] shadow-xs transition-all duration-200"
              >
                Submit Your Industry Challenge <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Poster of the Flyer */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <div className="bg-white border border-stone-200/90 p-4 rounded-3xl shadow-sm w-full max-w-[400px] group transition-all duration-300 hover:shadow-md hover:border-stone-300">
              <div className="relative overflow-hidden rounded-2xl shadow-xs">
                <img 
                  src="/images/flyer_2.jpeg" 
                  alt="CII Students Innovation Challenge Flyer" 
                  className="w-full h-auto block group-hover:scale-101 transition-all duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#04201a]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                  <Link 
                    to="/industry/login"
                    className="px-5 py-3 bg-white text-[#063028] text-sm font-bold uppercase rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-stone-50 transition-colors"
                  >
                    Enter Portal <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="p-4 pt-4 text-center space-y-1.5">
                <span className="text-xs font-bold uppercase text-[#a6711c] tracking-wider">
                  Featured Challenge Graphic
                </span>
                <p className="text-sm text-stone-600 font-normal leading-relaxed">
                  The Flyer highlights five foundational fields: Marketing Wars, People &amp; Finance, Engineering, Design, and Healthcare.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 10: Events & Announcements Sub-Banner */}
        <div className="bg-[#faf7f0] border border-stone-200/90 rounded-2xl sm:rounded-[28px] p-6 sm:p-10 relative overflow-hidden shadow-xs text-stone-800">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl text-left">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#edf4f0] border border-[#e2ece6] text-[#063028] text-xs font-bold uppercase tracking-wider">
                <Calendar className="h-4 w-4" /> Events Hub
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#063028] font-serif leading-snug">
                Connecting the Innovation Ecosystem
              </h3>
              <p className="text-base text-stone-700 leading-relaxed font-normal">
                Stay updated with workshops, seminars, innovation challenges, industry interactions, startup showcases, and collaborative events organized under the CII Industry–Academia Excellence Initiative.
              </p>
            </div>

            <div className="shrink-0 flex items-start">
              <button 
                onClick={() => {
                  const el = document.getElementById('get-involved');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-4 bg-[#063028] hover:bg-[#04201a] text-white rounded-xl text-sm font-bold uppercase tracking-wider shadow-xs transition-all duration-150 whitespace-nowrap active:scale-98 cursor-pointer"
              >
                View All Events
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
