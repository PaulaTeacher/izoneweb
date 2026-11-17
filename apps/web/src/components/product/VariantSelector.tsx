'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { checkoutWhatsapp } from '@/lib/api';
import { buildWaMeUrl } from '@/lib/whatsapp';
import Link from 'next/link';
import { ShoppingBag, Check, Truck, Store, RefreshCw, MessageCircle, CreditCard } from 'lucide-react';
import { formatCOP, variantLabel } from '@izone/shared-types';
import type { Product, Variant } from '@izone/shared-types';
import { StickyBuyBar } from './StickyBuyBar';

interface VariantSelectorProps {
  product: Product;
  onVariantChange?: (variant: Variant) => void;
}

export default function VariantSelector({ product, onVariantChange }: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    product.variants[0]
  );
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [includeProtection, setIncludeProtection] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addItem } = useCart();

  const isAccessory = product.productKind === 'accessory';
  const outOfStock = !selectedVariant || selectedVariant.stock === 0;

  const uniqueColors = Array.from(
    new Map(
      product.variants.map((v) => [v.colorName || v.colorHex || 'Único', v])
    ).values()
  );

  const uniqueStorages = Array.from(
    new Set(product.variants.map((v) => v.storage).filter((s): s is string => Boolean(s))),
  );

  const uniqueMaterials = Array.from(
    new Set(product.variants.map((v) => v.material).filter(Boolean)),
  );

  const materialLabels: Record<string, string> = {
    silicona: 'Silicona',
    cuero: 'Cuero',
    hibrido: 'Híbrido',
    diseno: 'Diseño',
    otro: 'Otro',
  };

  const handleSelectColor = (colorVariant: Variant) => {
    const match = product.variants.find(
      (v) =>
        (v.colorName === colorVariant.colorName || v.colorHex === colorVariant.colorHex) &&
        v.storage === selectedVariant?.storage &&
        v.material === selectedVariant?.material
    ) || colorVariant;

    setSelectedVariant(match);
    if (onVariantChange) onVariantChange(match);
  };

  const handleSelectStorage = (storage: string) => {
    const match = product.variants.find(
      (v) =>
        v.storage === storage &&
        (v.colorName === selectedVariant?.colorName || v.colorHex === selectedVariant?.colorHex) &&
        v.material === selectedVariant?.material
    ) || product.variants.find((v) => v.storage === storage);

    if (match) {
      setSelectedVariant(match);
      if (onVariantChange) onVariantChange(match);
    }
  };

  const handleSelectMaterial = (material: string) => {
    const match = product.variants.find(
      (v) =>
        v.material === material &&
        (v.colorName === selectedVariant?.colorName || v.colorHex === selectedVariant?.colorHex)
    ) || product.variants.find((v) => v.material === material);

    if (match) {
      setSelectedVariant(match);
      if (onVariantChange) onVariantChange(match);
    }
  };

  const currentPrice = Number(selectedVariant?.price || 0);
  const hasComparePrice = Boolean(selectedVariant?.comparePrice);
  const originalPrice = hasComparePrice ? Number(selectedVariant!.comparePrice) : null;
  const discountAmount =
    originalPrice !== null && originalPrice > currentPrice
      ? originalPrice - currentPrice
      : 0;

  const protectionPrice = 189000;

  const handleAddToCart = () => {
    if (!selectedVariant || outOfStock) return;
    addItem(product, selectedVariant, 1, includeProtection);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleDirectWhatsapp = async () => {
    if (!selectedVariant) return;

    if (outOfStock) {
      window.open(
        buildWaMeUrl(
          `Hola iZone Tech, quiero consultar disponibilidad de ${product.name} (${variantLabel(selectedVariant)}).`,
        ),
        '_blank',
        'noopener,noreferrer',
      );
      return;
    }

    setLoading(true);
    try {
      const res = await checkoutWhatsapp({
        items: [{ variantId: selectedVariant.id, quantity: 1, hasProtection: includeProtection }],
        customerName: name.trim() || 'Cliente web',
      });
      if (res.url) window.open(res.url, '_blank');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al generar enlace de WhatsApp';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 mt-4">
      <div className="pt-2">
        {discountAmount > 0 && originalPrice !== null && (
          <div className="flex items-center gap-3">
            <span className="text-sm md:text-base text-neutral-400 line-through">
              {formatCOP(originalPrice)}
            </span>
            <span className="text-[11px] font-bold text-[#E05A1B] uppercase bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-md border border-orange-200 dark:border-orange-800">
              Ahorras {formatCOP(discountAmount)}
            </span>
          </div>
        )}

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            {formatCOP(currentPrice)}
          </span>
          <span className="text-xs text-neutral-500 font-medium">IVA incluido</span>
        </div>
      </div>

      {uniqueColors.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            Color: <span className="font-normal text-neutral-500">{selectedVariant?.colorName || 'Por defecto'}</span>
          </label>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {uniqueColors.map((cv) => {
              const isSelected =
                cv.colorName === selectedVariant?.colorName ||
                cv.colorHex === selectedVariant?.colorHex;
              return (
                <button
                  key={cv.id}
                  type="button"
                  onClick={() => handleSelectColor(cv)}
                  className={`w-9 h-9 rounded-full relative transition-all cursor-pointer flex items-center justify-center p-0.5 ${
                    isSelected
                      ? 'ring-2 ring-[#0071E3] ring-offset-2 dark:ring-offset-black scale-105'
                      : 'hover:scale-105 border border-neutral-300 dark:border-neutral-700'
                  }`}
                  title={cv.colorName || 'Color'}
                >
                  <span
                    className="w-full h-full rounded-full block shadow-inner"
                    style={{ backgroundColor: cv.colorHex || '#A0A0A0' }}
                  />
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 absolute drop-shadow ${
                        ['#F5F5F0', '#FFFFFF', '#FAFAFA'].includes(cv.colorHex || '')
                          ? 'text-black'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {uniqueMaterials.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            Material:{' '}
            <span className="font-normal text-neutral-500">
              {selectedVariant?.material
                ? materialLabels[selectedVariant.material] || selectedVariant.material
                : 'Por defecto'}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {uniqueMaterials.map((material) => {
              const isSelected = selectedVariant?.material === material;
              return (
                <button
                  key={material}
                  type="button"
                  onClick={() => handleSelectMaterial(material as string)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0071E3] bg-blue-50 text-[#0071E3] dark:bg-blue-950/40 dark:text-blue-300 ring-1 ring-[#0071E3]'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900'
                  }`}
                >
                  {materialLabels[material as string] || material}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {uniqueStorages.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            Capacidad:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {uniqueStorages.map((storage) => {
              const isSelected = selectedVariant?.storage === storage;
              return (
                <button
                  key={storage}
                  type="button"
                  onClick={() => handleSelectStorage(storage)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'border-[#0071E3] bg-blue-50 text-[#0071E3] dark:bg-blue-950/40 dark:text-blue-300 shadow-xs ring-1 ring-[#0071E3]'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900'
                  }`}
                >
                  {storage}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs">
        <span
          className={`w-2 h-2 rounded-full ${outOfStock ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}
        />
        <span
          className={
            outOfStock
              ? 'text-amber-700 dark:text-amber-400 font-semibold'
              : 'text-emerald-700 dark:text-emerald-400 font-semibold'
          }
        >
          {selectedVariant?.stock && selectedVariant.stock > 0
            ? `${selectedVariant.stock} unidades listas para despacho inmediato`
            : 'Consultar disponibilidad por WhatsApp'}
        </span>
      </div>

      <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2.5">
          <Store className="w-4 h-4 text-[#0071E3] flex-shrink-0" />
          <span>
            <strong>Retiro en tienda GRATIS:</strong> Disponible en 1 hora en CC Unilago, Local L 1-143 (Bogotá).
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Envío a domicilio GRATIS:</strong> Entrega el mismo día en Bogotá y 24-48h a nivel nacional.
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <span>
            <strong>Medios de pago:</strong> Tarjetas débito/crédito en punto físico (CC Unilago), transferencia o contraentrega en Bogotá.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pt-2">
        <button
          type="button"
          onClick={handleDirectWhatsapp}
          disabled={loading || !selectedVariant}
          className="w-full py-4 px-6 rounded-full font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm bg-[#25D366] hover:bg-[#1EBE5D] text-white disabled:opacity-50"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          {loading
            ? 'Generando…'
            : outOfStock
              ? 'Consultar por WhatsApp'
              : 'Comprar por WhatsApp'}
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedVariant || outOfStock}
          className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border ${
            addedAnimation
              ? 'bg-emerald-600 border-emerald-600 text-white scale-[0.98]'
              : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800'
          } disabled:opacity-50`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4" />
              ¡Agregado al Carrito!
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Agregar al Carrito
            </>
          )}
        </button>

        <input
          type="text"
          placeholder="Tu nombre (opcional, para el mensaje de WhatsApp)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-neutral-200 dark:border-neutral-800 rounded-full px-4 py-2.5 text-xs bg-white dark:bg-neutral-900 outline-none focus:border-[#25D366] transition"
        />
      </div>

      {!isAccessory && (
        <div
          onClick={() => setIncludeProtection(!includeProtection)}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
            includeProtection
              ? 'border-[#0071E3] bg-blue-50/50 dark:bg-blue-950/30'
              : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-300'
          }`}
        >
          <input
            type="checkbox"
            checked={includeProtection}
            onChange={() => {}}
            className="mt-1 w-4 h-4 rounded text-[#0071E3] accent-[#0071E3] cursor-pointer"
          />
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900 dark:text-white">
                Protege tu equipo por 12 meses*
              </span>
              <span className="font-bold text-[#0071E3]">+{formatCOP(protectionPrice)}</span>
            </div>
            <p className="text-neutral-500 mt-0.5 leading-snug">
              Cobertura contra rotura accidental de pantalla, daño por líquidos y hurto calificado. Menciona al asesor en WhatsApp si la deseas.
            </p>
          </div>
        </div>
      )}

      {!isAccessory && (
        <div className="p-3 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-neutral-900 text-xs">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-neutral-500 flex-shrink-0" />
            <span className="text-neutral-700 dark:text-neutral-300">
              ¿Tienes un dispositivo actual? <strong>Entrega en parte de pago</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Link
              href={`/trade-in?target=${product.slug}`}
              className="text-[#0071E3] hover:underline font-semibold whitespace-nowrap"
            >
              Simular retoma
            </Link>
            <button
              type="button"
              onClick={() => {
                window.open(
                  buildWaMeUrl(
                    `Hola iZone Tech, quisiera cotizar mi equipo en plan retoma. Me interesa: ${product.name}.`,
                  ),
                  '_blank',
                  'noopener,noreferrer',
                );
              }}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold whitespace-nowrap"
            >
              WhatsApp
            </button>
          </div>
        </div>
      )}

      {selectedVariant && (
        <StickyBuyBar
          productName={product.name}
          variantLabel={variantLabel(selectedVariant)}
          price={currentPrice}
          image={selectedVariant.featuredImage || product.images?.[0]}
          onWhatsapp={handleDirectWhatsapp}
          onAddToCart={handleAddToCart}
          whatsappLoading={loading}
          outOfStock={outOfStock}
        />
      )}
    </div>
  );
}
