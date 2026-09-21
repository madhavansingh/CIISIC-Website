import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Keyboard,
  Mousewheel,
  A11y,
} from 'swiper/modules';

// Swiper core styles
import 'swiper/css';
import 'swiper/css/navigation';

/* ─────────────────────────────────────────────
   Gallery images — Real CII events & summits
───────────────────────────────────────────── */
const images = [
  {
    id: 1,
    src: '/images/Photos/Launch-of-7-Excellence-Cells-July-2026.jpeg',
    alt: 'Official Launch of 7 Industry Excellence Cells',
    title: 'Official Launch of 7 Industry Excellence Cells',
    date: 'JULY 2026',
    objectPosition: 'center 30%',
  },
  {
    id: 2,
    src: '/images/Photos/Industry-Academia-Excellence-Cell-Leadership-Meet-July-2026.jpeg',
    alt: 'Industry Academia Excellence Cell Leadership Meet',
    title: 'Industry Academia Excellence Cell Leadership Meet',
    date: 'JULY 2026',
    objectPosition: 'center 35%',
  },
  {
    id: 3,
    src: '/images/Photos/Interaction-with-PS-Higher-Education_-Govt-of-MP-July-2026.jpeg',
    alt: 'Interaction with PS Higher Education, Govt of MP',
    title: 'Interaction with PS Higher Education, Govt of MP',
    date: 'JULY 2026',
    objectPosition: 'center 30%',
  },
  {
    id: 4,
    src: '/images/Photos/July-2026-_2_.jpeg',
    alt: 'Industry-Academia Strategic Dialogue',
    title: 'Industry-Academia Strategic Dialogue',
    date: 'JULY 2026',
    objectPosition: 'center 35%',
  },
  {
    id: 5,
    src: '/images/Photos/July-2026.jpeg',
    alt: 'Leadership Felicitation & Memento Presentation',
    title: 'Leadership Felicitation & Memento Presentation',
    date: 'JULY 2026',
    objectPosition: 'center 35%',
  },
  {
    id: 6,
    src: encodeURI('/images/Photos/Round Table on Industry Academia Collaboration Ma 2026.jpeg'),
    alt: 'Round Table on Collaborative Innovation',
    title: 'Round Table on Collaborative Innovation',
    date: 'MARCH 2026',
    objectPosition: 'center center',
  },
  {
    id: 7,
    src: encodeURI('/images/Photos/Industry Academia Survey Repot Launch Feb 2026.jpeg'),
    alt: 'Industry Academia Survey Report Launch',
    title: 'Industry Academia Survey Report Launch',
    date: 'FEBRUARY 2026',
    objectPosition: 'center 25%',
  },
  {
    id: 8,
    src: encodeURI('/images/Photos/Round Table on Industry Academia Collaboration - May 2025 (2).jpeg'),
    alt: 'Round Table on Industry-Academia Collaboration',
    title: 'Round Table on Industry-Academia Collaboration',
    date: 'MAY 2025',
    objectPosition: 'center center',
  },
];

export const ImageSliderSection: React.FC = () => {
  return (
    <section
      id="gallery"
      className="py-14 sm:py-20 bg-white border-t border-[#e8e4dc] scroll-mt-20 overflow-hidden"
    >
      {/* Section label */}
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12 mb-8 sm:mb-12">
        <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-semibold tracking-wide border border-[#063028]/10">
              Ecosystem in Action
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#063028] tracking-tight leading-tight font-serif">
              Innovation &amp; Collaboration Gallery
            </h2>
          </div>
      </div>

      {/* ── Swiper ── */}
      <div className="w-full">
        <Swiper
          modules={[Navigation, Keyboard, Mousewheel, A11y]}
          /* Layout */
          centeredSlides
          slidesPerView={1.15}
          breakpoints={{
            640:  { slidesPerView: 1.4, spaceBetween: 24 },
            768:  { slidesPerView: 1.7, spaceBetween: 28 },
            1024: { slidesPerView: 2.2, spaceBetween: 32 },
            1280: { slidesPerView: 2.6, spaceBetween: 36 },
          }}
          spaceBetween={16}
          /* Features */
          loop
          speed={700}
          keyboard={{ enabled: true, onlyInViewport: true }}
          mousewheel={{ forceToAxis: true, sensitivity: 1 }}
          navigation={{
            nextEl: '.gallery-btn-next',
            prevEl: '.gallery-btn-prev',
          }}
          a11y={{ prevSlideMessage: 'Previous image', nextSlideMessage: 'Next image' }}
          className="gallery-swiper !overflow-visible"
        >
          {images.map((img) => (
            <SwiperSlide key={img.id} className="gallery-slide">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-[24px] aspect-[4/3] sm:aspect-[16/10] w-full shadow-lg group">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  style={{ objectPosition: img.objectPosition }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none flex flex-col justify-end p-4 sm:p-6 text-white">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#c48825] mb-1">
                    {img.date}
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold font-serif leading-snug drop-shadow-sm text-stone-100">
                    {img.title}
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom navigation buttons */}
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12 mt-8 sm:mt-10 flex justify-end gap-3">
        <button
          className="gallery-btn-prev h-11 w-11 rounded-full bg-[#063028] hover:bg-[#c48825] text-white flex items-center justify-center transition-colors shadow-md border border-[#0a4035] cursor-pointer disabled:opacity-30"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="gallery-btn-next h-11 w-11 rounded-full bg-[#063028] hover:bg-[#c48825] text-white flex items-center justify-center transition-colors shadow-md border border-[#0a4035] cursor-pointer disabled:opacity-30"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Active-slide custom styling ── */}
      <style>{`
        /* dim non-active slides */
        .gallery-swiper .gallery-slide {
          opacity: 0.45;
          transform: scale(0.94);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        /* active slide: full opacity + slight scale-up */
        .gallery-swiper .swiper-slide-active {
          opacity: 1 !important;
          transform: scale(1) !important;
        }
        /* hide Swiper's default arrows */
        .gallery-swiper .swiper-button-next,
        .gallery-swiper .swiper-button-prev {
          display: none;
        }
      `}</style>
    </section>
  );
};
