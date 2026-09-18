'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@izone/shared-types';
import { formatCOP } from '@izone/shared-types';
import { useCart } from '@/lib/cart-context';
import { SmartImage } from '@/components/ui/SmartImage';

function discountLabel(price: number, compare?: number | null) {
  if (!compare || compare <= price) return null;
  const pct = Math.round(((compare - price) / compare) * 100);
  if (pct <= 0) return null;
  return `-${pct}%`;
}

export function FavoritesCarousel({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect, products.length]);

  if (!products.length) {
    return null;
  }

  return (
    <section className="py-16 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-4 md:px-12 max-w-7xl relative">
        <h2 className="text-3xl font-bold text-center text-[#1D1D1F] dark:text-white mb-10">
          Los favoritos del momento
        </h2>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 touch-pan-y">
              {products.map((product) => {
                const variant = product.variants?.[0];
                if (!variant) return null;
                const price = Number(variant.price);
                const compare =
                  variant.comparePrice != null ? Number(variant.comparePrice) : null;
                const discount = discountLabel(price, compare);
                const image =
                  variant.featuredImage ||
                  product.images?.[0] ||
                  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309?wid=500&hei=500&fmt=png-alpha';
                const href = `/product/${product.slug}`;

                return (
                  <div
                    key={product.id}
                    className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] pl-4"
                  >
                    <div className="flex flex-col items-center group">
                      <Link href={href} className="w-full">
                        <div className="w-full aspect-square border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-center p-8 bg-white dark:bg-neutral-900 transition-all group-hover:border-neutral-300 dark:group-hover:border-neutral-700 group-hover:shadow-sm mb-5 relative">
                          <SmartImage
                            src={image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            className="object-contain p-8 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>

                      <div className="text-center w-full px-2">
                        <Link href={href}>
                          <h3 className="text-[15px] font-bold text-[#1D1D1F] dark:text-white leading-tight min-h-[44px] mb-2 hover:text-[#0071E3] transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex flex-col items-center justify-center gap-0.5 mb-5">
                          {compare && compare > price ? (
                            <div className="flex items-center gap-1.5 text-[13px]">
                              <span className="text-neutral-400 line-through">
                                {formatCOP(compare)} COP
                              </span>
                              {discount ? (
                                <span className="text-red-500 font-semibold">{discount}</span>
                              ) : null}
                            </div>
                          ) : null}
                          <span className="text-base font-bold text-[#1D1D1F] dark:text-white">
                            {formatCOP(price)} COP
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            addItem(product, variant, 1);
                          }}
                          className="bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-semibold py-2.5 px-8 rounded-full transition-colors w-auto inline-block"
                        >
                          Añadir al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            className={`absolute top-1/2 -left-4 md:-left-12 -translate-y-[100%] w-10 h-10 rounded-full bg-[#0071E3] text-white flex items-center justify-center shadow-md transition-all ${
              !prevBtnEnabled
                ? 'opacity-0 cursor-default'
                : 'opacity-100 hover:bg-[#0077ED] hover:scale-105'
            }`}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 ml-[-2px]" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            className={`absolute top-1/2 -right-4 md:-right-12 -translate-y-[100%] w-10 h-10 rounded-full bg-[#0071E3] text-white flex items-center justify-center shadow-md transition-all ${
              !nextBtnEnabled
                ? 'opacity-0 cursor-default'
                : 'opacity-100 hover:bg-[#0077ED] hover:scale-105'
            }`}
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 mr-[-2px]" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-12">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'bg-black dark:bg-white scale-110'
                  : 'bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'
              }`}
              aria-label={`Ir a la página ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
