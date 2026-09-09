import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function PromoBanners() {
  return (
    <section className="py-12 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner de Retoma */}
          <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 rounded-3xl p-8 md:p-12 flex flex-col justify-between min-h-[350px] group">
            <div className="relative z-10 max-w-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 block">
                Trade-in iZone
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
                Tu equipo actual es dinero.
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-sm md:text-base">
                Entrégalo como parte de pago y llévate uno nuevo hoy mismo. Cotiza el valor de tu equipo en línea.
              </p>
              <Link 
                href="/trade-in" 
                className="inline-flex items-center gap-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black px-6 py-3 rounded-full hover:scale-105 transition-transform"
              >
                Conocer más <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Imagen ilustrativa (Placeholder por ahora) */}
            <div className="absolute right-0 bottom-0 w-2/3 h-2/3 md:w-1/2 md:h-full translate-x-10 translate-y-10 group-hover:scale-105 transition-transform duration-700 pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop" 
                alt="Trade-in iPhones" 
                className="w-full h-full object-cover rounded-tl-3xl shadow-2xl opacity-90 dark:opacity-70"
              />
            </div>
          </div>

          {/* Banner de Financiación */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 rounded-3xl p-8 md:p-12 flex flex-col justify-between min-h-[350px] group">
            <div className="relative z-10 max-w-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2 block">
                Financiación
              </span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
                Paga a cuotas. Cero estrés.
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-sm md:text-base">
                Lleva tu tecnología favorita hoy con 0% de interés pagando con tarjetas seleccionadas o crédito Addi.
              </p>
              <Link 
                href="/financiacion" 
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-900 bg-white shadow-sm border border-neutral-200 px-6 py-3 rounded-full hover:scale-105 transition-transform"
              >
                Ver opciones de pago <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Imagen ilustrativa */}
            <div className="absolute right-0 bottom-0 w-2/3 h-2/3 md:w-1/2 md:h-full translate-x-10 translate-y-10 group-hover:scale-105 transition-transform duration-700 pointer-events-none">
               <img 
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop" 
                alt="Financiación" 
                className="w-full h-full object-cover rounded-tl-3xl shadow-2xl opacity-90 dark:opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
