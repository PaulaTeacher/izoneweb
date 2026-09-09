'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Sparkles, Box, ShieldCheck, Check } from 'lucide-react';
import type { Product } from '@izone/shared-types';

interface ProductSpecsAccordionProps {
  product: Product;
}

export function ProductSpecsAccordion({ product }: ProductSpecsAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>('caracteristicas');

  const toggle = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const isMac = product.name.toLowerCase().includes('mac');
  const isWatch = product.name.toLowerCase().includes('watch');
  const isAudio = product.name.toLowerCase().includes('airpod');

  const defaultSpecs = [
    { label: 'Chip', value: isMac ? 'Chip M4 / M5 de Apple con arquitectura de 3nm' : 'Chip A18 / A19 Pro con Neural Engine de 16 núcleos' },
    { label: 'Pantalla', value: isMac ? 'Liquid Retina con True Tone y 500 nits de brillo' : 'Super Retina XDR OLED con ProMotion 120Hz y Always-On' },
    { label: 'Batería', value: isMac ? 'Hasta 18 horas de reproducción continua' : 'Hasta 29 horas de reproducción de video y carga rápida' },
    { label: 'Conectividad', value: 'Wi-Fi 7, 5G ultrarrápido, Bluetooth 5.3 y conector USB-C' },
    { label: 'Sistema Operativo', value: 'Compatible con Apple Intelligence de forma nativa' },
    { label: 'Materiales', value: 'Diseño en titanio de grado aeroespacial / aluminio 100% reciclado' },
  ];

  const inTheBox = isMac
    ? ['MacBook', 'Adaptador de corriente USB-C oficial', 'Cable de carga USB-C trenzado de 2 m', 'Documentación oficial Apple']
    : isWatch
    ? ['Apple Watch', 'Correa deportiva oficial', 'Cable de carga rápida magnética USB-C de 1 m', 'Documentación oficial Apple']
    : isAudio
    ? ['AirPods', 'Estuche de carga MagSafe (USB-C) con altavoz', 'Almohadillas de silicón (cuatro tamaños: XS, S, M, L)', 'Cable de carga USB-C trenzado', 'Documentación']
    : ['iPhone con iOS', 'Cable de carga USB-C trenzado oficial de 1 m', 'Documentación y pin de extracción SIM'];

  return (
    <div className="w-full mt-12 border-t border-neutral-200 dark:border-neutral-800 pt-8">
      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
        Información del producto
      </h3>

      <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
        {/* 1. Características */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle('caracteristicas')}
            className="w-full flex items-center justify-between text-left py-2 font-bold text-base md:text-lg text-neutral-900 dark:text-white group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#0071E3]" />
              <span>Características destacadas</span>
            </div>
            {openSection === 'caracteristicas' ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </button>

          {openSection === 'caracteristicas' && (
            <div className="pt-3 pb-4 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed space-y-3">
              <p>
                <strong>{product.name}</strong> ha sido diseñado para ofrecer el máximo equilibrio entre potencia, eficiencia y sofisticación estética.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
                  <h5 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider mb-1">
                     Apple Intelligence
                  </h5>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Integración nativa del sistema de inteligencia personal de Apple. Redacta, resume y procesa información visual manteniendo tu privacidad protegida.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
                  <h5 className="font-bold text-neutral-900 dark:text-white text-xs uppercase tracking-wider mb-1">
                    Autonomía y Desempeño Pro
                  </h5>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Optimización energética de última generación que garantiza rendimiento continuo para tus jornadas más exigentes sin comprometer la batería.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Especificaciones Técnicas */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle('specs')}
            className="w-full flex items-center justify-between text-left py-2 font-bold text-base md:text-lg text-neutral-900 dark:text-white group"
          >
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-[#0071E3]" />
              <span>Especificaciones técnicas</span>
            </div>
            {openSection === 'specs' ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </button>

          {openSection === 'specs' && (
            <div className="pt-3 pb-4">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {defaultSpecs.map((spec, i) => (
                  <div key={i} className="border-b border-neutral-100 dark:border-neutral-800/80 pb-2">
                    <dt className="text-xs font-semibold text-neutral-400 uppercase">{spec.label}</dt>
                    <dd className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* 3. Contenido de la Caja */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle('caja')}
            className="w-full flex items-center justify-between text-left py-2 font-bold text-base md:text-lg text-neutral-900 dark:text-white group"
          >
            <div className="flex items-center gap-2.5">
              <Box className="w-5 h-5 text-[#0071E3]" />
              <span>En la caja</span>
            </div>
            {openSection === 'caja' ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </button>

          {openSection === 'caja' && (
            <div className="pt-3 pb-4">
              <ul className="space-y-2">
                {inTheBox.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 4. Garantía Oficial y Políticas */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle('garantia')}
            className="w-full flex items-center justify-between text-left py-2 font-bold text-base md:text-lg text-neutral-900 dark:text-white group"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#0071E3]" />
              <span>Garantía y respaldo</span>
            </div>
            {openSection === 'garantia' ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </button>

          {openSection === 'garantia' && (
            <div className="pt-3 pb-4 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-2">
              <p>
                <strong>Garantía Oficial de 1 Año:</strong> Cobertura directa en cualquier centro de servicio autorizado Apple a nivel nacional e internacional.
              </p>
              <p>
                <strong>Derecho de Retracto:</strong> Tienes 14 días calendario para cambios o devoluciones directas conservando el empaque original sin alteraciones.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
