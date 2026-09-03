import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      q: "Who can submit industry challenges?",
      a: "Industries, startups, MSMEs, government organizations, and institutions."
    },
    {
      q: "Who can participate?",
      a: "Students from CII partner institutions under faculty mentorship."
    },
    {
      q: "How are challenges assigned?",
      a: "Each challenge is reviewed and mapped to the appropriate CII Excellence Cell based on domain and expertise."
    },
    {
      q: "Can institutions become partners?",
      a: "Yes. Institutions can collaborate with the CII Industry–Academia Excellence Initiative by joining the growing innovation ecosystem as partner institutions."
    }
  ];

  const handleToggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#faf8f4] border-t border-[#e8e4dc] scroll-mt-20">
      <div className="max-w-[800px] mx-auto px-6 sm:px-8">
        
        {/* Header Block */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-semibold tracking-wide">
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063028] tracking-tight leading-tight font-serif">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ List Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden transition-all duration-300 hover:border-stone-300 shadow-xs"
              >
                {/* Question Header */}
                <button
                  type="button"
                  onClick={() => handleToggle(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left font-bold text-[#063028] hover:text-[#c48825] transition-colors focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-[#063028] shrink-0" />
                    <span className="text-base sm:text-lg font-bold text-[#063028] leading-relaxed">{faq.q}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-stone-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#063028]' : ''}`} />
                </button>

                {/* Answer Content */}
                <div 
                  className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 border-t border-stone-100 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
                >
                  <div className="px-6 py-5 bg-[#faf8f4]/60">
                    <p className="text-base text-stone-700 leading-relaxed font-normal">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
