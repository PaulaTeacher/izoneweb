'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'iPhone 16 Pro',
    description: 'Diseñado en titanio aeroespacial con el chip A18 Pro más rápido hasta la fecha.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop',
    link: '/product/iphone-16-pro',
    priceText: 'Desde $ 5.499.000',
    theme: 'dark' // dark text or white text depending on background
  },
  {
    id: 2,
    title: 'MacBook Air M3',
    description: 'Súper liviano. Súper chip M3.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
    link: '/product/macbook-air-m3',
    priceText: 'Desde $ 6.299.000',
    theme: 'light'
  },
  {
    id: 3,
    title: 'AirPods Pro',
    description: 'Magia que se oye en alta fidelidad.',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1200&auto=format&fit=crop',
    link: '/product/airpods-pro-2',
    priceText: 'Desde $ 1.199.000',
    theme: 'light'
  }
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false })
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative overflow-hidden bg-neutral-100">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 min-h-[600px] md:min-h-[700px]">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              
              {/* Dark overlay for dark theme slides */}
              <div className={`absolute inset-0 ${slide.theme === 'dark' ? 'bg-black/50' : 'bg-black/20'}`} />

              <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center text-center px-4 pt-32 pb-24">
                <h1 className={`text-5xl md:text-7xl font-bold tracking-tight mb-4 ${slide.theme === 'dark' || slide.theme === 'light' ? 'text-white' : 'text-neutral-900'}`}>
                  {slide.title}
                </h1>
                <p className={`text-xl md:text-2xl mb-8 max-w-2xl font-light ${slide.theme === 'dark' || slide.theme === 'light' ? 'text-neutral-200' : 'text-neutral-600'}`}>
                  {slide.description}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href={slide.link}
                    className="bg-white text-black hover:bg-neutral-200 px-8 py-3.5 rounded-full font-medium transition shadow-lg flex items-center gap-2 text-sm"
                  >
                    Comprar ahora <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className={`text-sm ${slide.theme === 'dark' || slide.theme === 'light' ? 'text-white/80' : 'text-neutral-500'}`}>
                    {slide.priceText}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
