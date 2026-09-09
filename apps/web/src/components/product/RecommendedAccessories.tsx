'use client';

import React from 'react';
import Link from 'next/link';
import { formatCOP } from '@izone/shared-types';
import { Star, Plus } from 'lucide-react';

interface RecommendedAccessoriesProps {
  productName: string;
}

const ACCESSORIES = [
  {
    id: 'case-magsafe',
    name: 'Funda Transparente MagSafe con protección contra caídas',
    category: 'FUNDAS Y PROTECCIÓN',
    price: 189000,
    rating: 4.8,
    reviews: 142,
    sales: '300+ vendidos',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT1E3?wid=400&hei=400&fmt=png-alpha',
  },
  {
    id: 'charger-20w',
    name: 'Adaptador de corriente USB-C de 20 W oficial',
    category: 'CARGA RÁPIDA',
    price: 129000,
    rating: 4.9,
    reviews: 580,
    sales: '1 K+ vendidos',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MU7V2_GEO_US?wid=400&hei=400&fmt=png-alpha',
  },
  {
    id: 'screen-guard',
    name: 'Protector de Pantalla Cerámico GlassGuard Privacy 9H',
    category: 'PROTECCIÓN PANTALLA',
    price: 89000,
    rating: 4.7,
    reviews: 89,
    sales: '500+ vendidos',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/HQ3W2?wid=400&hei=400&fmt=png-alpha',
  },
  {
    id: 'cable-magsafe',
    name: 'Cargador inalámbrico MagSafe de 15 W (1 m)',
    category: 'MAGSAFE ACCESORIOS',
    price: 249000,
    rating: 4.9,
    reviews: 210,
    sales: '250+ vendidos',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXH3?wid=400&hei=400&fmt=png-alpha',
  },
];

export function RecommendedAccessories({ productName }: RecommendedAccessoriesProps) {
  return (
    <section className="w-full my-14">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#0071E3] uppercase">
            Completa tu experiencia
          </span>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Los más elegidos con {productName}
          </h3>
        </div>
        <Link
          href="/shop?category=accesorios"
          className="text-xs font-semibold text-[#0071E3] hover:underline"
        >
          Ver todos los accesorios
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACCESSORIES.map((acc) => (
          <div
            key={acc.id}
            className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 bg-white dark:bg-neutral-900 flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              <div className="w-full aspect-square flex items-center justify-center p-2 mb-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl overflow-hidden">
                <img
                  src={acc.image}
                  alt={acc.name}
                  className="w-3/4 h-3/4 object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                {acc.category}
              </span>

              <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-2 leading-tight">
                {acc.name}
              </h4>

              <div className="flex items-center gap-1 mb-2 text-[11px] text-neutral-500">
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                  {acc.rating}
                </span>
                <div className="flex text-amber-500">
                  <Star className="w-3 h-3 fill-current" />
                </div>
                <span>({acc.reviews})</span>
                <span className="text-[10px] text-[#0071E3] font-medium ml-1">
                  · {acc.sales}
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {formatCOP(acc.price)}
              </span>

              <Link
                href="/shop?category=accesorios"
                className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/50 hover:bg-[#0071E3] hover:text-white text-[#0071E3] flex items-center justify-center transition-colors"
                title="Ver accesorio"
              >
                <Plus className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
