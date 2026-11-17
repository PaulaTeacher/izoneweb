'use client';

import { useState, useEffect } from 'react';
import { Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { buildWaMeUrl } from '@/lib/whatsapp';

const announcements = [
  {
    id: 1,
    icon: Truck,
    text: 'Envíos gratis a todo el país por compras superiores a $200.000',
    badge: 'Envío Express',
    link: '/#envios',
  },
  {
    id: 2,
    icon: ShieldCheck,
    text: 'Garantía Oficial Apple de 1 año en todos nuestros equipos',
    badge: '100% Original',
    link: '/#garantia',
  },
];

export default function TopAnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[currentIndex];
  const Icon = current.icon;

  return (
    <aside aria-label="Anuncio promocional" className="bg-[#1D1D1F] text-white text-xs py-2 px-4 select-none relative z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Contacto / Ubicación Desktop */}
        <div className="hidden lg:flex items-center gap-4 text-neutral-400">
          <span className="flex items-center gap-1.5 hover:text-white transition">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Tienda Bogotá: CC Unilago L 1-143
          </span>
          <span className="text-neutral-600">|</span>
          <a
            href={buildWaMeUrl('Hola iZone Tech, deseo asesoría personalizada')}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition flex items-center gap-1 text-emerald-400 font-medium"
          >
            WhatsApp Asesoría Directa
          </a>
        </div>

        {/* Rotador central dinámico */}
        <div className="flex-1 flex items-center justify-center">
          <Link
            href={current.link}
            className="inline-flex items-center gap-2 group transition-opacity duration-300 hover:text-neutral-200"
          >
            <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 group-hover:bg-[#0071E3] group-hover:text-white transition">
              {current.badge}
            </span>
            <Icon className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
            <span className="font-medium tracking-tight text-center truncate max-w-[280px] sm:max-w-none">
              {current.text}
            </span>
            <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Selector de moneda y soporte rápido */}
        <div className="hidden md:flex items-center gap-3 text-neutral-400">
          <span className="font-semibold text-neutral-300">COP ($)</span>
          <span className="text-neutral-600">|</span>
          <Link href="/#faq" className="hover:text-white transition">
            Ayuda & FAQ
          </Link>
        </div>
      </div>
    </aside>
  );
}
