import React from 'react';
import { HeroBannerCarousel } from '../components/landing/HeroBannerCarousel';
import { QuickImpactStatsSection } from '../components/landing/QuickImpactStatsSection';
import { HeroSection } from '../components/landing/HeroSection';
import { AboutSection } from '../components/landing/AboutSection';
import { ServicesSection } from '../components/landing/ServicesSection';
import { PartnerInstitutionsSection } from '../components/landing/PartnerInstitutionsSection';
import { ChallengeAreasSection } from '../components/landing/ChallengeAreasSection';
import { ExcellenceCellsSection } from '../components/landing/ExcellenceCellsSection';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { WhyCiiSection } from '../components/landing/WhyCiiSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { FAQSection } from '../components/landing/FAQSection';
import { GetInvolvedSection } from '../components/landing/GetInvolvedSection';
import { FooterSection } from '../components/landing/FooterSection';

export const Home: React.FC = () => {
  return (
    <div className="bg-[#faf8f4] min-h-screen font-sans selection:bg-[#c48825]/20 selection:text-[#063028] scroll-smooth overflow-x-hidden">
      {/* Main UI Hero Screen: Exactly fills the initial viewport under the 72px navbar so ONLY the slideshow and card are visible */}
      <section 
        id="hero" 
        className="w-full h-[calc(100vh-72px)] min-h-[560px] flex flex-col justify-between bg-[#faf8f4] border-b border-[#e8e4dc] overflow-hidden"
      >
        <div className="w-full flex-1 min-h-0 relative flex flex-col">
          <HeroBannerCarousel />
        </div>
        <QuickImpactStatsSection />
      </section>

      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PartnerInstitutionsSection />
      <ChallengeAreasSection />
      <ExcellenceCellsSection />
      <WorkflowSection />
      <WhyCiiSection />
      <TestimonialsSection />
      <FAQSection />
      <GetInvolvedSection />
      <FooterSection />
    </div>
  );
};
