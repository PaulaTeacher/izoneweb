'use client';
import { useState } from 'react';
import { checkoutWhatsapp } from '@/lib/api';
import { ShoppingBag } from 'lucide-react';
import { formatCOP, variantLabel } from '@izone/shared-types';
import type { Product, Variant } from '@izone/shared-types';

export default function VariantSelector({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(product.variants[0]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const handleCheckout = async () => {
    if (!name.trim()) return alert('Por favor, ingresa tu nombre');
    if (!selectedVariant) return alert('Por favor, selecciona una variante');
    setLoading(true);
    try {
      const res = await checkoutWhatsapp([{ variantId: selectedVariant.id, quantity: 1 }], name);
      if (res.url) window.open(res.url, '_blank');
    } catch {
      alert('Error al generar enlace de pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-8">
      <div>
        <h3 className="font-semibold mb-3 text-sm tracking-wide text-neutral-500 uppercase">
          Color y Almacenamiento
        </h3>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v: Variant) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              className={`border rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                selectedVariant?.id === v.id
                  ? 'border-black bg-black text-white'
                  : 'hover:border-neutral-400 bg-white text-neutral-900'
              }`}
            >
              {variantLabel(v)}
            </button>
          ))}
        </div>
      </div>

      <div className="text-3xl font-bold">
        {selectedVariant ? formatCOP(selectedVariant.price) : 'Selecciona una variante'}
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <input
          type="text"
          placeholder="Nombre del cliente..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
          disabled={loading}
        />
        <button
          onClick={handleCheckout}
          disabled={loading || !selectedVariant}
          className="bg-green-600 text-white rounded-xl px-4 py-4 font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
        >
          {loading ? 'Preparando...' : 'Comprar por WhatsApp'}
        </button>
        <button
          disabled={loading || !selectedVariant}
          className="bg-white text-black border border-black rounded-xl px-4 py-4 font-semibold hover:bg-neutral-50 transition flex items-center justify-center gap-2 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <ShoppingBag className="w-5 h-5" />
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}
