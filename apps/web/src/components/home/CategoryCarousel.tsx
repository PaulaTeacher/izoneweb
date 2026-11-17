'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatCOP } from '@izone/shared-types';
import { SmartImage } from '@/components/ui/SmartImage';

// Usaremos imágenes de referencia que se mezclen con el fondo blanco (mix-blend-multiply)
const categories = [
  {
    id: 'mac',
    name: 'Mac',
    fallbackPrice: 'Desde $3.699.000',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-card-40-macbook-air-202110?wid=400&hei=300&fmt=png-alpha&qlt=90&.v=1633726242000',
    link: '/shop?category=mac',
  },
  {
    id: 'iphone',
    name: 'iPhone',
    fallbackPrice: 'Desde $2.899.000',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309?wid=340&hei=264&fmt=png-alpha&qlt=95&.v=1693086290559',
    link: '/shop?category=iphone',
  },
  {
    id: 'ipad',
    name: 'iPad',
    fallbackPrice: 'Desde $2.069.000',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-card-40-pro-202210?wid=340&hei=264&fmt=png-alpha&qlt=95&.v=1664578844510',
    link: '/shop?category=ipad',
  },
  {
    id: 'watch',
    name: 'Apple Watch',
    fallbackPrice: 'Desde $1.199.000',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-card-40-ultra2-202309?wid=340&hei=264&fmt=png-alpha&qlt=95&.v=1693611634594',
    link: '/shop?category=watch',
  },
  {
    id: 'audio',
    name: 'Audio',
    fallbackPrice: 'Desde $99.000',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-silver-202011?wid=400&hei=400&fmt=jpeg&qlt=90&.v=1604021221000',
    link: '/shop?category=audio',
  },
  {
    id: 'tv',
    name: 'Apple TV & Hogar',
    fallbackPrice: 'Desde $809.000',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-tv-4k-hero-select-202210?wid=400&hei=400&fmt=jpeg&qlt=90&.v=1664896361164',
    link: '/shop?category=tv',
  },
  {
    id: 'accesorios',
    name: 'Accesorios',
    fallbackPrice: 'Desde $24.500',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT223?wid=400&hei=400&fmt=jpeg&qlt=90&.v=1693248280978',
    link: '/accesorios',
  },
  {
    id: 'airtag',
    name: 'AirTag',
    fallbackPrice: 'Desde $38.350',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airtag-single-select-202104?wid=400&hei=400&fmt=jpeg&qlt=90&.v=1617761673000',
    link: '/shop?category=accesorios',
  },
];

export function CategoryCarousel({ minPrices = {} }: { minPrices?: Record<string, number> }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section
      aria-labelledby="categories-heading"
      className="py-16 bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-900"
    >
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex items-center justify-between gap-4 mb-10">
          <h2
            id="categories-heading"
            className="text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-white"
          >
            Ver todos los productos Apple.
          </h2>
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canPrev}
              aria-label="Categorías anteriores"
              className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 flex items-center justify-center transition touch-manipulation hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canNext}
              aria-label="Siguientes categorías"
              className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 flex items-center justify-center transition touch-manipulation hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="relative" role="region" aria-roledescription="carousel" aria-label="Categorías">
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <ul className="flex gap-4 md:gap-8 touch-pan-x list-none m-0 p-0">
              {categories.map((cat) => (
                <li key={cat.id} className="flex-[0_0_auto]">
                  <Link
                    href={cat.link}
                    className="group flex flex-col items-center justify-end h-40 w-28 md:w-36 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
                  >
                    <div className="relative w-20 h-20 md:w-24 md:h-24 mb-3 shrink-0">
                      <SmartImage
                        src={cat.image}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <span className="text-[15px] font-semibold text-[#1D1D1F] dark:text-white transition-colors text-center">
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                      {minPrices[cat.id] ? `Desde ${formatCOP(minPrices[cat.id])}` : cat.fallbackPrice}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white dark:from-neutral-950 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
