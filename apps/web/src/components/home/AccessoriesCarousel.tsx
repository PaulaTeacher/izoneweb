'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { SmartImage } from '@/components/ui/SmartImage';

const accessories = [
  {
    id: 'accesorios-mac',
    title: 'Accesorios Mac',
    isNew: true,
    description: 'Compra aquí accesorios para Mac, teclados, mouse, cables y más',
    price: 'Disponible desde $29.900 COP',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MK2A3?wid=500&hei=500&fmt=png-alpha&qlt=90',
    link: '/accesorios?tipo=accesorios-mac'
  },
  {
    id: 'accesorios-ipad',
    title: 'Accesorios iPad',
    isNew: true,
    description: 'Compra accesorios para iPad',
    price: 'Disponible desde $30.000 COP',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-smart-folio-black-202210?wid=500&hei=500&fmt=png-alpha&qlt=90',
    link: '/accesorios?kind=tablet'
  },
  {
    id: 'accesorios-tv',
    title: 'Accesorios Apple TV',
    isNew: true,
    description: 'Compra accesorios para TV',
    price: 'Disponible desde $55.900 COP',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-tv-4k-hero-select-202210?wid=500&hei=500&fmt=png-alpha&qlt=90',
    link: '/shop?category=accesorios&device=tv'
  },
  {
    id: 'accesorios-watch',
    title: 'Accesorios Watch',
    isNew: true,
    description: 'Compra accesorios para Watch',
    price: 'Disponible desde $34.900 COP',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTJQ3?wid=500&hei=500&fmt=png-alpha&qlt=90',
    link: '/accesorios?kind=watch'
  },
  {
    id: 'accesorios-iphone',
    title: 'Accesorios iPhone',
    isNew: true,
    description: 'Cargadores, fundas MagSafe y más',
    price: 'Disponible desde $45.000 COP',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT223?wid=500&hei=500&fmt=png-alpha&qlt=90',
    link: '/accesorios?brand=apple&kind=phone'
  }
];

export function AccessoriesCarousel() {
  // Se agregó "loop: true" para el carrusel infinito
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-20 bg-[#F5F5F7] dark:bg-neutral-900 overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-12 max-w-[1240px] relative">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] dark:text-white mb-10 tracking-tight">
          Accesorios. <span className="text-neutral-500">Elementos esenciales que combinan a la perfección.</span>
        </h2>

        <div className="relative">
          {/* Sombras de difuminado (fade effect) SOLO a la derecha */}
          <div className="absolute top-0 bottom-0 -right-2 w-20 md:w-36 bg-gradient-to-l from-[#F5F5F7] via-[#F5F5F7]/80 to-transparent dark:from-neutral-900 dark:via-neutral-900/80 dark:to-transparent z-10 pointer-events-none" />

          {/* Carrusel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 touch-pan-x py-4">
              {accessories.map((item) => (
                <div key={item.id} className="flex-[0_0_78%] sm:flex-[0_0_46%] md:flex-[0_0_30%] lg:flex-[0_0_23.5%] pl-4">
                  <Link href={item.link} className="block group h-full">
                    <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-7 flex flex-col h-full border border-neutral-100 dark:border-neutral-800 shadow-sm group-hover:shadow-md transition-all duration-300">
                      {/* Imagen */}
                      <div className="relative w-full h-48 mb-6">
                        <SmartImage
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 30vw, 24vw"
                          className="object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Texto */}
                      <div className="flex flex-col flex-grow">
                        {item.isNew && (
                          <span className="text-[10px] font-bold text-[#BF4800] dark:text-[#FF6B1A] uppercase tracking-wider mb-2">
                            NUEVO
                          </span>
                        )}
                        <h3 className="text-[19px] font-bold text-[#1D1D1F] dark:text-white mb-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-[13px] text-neutral-600 dark:text-neutral-400 mb-6 flex-grow leading-relaxed">
                          {item.description}
                        </p>
                        <p className="text-[11px] text-neutral-500 font-medium">
                          {item.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Flecha izquierda */}
          <button
            onClick={scrollPrev}
            className={`absolute top-1/2 -left-3 md:-left-6 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md text-neutral-700 dark:text-neutral-300 flex items-center justify-center shadow-md border border-neutral-200/70 dark:border-neutral-700 transition-all ${
              !prevBtnEnabled ? 'opacity-0 cursor-default pointer-events-none' : 'opacity-100 hover:bg-white hover:scale-105'
            }`}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 mr-0.5" />
          </button>

          {/* Flecha derecha */}
          <button
            onClick={scrollNext}
            className={`absolute top-1/2 -right-3 md:-right-5 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md text-neutral-700 dark:text-neutral-300 flex items-center justify-center shadow-md border border-neutral-200/70 dark:border-neutral-700 transition-all ${
              !nextBtnEnabled ? 'opacity-0 cursor-default pointer-events-none' : 'opacity-100 hover:bg-white hover:scale-105'
            }`}
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
