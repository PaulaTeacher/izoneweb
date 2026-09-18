'use client';

import React, { useEffect, useState } from 'react';
import { formatCOP } from '@izone/shared-types';
import { ShoppingBag, Truck, Store } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';

interface StickyBuyBarProps {
  productName: string;
  variantLabel: string;
  price: number;
  image?: string;
  onAddToCart: () => void;
  disabled?: boolean;
}

export function StickyBuyBar({
  productName,
  variantLabel,
  price,
  image,
  onAddToCart,
  disabled = false,
}: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar la barra cuando el usuario ha scrolleado más de 450px
      if (window.scrollY > 450) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Lado Izquierdo: Métodos de Entrega (Oculto en móvil) */}
        <div className="hidden lg:flex flex-col text-[11px] text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>
              <strong>Recoger en Tienda:</strong> Cra. 15 # 93-60 (En 1h)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mt-0.5">
            <Truck className="w-3.5 h-3.5" />
            <span>Envío a domicilio GRATIS prioritario</span>
          </div>
        </div>

        {/* Centro: Info del Producto y Miniatura */}
        <div className="flex items-center gap-3">
          {image && (
            <div className="relative w-11 h-11 flex-shrink-0 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
              <SmartImage
                src={image}
                alt={productName}
                fill
                sizes="44px"
                className="object-contain p-0.5"
              />
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className="text-xs md:text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[200px] md:max-w-[320px]">
              {productName}
            </span>
            <span className="text-[11px] text-neutral-500 truncate max-w-[180px]">
              {variantLabel}
            </span>
          </div>
        </div>

        {/* Lado Derecho: Precio y Botón CTA */}
        <div className="flex items-center gap-4">
          <div className="text-right flex flex-col justify-center">
            <span className="text-sm md:text-lg font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
              {formatCOP(price)}
            </span>
          </div>

          <button
            type="button"
            onClick={onAddToCart}
            disabled={disabled}
            className="bg-[#0071E3] hover:bg-[#0077ED] active:scale-95 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="whitespace-nowrap">Agregar al carrito</span>
          </button>
        </div>
      </div>
    </div>
  );
}
