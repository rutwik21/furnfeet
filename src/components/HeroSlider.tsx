'use client'

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';

interface HeroSliderProps {
  slides: {
    id: number;
    image: string;
    ctaLink?: string;
  }[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  return (
    <div className="relative w-full mt-10 md:mt-0 aspect-[16/9] md:aspect-[16/8]">
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          color: white !important;
        }
      `}</style>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        color='#ffffff'
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-full border-0"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Link href={slide.ctaLink || '#'} className="relative w-full h-full border-0">
              <img
                src={slide.image}
                className="w-full h-full object-cover border-0"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;