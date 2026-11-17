'use client';

import React, { useEffect, useState } from 'react';
import { formatCOP } from '@izone/shared-types';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';

interface StickyBuyBarProps {
  productName: string;
  variantLabel: string;
  price: number;
  image?: string;
  onWhatsapp: () => void;
  onAddToCart: () => void;
  whatsappLoading?: boolean;
  disabled?: boolean;
  outOfStock?: boolean;
}

export function StickyBuyBar({
  productName,
  variantLabel,
  price,
  image,
  onWhatsapp,
  onAddToCart,
  whatsappLoading = false,
  disabled = false,
  outOfStock = false,
}: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 280);
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
      <div className="max-w-[1240px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
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
          <div className="flex flex-col text-left min-w-0">
            <span className="text-xs md:text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[140px] sm:max-w-[220px]">
              {productName}
            </span>
            <span className="text-[11px] text-neutral-400 truncate max-w-[140px] sm:max-w-[200px]">
              {variantLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-sm md:text-lg font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
            {formatCOP(price)}
          </span>

          <button
            type="button"
            onClick={onAddToCart}
            disabled={disabled || outOfStock}
            aria-label="Agregar al carrito"
            className="hidden sm:flex border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs px-3 py-2.5 rounded-full transition-all items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="whitespace-nowrap">Carrito</span>
          </button>

          <button
            type="button"
            onClick={onWhatsapp}
            disabled={disabled || whatsappLoading}
            className="bg-[#25D366] hover:bg-[#1EBE5D] active:scale-95 text-white font-bold text-xs md:text-sm px-4 sm:px-5 py-3 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span className="whitespace-nowrap">
              {whatsappLoading
                ? '…'
                : outOfStock
                  ? 'Consultar'
                  : 'WhatsApp'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
