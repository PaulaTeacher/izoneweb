import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';

export function PromoBanners() {
  return (
    <section className="py-12 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 rounded-3xl p-8 md:p-12 flex flex-col justify-between min-h-[350px] group">
            <div className="relative z-10 max-w-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 block">
                Trade-in iZone
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
                Tu equipo actual es dinero.
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-8 text-sm md:text-base">
                Entrégalo como parte de pago y llévate uno nuevo hoy mismo. Cotiza el valor de tu equipo en línea.
              </p>
              <Link
                href="/trade-in"
                className="inline-flex items-center gap-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black px-6 py-3 rounded-full hover:scale-105 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
              >
                Conocer más <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="absolute right-0 bottom-0 w-2/3 h-2/3 md:w-1/2 md:h-full translate-x-10 translate-y-10 group-hover:scale-105 transition-transform duration-700 pointer-events-none">
              <SmartImage
                src="/images/banners/promo-trade-in.webp"
                alt=""
                fill
                sizes="(max-width: 768px) 70vw, 25vw"
                className="object-cover rounded-tl-3xl shadow-2xl opacity-25 md:opacity-90 dark:opacity-25 md:dark:opacity-70"
              />
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-sky-950/40 rounded-3xl p-8 md:p-12 flex flex-col justify-between min-h-[350px] group">
            <div className="relative z-10 max-w-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 block">
                Compra protegida
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
                Garantía oficial. Envío seguro.
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 mb-8 text-sm md:text-base">
                Equipos Apple nuevos con 1 año de garantía internacional Apple. Paga con tarjeta en nuestra tienda física (CC Unilago) o coordina tu medio de pago con un asesor.
              </p>
              <Link
                href="/#garantia"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-white bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-700 px-6 py-3 rounded-full hover:scale-105 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
              >
                Ver políticas de garantía <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="absolute right-0 bottom-0 w-2/3 h-2/3 md:w-1/2 md:h-full translate-x-10 translate-y-10 group-hover:scale-105 transition-transform duration-700 pointer-events-none">
              <SmartImage
                src="/images/banners/promo-garantia.webp"
                alt=""
                fill
                sizes="(max-width: 768px) 70vw, 25vw"
                className="object-cover rounded-tl-3xl shadow-2xl opacity-25 md:opacity-90 dark:opacity-25 md:dark:opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
