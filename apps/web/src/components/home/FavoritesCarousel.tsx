'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

const favoriteProducts = [
  {
    id: 'iphone-17-pro-max-plata',
    name: 'iPhone 17 Pro Max 256 GB Plata',
    originalPrice: '$ 6.999.000 COP',
    discount: '-10.00%',
    price: '$ 6.279.000 COP',
    image: '/images/products/iphone-17-silver.jpg',
    link: '/product/iphone-17-pro-max-plata'
  },
  {
    id: 'iphone-17-pro-max-naranja',
    name: 'iPhone 17 Pro Max 256 GB Naranja cósmico',
    originalPrice: '$ 6.999.000 COP',
    discount: '-10.00%',
    price: '$ 6.279.000 COP',
    image: '/images/products/iphone-17-orange.jpg',
    link: '/product/iphone-17-pro-max-naranja'
  },
  {
    id: 'iphone-17-pro-plata',
    name: 'iPhone 17 Pro 256 GB Plata',
    originalPrice: '$ 6.449.000 COP',
    discount: '-10.00%',
    price: '$ 5.749.000 COP',
    image: '/images/products/iphone-17-silver.jpg',
    link: '/product/iphone-17-pro-plata'
  },
  {
    id: 'macbook-air-m3-midnight',
    name: 'MacBook Air 13" M3 256 GB Medianoche',
    originalPrice: '$ 5.999.000 COP',
    discount: '-8.00%',
    price: '$ 5.519.000 COP',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-m3-midnight-select-202402?wid=500&hei=500&fmt=png-alpha',
    link: '/product/macbook-air-m3-midnight'
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro (2.ª Generación)',
    originalPrice: '$ 1.299.000 COP',
    discount: '-15.00%',
    price: '$ 1.104.000 COP',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTJV3?wid=500&hei=500&fmt=png-alpha',
    link: '/product/airpods-pro-2'
  }
];

export function FavoritesCarousel() {
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
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

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
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-4 md:px-12 max-w-7xl relative">
        <h2 className="text-3xl font-bold text-center text-[#1D1D1F] dark:text-white mb-10">
          Los favoritos del momento
        </h2>

        <div className="relative">
          {/* Carrusel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 touch-pan-y">
              {favoriteProducts.map((product) => (
                <div key={product.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] pl-4">
                  <div className="flex flex-col items-center group">
                    {/* Contenedor de Imagen */}
                    <Link href={product.link} className="w-full">
                      <div className="w-full aspect-square border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-center p-8 bg-white dark:bg-neutral-900 transition-all group-hover:border-neutral-300 dark:group-hover:border-neutral-700 group-hover:shadow-sm mb-5 relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Información del Producto */}
                    <div className="text-center w-full px-2">
                      <Link href={product.link}>
                        <h3 className="text-[15px] font-bold text-[#1D1D1F] dark:text-white leading-tight min-h-[44px] mb-2 hover:text-[#0071E3] transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex flex-col items-center justify-center gap-0.5 mb-5">
                        <div className="flex items-center gap-1.5 text-[13px]">
                          <span className="text-neutral-400 line-through">
                            {product.originalPrice}
                          </span>
                          <span className="text-red-500 font-semibold">
                            {product.discount}
                          </span>
                        </div>
                        <span className="text-base font-bold text-[#1D1D1F] dark:text-white">
                          {product.price}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Mocking Product and Variant types since we are using static data for the carousel
                          const mockProduct = {
                            id: product.id,
                            name: product.name,
                            slug: product.id,
                          } as unknown as import('@izone/shared-types').Product;
                          
                          const mockVariant = {
                            id: `${product.id}-var`,
                            price: Number(product.price.replace(/\D/g, '')), // Extract numeric price
                            featuredImage: product.image,
                          } as unknown as import('@izone/shared-types').Variant;

                          addItem(mockProduct, mockVariant, 1);
                        }}
                        className="bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-semibold py-2.5 px-8 rounded-full transition-colors w-auto inline-block"
                      >
                        Añadir al carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flechas de navegación (Estilo Flotante) */}
          <button
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            className={`absolute top-1/2 -left-4 md:-left-12 -translate-y-[100%] w-10 h-10 rounded-full bg-[#0071E3] text-white flex items-center justify-center shadow-md transition-all ${
              !prevBtnEnabled ? 'opacity-0 cursor-default' : 'opacity-100 hover:bg-[#0077ED] hover:scale-105'
            }`}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 ml-[-2px]" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            className={`absolute top-1/2 -right-4 md:-right-12 -translate-y-[100%] w-10 h-10 rounded-full bg-[#0071E3] text-white flex items-center justify-center shadow-md transition-all ${
              !nextBtnEnabled ? 'opacity-0 cursor-default' : 'opacity-100 hover:bg-[#0077ED] hover:scale-105'
            }`}
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 mr-[-2px]" />
          </button>
        </div>

        {/* Puntos de paginación */}
        <div className="flex justify-center gap-2 mt-12">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex ? 'bg-black dark:bg-white scale-110' : 'bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'
              }`}
              aria-label={`Ir a la página ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
