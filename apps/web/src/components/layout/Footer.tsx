'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/site';
import { buildWaMeUrl } from '@/lib/whatsapp';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedEmail = email.trim();
    if (!cleanedEmail || !cleanedEmail.includes('@')) return;
    window.open(
      buildWaMeUrl(
        `Hola iZone Tech, quiero suscribirme al Newsletter de ofertas y lanzamientos Apple. Mi correo es: ${cleanedEmail}`,
      ),
      '_blank',
      'noopener,noreferrer',
    );
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#1D1D1F] text-white border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Banner Superior del Footer (Estilo iShop / Mac Center) */}
        <div className="bg-[#2D2D2F] rounded-3xl p-8 md:p-10 mb-16 border border-neutral-700/50 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-xs font-semibold text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Newsletter iZone Tech
            </div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Recibe ofertas exclusivas y lanzamientos Apple
            </h3>
            <p className="text-neutral-400 text-sm mt-2">
              Entérate primero de la disponibilidad de nuevos iPhones, promociones de temporada y descuentos en accesorios en Bogotá.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="Ingresa tu correo electrónico..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Correo electrónico"
                required
                className="w-full bg-[#1D1D1F] border border-neutral-700 text-white placeholder-neutral-400 text-sm px-4 py-3 rounded-full outline-none focus:border-[#0071E3] transition"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm px-6 py-3 rounded-full transition shrink-0 flex items-center justify-center gap-2 shadow-sm"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" /> ¡Suscrito!
                  </>
                ) : (
                  <>
                    Suscribirme <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-neutral-400 mt-2 text-center sm:text-left">
              Al suscribirte aceptas nuestras políticas de tratamiento de datos personales.
            </p>
          </form>
        </div>

        {/* Columnas de Navegación del Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-neutral-800 text-sm">
          {/* Columna 1: Categorías */}
          <div className="col-span-1">
            <h4 className="font-semibold text-xs tracking-wider text-neutral-400 uppercase mb-4">
              Comprar Apple
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li>
                <Link href="/iphone" className="hover:text-white transition">
                  iPhone 18 Pro & Max
                </Link>
              </li>
              <li>
                <Link href="/iphone" className="hover:text-white transition">
                  iPhone Duo y iPhone 17
                </Link>
              </li>
              <li>
                <Link href="/mac" className="hover:text-white transition">
                  MacBook Air M5 y MacBook Neo
                </Link>
              </li>
              <li>
                <Link href="/ipad" className="hover:text-white transition">
                  iPad y Magic Keyboard
                </Link>
              </li>
              <li>
                <Link href="/watch" className="hover:text-white transition">
                  Apple Watch Series 11 y SE 3
                </Link>
              </li>
              <li>
                <Link href="/audio" className="hover:text-white transition">
                  AirPods 4, 5 y Pro 3
                </Link>
              </li>
              <li>
                <Link href="/accesorios" className="hover:text-white transition">
                  Cargadores, cables y Apple Pencil
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 2: Servicio y Asistencia */}
          <div className="col-span-1">
            <h4 className="font-semibold text-xs tracking-wider text-neutral-400 uppercase mb-4">
              Atención al Cliente
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li>
                <a
                  href={buildWaMeUrl('Hola iZone Tech, necesito soporte con una compra')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Soporte por WhatsApp
                </a>
              </li>
              <li>
                <Link href="/politicas#garantia" className="hover:text-white transition">
                  Políticas de Garantía (1 Año)
                </Link>
              </li>
              <li>
                <Link href="/politicas#envios" className="hover:text-white transition">
                  Rastreo y Tiempos de Envío
                </Link>
              </li>
              <li>
                <Link href="/politicas#medios-pago" className="hover:text-white transition">
                  Medios de Pago
                </Link>
              </li>
              <li>
                <Link href="/politicas#faq" className="hover:text-white transition">
                  Preguntas Frecuentes (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Políticas y Legal */}
          <div id="politicas" className="col-span-1 scroll-mt-28">
            <h4 className="font-semibold text-xs tracking-wider text-neutral-400 uppercase mb-4">
              Términos & Políticas
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li>
                <Link href="/politicas#terminos" className="hover:text-white transition">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/politicas#privacidad" className="hover:text-white transition">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/politicas#devoluciones" className="hover:text-white transition">
                  Cambios y Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/politicas#tratamiento-datos" className="hover:text-white transition">
                  Tratamiento de Datos Personales
                </Link>
              </li>
              <li>
                <Link href="/politicas#superintendencia" className="hover:text-white transition">
                  Superintendencia de Industria y Comercio (SIC)
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Sobre iZone Tech */}
          <div id="nosotros" className="col-span-1 scroll-mt-28">
            <h4 className="font-semibold text-xs tracking-wider text-neutral-400 uppercase mb-4">
              Sobre iZone Tech
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li>
                <Link href="/#nosotros" className="hover:text-white transition">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/#redes" className="hover:text-white transition">
                  Instagram & TikTok
                </Link>
              </li>
              <li>
                <Link href="/#tiendas" className="hover:text-white transition">
                  Puntos Físicos Bogotá
                </Link>
              </li>
              <li id="corporativo" className="scroll-mt-28">
                <Link href="/#contacto" className="hover:text-white transition">
                  Ventas Corporativas & B2B
                </Link>
              </li>
              <li id="trabaja-con-nosotros" className="scroll-mt-28">
                <Link href="/#contacto" className="hover:text-white transition">
                  Trabaja con Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 5: Contacto Directo y Ubicación */}
          <div id="contacto" className="col-span-2 md:col-span-4 lg:col-span-1 scroll-mt-28">
            <h4 className="font-semibold text-xs tracking-wider text-neutral-400 uppercase mb-4">
              Ubicación & Contacto
            </h4>
            <div className="space-y-3 text-neutral-400 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" />
                <span>CC Unilago, Local L 1-143, Bogotá D.C., Colombia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+57 323 264 8303</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#0071E3] shrink-0" />
                <span>izonetech.co@gmail.com</span>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-neutral-300 mb-3">Síguenos</p>
              <div className="flex items-center gap-3">
                <a
                  href={SOCIAL_LINKS.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram de iZone Tech (${SOCIAL_LINKS.instagram.handle})`}
                  className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#0071E3] text-white flex items-center justify-center transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href={SOCIAL_LINKS.tiktok.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`TikTok de iZone Tech (${SOCIAL_LINKS.tiktok.handle})`}
                  className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#0071E3] text-white flex items-center justify-center transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.33 6.33 0 0 0 3.16 15.3a6.33 6.33 0 0 0 6.33 6.33 6.33 6.33 0 0 0 6.33-6.33V8.73a8.18 8.18 0 0 0 4.77 1.52V6.84a4.85 4.85 0 0 1-1-.15z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Medios de Pago Aceptados (Logos / Texto oficial) */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-neutral-800 text-xs text-neutral-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-neutral-300">Medios de Pago Seguros:</span>
            <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 font-medium">PSE</span>
            <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 font-medium">Visa</span>
            <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 font-medium">Mastercard</span>
            <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 font-medium">Bancolombia</span>
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 font-semibold">Contraentrega Bogotá</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Transacciones 100% encriptadas con SSL 256-bit</span>
          </div>
        </div>

        {/* Copyright Legal Mac Center Benchmark */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} iZone Tech Colombia S.A.S. NIT: 901.458.789-2. Todos los derechos reservados.</p>
          <p className="text-[11px] text-neutral-400 max-w-xl text-center md:text-right">
            Apple, el logotipo de Apple, iPhone, iPad, Mac, Apple Watch y AirPods son marcas registradas de Apple Inc., registradas en EE. UU. y otros países. iZone Tech es un distribuidor y comercializador de tecnología en Colombia.
          </p>
        </div>
      </div>
    </footer>
  );
}
