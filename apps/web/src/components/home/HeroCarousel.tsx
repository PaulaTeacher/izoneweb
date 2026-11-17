'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Link from 'next/link';
import type { HomeHeroSlide } from '@izone/shared-types';
import { SmartImage } from '@/components/ui/SmartImage';

const DEFAULT_SLIDES: HomeHeroSlide[] = [
  {
    id: 'iphone-duo',
    title: 'iPhone Duo',
    description:
      'El primer iPhone plegable: pantalla de 7.6", chip A20 Pro y diseño en titanio.',
    image: '/images/hero/hero-iphone-duo.webp',
    link: '/product/iphone-duo',
    priceText: 'Desde $ 9.650.000',
    badge: 'Nuevo',
  },
  {
    id: 'iphone-18-pro-max',
    title: 'iPhone 18 Pro Max',
    description: 'Chip Pro de última generación, cámara teleobjetivo avanzada y acabado Burgundy.',
    image: '/images/hero/hero-iphone-18-pro-max.webp',
    link: '/product/iphone-18-pro-max',
    priceText: 'Desde $ 6.100.000',
    badge: 'Nuevo',
  },
  {
    id: 'macbook-air-13-m5',
    title: 'MacBook Air 13" (M5)',
    description: 'Chip Apple M5, 16GB de memoria unificada y 512GB SSD en cuatro acabados.',
    image: '/images/hero/hero-macbook-air-m5.webp',
    link: '/product/macbook-air-13-m5',
    priceText: 'Desde $ 4.400.000',
    badge: 'M5',
  },
];

const HERO_IMAGE_BY_LINK: Record<string, string> = {
  '/product/iphone-duo': '/images/hero/hero-iphone-duo.webp',
  '/product/iphone-18-pro-max': '/images/hero/hero-iphone-18-pro-max.webp',
  '/product/macbook-air-13-m5': '/images/hero/hero-macbook-air-m5.webp',
};

export function HeroCarousel({ slides: initialSlides }: { slides?: HomeHeroSlide[] }) {
  const slides =
    initialSlides && initialSlides.length > 0
      ? initialSlides.map((s) => ({
          ...s,
          image: HERO_IMAGE_BY_LINK[s.link] ?? s.image,
        }))
      : DEFAULT_SLIDES;
  const autoplayPlugin = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplayPlugin.current]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const hasInteracted = useRef(false);

  const scrollPrev = useCallback(() => {
    hasInteracted.current = true;
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    hasInteracted.current = true;
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      hasInteracted.current = true;
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  const toggleAutoplay = useCallback(() => {
    const plugin = autoplayPlugin.current;
    if (!plugin) return;
    if (isPlaying) {
      plugin.stop();
      setIsPlaying(false);
    } else {
      plugin.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      autoplayPlugin.current?.stop();
      setIsPlaying(false);
    }
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setSelectedIndex(idx);
    if (hasInteracted.current) {
      const slide = slides[idx];
      setStatusMessage(`Diapositiva ${idx + 1} de ${slides.length}: ${slide?.title ?? ''}`);
    }
  }, [emblaApi, slides]);

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
      aria-roledescription="carousel"
      aria-label="Productos destacados"
      className="relative overflow-hidden bg-white dark:bg-neutral-950"
    >
      <div className="relative h-[700px] sm:h-[740px] md:h-[660px]">
        <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex touch-pan-y h-full">
          {slides.map((slide, index) => {
            const isFirst = index === 0;
            const Heading = isFirst ? 'h1' : 'h2';
            const isFigmaDuo = slide.link === '/product/iphone-duo';

            if (isFigmaDuo) {
              return (
                <div
                  key={slide.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} de ${slides.length}: ${slide.title}`}
                  className="relative flex-[0_0_100%] min-w-0 h-full bg-white"
                >
                  <div className="container mx-auto h-full max-w-7xl px-4 md:px-10 pt-24 md:pt-20 pb-8 md:pb-20 grid grid-cols-1 md:grid-cols-12 items-center gap-6">
                    <div className="relative h-[250px] sm:h-[330px] md:h-[520px] md:col-span-7 self-end">
                      <SmartImage
                        src="/images/hero/hero-iphone-duo-figma.png"
                        alt="iPhone Duo"
                        fill
                        priority={isFirst}
                        fetchPriority={isFirst ? 'high' : 'low'}
                        sizes="(max-width: 768px) 100vw, 58vw"
                        className="object-contain object-bottom"
                      />
                    </div>

                    <div className="md:col-span-5 flex flex-col items-center text-center gap-4 pb-6 md:pb-0">
                      <Heading className="text-5xl sm:text-6xl lg:text-[84px] leading-none tracking-tight flex items-baseline justify-center">
                        <span className="font-bold text-black">iPhone</span>
                        <span className="font-black bg-gradient-to-r from-[#a69b8b] from-[28%] to-[#e5d1b1] to-[73%] bg-clip-text text-transparent">
                          DUO
                        </span>
                      </Heading>

                      <Link
                        href={slide.link}
                        className="w-full max-w-[360px] h-[50px] rounded-[52px] bg-[#f8f5f5] hover:bg-neutral-100 text-black text-lg font-light flex items-center justify-center shadow-[0_7px_5.8px_rgba(0,0,0,0.25)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
                      >
                        Comprar Ahora
                      </Link>

                      <Link
                        href="/iphone"
                        className="text-lg font-light text-black hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3] rounded-md px-3 py-1"
                      >
                        Ver Modelos
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            if (slide.link === '/product/macbook-air-13-m5') {
              return (
                <div
                  key={slide.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} de ${slides.length}: ${slide.title}`}
                  className="relative flex-[0_0_100%] min-w-0 h-full bg-white"
                >
                  <div className="container mx-auto h-full max-w-7xl px-4 md:px-10 pt-24 md:pt-20 pb-8 md:pb-20 grid grid-cols-1 md:grid-cols-12 items-center gap-6">
                    <div className="md:col-span-5 flex flex-col items-center text-center gap-4 order-2 md:order-1 pb-6 md:pb-0">
                      <Heading className="text-5xl sm:text-6xl lg:text-[78px] leading-none tracking-tight flex items-baseline justify-center gap-3">
                        <span className="font-light text-black">MacBook</span>
                        <span className="font-black bg-gradient-to-r from-[#d5e8f2] from-[28%] to-[#8299a9] to-[73%] bg-clip-text text-transparent">
                          Air
                        </span>
                      </Heading>

                      <Link
                        href={slide.link}
                        className="w-full max-w-[360px] h-[50px] rounded-[52px] bg-[#f8f5f5] hover:bg-neutral-100 text-black text-lg font-light flex items-center justify-center shadow-[0_7px_5.8px_rgba(0,0,0,0.25)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
                      >
                        Comprar Ahora
                      </Link>

                      <Link
                        href="/mac"
                        className="text-lg font-light text-black hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3] rounded-md px-3 py-1"
                      >
                        Ver Modelos
                      </Link>
                    </div>

                    <div className="relative h-[230px] sm:h-[310px] md:h-[460px] md:col-span-7 order-1 md:order-2">
                      <SmartImage
                        src="/images/hero/hero-macbook-air-m5-figma.png"
                        alt="MacBook Air M5"
                        fill
                        fetchPriority="low"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 58vw"
                        className="object-contain object-center"
                      />
                    </div>
                  </div>
                </div>
              );
            }

            if (slide.link === '/product/iphone-18-pro-max') {
              return (
                <div
                  key={slide.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} de ${slides.length}: ${slide.title}`}
                  className="relative flex-[0_0_100%] min-w-0 h-full bg-black overflow-hidden"
                >
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage:
                        'linear-gradient(105.37deg, rgb(61, 39, 42) 6.37%, rgba(125, 76, 84, 0.7) 21.88%, rgba(115, 115, 115, 0) 52.61%)',
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative z-10 container mx-auto h-full max-w-7xl px-4 md:px-10 pt-24 md:pt-20 pb-0 grid grid-cols-1 md:grid-cols-12 items-center gap-6">
                    <div className="relative z-20 md:col-span-6 flex flex-col items-center text-center gap-4 order-2 md:order-1 pb-12 md:pb-16">
                      <Heading className="font-sans leading-none tracking-tight flex flex-col items-center">
                        <span className="text-4xl sm:text-5xl lg:text-[68px] font-bold text-white">
                          iPhone
                        </span>
                        <span
                          className="text-6xl sm:text-7xl lg:text-[124px] font-bold bg-clip-text text-transparent"
                          style={{
                            backgroundImage:
                              'linear-gradient(-72.3deg, rgb(56, 32, 36) 3.6%, rgb(246, 246, 246) 98.28%)',
                          }}
                        >
                          18 Pro
                        </span>
                      </Heading>

                      <Link
                        href={slide.link}
                        className="w-full max-w-[420px] h-[50px] rounded-[52px] bg-[#f8f5f5] hover:bg-neutral-200 text-black text-lg font-light flex items-center justify-center shadow-[0_7px_5.8px_rgba(0,0,0,0.25)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        Comprar Ahora
                      </Link>

                      <Link
                        href="/iphone"
                        className="text-lg font-light text-white/90 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-md px-3 py-1"
                      >
                        Ver Modelos
                      </Link>
                    </div>

                    <div className="relative z-10 -mx-4 md:mx-0 h-[320px] sm:h-[380px] md:h-[500px] md:col-span-6 order-1 md:order-2 self-end pointer-events-none [mask-image:linear-gradient(to_bottom,#000_60%,transparent_100%)] md:[mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_55%,transparent_100%)]">
                      <SmartImage
                        src="/images/hero/hero-iphone-18-pro-figma.png"
                        alt="iPhone 18 Pro Burgundy"
                        fill
                        fetchPriority="low"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-top md:object-contain md:object-bottom mix-blend-lighten"
                      />
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${slides.length}: ${slide.title}`}
                className="relative flex-[0_0_100%] min-w-0 h-full"
              >
                <SmartImage
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={isFirst}
                  fetchPriority={isFirst ? 'high' : 'low'}
                  loading={isFirst ? undefined : 'lazy'}
                  sizes="100vw"
                  className="object-cover object-center"
                />
                {/* Gradiente sutil solo en la base para los puntos de paginación */}
                <div
                  className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/35 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center text-center px-4 pt-32 pb-24">
                  {slide.badge ? (
                    <span className="mb-4 inline-flex items-center rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/25">
                      {slide.badge}
                    </span>
                  ) : null}
                  <Heading className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                    {slide.title}
                  </Heading>
                  <p className="text-xl md:text-2xl mb-8 max-w-2xl font-light text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                      href={slide.link}
                      className="bg-white text-black hover:bg-neutral-200 px-8 py-3.5 rounded-full font-medium transition shadow-lg flex items-center gap-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Comprar ahora <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                    <span className="text-sm font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                      {slide.priceText}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controles Anterior / Siguiente */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Diapositiva anterior"
        className="hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/45 hover:bg-black/70 text-white backdrop-blur-md items-center justify-center transition touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
      </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Siguiente diapositiva"
          className="hidden sm:flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/45 hover:bg-black/70 text-white backdrop-blur-md items-center justify-center transition touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Región de estado accesible */}
      <p className="sr-only" role="status" aria-live="polite">
        {statusMessage}
      </p>

      {/* Puntos de paginación y control de pausa debajo del Hero */}
      <div className="flex items-center justify-center gap-1 py-3 bg-white dark:bg-neutral-950">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => scrollTo(index)}
            aria-current={index === selectedIndex ? 'true' : undefined}
            className="flex h-11 min-w-[44px] items-center justify-center touch-manipulation rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
            aria-label={`Ir a la diapositiva ${index + 1}: ${slide.title}`}
          >
            <span
              className={`block h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'w-8 bg-neutral-900 dark:bg-white'
                  : 'w-2.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-500'
              }`}
            />
          </button>
        ))}
        <button
          type="button"
          onClick={toggleAutoplay}
          aria-label={isPlaying ? 'Pausar presentación' : 'Reproducir presentación'}
          aria-pressed={!isPlaying}
          className="ml-2 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white transition touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Play className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </section>
  );
}
