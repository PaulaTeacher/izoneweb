import React from 'react';
import Link from 'next/link';
import { formatCOP, type Product } from '@izone/shared-types';

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export function ProductGrid({ title, subtitle, products }: ProductGridProps) {
  if (!products?.length) return null;

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-sm md:text-base text-neutral-500 mt-2 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <Link 
          href="/shop" 
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center transition"
        >
          Ver todo el catálogo →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => {
          const minPrice = p.variants?.[0]?.price ? formatCOP(p.variants[0].price) : '';

          return (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group flex flex-col bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 hover:shadow-2xl hover:border-neutral-200 dark:hover:border-neutral-700 transition-all duration-300"
            >
              {/* Etiqueta / Tag (Opcional) */}
              <div className="flex justify-between items-center mb-4 h-6">
                {p.tags?.[0] ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {p.tags[0].name}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    {p.category?.name}
                  </span>
                )}
              </div>

              {/* Imagen del producto (Usando placeholder por ahora si no hay img) */}
              <div className="relative aspect-square mb-6 overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center">
                <img
                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=600&auto=format&fit=crop'}
                  alt={p.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Información */}
              <div className="flex-1 flex flex-col justify-end">
                <h3 className="text-lg font-bold mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {p.name}
                </h3>
                
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-end justify-between">
                  <div>
                    <span className="text-xs text-neutral-500 block mb-1">Precio</span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {minPrice}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
