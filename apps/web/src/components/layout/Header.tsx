'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface CategoryItem {
  name: string;
  href: string;
  badge?: string;
  highlight?: boolean;
  subcategories?: { title: string; href: string; description?: string }[];
  featuredProduct?: {
    name: string;
    description: string;
    image: string;
    href: string;
    price: string;
  };
}

const categories: CategoryItem[] = [
  {
    name: 'Mac',
    href: '/#macbooks',
    subcategories: [
      { title: 'MacBook Air M3', href: '/#macbooks', description: 'Increíblemente delgada y rápida' },
      { title: 'MacBook Pro 14" y 16"', href: '/#macbooks', description: 'Potencia profesional extrema' },
      { title: 'iMac 24"', href: '/#macbooks', description: 'Todo en uno con pantalla 4.5K' },
      { title: 'Mac Studio & Mac mini', href: '/#macbooks', description: 'Rendimiento modular sin límites' },
    ],
    featuredProduct: {
      name: 'MacBook Air M3',
      description: 'Potencia sin límites en un diseño ultraligero.',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
      href: '/#macbooks',
      price: 'Desde $ 5.699.000',
    },
  },
  {
    name: 'iPhone',
    href: '/#smartphones',
    badge: 'Nuevo',
    subcategories: [
      { title: 'iPhone 16 Pro & Pro Max', href: '/product/iphone-16-pro', description: 'Titanio con chip A18 Pro' },
      { title: 'iPhone 16 & 16 Plus', href: '/#smartphones', description: 'Control de cámara y chip A18' },
      { title: 'iPhone 15 & 15 Plus', href: '/#smartphones', description: 'Dynamic Island y cámara de 48 MP' },
      { title: 'Comparar modelos', href: '/#smartphones', description: 'Encuentra el iPhone ideal para ti' },
    ],
    featuredProduct: {
      name: 'iPhone 16 Pro Max',
      description: 'El diseño definitivo en titanio y control de cámara profesional.',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
      href: '/product/iphone-16-pro',
      price: 'Desde $ 5.499.000',
    },
  },
  {
    name: 'iPad',
    href: '/#ipad',
    subcategories: [
      { title: 'iPad Pro M4', href: '/#ipad', description: 'Pantalla OLED Ultra Retina XDR' },
      { title: 'iPad Air M2', href: '/#ipad', description: 'Rendimiento versátil en 11" y 13"' },
      { title: 'iPad 10ma Gen', href: '/#ipad', description: 'El iPad esencial para todo' },
      { title: 'Apple Pencil & Teclados', href: '/#accesorios', description: 'Accesorios oficiales' },
    ],
    featuredProduct: {
      name: 'iPad Pro M4',
      description: 'Ultradelgado y con el poder sin precedentes del chip M4.',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
      href: '/#ipad',
      price: 'Desde $ 4.899.000',
    },
  },
  {
    name: 'Watch',
    href: '/#apple-watch',
    subcategories: [
      { title: 'Apple Watch Ultra 2', href: '/#apple-watch', description: 'Aventura y resistencia extrema' },
      { title: 'Apple Watch Series 10', href: '/#apple-watch', description: 'Diseño más delgado y pantalla mayor' },
      { title: 'Apple Watch SE', href: '/#apple-watch', description: 'Grandes funciones a precio accesible' },
      { title: 'Correas & Cargas', href: '/#accesorios', description: 'Personaliza tu estilo' },
    ],
    featuredProduct: {
      name: 'Apple Watch Series 10',
      description: 'Una pantalla monumental en el diseño más delgado jamás creado.',
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop',
      href: '/#apple-watch',
      price: 'Desde $ 2.199.000',
    },
  },
  {
    name: 'Audio',
    href: '/#audio',
    subcategories: [
      { title: 'AirPods Pro 2', href: '/#audio', description: 'Cancelación activa de ruido pro' },
      { title: 'AirPods 4 con ANC', href: '/#audio', description: 'Audio espacial personalizado' },
      { title: 'AirPods Max', href: '/#audio', description: 'Alta fidelidad acústica' },
      { title: 'HomePod & HomePod mini', href: '/#audio', description: 'Sonido envolvente para el hogar' },
    ],
    featuredProduct: {
      name: 'AirPods Pro (2.ª Gen)',
      description: 'Audio adaptativo y cancelación de ruido hasta el doble de potente.',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop',
      href: '/#audio',
      price: 'Desde $ 1.149.000',
    },
  },
  {
    name: 'Accesorios',
    href: '/#accesorios',
    subcategories: [
      { title: 'Fundas y Protección MagSafe', href: '/#accesorios', description: 'Silicona, cuero fino y acrílico' },
      { title: 'Cargadores y Cables', href: '/#accesorios', description: 'Adaptadores USB-C 20W y 35W' },
      { title: 'Baterías Portátiles MagSafe', href: '/#accesorios', description: 'Energía extra en cualquier lugar' },
      { title: 'Soportes y Adaptadores', href: '/#accesorios', description: 'Hubs multipuerto y docks' },
    ],
  },
  {
    name: 'Ofertas',
    href: '/#ofertas',
    highlight: true,
    badge: 'Hot',
    subcategories: [
      { title: 'Descuentos del Mes', href: '/#ofertas', description: 'Ahorra hasta $800.000 en referencias selectas' },
      { title: 'Reacondicionados Grado A+', href: '/#ofertas', description: '100% funcionales con garantía directa' },
      { title: 'Combos & Bundles', href: '/#ofertas', description: 'iPhone + Case + Cargador con precio especial' },
    ],
  },
];

export default function Header() {
  const { openCart, totalCount } = useCart();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (catName: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(catName);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const activeCategoryData = categories.find((c) => c.name === activeMenu);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200'
          : 'bg-white border-b border-neutral-100'
      }`}
    >
      <nav aria-label="Navegación principal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo iZone Tech (Estilo Apple / iShop) */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#1D1D1F] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm group-hover:bg-[#0071E3] transition-colors">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-[#1D1D1F] leading-tight">
                  iZone<span className="text-[#0071E3]">Tech</span>
                </span>
                <span className="text-[10px] text-neutral-500 font-medium tracking-wider uppercase -mt-0.5">
                  Apple Specialist Bogotá
                </span>
              </div>
            </Link>
          </div>

          {/* Navegación Desktop con Mega Menú */}
          <div
            className="hidden lg:flex items-center gap-1 xl:gap-2"
            onMouseLeave={handleMouseLeave}
          >
            {categories.map((cat) => {
              const isActive = activeMenu === cat.name;
              return (
                <div
                  key={cat.name}
                  className="relative py-4"
                  onMouseEnter={() => handleMouseEnter(cat.name)}
                >
                  <Link
                    href={cat.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      cat.highlight
                        ? 'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 font-semibold'
                        : isActive
                        ? 'text-[#0071E3] bg-neutral-100/80'
                        : 'text-[#1D1D1F] hover:text-[#0071E3] hover:bg-neutral-50'
                    }`}
                  >
                    {cat.name}
                    {cat.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                          cat.highlight
                            ? 'bg-red-600 text-white'
                            : 'bg-[#0071E3] text-white'
                        }`}
                      >
                        {cat.badge}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Iconos de Acción Derecha */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Buscador Botón */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Buscar producto"
              className="p-2.5 text-neutral-700 hover:text-[#0071E3] rounded-full hover:bg-neutral-100 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Perfil / Contacto */}
            <Link
              href="/#contacto"
              aria-label="Mi Cuenta / Asesoría"
              className="hidden sm:inline-flex p-2.5 text-neutral-700 hover:text-[#0071E3] rounded-full hover:bg-neutral-100 transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Bolsa / Carrito con Contador */}
            <button
              onClick={openCart}
              aria-label="Ver carrito de compras"
              className="relative p-2.5 text-neutral-900 hover:text-[#0071E3] rounded-full hover:bg-neutral-100 transition-colors flex items-center"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#0071E3] text-white text-[11px] font-bold min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-scale-in">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Menú Hamburguesa Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú de navegación"
              className="lg:hidden p-2.5 text-neutral-700 hover:text-black rounded-lg ml-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda Desplegable */}
        {searchOpen && (
          <div className="py-3 px-2 border-t border-neutral-100 animate-fade-in">
            <div className="relative max-w-2xl mx-auto">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar iPhone, MacBook, iPad, AirPods o accesorios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-[#F5F5F7] text-sm text-[#1D1D1F] pl-11 pr-24 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-[#0071E3] focus:bg-white transition"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500 hover:text-black px-3 py-1.5 rounded-full hover:bg-neutral-200 transition"
              >
                Cerrar
              </button>
            </div>
            {/* Términos de búsqueda populares estilo iShop */}
            <div className="max-w-2xl mx-auto mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-700">Populares:</span>
              {['iPhone 16 Pro', 'MacBook Air M3', 'AirPods Pro 2', 'Apple Watch Ultra', 'Cargador 20W'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-2.5 py-0.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mega Menú Flotante Desktop */}
      {activeCategoryData && activeCategoryData.subcategories && (
        <div
          onMouseEnter={() => {
            if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
          className="hidden lg:block absolute top-full left-0 w-full bg-white border-b border-neutral-200 shadow-xl transition-all duration-200 animate-fade-in"
        >
          <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-12 gap-8">
            {/* Columna de Enlaces Subcategorías */}
            <div className="col-span-7 grid grid-cols-2 gap-4">
              {activeCategoryData.subcategories.map((sub) => (
                <Link
                  key={sub.title}
                  href={sub.href}
                  onClick={() => setActiveMenu(null)}
                  className="p-3 rounded-xl hover:bg-[#F5F5F7] transition group"
                >
                  <p className="font-semibold text-sm text-[#1D1D1F] group-hover:text-[#0071E3] transition">
                    {sub.title}
                  </p>
                  {sub.description && (
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                      {sub.description}
                    </p>
                  )}
                </Link>
              ))}

              <div className="col-span-2 mt-2 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <Link
                  href={activeCategoryData.href}
                  onClick={() => setActiveMenu(null)}
                  className="text-xs font-semibold text-[#0071E3] hover:underline flex items-center gap-1"
                >
                  Ver todo en {activeCategoryData.name} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-xs text-neutral-400">Garantía oficial y entrega inmediata</span>
              </div>
            </div>

            {/* Columna Producto Destacado en Mega Menú */}
            <div className="col-span-5 border-l border-neutral-100 pl-8">
              {activeCategoryData.featuredProduct ? (
                <Link
                  href={activeCategoryData.featuredProduct.href}
                  onClick={() => setActiveMenu(null)}
                  className="block group bg-[#F5F5F7] rounded-2xl p-5 hover:shadow-md transition overflow-hidden"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[#0071E3] uppercase tracking-wider mb-2">
                    <span>Destacado de la semana</span>
                    <span className="text-neutral-900 font-bold">
                      {activeCategoryData.featuredProduct.price}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-[#1D1D1F] group-hover:text-[#0071E3] transition">
                    {activeCategoryData.featuredProduct.name}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 mb-4">
                    {activeCategoryData.featuredProduct.description}
                  </p>
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={activeCategoryData.featuredProduct.image}
                      alt={activeCategoryData.featuredProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
              ) : (
                <div className="bg-[#F5F5F7] rounded-2xl p-6 h-full flex flex-col justify-center text-center">
                  <Sparkles className="w-8 h-8 text-[#0071E3] mx-auto mb-2" />
                  <h5 className="font-bold text-sm text-[#1D1D1F]">
                    Asesoría Especializada Apple
                  </h5>
                  <p className="text-xs text-neutral-500 mt-1 mb-3">
                    ¿Dudas con la referencia o capacidad? Te asesoramos en tiempo real.
                  </p>
                  <a
                    href="https://wa.me/573001234567?text=Hola%20iZone%20Tech,%20deseo%20asesor%C3%ADa%20para%20elegir%20mi%20equipo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#1D1D1F] hover:bg-[#0071E3] text-white text-xs font-semibold py-2 px-4 rounded-full transition"
                  >
                    Hablar con un asesor
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menú Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-200 bg-white px-4 py-6 space-y-4 animate-fade-in max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            {categories.map((cat) => (
              <div key={cat.name} className="border-b border-neutral-100 pb-2">
                <Link
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between text-base font-semibold py-2 ${
                    cat.highlight ? 'text-red-600' : 'text-[#1D1D1F]'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cat.highlight ? 'bg-red-600 text-white' : 'bg-[#0071E3] text-white'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </Link>
                {/* Submenú en mobile */}
                {cat.subcategories && (
                  <div className="pl-4 space-y-1 py-1">
                    {cat.subcategories.slice(0, 3).map((sub) => (
                      <Link
                        key={sub.title}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-xs text-neutral-500 py-1 hover:text-[#0071E3]"
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-3">
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white text-center font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              Comprar por WhatsApp
            </a>
            <p className="text-center text-xs text-neutral-400">
              Cra. 15 # 93-60, Bogotá D.C. • Envíos a toda Colombia
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
