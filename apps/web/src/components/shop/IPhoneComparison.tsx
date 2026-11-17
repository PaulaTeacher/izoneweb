'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCOP } from '@izone/shared-types';
import { useCart } from '@/lib/cart-context';
import {
  Cpu,
  Camera,
  BatteryCharging,
  Sparkles,
  Smartphone,
  ShieldAlert,
  Cable,
  Check,
  ChevronDown
} from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';

interface CompareModel {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  slug: string;
  colors: { name: string; class: string }[];
  display: {
    size: string;
    description: string;
    proMotion: boolean;
    alwaysOn: boolean;
  };
  material: string;
  appleIntelligence: boolean;
  chip: {
    name: string;
    details: string;
  };
  camera: {
    system: string;
    zoom: string;
    cameraControl: boolean;
    actionButton: boolean;
  };
  battery: string;
  usb: string;
  security: string;
}

const COMPARISON_MODELS: CompareModel[] = [
  {
    id: 'iphone-17-pro',
    name: 'iPhone 17 Pro',
    tagline: 'El diseño Pro más vanguardista con potencia de nueva generación.',
    price: 5749000,
    image: 'https://co.tiendasishop.com/cdn/shop/files/AMZ_Family-Stripe_iPhone_17_pro_max.avif?v=1757555392&width=180',
    slug: 'iphone-17-pro',
    colors: [
      { name: 'Titanio Natural', class: 'bg-[#8F8A81] border-[#7A756D]' },
      { name: 'Titanio del Desierto', class: 'bg-[#C5B39B] border-[#A89680]' },
      { name: 'Titanio Blanco', class: 'bg-[#F2F2F2] border-[#D9D9D9]' },
      { name: 'Titanio Negro', class: 'bg-[#1D1D1F] border-[#333336]' },
    ],
    display: {
      size: '6.3″ o 6.9″',
      description: 'Super Retina XDR con ProMotion de hasta 120 Hz',
      proMotion: true,
      alwaysOn: true,
    },
    material: 'Titanio forjado aeroespacial con Ceramic Shield de máxima resistencia',
    appleIntelligence: true,
    chip: {
      name: 'Chip A19 Pro',
      details: 'CPU de 6 núcleos ultrarrápida, GPU Pro y Neural Engine avanzado',
    },
    camera: {
      system: 'Sistema Pro de 48 MP (Fusion, Ultra gran angular de 48 MP y Teleobjetivo 5x)',
      zoom: 'Zoom óptico de hasta 5x',
      cameraControl: true,
      actionButton: true,
    },
    battery: 'Hasta 33 horas de reproducción de video',
    usb: 'USB-C compatible con USB 3 de alta velocidad',
    security: 'Face ID, Detección de Choques y Emergencia SOS',
  },
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    tagline: 'Pantalla inmersiva de 6.9″ y la mayor autonomía en un iPhone.',
    price: 5899000,
    image: 'https://co.tiendasishop.com/cdn/shop/files/iphone16_family_stripe.png?v=1725934994&width=180',
    slug: 'iphone-16-pro-max',
    colors: [
      { name: 'Titanio del Desierto', class: 'bg-[#C5B39B] border-[#A89680]' },
      { name: 'Titanio Natural', class: 'bg-[#8F8A81] border-[#7A756D]' },
      { name: 'Titanio Blanco', class: 'bg-[#F2F2F2] border-[#D9D9D9]' },
      { name: 'Titanio Negro', class: 'bg-[#1D1D1F] border-[#333336]' },
    ],
    display: {
      size: '6.9″',
      description: 'Super Retina XDR con tecnología ProMotion y pantalla siempre activa',
      proMotion: true,
      alwaysOn: true,
    },
    material: 'Titanio de grado aeroespacial con Ceramic Shield de última generación',
    appleIntelligence: true,
    chip: {
      name: 'Chip A18 Pro',
      details: 'CPU de 6 núcleos, GPU de 6 núcleos y Neural Engine de 16 núcleos',
    },
    camera: {
      system: 'Sistema Pro de 48 MP con Control de la Cámara y teleobjetivo de 5x',
      zoom: 'Zoom óptico de hasta 5x',
      cameraControl: true,
      actionButton: true,
    },
    battery: 'Hasta 33 horas de reproducción de video',
    usb: 'USB-C compatible con USB 3 (transferencias hasta 20x más veloces)',
    security: 'Face ID, Detección de Choques y Emergencia SOS',
  },
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    tagline: 'El iPhone definitivo para creadores y profesionales.',
    price: 5499000,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-desert-titanium-select-202409?wid=500&hei=500&fmt=png-alpha',
    slug: 'iphone-16-pro',
    colors: [
      { name: 'Titanio del Desierto', class: 'bg-[#C5B39B] border-[#A89680]' },
      { name: 'Titanio Natural', class: 'bg-[#8F8A81] border-[#7A756D]' },
      { name: 'Titanio Blanco', class: 'bg-[#F2F2F2] border-[#D9D9D9]' },
      { name: 'Titanio Negro', class: 'bg-[#1D1D1F] border-[#333336]' },
    ],
    display: {
      size: '6.3″',
      description: 'Super Retina XDR con tecnología ProMotion',
      proMotion: true,
      alwaysOn: true,
    },
    material: 'Titanio de grado aeroespacial con Ceramic Shield de última generación',
    appleIntelligence: true,
    chip: {
      name: 'Chip A18 Pro',
      details: 'CPU de 6 núcleos, GPU de 6 núcleos y Neural Engine de 16 núcleos',
    },
    camera: {
      system: 'Sistema Pro de 48 MP (Fusion, Ultra gran angular de 48 MP y Teleobjetivo)',
      zoom: 'Zoom óptico de hasta 5x',
      cameraControl: true,
      actionButton: true,
    },
    battery: 'Hasta 27 horas de reproducción de video',
    usb: 'USB-C compatible con USB 3 (transferencias hasta 20x más veloces)',
    security: 'Face ID, Detección de Choques y Emergencia SOS',
  },
];

export function IPhoneComparison() {
  const { addItem } = useCart();
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    'iphone-17-pro',
    'iphone-16-pro-max',
    'iphone-16-pro',
  ]);
  const [addedModelId, setAddedModelId] = useState<string | null>(null);

  const selectedModels = selectedModelIds.map(
    (id) => COMPARISON_MODELS.find((m) => m.id === id) || COMPARISON_MODELS[0]
  );

  const handleModelChange = (slotIndex: number, newModelId: string) => {
    setSelectedModelIds((prev) => {
      const next = [...prev];
      next[slotIndex] = newModelId;
      return next;
    });
  };

  const handleQuickAdd = (model: CompareModel) => {
    const mockProduct = {
      id: model.id,
      name: model.name,
      slug: model.slug,
    } as unknown as import('@izone/shared-types').Product;
    const mockVariant = {
      id: `${model.id}-default`,
      price: model.price,
      featuredImage: model.image,
      color: model.colors[0]?.name || 'Estándar',
    } as unknown as import('@izone/shared-types').Variant;

    addItem(mockProduct, mockVariant, 1);
    setAddedModelId(model.id);
    setTimeout(() => setAddedModelId(null), 1800);
  };

  return (
    <section id="comparador" className="py-24 bg-white dark:bg-[#0A0A0A] border-t border-black/5 dark:border-white/5 scroll-mt-16">
      <div className="max-w-[1180px] mx-auto px-4">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0071E3] block mb-2">
            Comparador Oficial
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight mb-4">
            Compara los modelos de iPhone.
          </h2>
          <p className="text-base md:text-lg text-neutral-500 font-normal">
            Descubre las diferencias clave en pantalla, cámaras, chip y batería para elegir el iPhone perfecto para tus necesidades.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="overflow-x-auto pb-6">
          <div className="min-w-[780px] grid grid-cols-3 gap-6 md:gap-8">
            {selectedModels.map((model, idx) => (
              <div key={`${model.id}-${idx}`} className="flex flex-col">
                {/* Selector Dropdown */}
                <div className="relative mb-6">
                  <label className="text-[11px] text-neutral-400 block mb-1 font-medium">
                    Modelo {idx + 1}
                  </label>
                  <div className="relative">
                    <select
                      value={model.id}
                      onChange={(e) => handleModelChange(idx, e.target.value)}
                      className="w-full appearance-none bg-[#F5F5F7] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[#1D1D1F] dark:text-white text-sm font-bold py-2.5 pl-3 pr-8 rounded-xl outline-none focus:ring-2 focus:ring-[#0071E3] cursor-pointer"
                    >
                      {COMPARISON_MODELS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Device Image */}
                <div className="relative w-full h-48 mb-6">
                  <SmartImage
                    src={model.image}
                    alt={model.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 220px"
                    className="object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Color Dots */}
                <div className="flex items-center justify-center gap-1.5 mb-3 min-h-[20px]">
                  {model.colors.map((c) => (
                    <span
                      key={c.name}
                      title={c.name}
                      className={`w-3.5 h-3.5 rounded-full border ${c.class}`}
                    />
                  ))}
                </div>

                {/* Title & Price */}
                <div className="text-center pb-6 border-b border-black/5 dark:border-white/10 mb-6 flex-grow-0">
                  <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white mb-1">
                    {model.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 min-h-[32px] mb-3">
                    {model.tagline}
                  </p>
                  <p className="text-lg font-black text-[#1D1D1F] dark:text-white mb-4">
                    Desde {formatCOP(model.price)}
                  </p>

                  <div className="flex flex-col gap-2 px-2">
                    <button
                      onClick={() => handleQuickAdd(model)}
                      className={`w-full py-2 px-4 rounded-full text-xs font-semibold transition-all ${
                        addedModelId === model.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#0071E3] hover:bg-[#0077ED] text-white'
                      }`}
                    >
                      {addedModelId === model.id ? (
                        <span className="flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5" /> ¡Agregado!
                        </span>
                      ) : (
                        'Añadir a la bolsa'
                      )}
                    </button>
                    <Link
                      href={`/product/${model.slug}`}
                      className="text-xs text-[#0071E3] hover:underline font-medium"
                    >
                      Ver especificaciones →
                    </Link>
                  </div>
                </div>

                {/* SPECIFICATION ROWS */}
                <div className="space-y-8 text-center text-xs">
                  {/* Apple Intelligence */}
                  <div className="pt-2">
                    <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-[2px] mb-2 flex items-center justify-center shadow-sm">
                      <div className="w-full h-full bg-white dark:bg-black rounded-[10px] flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-rose-500" />
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white block text-sm mb-1">
                      Apple Intelligence
                    </span>
                    <p className="text-neutral-500">
                      {model.appleIntelligence
                        ? 'Diseñado para Apple Intelligence con IA integrada'
                        : 'No compatible'}
                    </p>
                  </div>

                  {/* Pantalla */}
                  <div className="border-t border-black/5 dark:border-white/5 pt-6">
                    <Smartphone className="w-5 h-5 mx-auto text-neutral-400 mb-2" />
                    <span className="font-bold text-neutral-900 dark:text-white block text-sm mb-1">
                      Pantalla {model.display.size}
                    </span>
                    <p className="text-neutral-500 mb-1">
                      {model.display.description}
                    </p>
                    {model.display.proMotion && (
                      <span className="inline-block text-[10px] font-bold text-[#0071E3] bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full mt-1">
                        ProMotion hasta 120 Hz
                      </span>
                    )}
                  </div>

                  {/* Chip */}
                  <div className="border-t border-black/5 dark:border-white/5 pt-6">
                    <Cpu className="w-5 h-5 mx-auto text-neutral-400 mb-2" />
                    <span className="font-bold text-neutral-900 dark:text-white block text-sm mb-1">
                      {model.chip.name}
                    </span>
                    <p className="text-neutral-500">
                      {model.chip.details}
                    </p>
                  </div>

                  {/* Cámaras */}
                  <div className="border-t border-black/5 dark:border-white/5 pt-6">
                    <Camera className="w-5 h-5 mx-auto text-neutral-400 mb-2" />
                    <span className="font-bold text-neutral-900 dark:text-white block text-sm mb-1">
                      Cámaras
                    </span>
                    <p className="text-neutral-500 mb-1">
                      {model.camera.system}
                    </p>
                    <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                      {model.camera.zoom}
                    </p>
                    {model.camera.cameraControl && (
                      <span className="inline-block text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full mt-2">
                        Control de la Cámara táctil
                      </span>
                    )}
                  </div>

                  {/* Batería */}
                  <div className="border-t border-black/5 dark:border-white/5 pt-6">
                    <BatteryCharging className="w-5 h-5 mx-auto text-neutral-400 mb-2" />
                    <span className="font-bold text-neutral-900 dark:text-white block text-sm mb-1">
                      Batería
                    </span>
                    <p className="text-neutral-500">
                      {model.battery}
                    </p>
                  </div>

                  {/* Conector */}
                  <div className="border-t border-black/5 dark:border-white/5 pt-6">
                    <Cable className="w-5 h-5 mx-auto text-neutral-400 mb-2" />
                    <span className="font-bold text-neutral-900 dark:text-white block text-sm mb-1">
                      Conector
                    </span>
                    <p className="text-neutral-500">
                      {model.usb}
                    </p>
                  </div>

                  {/* Seguridad */}
                  <div className="border-t border-black/5 dark:border-white/5 pt-6">
                    <ShieldAlert className="w-5 h-5 mx-auto text-neutral-400 mb-2" />
                    <span className="font-bold text-neutral-900 dark:text-white block text-sm mb-1">
                      Seguridad y Emergencias
                    </span>
                    <p className="text-neutral-500">
                      {model.security}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
