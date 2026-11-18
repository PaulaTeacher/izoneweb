'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { formatCOP, type Product } from '@izone/shared-types';
import { CategoryModelCarousel, type ModelCarouselItem } from './CategoryModelCarousel';
import { SmartImage } from '@/components/ui/SmartImage';
import { RatingSummary } from '@/components/product/StarRating';

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
  filters: { id: string; label: string; matchStrings?: string[] }[];
  comparisonComponent?: React.ReactNode;
}

interface CategoryHubProps {
  initialProducts: Product[];
  config: CategoryHubConfig;
}

export function CategoryHub({ initialProducts, config }: CategoryHubProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleChapterAction = (item: ModelCarouselItem) => {
    // Product / hub links use Next.js <Link href>; do not hijack them.
    if (item.action === 'link') return;
    if (item.action === 'scroll' && item.actionTarget) {
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

  return (
    <div className="w-full bg-white dark:bg-black min-h-screen font-sans">
      {/* Carrusel de modelos */}
      <section className="bg-white dark:bg-[#161617]">
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

      {/* Catálogo de Productos con Filtros Activos */}
      <section id="catalogo-productos" className="w-full pt-4 pb-16 scroll-mt-24">
        <div className="max-w-[1100px] mx-auto px-4">
          <h1 className="sr-only">Modelos de {config.title} disponibles</h1>
          {selectedFilter && (
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setSelectedFilter(null)}
                className="text-xs font-semibold text-[#0071E3] hover:underline"
              >
                Ver todos los modelos ({initialProducts.length})
              </button>
            </div>
          )}

          <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800">
            {filteredProducts.map((product) => {
              const defaultVariant = product.variants?.[0];
              const currentPrice = Number(defaultVariant?.price || 0);
              const activeImage = defaultVariant?.featuredImage || product.images?.[0];
              const isNew = product.tags?.some((t) => t.name.toLowerCase() === 'nuevo');

              return (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row items-center justify-between py-8 md:py-12 gap-10 group"
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
                      <Link href={`/product/${product.slug}`}>{product.name}</Link>
                    </h3>

                    <p className="text-[14px] text-neutral-600 dark:text-neutral-400 font-medium mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="text-[16px] text-[#1D1D1F] dark:text-neutral-200 font-bold mb-4">
                      Desde {formatCOP(currentPrice)}*
                    </div>

                    <div className="mb-6">
                      <RatingSummary
                        average={product.ratingAverage}
                        count={product.reviewCount}
                      />
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
                        <div className="relative w-[85%] md:w-[75%] aspect-square max-h-[300px]">
                          <SmartImage
                            src={activeImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 85vw, 35vw"
                            className="object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
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
                Pagos seguros
              </h4>
              <p className="text-xs text-neutral-500">
                Tarjetas en punto físico, PSE y transferencia. Asesoría directa.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
