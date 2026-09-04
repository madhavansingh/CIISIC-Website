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
   Gallery images — swap in your own when ready
───────────────────────────────────────────── */
const images = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    alt: 'Industry summit conference',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
    alt: 'Student innovation workshop',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
    alt: 'Collaboration session',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
    alt: 'Research and innovation lab',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80',
    alt: 'AgriTech demonstration',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80',
    alt: 'Student pitch event',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80',
    alt: 'Technical skills workshop',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80',
    alt: 'Excellence summit launch',
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-semibold tracking-wide border border-[#063028]/10">
              ✦ Ecosystem in Action
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
              <div className="overflow-hidden rounded-2xl sm:rounded-[24px] aspect-[4/3] sm:aspect-[16/10] w-full shadow-lg">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500"
                  draggable={false}
                />
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
