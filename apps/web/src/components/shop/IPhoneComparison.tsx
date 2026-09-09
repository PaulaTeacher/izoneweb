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
      size: '6.3″ o 6.9″',
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
    battery: 'Hasta 33 horas de reproducción de video',
    usb: 'USB-C compatible con USB 3 (transferencias hasta 20x más veloces)',
    security: 'Face ID, Detección de Choques y Emergencia SOS',
  },
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    tagline: 'Potencia total con Control de la Cámara y chip A18.',
    price: 4399000,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=500&hei=500&fmt=png-alpha',
    slug: 'iphone-16',
    colors: [
      { name: 'Ultramar', class: 'bg-[#3752A6] border-[#29418E]' },
      { name: 'Verde Azulado', class: 'bg-[#83A6A3] border-[#668B88]' },
      { name: 'Rosa', class: 'bg-[#E3A8B8] border-[#CC92A2]' },
      { name: 'Blanco', class: 'bg-[#F2F2F2] border-[#D9D9D9]' },
      { name: 'Negro', class: 'bg-[#1D1D1F] border-[#333336]' },
    ],
    display: {
      size: '6.1″ o 6.7″',
      description: 'Super Retina XDR con Dynamic Island',
      proMotion: false,
      alwaysOn: false,
    },
    material: 'Aluminio de calidad aeroespacial con vidrio trasero con infusión de color',
    appleIntelligence: true,
    chip: {
      name: 'Chip A18',
      details: 'CPU de 6 núcleos, GPU de 5 núcleos y Neural Engine de 16 núcleos',
    },
    camera: {
      system: 'Sistema de dos cámaras avanzadas de 48 MP (Fusion 48 MP y Ultra gran angular)',
      zoom: 'Zoom óptico de hasta 2x',
      cameraControl: true,
      actionButton: true,
    },
    battery: 'Hasta 27 horas de reproducción de video',
    usb: 'USB-C compatible con USB 2',
    security: 'Face ID, Detección de Choques y Emergencia SOS',
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    tagline: 'Dynamic Island, cámara de 48 MP y conector USB-C.',
    price: 3699000,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=500&hei=500&fmt=png-alpha',
    slug: 'iphone-15',
    colors: [
      { name: 'Azul', class: 'bg-[#5C7E99] border-[#446580]' },
      { name: 'Rosa', class: 'bg-[#E3A8B8] border-[#CC92A2]' },
      { name: 'Verde', class: 'bg-[#83A6A3] border-[#668B88]' },
      { name: 'Amarillo', class: 'bg-[#E8D49E] border-[#C7B580]' },
      { name: 'Negro', class: 'bg-[#1D1D1F] border-[#333336]' },
    ],
    display: {
      size: '6.1″ o 6.7″',
      description: 'Super Retina XDR con Dynamic Island',
      proMotion: false,
      alwaysOn: false,
    },
    material: 'Aluminio con parte posterior de vidrio con infusión de color',
    appleIntelligence: false,
    chip: {
      name: 'Chip A16 Bionic',
      details: 'CPU de 6 núcleos, GPU de 5 núcleos y Neural Engine de 16 núcleos',
    },
    camera: {
      system: 'Sistema de dos cámaras avanzadas (Cámara principal de 48 MP y Ultra gran angular)',
      zoom: 'Zoom óptico de hasta 2x',
      cameraControl: false,
      actionButton: false,
    },
    battery: 'Hasta 26 horas de reproducción de video',
    usb: 'USB-C compatible con USB 2',
    security: 'Face ID, Detección de Choques y Emergencia SOS',
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    tagline: 'Gran rendimiento y duración de batería para el día a día.',
    price: 2999000,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=500&hei=500&fmt=png-alpha',
    slug: 'iphone-14',
    colors: [
      { name: 'Medianoche', class: 'bg-[#1D1D1F] border-[#333336]' },
      { name: 'Blanco Estelar', class: 'bg-[#F2F2F2] border-[#D9D9D9]' },
      { name: 'Azul', class: 'bg-[#5C7E99] border-[#446580]' },
      { name: 'Morado', class: 'bg-[#C1B7D1] border-[#9F93B5]' },
    ],
    display: {
      size: '6.1″ o 6.7″',
      description: 'Super Retina XDR OLED',
      proMotion: false,
      alwaysOn: false,
    },
    material: 'Aluminio aeroespacial con Ceramic Shield frontal',
    appleIntelligence: false,
    chip: {
      name: 'Chip A15 Bionic',
      details: 'CPU de 6 núcleos y GPU de 5 núcleos',
    },
    camera: {
      system: 'Sistema de dos cámaras de 12 MP con Modo Cine en 4K',
      zoom: 'Zoom óptico de 2x',
      cameraControl: false,
      actionButton: false,
    },
    battery: 'Hasta 20 horas de reproducción de video',
    usb: 'Conector Lightning',
    security: 'Face ID y Detección de Choques',
  },
];

export function IPhoneComparison() {
  const { addItem } = useCart();
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    'iphone-16-pro',
    'iphone-16',
    'iphone-15',
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
                <div className="w-full h-48 flex items-center justify-center mb-6">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-300"
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
