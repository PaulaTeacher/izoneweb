import Link from 'next/link';
import { ArrowLeft, Search, ShoppingBag } from 'lucide-react';

const QUICK_CATEGORIES = [
  { href: '/iphone', label: 'iPhone' },
  { href: '/mac', label: 'Mac' },
  { href: '/ipad', label: 'iPad' },
  { href: '/watch', label: 'Apple Watch' },
  { href: '/audio', label: 'AirPods y Audio' },
  { href: '/accesorios', label: 'Accesorios' },
  { href: '/trade-in', label: 'Plan Retoma' },
] as const;

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F5F5F7] dark:bg-black flex flex-col font-sans">
      <header className="border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#161617]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-[#1D1D1F] dark:text-white"
          >
            iZone Tech
          </Link>
          <Link
            href="/shop"
            className="text-xs font-medium text-[#0071E3] hover:underline"
          >
            Ir al catálogo
          </Link>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0071E3] mb-3">
          Error 404
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-white mb-4">
          Página no encontrada
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-md mb-8">
          No encontramos la página que buscas. Es posible que el enlace haya cambiado o que el producto ya no esté disponible.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Volver al inicio
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white px-6 py-3 text-sm font-semibold transition"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            Ver todo el catálogo
          </Link>
        </div>

        <div className="w-full pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4 flex items-center justify-center gap-1.5">
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            Explorar por categoría
          </p>
          <nav aria-label="Categorías principales" className="flex flex-wrap items-center justify-center gap-2">
            {QUICK_CATEGORIES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:border-[#0071E3] hover:text-[#0071E3] transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}
