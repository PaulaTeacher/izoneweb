'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { SmartImage } from '@/components/ui/SmartImage';

export interface ModelCarouselItem {
  id: string;
  name: string;
  img?: string;
  badge?: string; // e.g., 'NUEVO', 'OFERTA', 'UNIDADES LIMITADAS'
  subBadge?: string; // e.g., 'UNIDADES LIMITADAS'
  price?: string; // e.g., 'Desde $3.499.000'
  href?: string;
  action?: 'filter' | 'scroll' | 'link';
  actionTarget?: string;
}

interface CategoryModelCarouselProps {
  items: ModelCarouselItem[];
  activeId?: string;
  onItemClick?: (item: ModelCarouselItem) => void;
  className?: string;
}

export function CategoryModelCarousel({
  items,
  activeId,
  onItemClick,
  className = '',
}: CategoryModelCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const handleItemClick = (item: ModelCarouselItem, e: React.MouseEvent) => {
    if (onItemClick) {
      onItemClick(item);
    }

    if (item.action === 'scroll' && item.actionTarget) {
      e.preventDefault();
      document.getElementById(item.actionTarget)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`relative w-full bg-white dark:bg-[#161617] select-none h-[108px] max-h-[108px] overflow-hidden shadow-[inset_0px_-0.5px_0px_#d2d2d2] dark:shadow-[inset_0px_-0.5px_0px_#262626] ${className}`}
    >
      <div className="max-w-[1300px] mx-auto h-full px-2 md:px-4 relative flex items-center">
        {/* Flecha Izquierda */}
        {canScrollPrev && (
          <button
            onClick={scrollPrev}
            aria-label="Anterior"
            className="absolute left-0 z-20 w-9 h-[84px] bg-white dark:bg-[#161617] border-r border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2]" />
          </button>
        )}

        {/* Carrusel Embla */}
        <div
          ref={emblaRef}
          className="overflow-hidden w-full cursor-grab active:cursor-grabbing h-full flex items-center"
        >
          <div className="flex items-center touch-pan-x pl-1 pr-10">
            {items.map((item) => {
              const isActive = activeId === item.id;
              const content = (
                <div
                  className={`flex items-end gap-2 px-3 py-2 transition-all duration-200 group flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'opacity-100'
                      : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{ width: '220px' }}
                >
                  {/* Miniatura Oficial del Dispositivo (84x84 exactamente como iShop) */}
                  <div className="relative w-[84px] h-[84px] flex-shrink-0">
                    {item.img ? (
                      <SmartImage
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="84px"
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-[84px] h-[84px] bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-neutral-400 font-bold"></span>
                      </div>
                    )}
                  </div>

                  {/* Textos: Badges, Nombre y Precio (Tipografía y jerarquía idéntica a iShop) */}
                  <div className="flex flex-col text-left pb-1 flex-1 min-w-0">
                    {/* Tags / Badges */}
                    <div className="flex flex-wrap items-center gap-1 leading-none mb-1 min-h-[14px]">
                      {item.badge && (
                        <span
                          className={`text-[8px] font-bold uppercase tracking-tight ${
                            item.badge.includes('OFERTA')
                              ? 'text-[#f68025]'
                              : 'text-[#BF4800]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.subBadge && (
                        <span className="text-[8px] font-bold uppercase tracking-tight text-[#f68025]">
                          {item.subBadge}
                        </span>
                      )}
                    </div>

                    {/* Nombre del Modelo */}
                    <p className="text-[12px] font-semibold text-[#121212] dark:text-neutral-100 group-hover:text-[#0071E3] transition-colors leading-[14px] truncate">
                      {item.name}
                    </p>

                    {/* Precio Inicial */}
                    {item.price && (
                      <p className="text-[10px] text-[rgba(18,18,18,0.75)] dark:text-neutral-400 font-normal leading-normal mt-[1px] truncate">
                        {item.price}
                      </p>
                    )}
                  </div>
                </div>
              );

              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleItemClick(item, e)}
                    className="flex-shrink-0 block"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleItemClick(item, e)}
                  className="flex-shrink-0 block focus:outline-none text-left"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>

        {/* Flecha Derecha (Estilo idéntico a iShop con divisor) */}
        {canScrollNext && (
          <button
            onClick={scrollNext}
            aria-label="Siguiente"
            className="absolute right-0 z-20 w-9 h-[84px] bg-white dark:bg-[#161617] border-l border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <ChevronRight className="w-5 h-5 stroke-[2]" />
          </button>
        )}
      </div>
    </div>
  );
}
