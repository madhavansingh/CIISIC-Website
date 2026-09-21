import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Keyboard, A11y } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Swiper core styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface BannerSlide {
  id: string | number;
  image: string;
  alt: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  linkText?: string;
  linkUrl?: string;
  isExternal?: boolean;
  objectPosition?: string;
}

const defaultHeroBanners: BannerSlide[] = [
  {
    id: 'launch-7-excellence-cells',
    image: '/images/Photos/Launch-of-7-Excellence-Cells-July-2026.jpeg',
    alt: 'Official Launch of 7 Industry Excellence Cells - July 2026',
    badge: 'JULY 2026',
    title: 'Official Launch of 7 Industry Excellence Cells',
    objectPosition: 'center 38%',
  },
  {
    id: 'leadership-meet-july-2026',
    image: '/images/Photos/Industry-Academia-Excellence-Cell-Leadership-Meet-July-2026.jpeg',
    alt: 'Industry Academia Excellence Cell Leadership Meet - July 2026',
    badge: 'JULY 2026',
    title: 'Industry Academia Excellence Cell Leadership Meet',
    objectPosition: 'center 46%',
  },
  {
    id: 'interaction-ps-higher-education',
    image: '/images/Photos/Interaction-with-PS-Higher-Education_-Govt-of-MP-July-2026.jpeg',
    alt: 'Interaction with PS Higher Education, Govt of MP - July 2026',
    badge: 'JULY 2026',
    title: 'Interaction with PS Higher Education, Govt of MP',
    objectPosition: 'center 38%',
  },
  {
    id: 'industry-academia-strategic-dialogue',
    image: '/images/Photos/July-2026-_2_.jpeg',
    alt: 'Industry-Academia Strategic Dialogue - July 2026',
    badge: 'JULY 2026',
    title: 'Industry-Academia Strategic Dialogue',
    objectPosition: 'center 40%',
  },
  {
    id: 'leadership-felicitation-memento',
    image: '/images/Photos/July-2026.jpeg',
    alt: 'Leadership Felicitation & Memento Presentation - July 2026',
    badge: 'JULY 2026',
    title: 'Leadership Felicitation & Memento Presentation',
    objectPosition: 'center 40%',
  },
  {
    id: 'roundtable-march-2026',
    image: encodeURI('/images/Photos/Round Table on Industry Academia Collaboration Ma 2026.jpeg'),
    alt: 'Round Table on Collaborative Innovation - March 2026',
    badge: 'MARCH 2026',
    title: 'Round Table on Collaborative Innovation',
    objectPosition: 'center 45%',
  },
  {
    id: 'survey-report-launch-feb-2026',
    image: encodeURI('/images/Photos/Industry Academia Survey Repot Launch Feb 2026.jpeg'),
    alt: 'Industry Academia Survey Report Launch - February 2026',
    badge: 'FEBRUARY 2026',
    title: 'Industry Academia Survey Report Launch',
    objectPosition: 'center 35%',
  },
  {
    id: 'roundtable-may-2025',
    image: encodeURI('/images/Photos/Round Table on Industry Academia Collaboration - May 2025 (2).jpeg'),
    alt: 'Round Table on Industry-Academia Collaboration - May 2025',
    badge: 'MAY 2025',
    title: 'Round Table on Industry-Academia Collaboration',
    objectPosition: 'center 42%',
  },
];

export const HeroBannerCarousel: React.FC = () => {
  return (
    <div
      id="hero-carousel"
      className="w-full h-full relative overflow-hidden bg-stone-950 select-none flex-1 min-h-0"
      style={{ maxWidth: 'none' }}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay, Keyboard, A11y]}
        slidesPerView={1}
        loop={true}
        speed={800}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        keyboard={{ enabled: true }}
        navigation={{
          prevEl: '.hero-carousel-prev',
          nextEl: '.hero-carousel-next',
        }}
        pagination={{
          el: '.hero-carousel-pagination',
          clickable: true,
          bulletClass: 'hero-bullet',
          bulletActiveClass: 'hero-bullet-active',
        }}
        a11y={{
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
        }}
        className="w-full h-full relative group"
      >
        {defaultHeroBanners.map((banner) => (
          <SwiperSlide key={banner.id} className="relative w-full h-full">
            <div className="relative w-full h-full bg-stone-950 overflow-hidden flex items-center justify-center">
              
              {/* Full-width Cover Image */}
              <img
                src={banner.image}
                alt={banner.alt}
                loading="eager"
                style={{ objectPosition: banner.objectPosition || 'center center' }}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-102"
                draggable={false}
              />

              {/* Smooth, multi-stop bottom-to-top gradient that fades seamlessly with zero hard boundary */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.6) 14%, rgba(0, 0, 0, 0.3) 28%, rgba(0, 0, 0, 0.1) 42%, rgba(0, 0, 0, 0) 58%)',
                }}
              />
              {/* Soft radial fill focused around bottom-left text quadrant */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 75% 60% at 12% 92%, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.32) 40%, rgba(0, 0, 0, 0.08) 70%, rgba(0, 0, 0, 0) 100%)',
                }}
              />

              {/* Slide Content Layout: Lower-Left Text with exact design from uploaded images */}
              <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pb-5 sm:pb-7 md:pb-8 lg:pb-9 z-10 text-white pointer-events-auto">
                <div className="w-full max-w-[1400px] mx-auto">
                  <div className="max-w-3xl lg:max-w-5xl space-y-1 sm:space-y-1.5">
                    {banner.badge && (
                      <div className="text-[#c48825] font-bold text-xs sm:text-sm md:text-[15px] tracking-wider uppercase font-sans drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                        {banner.badge}
                      </div>
                    )}
                    {banner.title && (
                      <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-[1.85rem] xl:text-[2.1rem] font-bold font-serif text-white tracking-tight leading-[1.25] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                        {banner.title}
                      </h2>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}

        {/* Public-Portal Style Vertically Centered Left Circular Navigation Button */}
        <button
          aria-label="Previous Slide"
          className="hero-carousel-prev absolute left-3 sm:left-5 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs border border-white/30 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-20"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-[2.2]" />
        </button>

        {/* Public-Portal Style Vertically Centered Right Circular Navigation Button */}
        <button
          aria-label="Next Slide"
          className="hero-carousel-next absolute right-3 sm:right-5 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs border border-white/30 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-20"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-[2.2]" />
        </button>

        {/* Slide Indicators / Pagination Bullets near Bottom Center */}
        <div className="hero-carousel-pagination absolute bottom-2.5 sm:bottom-3.5 left-0 right-0 z-20 flex items-center justify-center gap-2 pointer-events-auto" />
      </Swiper>

      {/* Embedded Swiper Pagination and Full-Height Styling */}
      <style>{`
        #hero-carousel,
        #hero-carousel .swiper,
        #hero-carousel .swiper-wrapper,
        #hero-carousel .swiper-slide {
          height: 100% !important;
        }
        .hero-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.45);
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-block;
        }
        @media (min-width: 640px) {
          .hero-bullet {
            width: 11px;
            height: 11px;
          }
        }
        .hero-bullet-active {
          width: 32px !important;
          background: #c48825 !important;
          box-shadow: 0 0 12px rgba(196, 136, 37, 0.85);
        }
      `}</style>
    </div>
  );
};
