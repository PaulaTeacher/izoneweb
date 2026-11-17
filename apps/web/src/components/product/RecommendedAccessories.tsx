'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { formatCOP, type Product } from '@izone/shared-types';
import { Check, Plus } from 'lucide-react';
import { easeOut } from '@/components/motion/FadeIn';
import { SmartImage } from '@/components/ui/SmartImage';
import { useCart } from '@/lib/cart-context';

interface RecommendedAccessoriesProps {
  productName: string;
  products: Product[];
}

export function RecommendedAccessories({ productName, products }: RecommendedAccessoriesProps) {
  const reduce = useReducedMotion();
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    if (!addedId) return;
    const timer = window.setTimeout(() => setAddedId(null), 1500);
    return () => window.clearTimeout(timer);
  }, [addedId]);

  if (!products.length) return null;

  return (
    <section className="w-full my-14" aria-labelledby="recommended-accessories-heading">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#0071E3] uppercase">
            Completa tu experiencia
          </span>
          <h3
            id="recommended-accessories-heading"
            className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white"
          >
            Los más elegidos con {productName}
          </h3>
        </div>
        <Link
          href="/accesorios"
          className="text-xs font-semibold text-[#0071E3] hover:underline"
        >
          Ver todos los accesorios
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((acc, index) => {
          const primaryVariant = acc.variants?.[0];
          const minPrice = Number(primaryVariant?.price || 0);
          const inStock = Boolean(primaryVariant && primaryVariant.stock > 0);
          const isAdded = addedId === acc.id;
          const image = acc.images?.[0];
          const colors = (acc.variants || []).filter((v) => v.colorHex).slice(0, 5);

          return (
            <motion.article
              key={acc.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduce ? 0 : 0.22,
                delay: reduce ? 0 : index * 0.05,
                ease: easeOut,
              }}
              className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 bg-white dark:bg-neutral-900 flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <Link
                  href={`/product/${acc.slug}`}
                  className="relative w-full aspect-square flex items-center justify-center p-2 mb-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl overflow-clip"
                >
                  {image ? (
                    <SmartImage
                      src={image}
                      alt={acc.name}
                      fill
                      sizes="(max-width: 768px) 40vw, 160px"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-xs text-neutral-400">{acc.brand?.name}</span>
                  )}
                </Link>

                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  {acc.category?.name || acc.brand?.name}
                </span>

                <Link href={`/product/${acc.slug}`}>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-2 leading-tight hover:text-[#0071E3]">
                    {acc.name}
                  </h4>
                </Link>

                {colors.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-2">
                    {colors.map((v) => (
                      <span
                        key={v.id}
                        title={v.colorName || undefined}
                        className="w-3 h-3 rounded-full border border-black/10"
                        style={{ backgroundColor: v.colorHex || undefined }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <footer className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-neutral-900 dark:text-white">
                  {minPrice ? formatCOP(minPrice) : 'Ver opciones'}
                </span>

                <button
                  type="button"
                  disabled={!inStock}
                  onClick={() => {
                    if (!primaryVariant || !inStock) return;
                    addItem(acc, primaryVariant, 1);
                    setAddedId(acc.id);
                  }}
                  aria-label={`Agregar ${acc.name} al carrito`}
                  className={`h-9 px-3 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1 transition-colors touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3] ${
                    !inStock
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                      : isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-50 dark:bg-blue-950/50 hover:bg-[#0071E3] hover:text-white text-[#0071E3]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      Agregado
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      Agregar
                    </>
                  )}
                </button>
              </footer>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
