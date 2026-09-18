'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { SmartImage } from '@/components/ui/SmartImage';

// Usaremos imágenes de referencia que se mezclen con el fondo blanco (mix-blend-multiply)
const categories = [
  { 
    id: 'mac', 
    name: 'Mac', 
    price: 'Desde $3.699.000', 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-card-40-macbook-air-202110?wid=400&hei=300&fmt=png-alpha&qlt=90&.v=1633726242000', 
    link: '/shop?category=mac' 
  },
  { 
    id: 'iphone', 
    name: 'iPhone', 
    price: 'Desde $2.899.000', 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309?wid=340&hei=264&fmt=png-alpha&qlt=95&.v=1693086290559', 
    link: '/shop?category=iphone' 
  },
  { 
    id: 'ipad', 
    name: 'iPad', 
    price: 'Desde $2.069.000', 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-card-40-pro-202210?wid=340&hei=264&fmt=png-alpha&qlt=95&.v=1664578844510', 
    link: '/shop?category=ipad' 
  },
  { 
    id: 'watch', 
    name: ' WATCH', 
    price: 'Desde $1.199.000', 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-card-40-ultra2-202309?wid=340&hei=264&fmt=png-alpha&qlt=95&.v=1693611634594', 
    link: '/shop?category=watch' 
  },
  { 
    id: 'audio', 
    name: 'Audio', 
    price: 'Desde $99.000', 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-silver-202011?wid=400&hei=400&fmt=jpeg&qlt=90&.v=1604021221000', 
    link: '/shop?category=audio' 
  },
  { 
    id: 'tv', 
    name: ' TV & Hogar', 
    price: 'Desde $809.000', 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-tv-4k-hero-select-202210?wid=400&hei=400&fmt=jpeg&qlt=90&.v=1664896361164', 
    link: '/shop?category=tv' 
  },
  { 
    id: 'accesorios', 
    name: 'Accesorios', 
    price: 'Desde $24.500', 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT223?wid=400&hei=400&fmt=jpeg&qlt=90&.v=1693248280978', 
    link: '/accesorios' 
  },
  { 
    id: 'airtag', 
    name: 'AirTag', 
    price: 'Desde $38.350', 
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airtag-single-select-202104?wid=400&hei=400&fmt=jpeg&qlt=90&.v=1617761673000', 
    link: '/shop?category=accesorios' 
  },
];

export function CategoryCarousel() {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  return (
    <section className="py-16 bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-900">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-white mb-10">
          Ver todos los productos Apple.
        </h2>
        
        <div className="relative">
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex gap-4 md:gap-8 touch-pan-x">
              {categories.map((cat) => (
                <div key={cat.id} className="flex-[0_0_auto]">
                  <Link
                    href={cat.link}
                    className="group flex flex-col items-center justify-end h-40 w-28 md:w-36 transition-transform hover:-translate-y-1"
                  >
                    <div className="relative flex-1 flex items-end justify-center w-full mb-3 h-20">
                      <SmartImage
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="144px"
                        className="object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <span className="text-[15px] font-semibold text-[#1D1D1F] dark:text-white transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-neutral-500 mt-1">
                      {cat.price}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sombra de desvanecimiento a los lados para indicar scroll (opcional) */}
          <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white dark:from-neutral-950 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
