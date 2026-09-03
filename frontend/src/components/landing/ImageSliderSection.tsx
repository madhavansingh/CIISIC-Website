import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Sparkles, 
  MapPin, 
  Users
} from 'lucide-react';

interface SlideItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  location: string;
  stats: string;
  date: string;
}

const slides: SlideItem[] = [
  {
    id: 'family-business',
    title: "Family Business Governance & Leadership Roundtables",
    category: "Entrepreneurship",
    description: "Case study explorations on intergenerational business continuity, digital modernization, and enterprise resilience for regional firms.",
    image: "/images/1_family_business.jpg",
    location: "Jagran Lakecity University",
    stats: "40+ Family Enterprise Leaders",
    date: "Executive Forum"
  },
  {
    id: 'talent-readiness',
    title: "Career Readiness & Corporate Mentorship Drives",
    category: "Talent Readiness",
    description: "Interactive mock interviews, industry problem-solving sprints, and live aptitude roundtables led by senior engineering leaders.",
    image: "/images/2_talent_readiness.jpg",
    location: "LNCT Campus Amphitheater",
    stats: "500+ Students Mentored",
    date: "Employability Initiative"
  },
  {
    id: 'research-innovation',
    title: "Applied Research & Prototyping Laboratory",
    category: "Research & Innovation",
    description: "Students and faculty mentors collaborating on real-world industrial prototypes, testing novel sensor solutions and computational models.",
    image: "/images/3_research_innovation.jpg",
    location: "LNCT University Advanced Lab",
    stats: "12+ Live Industry Prototypes",
    date: "Excellence Cell"
  },
  {
    id: 'ai-in-business',
    title: "Enterprise AI & Machine Learning Solutions",
    category: "AI in Business",
    description: "Industry practitioners conducting technical walkthroughs on generative AI architectures, automated defect detection, and business workflows.",
    image: "/images/4_ai_in_business.jpg",
    location: "Oriental Group of Institutes",
    stats: "8 Active Enterprise AI Projects",
    date: "Specialized Cell"
  },
  {
    id: 'agritech-solutions',
    title: "AgriTech & Rural Enterprise Engineering",
    category: "AgriTech Innovation",
    description: "Developing smart irrigation monitors, soil telemetry sensors, and supply-chain logistics tools for regional agricultural enterprises.",
    image: "/images/5_agritech.jpeg",
    location: "RNTU Innovation Center",
    stats: "6 Regional Farm Deployments",
    date: "Applied Fieldwork"
  },
  {
    id: 'skill-development',
    title: "Applied Technical Skills & Hardware Workshop",
    category: "Skill Development",
    description: "Hands-on calibration of embedded systems, IoT testbenches, and industrial automation equipment under guided academic supervision.",
    image: "/images/6_skill_development.jpeg",
    location: "Scope Global Skills Lab",
    stats: "18 Hardware Kits & Testbeds",
    date: "Technical Workshop"
  },
  {
    id: 'startup-showcase',
    title: "Student Startup Pitch & Innovation Demo Day",
    category: "Venture Incubation",
    description: "Young collegiate founders presenting vetted minimum viable products to angel networks, MSME heads, and industrial venture partners.",
    image: "/images/7_startup.jpeg",
    location: "Central Incubation Center",
    stats: "14 Pitches • 4 Seed Allocations",
    date: "Pitch Showcase"
  },
  {
    id: 'summit-launch',
    title: "CII Industry-Academia Excellence Summit & Launch",
    category: "Flagship Initiative",
    description: "Bringing together industry captains, academic chancellors, and student innovators to inaugurate state-level innovation cells and strategic alliances.",
    image: "/images/flyer_2.jpeg",
    location: "CII State Council & Partner Campuses",
    stats: "35+ Partner Institutions • 150+ Delegates",
    date: "Annual Summit"
  }
];

export const ImageSliderSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = slides.length;
  const currentSlide = slides[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay handler
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    setTouchStartX(null);
  };

  return (
    <section 
      id="gallery" 
      className="py-16 sm:py-20 bg-[#faf8f4] border-t border-[#e8e4dc] scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-semibold tracking-wide border border-[#063028]/10">
              <Sparkles className="h-3.5 w-3.5 text-[#c48825]" />
              <span>Ecosystem in Action</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#063028] tracking-tight leading-tight font-serif">
              Innovation & Collaboration Gallery
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Explore key focus areas, applied student projects, leadership roundtables, and technical workshops across partner institutions.
            </p>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-stone-200/90 text-stone-700 text-xs font-medium hover:bg-stone-50 hover:text-[#063028] transition-all cursor-pointer shadow-xs"
              title={isPlaying ? "Pause automatic transition" : "Resume automatic transition"}
              aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-[#c48825]" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-[#063028]" />
                  <span>Autoplay</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 bg-white border border-stone-200/90 p-1 rounded-xl shadow-xs">
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg text-stone-600 hover:text-[#063028] hover:bg-[#edf4f0] transition-colors cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold text-stone-600 px-2 min-w-[50px] text-center font-mono">
                {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <button
                onClick={handleNext}
                className="p-2 rounded-lg text-stone-600 hover:text-[#063028] hover:bg-[#edf4f0] transition-colors cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Card: Split Showcase with Proportional Image Fitting */}
        <div 
          className="relative bg-white rounded-[24px] sm:rounded-[28px] border border-stone-200/90 shadow-xl overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top subtle progress bar */}
          {isPlaying && (
            <div className="w-full h-1 bg-stone-100">
              <div 
                key={currentIndex} 
                className="h-full bg-[#c48825] transition-all duration-[5000ms] ease-linear w-full origin-left"
                style={{
                  animation: 'slideProgress 5s linear infinite'
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Column: Contained Image Showcase */}
            <div className="lg:col-span-6 bg-[#f4f2ed] p-4 sm:p-6 lg:p-8 flex items-center justify-center relative min-h-[340px] sm:min-h-[400px] lg:min-h-[460px]">
              
              {/* Image Container with Natural Aspect Ratio & No Cropping */}
              <div className="relative w-full h-full max-h-[400px] sm:max-h-[440px] flex items-center justify-center">
                <img
                  key={currentSlide.id}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="max-h-[360px] sm:max-h-[410px] w-auto max-w-full object-contain rounded-xl shadow-md border border-stone-200/70 bg-white transition-opacity duration-300"
                />
              </div>

              {/* Floating Slide Navigation Arrows on the Image container */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-[#063028] text-stone-700 hover:text-white shadow-md border border-stone-200/80 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-[#063028] text-stone-700 hover:text-white shadow-md border border-stone-200/80 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Right Column: Slide Story & Narrative Details */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Category Badge */}
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-semibold tracking-wide border border-[#063028]/15">
                    <span className="h-2 w-2 rounded-full bg-[#c48825]"></span>
                    {currentSlide.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-[#063028] leading-tight">
                  {currentSlide.title}
                </h3>

                {/* Accent line */}
                <div className="w-12 h-[2.5px] bg-[#c48825] rounded-full"></div>

                {/* Description */}
                <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
                  {currentSlide.description}
                </p>

                {/* Metadata Pills */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="h-8 w-8 rounded-lg bg-[#edf4f0] text-[#063028] flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Institution / Host</p>
                      <p className="text-xs font-semibold text-stone-800 truncate">{currentSlide.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="h-8 w-8 rounded-lg bg-[#edf4f0] text-[#063028] flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Scale & Impact</p>
                      <p className="text-xs font-semibold text-stone-800 truncate">{currentSlide.stats}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions & Mini Stepper */}
              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex ? 'w-6 bg-[#063028]' : 'w-2 bg-stone-200 hover:bg-stone-300'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-[#063028] hover:bg-[#edf4f0] transition-colors cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-[#063028] hover:bg-[#edf4f0] transition-colors cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
