'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { checkoutWhatsapp } from '@/lib/api';
import { ShoppingBag, Check, ShieldCheck, Truck } from 'lucide-react';
import { formatCOP, variantLabel } from '@izone/shared-types';
import type { Product, Variant } from '@izone/shared-types';

export default function VariantSelector({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    product.variants[0],
  );
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleDirectWhatsapp = async () => {
    if (!name.trim()) {
      alert('Por favor, ingresa tu nombre');
      return;
    }
    if (!selectedVariant) {
      alert('Por favor, selecciona una variante');
      return;
    }
    setLoading(true);
    try {
      const res = await checkoutWhatsapp({
        items: [{ variantId: selectedVariant.id, quantity: 1 }],
        customerName: name.trim(),
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
    <div className="flex flex-col gap-6 mt-6">
      {/* Selector de Opciones */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-xs tracking-wider text-neutral-500 uppercase">
            Seleccionar Variante
          </h3>
          {selectedVariant && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                selectedVariant.stock > 0
                  ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {selectedVariant.stock > 0
                ? `${selectedVariant.stock} disponibles en bodega`
                : 'Agotado'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {product.variants.map((v: Variant) => {
            const isSelected = selectedVariant?.id === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`border text-left rounded-2xl p-4 transition-all focus:outline-none relative ${
                  isSelected
                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-md'
                    : 'hover:border-neutral-400 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white'
                }`}
              >
                <div className="font-semibold text-sm">{variantLabel(v)}</div>
                <div
                  className={`text-xs mt-1 ${
                    isSelected
                      ? 'text-neutral-300 dark:text-neutral-700'
                      : 'text-neutral-500'
                  }`}
                >
                  {formatCOP(v.price)}
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 absolute top-4 right-4" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Precio Activo */}
      <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-2xl flex items-baseline justify-between">
        <span className="text-xs font-medium text-neutral-500 uppercase">
          Precio Final
        </span>
        <span className="text-3xl font-bold tracking-tight">
          {selectedVariant ? formatCOP(selectedVariant.price) : '---'}
        </span>
      </div>

      {/* Call to Actions */}
      <div className="flex flex-col gap-3">
        {/* Input de Nombre para WhatsApp Rápido */}
        <input
          type="text"
          placeholder="Tu nombre (para compra directa)..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-2xl px-4 py-3.5 text-sm bg-white dark:bg-neutral-900 outline-none focus:border-black dark:focus:border-white transition"
          disabled={loading}
        />

        {/* Botón 1: Comprar directo por WhatsApp */}
        <button
          onClick={handleDirectWhatsapp}
          disabled={loading || !selectedVariant || selectedVariant.stock === 0}
          className="bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-2xl px-4 py-4 font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-green-500/20"
        >
          {loading ? 'Generando orden...' : 'Comprar Ahora por WhatsApp'}
        </button>

        {/* Botón 2: Agregar al Carrito */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock === 0}
          className="bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white rounded-2xl px-4 py-3.5 font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4 text-green-400" /> ¡Agregado a la Bolsa!
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Agregar a la Bolsa
            </>
          )}
        </button>
      </div>

      {/* Badges de Garantía */}
      <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-neutral-500 border-t">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-500" />
          <span>Despacho inmediato a todo el país</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>Garantía oficial Apple 12 meses</span>
        </div>
      </div>
    </div>
  );
}
