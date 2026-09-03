import React, { useEffect } from 'react';
import { INDORE_INSTITUTIONS, BHOPAL_INSTITUTIONS } from '../data/institutions';
import { Building2 } from 'lucide-react';

export const Institutions: React.FC = () => {
  // Ensure we start at the top of the page when navigating here
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#faf8f4] min-h-screen py-16 sm:py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-semibold tracking-wide">
            Partner Network
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#063028] tracking-tight font-serif leading-tight">
            Partner Institutions
          </h1>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
            Connecting leading technical universities, engineering colleges, and research institutes across Indore and Bhopal to drive student-led innovations for industry challenges.
          </p>
        </div>

        {/* Two-Column Grid for Cities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Indore Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
              <div className="p-3 bg-[#edf4f0] text-[#063028] rounded-xl">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#063028] font-serif">Indore Division</h2>
                <p className="text-sm text-[#a6711c] font-bold uppercase tracking-wider">{INDORE_INSTITUTIONS.length} Partner Institutions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INDORE_INSTITUTIONS.map((inst, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-stone-200/90 p-5 rounded-2xl shadow-xs flex flex-col justify-center min-h-[5.5rem] transition-all duration-300 hover:border-[#063028] hover:shadow-md hover:-translate-y-0.5"
                >
                  <p className="text-sm sm:text-base font-bold text-stone-800 leading-snug">
                    {inst.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bhopal Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
              <div className="p-3 bg-[#fef6e7] text-[#c48825] rounded-xl">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#063028] font-serif">Bhopal Division</h2>
                <p className="text-sm text-[#a6711c] font-bold uppercase tracking-wider">{BHOPAL_INSTITUTIONS.length} Partner Institutions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BHOPAL_INSTITUTIONS.map((inst, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-stone-200/90 p-5 rounded-2xl shadow-xs flex flex-col justify-center min-h-[5.5rem] transition-all duration-300 hover:border-[#063028] hover:shadow-md hover:-translate-y-0.5"
                >
                  <p className="text-sm sm:text-base font-bold text-stone-800 leading-snug">
                    {inst.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
