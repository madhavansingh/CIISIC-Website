import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, University, ArrowRight } from 'lucide-react';

export const GetInvolvedSection: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="get-involved" className="py-16 sm:py-24 bg-[#faf8f4] border-t border-[#e8e4dc] scroll-mt-20">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-semibold tracking-wide">
            Get Involved
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#063028] tracking-tight leading-tight font-serif">
            Ready to Solve the Next Industry Challenge?
          </h2>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
            Whether you're an industry partner looking to solve business challenges or an institution preparing future innovators, join the CII Industry–Academia Excellence Initiative driving real-world innovation through collaboration.
          </p>
        </div>

        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Card 1: Become an Industry Partner */}
          <div className="bg-white border border-stone-200/90 rounded-2xl sm:rounded-[24px] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#063028]"></div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[#edf4f0] text-[#063028] rounded-2xl group-hover:bg-[#063028] group-hover:text-white transition-all duration-300 shrink-0">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-[#063028] tracking-wider block">
                    Connect &amp; Innovate
                  </span>
                  <h3 className="text-2xl font-bold text-[#063028] font-serif">
                    Become an Industry Partner
                  </h3>
                </div>
              </div>

              <p className="text-base text-stone-700 leading-relaxed font-normal">
                Submit real business challenges, get matched with expert faculty-led student teams, and co-develop practical, research-backed solutions.
              </p>

              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-sm sm:text-base text-stone-700 font-medium">
                  <div className="h-5 w-5 rounded-full bg-[#edf4f0] text-[#063028] flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                  <span>Verified faculty &amp; student team matching</span>
                </li>
                <li className="flex items-center gap-3 text-sm sm:text-base text-stone-700 font-medium">
                  <div className="h-5 w-5 rounded-full bg-[#edf4f0] text-[#063028] flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                  <span>Structured challenge submission process</span>
                </li>
                <li className="flex items-center gap-3 text-sm sm:text-base text-stone-700 font-medium">
                  <div className="h-5 w-5 rounded-full bg-[#edf4f0] text-[#063028] flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                  <span>Milestone tracking &amp; solution reports</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                to="/industry/login"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 bg-[#063028] hover:bg-[#04201a] text-white text-sm sm:text-base font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs"
              >
                Enter Industry Portal <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>


          {/* Card 2: Become a Partner Institution */}
          <div className="bg-white border border-stone-200/90 rounded-2xl sm:rounded-[24px] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c48825]"></div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[#fef6e7] text-[#c48825] rounded-2xl group-hover:bg-[#c48825] group-hover:text-white transition-all duration-300 shrink-0">
                  <University className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-[#a6711c] tracking-wider block">
                    Academic Partnership
                  </span>
                  <h3 className="text-2xl font-bold text-[#063028] font-serif">
                    Become a Partner Institution
                  </h3>
                </div>
              </div>

              <p className="text-base text-stone-700 leading-relaxed font-normal">
                Empower your students with real industry challenges. Partner institutions gain access to curated problem statements, mentor networks, and structured innovation programmes.
              </p>

              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-sm sm:text-base text-stone-700 font-medium">
                  <div className="h-5 w-5 rounded-full bg-[#fef6e7] text-[#c48825] flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                  <span>Access to live industry problem statements</span>
                </li>
                <li className="flex items-center gap-3 text-sm sm:text-base text-stone-700 font-medium">
                  <div className="h-5 w-5 rounded-full bg-[#fef6e7] text-[#c48825] flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                  <span>Faculty-guided student team coordination</span>
                </li>
                <li className="flex items-center gap-3 text-sm sm:text-base text-stone-700 font-medium">
                  <div className="h-5 w-5 rounded-full bg-[#fef6e7] text-[#c48825] flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                  <span>Progress dashboards & submission tracking</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                to="/institution/login"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 bg-[#c48825] hover:bg-[#b0781e] text-white text-sm sm:text-base font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs"
              >
                Enter Institution Portal <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Additional Buttons underneath */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-12">
          <button
            onClick={() => handleScrollTo('partner-institutions')}
            className="px-6 py-3.5 bg-white border border-stone-300 hover:bg-[#faf8f4] text-[#063028] text-sm sm:text-base font-bold rounded-xl transition-colors cursor-pointer"
          >
            Become a Partner Institution
          </button>
          <button
            onClick={() => handleScrollTo('about-ciisic')}
            className="px-6 py-3.5 bg-white border border-stone-300 hover:bg-[#faf8f4] text-[#063028] text-sm sm:text-base font-bold rounded-xl transition-colors cursor-pointer"
          >
            Explore CIISIC
          </button>
        </div>

      </div>
    </section>
  );
};
