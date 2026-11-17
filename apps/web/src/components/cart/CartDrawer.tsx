'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { checkoutWhatsapp, validateCoupon } from '@/lib/api';
import { formatCOP } from '@izone/shared-types';
import { X, Trash2, Plus, Minus, Tag, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { easeOut } from '@/components/motion/FadeIn';
import { SmartImage } from '@/components/ui/SmartImage';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) || []).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
      );

    requestAnimationFrame(() => {
      const list = focusables();
      (list[0] || panel)?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCart();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, closeCart]);


  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    const result = await validateCoupon(couponCode.trim(), subtotal);
    if (result) {
      setDiscountAmount(result.discountAmount);
      setAppliedCoupon(result.code);
    } else {
      setCouponError('Cupón inválido o vencido');
      setDiscountAmount(0);
      setAppliedCoupon(null);
    }
  };

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      alert('Por favor ingresa tu nombre para el pedido');
      return;
    }

    setLoading(true);
    try {
      const res = await checkoutWhatsapp({
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity, hasProtection: i.hasProtection })),
        customerName: customerName.trim(),
        couponCode: appliedCoupon || undefined,
        shipping: city ? { name: customerName, city } : undefined,
      });

      if (res.url) {
        window.open(res.url, '_blank');
        clearCart();
        closeCart();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con WhatsApp';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);
  const reduce = useReducedMotion();
  const duration = reduce ? 0 : 0.22;

  return (
    <AnimatePresence>
      {isOpen && (
    <motion.div
      key="cart-drawer"
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, ease: easeOut }}
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration, ease: easeOut }}
      />

      {/* Drawer */}
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-md bg-white dark:bg-neutral-950 h-full shadow-2xl flex flex-col z-10 outline-none"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration, ease: easeOut }}
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 id="cart-drawer-title" className="text-xl font-bold tracking-tight">Tu Bolsa</h2>
            <span className="bg-neutral-100 dark:bg-neutral-800 text-xs px-2.5 py-1 rounded-full font-medium">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar bolsa"
            className="p-2 text-neutral-400 hover:text-black dark:hover:text-white transition rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 text-neutral-400">
              <p className="text-lg font-medium mb-2">Tu bolsa está vacía</p>
              <p className="text-sm text-neutral-500 mb-6">
                Descubre los últimos dispositivos Apple disponibles.
              </p>
              <button
                onClick={closeCart}
                className="bg-black text-white dark:bg-white dark:text-black px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition"
              >
                Explorar catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variantId}
                className="flex gap-4 p-4 border rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50 items-center"
              >
                {item.imageUrl ? (
                  <div className="relative w-16 h-16 rounded-xl border overflow-hidden flex-shrink-0 bg-white">
                    <SmartImage
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-xs text-neutral-500">
                    Apple
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.productSlug}`}
                    onClick={closeCart}
                    className="font-semibold text-sm hover:underline truncate block"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-xs text-neutral-500 mb-2 truncate">
                    {item.variantDetails}
                  </p>
                  {item.hasProtection && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0071E3] bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md mb-2">
                      <ShieldCheck className="w-3 h-3" /> Protección 12 Meses
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{formatCOP(item.price)}</span>
                    <div className="flex items-center border rounded-lg overflow-hidden bg-white dark:bg-neutral-950">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-neutral-400 hover:text-red-500 transition p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t bg-neutral-50/50 dark:bg-neutral-900/50 space-y-4">
            {/* Cupón */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Código de cupón (ej: WELCOME10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border bg-white dark:bg-neutral-950 outline-none uppercase font-mono"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="text-xs px-4 py-2.5 bg-neutral-200 dark:bg-neutral-800 font-semibold rounded-xl hover:bg-neutral-300 dark:hover:bg-neutral-700 transition"
                >
                  Aplicar
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-xs text-green-600 font-medium mt-1.5 flex items-center gap-1">
                  ✓ Cupón <strong>{appliedCoupon}</strong> aplicado con éxito.
                </p>
              )}
              {couponError && (
                <p className="text-xs text-red-500 font-medium mt-1.5">
                  {couponError}
                </p>
              )}
            </div>

            {/* Datos del Cliente */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Tu nombre completo *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border bg-white dark:bg-neutral-950 outline-none"
              />
              <input
                type="text"
                placeholder="Ciudad de entrega (Opcional)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border bg-white dark:bg-neutral-950 outline-none"
              />
            </div>

            {/* Resumen */}
            <div className="text-xs space-y-1.5 pt-2 text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {formatCOP(subtotal)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento aplicado</span>
                  <span className="font-semibold">-{formatCOP(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-neutral-900 dark:text-white pt-2 border-t">
                <span>Total Estimado</span>
                <span>{formatCOP(finalTotal)}</span>
              </div>
            </div>

            {/* Badges de Confianza */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400 py-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-500" /> Envío seguro nacional
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Garantía 1 año Apple
              </span>
            </div>

            {/* Botón WhatsApp */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-70"
            >
              {loading ? (
                'Creando pedido...'
              ) : (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  Completar Pedido por WhatsApp
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}
