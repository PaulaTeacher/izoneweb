import Link from 'next/link';
import { getProducts } from '@/lib/api';
import { formatCOP } from '@izone/shared-types';
import type { Product } from '@izone/shared-types';
import { ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';

export default async function Home() {
  const products = await getProducts();
  const heroProduct = products.find((p) => p.slug === 'iphone-16-pro') || products[0];

  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Hero Banner Estilo Apple */}
      <section className="relative overflow-hidden bg-black text-white pt-24 pb-32 px-4 text-center">
        <div className="container mx-auto max-w-4xl relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-xs font-semibold text-neutral-300 mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Nuevo lanzamiento
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            iPhone 16 Pro
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 mb-8 max-w-2xl font-light">
            Diseñado en titanio aeroespacial con el chip A18 Pro más rápido hasta la fecha.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link
              href={`/product/${heroProduct?.slug || 'iphone-16-pro'}`}
              className="bg-white text-black hover:bg-neutral-200 px-8 py-3.5 rounded-full font-medium transition shadow-lg flex items-center gap-2 text-sm"
            >
              Comprar ahora <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-sm text-neutral-400">
              Desde {heroProduct?.variants?.[0] ? formatCOP(heroProduct.variants[0].price) : '$ 5.499.000'}
            </span>
          </div>

          {/* Hero Image Mockup */}
          <div className="w-full max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
            <img
              src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop"
              alt="iPhone 16 Pro iZone Tech"
              className="w-full h-80 object-cover object-center"
            />
          </div>
        </div>

        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />
      </section>

      {/* Value Proposition Bar */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white dark:bg-neutral-900 border rounded-3xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <p className="text-sm font-semibold">Garantía Oficial 1 Año</p>
              <p className="text-xs text-neutral-500">Equipos 100% nuevos y sellados</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Truck className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <p className="text-sm font-semibold">Envío Seguro Nacional</p>
              <p className="text-xs text-neutral-500">Entrega rápida en Bogotá y Colombia</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <div className="text-left">
              <p className="text-sm font-semibold">Compra Directa por WhatsApp</p>
              <p className="text-xs text-neutral-500">Asesoría personalizada instantánea</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid de Catálogo */}
      <section className="container mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Catálogo Disponible</h2>
            <p className="text-sm text-neutral-500">Equipos en inventario listos para entrega</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p: Product, i: number) => {
            const minPrice = p.variants?.[0]?.price ? formatCOP(p.variants[0].price) : '';
            const isLarge = i === 0;

            return (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className={`group relative bg-white dark:bg-neutral-900 rounded-3xl p-8 border hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between ${
                  isLarge ? 'md:col-span-2 min-h-[380px]' : 'min-h-[320px]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      {p.category?.name || 'Apple'}
                    </span>
                    {p.tags?.[0] && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                        {p.tags[0].name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition">
                    {p.name}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2 max-w-md">
                    {p.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <div>
                    <span className="text-xs text-neutral-400 block">Precio</span>
                    <span className="text-lg font-bold text-neutral-900 dark:text-white">
                      Desde {minPrice}
                    </span>
                  </div>
                  <span className="text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black px-4 py-2 rounded-full transition">
                    Ver opciones
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
