import React from 'react';
import { ShieldCheck, Truck, CreditCard, Clock } from 'lucide-react';

export function TrustBanner() {
  return (
    <section className="bg-neutral-50 dark:bg-neutral-900 border-y py-8 relative z-20 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div id="garantia" className="flex flex-col items-center justify-center gap-3 scroll-mt-28">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">Garantía Oficial</p>
              <p className="text-xs text-neutral-500 mt-1">1 Año de protección</p>
            </div>
          </div>
          
          <div id="envios" className="flex flex-col items-center justify-center gap-3 scroll-mt-28">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">Envío Seguro</p>
              <p className="text-xs text-neutral-500 mt-1">A nivel nacional</p>
            </div>
          </div>

          <div id="medios-pago" className="flex flex-col items-center justify-center gap-3 scroll-mt-28">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">Múltiples Pagos</p>
              <p className="text-xs text-neutral-500 mt-1">Tarjetas, PSE y contraentrega</p>
            </div>
          </div>

          <div id="faq" className="flex flex-col items-center justify-center gap-3 scroll-mt-28">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">Soporte 24/7</p>
              <p className="text-xs text-neutral-500 mt-1">Asesoría personalizada</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
