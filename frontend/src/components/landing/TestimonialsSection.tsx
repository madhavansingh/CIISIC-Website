import React from 'react';
import { Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Working with students through the CII Industry–Academia Excellence Initiative brought fresh perspectives and innovative solutions to our business challenges.",
      role: "Industry Partner",
      avatarBg: "bg-[#edf4f0] text-[#063028]",
      avatarTxt: "IP"
    },
    {
      quote: "CIISIC gave me the opportunity to work on a real industry problem and transform classroom learning into practical experience.",
      role: "Student Innovator",
      avatarBg: "bg-[#fef6e7] text-[#c48825]",
      avatarTxt: "SI"
    },
    {
      quote: "This initiative has strengthened collaboration between academia and industry while creating meaningful opportunities for students.",
      role: "Faculty Mentor",
      avatarBg: "bg-[#edf4f0] text-[#063028]",
      avatarTxt: "FM"
    }
  ];

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-[#faf8f4] border-t border-[#e8e4dc] scroll-mt-20">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-semibold tracking-wide">
            Ecosystem Voices
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063028] tracking-tight leading-tight font-serif">
            Collaboration That Creates Impact
          </h2>
          <p className="text-stone-700 text-base sm:text-lg font-medium">
            Voices from the CII Ecosystem
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="bg-white border border-stone-200/90 p-6 sm:p-8 rounded-2xl flex flex-col justify-between relative shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-300"
            >
              {/* Quote Icon overlay */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-[#c48825]/20 pointer-events-none" />

              <div className="space-y-6">
                <p className="text-stone-700 text-base sm:text-lg font-sans leading-relaxed relative z-10">
                  “{t.quote}”
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-6 border-t border-stone-100 mt-6">
                {/* Clean Initial Avatar representing the stakeholder */}
                <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm uppercase shadow-xs ${t.avatarBg}`}>
                  {t.avatarTxt}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#063028]">
                    {t.role}
                  </h4>
                  <span className="text-xs text-stone-600 font-semibold uppercase tracking-wider">
                    Verified Stakeholder
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
