'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [addedId, setAddedId] = useState<string | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
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
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect, products.length]);

  useEffect(() => {
    if (!addedId) return;
    const timer = window.setTimeout(() => setAddedId(null), 1500);
    return () => window.clearTimeout(timer);
  }, [addedId]);

  if (!products.length) {
    return (
      <section aria-labelledby="favorites-heading" className="py-16 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 id="favorites-heading" className="text-3xl font-bold text-[#1D1D1F] dark:text-white mb-4">
            Los favoritos del momento
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Explora nuestro catálogo completo de equipos y accesorios Apple disponibles.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm font-semibold px-6 py-3 transition-colors"
          >
            Ver catálogo completo
          </Link>
        </div>
      </section>
    );
  }

  const pageCount =
    scrollSnaps.length > 0
      ? scrollSnaps.length
      : Math.max(1, Math.ceil(products.length / 3));

  return (
    <section
      aria-labelledby="favorites-heading"
      aria-roledescription="carousel"
      className="py-16 bg-white dark:bg-neutral-950"
    >
      <div className="container mx-auto px-4 md:px-12 max-w-7xl relative">
        <h2
          id="favorites-heading"
          className="text-3xl font-bold text-center text-[#1D1D1F] dark:text-white mb-10"
        >
          Los favoritos del momento
        </h2>

        <div className="relative min-h-[420px] md:min-h-[480px]">
          <div className="overflow-hidden -mx-3 px-3 py-4" ref={emblaRef}>
            <div className="flex -ml-4 touch-pan-y">
              {products.map((product) => {
                const variant = product.variants?.[0];
                if (!variant) return null;
                const price = Number(variant.price);
                const compare =
                  variant.comparePrice != null ? Number(variant.comparePrice) : null;
                const discount = discountLabel(price, compare);
                const inStock = variant.stock == null || variant.stock > 0;
                const isAdded = addedId === product.id;
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
                    <div className="flex flex-col items-center group px-1.5">
                      <Link
                        href={href}
                        className="w-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
                      >
                        <div className="w-full aspect-square rounded-2xl flex items-center justify-center p-8 bg-white dark:bg-neutral-900 mb-5 relative shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.10),0_4px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] dark:group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
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
                        <Link
                          href={href}
                          className="inline-block rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
                        >
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
                          disabled={!inStock}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!inStock) return;
                            addItem(product, variant, 1);
                            setAddedId(product.id);
                          }}
                          className={`text-[13px] font-semibold py-2.5 px-8 rounded-full transition-colors inline-flex items-center justify-center gap-1.5 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3] ${
                            !inStock
                              ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed'
                              : isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#0071E3] hover:bg-[#0077ED] text-white'
                          }`}
                        >
                          {!inStock ? (
                            'Agotado'
                          ) : isAdded ? (
                            <>
                              <Check className="w-4 h-4" aria-hidden="true" />
                              Añadido
                            </>
                          ) : (
                            'Añadir al carrito'
                          )}
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
            className={`absolute top-1/2 -left-4 md:-left-12 -translate-y-[100%] w-11 h-11 rounded-full bg-[#0071E3] text-white flex items-center justify-center shadow-md transition-all touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3] ${
              !prevBtnEnabled
                ? 'opacity-0 cursor-default pointer-events-none'
                : 'opacity-100 hover:bg-[#0077ED] hover:scale-105'
            }`}
            aria-label="Productos anteriores"
          >
            <ChevronLeft className="w-6 h-6 ml-[-2px]" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            className={`absolute top-1/2 -right-4 md:-right-12 -translate-y-[100%] w-11 h-11 rounded-full bg-[#0071E3] text-white flex items-center justify-center shadow-md transition-all touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3] ${
              !nextBtnEnabled
                ? 'opacity-0 cursor-default pointer-events-none'
                : 'opacity-100 hover:bg-[#0077ED] hover:scale-105'
            }`}
            aria-label="Siguientes productos"
          >
            <ChevronRight className="w-6 h-6 mr-[-2px]" aria-hidden="true" />
          </button>
        </div>

        <div className="flex justify-center mt-6">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              aria-current={index === selectedIndex ? 'true' : undefined}
              className="flex h-11 w-11 items-center justify-center touch-manipulation rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
              aria-label={`Ir a la página ${index + 1} de ${pageCount}`}
            >
              <span
                className={`block h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                  index === selectedIndex
                    ? 'bg-black dark:bg-white'
                    : 'bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
