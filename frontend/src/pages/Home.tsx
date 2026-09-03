import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { AboutSection } from '../components/landing/AboutSection';
import { PartnerInstitutionsSection } from '../components/landing/PartnerInstitutionsSection';
import { WhyCiiSection } from '../components/landing/WhyCiiSection';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { ExcellenceCellsSection } from '../components/landing/ExcellenceCellsSection';
import { ChallengeAreasSection } from '../components/landing/ChallengeAreasSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { ImageSliderSection } from '../components/landing/ImageSliderSection';
import { FAQSection } from '../components/landing/FAQSection';
import { GetInvolvedSection } from '../components/landing/GetInvolvedSection';
import { FooterSection } from '../components/landing/FooterSection';

export const Home: React.FC = () => {
  return (
    <div className="bg-[#faf8f4] min-h-screen font-sans selection:bg-[#c48825]/20 selection:text-[#063028] scroll-smooth">
      <HeroSection />
      <AboutSection />
      <PartnerInstitutionsSection />
      <ExcellenceCellsSection />
      <WorkflowSection />
      <WhyCiiSection />
      <ChallengeAreasSection />
      <TestimonialsSection />
      <ImageSliderSection />
      <FAQSection />
      <GetInvolvedSection />
      <FooterSection />
    </div>
  );
};
