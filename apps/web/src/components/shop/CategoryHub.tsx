'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ShieldCheck, Truck, RefreshCw, CreditCard, Star, Info, ArrowRight } from 'lucide-react';
import { formatCOP, type Product } from '@izone/shared-types';
import { CategoryModelCarousel, type ModelCarouselItem } from './CategoryModelCarousel';

export interface CategoryHubConfig {
  id: string;
  title: string;
  chapterItems: {
    name: string;
    id: string;
    img?: string;
    isNew?: boolean;
    badge?: string;
    subBadge?: string;
    price?: string;
    subtitle?: string;
    href?: string;
    action?: 'filter' | 'scroll' | 'link';
    actionTarget?: string;
  }[];
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: { label: string; filterId: string };
    discountText?: string;
    installmentsText?: string;
    buttonText?: string;
    image?: string;
    secondaryImage?: string;
    bannerImage?: string;
    bannerMobileImage?: string;
    slides?: {
      id: string;
      image: string;
      imageMobile?: string;
      alt: string;
      link?: string;
    }[];
    legalNote?: string;
  };
  filters: { id: string; label: string; matchStrings?: string[] }[];
  comparisonComponent?: React.ReactNode;
}

interface CategoryHubProps {
  initialProducts: Product[];
  config: CategoryHubConfig;
}

export function CategoryHub({ initialProducts, config }: CategoryHubProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Hero Slider Embla Carousel
  const [heroEmblaRef, heroEmblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  const onHeroSelect = useCallback(() => {
    if (!heroEmblaApi) return;
    setSelectedSlideIndex(heroEmblaApi.selectedScrollSnap());
  }, [heroEmblaApi]);

  useEffect(() => {
    if (!heroEmblaApi) return;
    onHeroSelect();
    heroEmblaApi.on('select', onHeroSelect);
    heroEmblaApi.on('reInit', onHeroSelect);
  }, [heroEmblaApi, onHeroSelect]);

  const scrollToSlide = (idx: number) => {
    if (heroEmblaApi) heroEmblaApi.scrollTo(idx);
  };

  const handleChapterAction = (item: ModelCarouselItem) => {
    if (item.action === 'link' && item.actionTarget) {
      window.location.href = item.actionTarget;
    } else if (item.action === 'scroll' && item.actionTarget) {
      document.getElementById(item.actionTarget)?.scrollIntoView({ behavior: 'smooth' });
    } else if (item.action === 'filter' && item.actionTarget) {
      setSelectedFilter((prev) => (prev === item.actionTarget ? null : (item.actionTarget as string)));
      document.getElementById('catalogo-productos')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtrado reactivo de productos si se selecciona un modelo o filtro
  const filteredProducts = selectedFilter
    ? initialProducts.filter((p) => {
        const targetFilter = config.filters.find((f) => f.id === selectedFilter);
        const matchStrings = targetFilter?.matchStrings || [selectedFilter];
        return matchStrings.some(
          (m) =>
            p.name.toLowerCase().includes(m.toLowerCase()) ||
            p.slug.toLowerCase().includes(m.toLowerCase())
        );
      })
    : initialProducts;

  const hasSlides = config.hero.slides && config.hero.slides.length > 0;

  return (
    <div className="w-full bg-white dark:bg-black min-h-screen font-sans">
      {/* 1. Carrusel Tipo Banner Horizontal de Modelos (Exacto al diseño iShop Colombia) */}
      <section className="sticky top-[44px] z-30 bg-white dark:bg-[#121212]">
        <CategoryModelCarousel
          items={config.chapterItems.map((item) => ({
            ...item,
            action: item.action || 'filter',
            actionTarget: item.actionTarget || item.id,
          }))}
          activeId={selectedFilter || undefined}
          onItemClick={handleChapterAction}
        />
      </section>

      {/* 2. Hero Banner Promocional Estilo iShop */}
      {hasSlides ? (
        <section className="relative overflow-hidden bg-[#2D3035] w-full">
          <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={heroEmblaRef}>
            <div className="flex touch-pan-y w-full">
              {config.hero.slides!.map((slide) => (
                <div
                  key={slide.id}
                  className="relative flex-[0_0_100%] min-w-0 flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    if (slide.link?.startsWith('#')) {
                      document.getElementById(slide.link.slice(1))?.scrollIntoView({ behavior: 'smooth' });
                    } else if (slide.link) {
                      window.location.href = slide.link;
                    }
                  }}
                >
                  {/* Desktop Image */}
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-auto max-h-[500px] object-cover object-center hidden md:block"
                    loading="eager"
                  />
                  {/* Mobile Image */}
                  <img
                    src={slide.imageMobile || slide.image}
                    alt={slide.alt}
                    className="w-full h-auto object-cover object-center md:hidden"
                    loading="eager"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Indicador de Diapositivas (Píldora blanca con puntos exactamente como iShop) */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center z-20 pointer-events-none">
            <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-md pointer-events-auto">
              {config.hero.slides!.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSlide(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === selectedSlideIndex
                      ? 'w-2.5 h-2.5 bg-[#FF6B1A]'
                      : 'w-2 h-2 bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400'
                  }`}
                  aria-label={`Ir a la diapositiva ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden bg-gradient-to-r from-[#4A4E54] via-[#35383D] to-[#1E2024] text-white py-12 md:py-16">
          <div className="max-w-[1240px] mx-auto px-4 md:px-8">
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12 min-h-[360px] md:min-h-[420px]">
              {/* Lado Izquierdo: Imagen Destacada del Dispositivo */}
              <div className="w-full md:w-1/2 flex items-center justify-center relative">
                <div className="relative w-[280px] h-[280px] md:w-[420px] md:h-[380px] flex items-center justify-center">
                  <img
                    src={config.hero.image || config.chapterItems[0]?.img || ''}
                    alt={config.hero.badge}
                    className="max-w-full max-h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Lado Derecho: Textos Comerciales y CTA al estilo iShop */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                {/* Badge de Modelo */}
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="text-xs md:text-sm font-semibold tracking-wider text-neutral-300 uppercase">
                     {config.hero.badge}
                  </span>
                </div>

                {/* Título Principal y Subtítulo */}
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-3">
                  {config.hero.discountText ? (
                    <>
                      <span className="block text-lg md:text-xl font-medium text-neutral-300 mb-1">
                        Descuento hasta de:
                      </span>
                      <span className="text-4xl md:text-6xl font-black text-white tracking-tight">
                        {config.hero.discountText}
                      </span>
                    </>
                  ) : (
                    config.hero.title
                  )}
                </h1>

                <p className="text-lg md:text-2xl font-light text-neutral-200 mt-2 mb-6">
                  {config.hero.installmentsText ? (
                    <span>
                      Estrena en <strong className="font-bold text-white">24 cuotas</strong> sin interés.**
                    </span>
                  ) : (
                    config.hero.description
                  )}
                </p>

                {/* Botón Naranja de Compra */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                  <button
                    onClick={() => {
                      document.getElementById('catalogo-productos')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#FF6B1A] hover:bg-[#E05A1B] text-white font-bold text-sm tracking-wider uppercase px-8 py-3.5 rounded-full shadow-[0_4px_20px_rgba(255,107,26,0.4)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {config.hero.buttonText || 'COMPRA AHORA'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      document.getElementById('comparador')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="border border-white/40 hover:border-white text-white text-sm font-medium px-6 py-3 rounded-full transition-colors"
                  >
                    Comparar modelos
                  </button>
                </div>

                {/* Disclaimer Legal al pie del banner */}
                <p className="text-[10px] md:text-[11px] text-neutral-400 max-w-lg leading-relaxed">
                  {config.hero.legalNote ||
                    '**Beneficio válido en tiendas físicas y online. Aplica el beneficio de 0% de tasa de interés por compras diferidas a 24 cuotas con tarjetas de crédito de bancos participantes (Bancolombia, Davivienda, Banco de Bogotá) y Addi. Ver términos y condiciones.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Catálogo de Productos con Filtros Activos */}
      <section id="catalogo-productos" className="w-full py-16 scroll-mt-24">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
                Modelos de {config.title} disponibles
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                {selectedFilter
                  ? `Mostrando filtro: ${config.filters.find((f) => f.id === selectedFilter)?.label || selectedFilter}`
                  : 'Explora todos los modelos y configuraciones con garantía oficial.'}
              </p>
            </div>

            {selectedFilter && (
              <button
                onClick={() => setSelectedFilter(null)}
                className="text-xs font-semibold text-[#0071E3] hover:underline self-start md:self-auto"
              >
                Ver todos los modelos ({initialProducts.length})
              </button>
            )}
          </div>

          <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
            {filteredProducts.map((product) => {
              const defaultVariant = product.variants?.[0];
              const currentPrice = Number(defaultVariant?.price || 0);
              const activeImage = defaultVariant?.featuredImage || product.images?.[0];
              const isNew = product.tags?.some((t) => t.name.toLowerCase() === 'nuevo');
              const reviewCount = Math.floor(Math.random() * (300 - 50 + 1) + 50);

              return (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row items-center justify-between py-14 md:py-20 gap-10 group"
                >
                  {/* Lado Izquierdo (Info) */}
                  <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                    {isNew ? (
                      <span className="text-[11px] font-bold tracking-wider text-[#E05A1B] uppercase mb-2">
                        Nuevo
                      </span>
                    ) : (
                      <div className="h-4" />
                    )}

                    <h3 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-2 group-hover:text-[#0071E3] transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-[14px] text-neutral-600 dark:text-neutral-400 font-medium mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="text-[16px] text-[#1D1D1F] dark:text-neutral-200 font-bold mb-4">
                      Desde {formatCOP(currentPrice)}*
                    </div>

                    <div className="flex flex-col gap-1.5 mb-6">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold">4.9</span>
                        <div className="flex text-[#F59E0B]">
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                        <span className="text-[13px] text-neutral-500">
                          ({Math.floor(reviewCount / 5)})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0071E3] dark:text-[#4da1ff]">
                        {reviewCount}+ vendidos en 30 días
                        <Info className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                    </div>

                    <Link
                      href={`/product/${product.slug}`}
                      className="border border-[#0071E3] text-[#0071E3] hover:bg-[#0071E3] hover:text-white text-[14px] font-medium px-6 py-2.5 rounded-full transition-colors"
                    >
                      Ver modelo y comprar
                    </Link>
                  </div>

                  {/* Lado Derecho (Imagen) */}
                  <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end">
                    <Link
                      href={`/product/${product.slug}`}
                      className="w-full flex justify-center md:justify-end"
                    >
                      {activeImage ? (
                        <img
                          src={activeImage}
                          alt={product.name}
                          className="w-[85%] md:w-[75%] max-h-[300px] object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-64 h-64 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-400 text-sm">
                          Sin imagen
                        </div>
                      )}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Comparador (opcional) */}
      <div id="comparador">{config.comparisonComponent && config.comparisonComponent}</div>

      {/* 5. Trust Perks iZone Tech */}
      <section className="bg-[#FAFAFA] dark:bg-[#121212] border-t border-black/5 dark:border-white/5 py-16 mt-0">
        <div className="max-w-[1024px] mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-[#1D1D1F] dark:text-white mb-10">
            ¿Por qué comprar tu equipo en iZone Tech?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#0071E3] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">
                Garantía Oficial
              </h4>
              <p className="text-xs text-neutral-500">
                1 año de garantía directa en centros de servicio Apple autorizados.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">
                Envíos Asegurados
              </h4>
              <p className="text-xs text-neutral-500">
                Entrega el mismo día en Bogotá y envíos prioritarios a toda Colombia.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">
                Plan Retoma
              </h4>
              <p className="text-xs text-neutral-500">
                Entrega tu dispositivo actual en parte de pago con valoración inmediata.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-1">
                0% de Interés
              </h4>
              <p className="text-xs text-neutral-500">
                Paga hasta en 24 cuotas sin interés con Bancolombia, Davivienda y Addi.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
