import React from 'react';
import { Landmark, GraduationCap, FileText, Award } from 'lucide-react';

interface StatItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}

const stats: StatItem[] = [
  {
    id: 'excellence-cells',
    icon: Landmark,
    value: '7+',
    label: 'EXCELLENCE CELLS',
  },
  {
    id: 'partner-institutions',
    icon: GraduationCap,
    value: '120+',
    label: 'PARTNER INSTITUTIONS',
  },
  {
    id: 'corporate-problems',
    icon: FileText,
    value: '450+',
    label: 'CORPORATE PROBLEMS',
  },
  {
    id: 'grants-funding',
    icon: Award,
    value: '₹15 Cr+',
    label: 'GRANTS & FUNDING',
  },
];

export const QuickImpactStatsSection: React.FC = () => {
  return (
    <div className="w-full bg-[#faf8f4] py-3 sm:py-3.5 md:py-4 shrink-0 border-t border-[#e8e4dc]">
      {/* Constrained max-width container to prevent horizontal stretching */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        
        {/* Outer Elevated Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-2.5 sm:p-3 md:p-3.5 shadow-[0_4px_20px_rgba(6,48,40,0.04)]">
          
          {/* 4 Cards: 2 Columns on Mobile, 4 Columns (1 single row) on Desktop with balanced proportions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-3.5">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className="group bg-[#fcfbf9] hover:bg-white rounded-xl sm:rounded-2xl border border-stone-200/80 hover:border-[#c48825]/50 py-3 sm:py-3.5 md:py-4 px-3 sm:px-4 flex flex-col items-center justify-center text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  {/* Icon & Value on One Row */}
                  <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                    <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#c48825] stroke-[2.2] shrink-0 transition-transform duration-200 group-hover:scale-105" />
                    <span className="text-lg sm:text-xl md:text-2xl lg:text-[26px] font-extrabold text-[#063028] tracking-tight font-sans leading-none">
                      {stat.value}
                    </span>
                  </div>

                  {/* Stat Label */}
                  <p className="mt-1.5 sm:mt-2 text-[10.5px] sm:text-[11.5px] md:text-xs font-bold text-stone-600 tracking-wider uppercase font-sans whitespace-nowrap">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
