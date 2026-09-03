import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const PartnerInstitutionsSection: React.FC = () => {
  const logos = [
    { name: 'Jagran Lakecity University', src: '/images/jagran_lakecity_logo.jpg' },
    { name: 'LNCT Group', src: '/images/lnct_g_logo.png' },
    { name: 'LNCT University', src: '/images/lnct_university_logo.png' },
    { name: 'Oriental Group of Institutes', src: '/images/oriental_group_logo.png' },
    { name: 'Rabindranath Tagore University', src: '/images/rntu_logo.png' },
    { name: 'Scope Global Skills University', src: '/images/scope_global_logo.png' },
  ];

  return (
    <section id="partner-institutions" className="py-16 sm:py-24 bg-[#faf8f4] border-t border-[#e8e4dc] scroll-mt-20">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-semibold tracking-wide">
            Partner Network
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063028] tracking-tight leading-tight font-serif">
            Powered by the CII Industry–Academia Excellence Initiative
          </h2>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
            A growing network of leading academic institutions across Madhya Pradesh, united by the Confederation of Indian Industry (CII) to strengthen industry–academia collaboration and innovation. Each partner institution hosts a CII Excellence Cell, bringing domain expertise, faculty leadership, and student innovation together to solve real industry challenges.
          </p>
        </div>

        {/* Integrated Statistics display (Section 9) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16 border-y border-[#e8e4dc] py-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#063028] tracking-tight font-serif">35+</div>
            <div className="text-sm font-bold text-stone-700 uppercase tracking-wider mt-2">Partner Institutions</div>
            <p className="text-xs sm:text-sm text-[#a6711c] font-bold uppercase tracking-wider mt-1">16 Bhopal, 20 Indore</p>
          </div>
          <div className="text-center sm:border-x border-[#e8e4dc] py-2 sm:py-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#063028] tracking-tight font-serif">7</div>
            <div className="text-sm font-bold text-stone-700 uppercase tracking-wider mt-2">CII Excellence Cells</div>
            <p className="text-xs sm:text-sm text-[#a6711c] font-bold uppercase tracking-wider mt-1">Domain-Specific Hubs</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#063028] tracking-tight font-serif">36</div>
            <div className="text-sm font-bold text-stone-700 uppercase tracking-wider mt-2">Active Cooperations</div>
            <p className="text-xs sm:text-sm text-[#a6711c] font-bold uppercase tracking-wider mt-1">Madhya Pradesh Network</p>
          </div>
        </div>

        {/* Brand Logos Showcase Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 items-center">
          {logos.map((logo, idx) => (
            <div 
              key={idx}
              className="bg-white border border-stone-200/90 p-6 rounded-2xl flex items-center justify-center h-28 hover:shadow-sm hover:border-stone-300 transition-all duration-300"
            >
              <img 
                src={logo.src} 
                alt={`${logo.name} logo`} 
                className="max-h-full max-w-full object-contain filter grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}

          {/* "+35 More" Special Grid Tile */}
          <div 
            className="bg-[#063028] border border-[#04201a] p-6 rounded-2xl flex flex-col items-center justify-center h-28 text-center text-white shadow-xs"
          >
            <span className="text-xl font-extrabold tracking-tight font-serif">35+</span>
            <span className="text-xs uppercase font-bold tracking-wider text-[#e2b765] mt-1">Institutions</span>
          </div>
        </div>

        {/* View All CTAs */}
        <div className="mt-12 text-center">
          <Link
            to="/institutions"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-stone-300 rounded-xl text-sm sm:text-base font-bold text-[#063028] hover:bg-[#063028] hover:text-white hover:border-[#063028] shadow-xs transition-all duration-300"
          >
            View All Partner Institutions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
