'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { easeOut } from '@/components/motion/FadeIn';

interface CategoryGroup {
  title: string;
  items: { title: string; href: string; description?: string; badge?: string }[];
}

interface CategoryItem {
  name: string;
  href: string;
  badge?: string;
  highlight?: boolean;
  groups?: CategoryGroup[];
}

const categories: CategoryItem[] = [
  {
    name: 'Mac',
    href: '/mac',
    groups: [
      {
        title: 'Explorar Mac',
        items: [
          { title: 'MacBook Air 13" (M5)', href: '/product/macbook-air-13-m5', badge: 'M5', description: 'Chip M5 · 16GB / 512GB' },
          { title: 'MacBook Neo 13" (A18 Pro)', href: '/product/macbook-neo-13-a18-pro', badge: 'Nuevo', description: '8GB / 256GB y 512GB' },
          { title: 'Ver todos los Mac', href: '/mac' },
        ]
      },
      {
        title: 'Comprar Mac',
        items: [
          { title: 'Comprar Mac', href: '/mac' },
          { title: 'Accesorios para Mac', href: '/accesorios?tipo=accesorios-mac' },
          { title: 'Plan Retoma', href: '/shop?category=ofertas' },
        ]
      },
      {
        title: 'Más de Mac',
        items: [
          { title: 'Soporte para Mac', href: '/#contacto' },
          { title: 'AppleCare+', href: '/#contacto' },
          { title: 'MacOS', href: '/mac' },
        ]
      }
    ]
  },
  {
    name: 'iPhone',
    href: '/iphone',
    badge: 'Nuevo',
    groups: [
      {
        title: 'Explorar iPhone',
        items: [
          { title: 'iPhone Duo', href: '/product/iphone-duo', badge: 'Nuevo' },
          { title: 'iPhone 18 Pro Max', href: '/product/iphone-18-pro-max', badge: 'Nuevo' },
          { title: 'iPhone 18 Pro', href: '/product/iphone-18-pro', badge: 'Nuevo' },
          { title: 'iPhone 17 Pro Max', href: '/product/iphone-17-pro-max' },
          { title: 'iPhone 17 Pro', href: '/product/iphone-17-pro' },
        ]
      },
      {
        title: 'Comprar iPhone',
        items: [
          { title: 'Comprar iPhone', href: '/iphone' },
          { title: 'Cargadores y Cables iPhone', href: '/accesorios?brand=apple&kind=phone' },
          { title: 'Plan Retoma', href: '/trade-in' },
        ]
      },
      {
        title: 'Más de iPhone',
        items: [
          { title: 'Soporte para iPhone', href: '/#contacto' },
          { title: 'AppleCare+', href: '/#contacto' },
          { title: 'iOS 27', href: '/iphone' },
        ]
      }
    ]
  },
  {
    name: 'iPad',
    href: '/ipad',
    groups: [
      {
        title: 'Explorar iPad',
        items: [
          { title: 'iPad 11 (A16)', href: '/product/ipad-11-a16', description: '128GB Wi-Fi' },
          { title: 'Ver todos', href: '/ipad' },
        ]
      },
      {
        title: 'Accesorios para iPad',
        items: [
          { title: 'Apple Pencil Pro', href: '/product/apple-pencil-pro' },
          { title: 'Apple Pencil (USB-C)', href: '/product/apple-pencil-usb-c' },
          { title: 'Magic Keyboard iPad Pro 11"', href: '/product/magic-keyboard-ipad-pro-11' },
          { title: 'Magic Keyboard iPad Air 11"', href: '/product/magic-keyboard-ipad-air-11' },
        ]
      },
      {
        title: 'Más de iPad',
        items: [
          { title: 'Soporte para iPad', href: '/#contacto' },
          { title: 'AppleCare+', href: '/#contacto' },
          { title: 'iPadOS', href: '/ipad' },
        ]
      }
    ]
  },
  {
    name: 'Watch',
    href: '/watch',
    groups: [
      {
        title: 'Explorar Apple Watch',
        items: [
          { title: 'Apple Watch Series 11', href: '/product/apple-watch-series-11', description: '42mm y 46mm GPS' },
          { title: 'Apple Watch SE 3', href: '/product/apple-watch-se-3', description: '40mm Starlight' },
          { title: 'Ver todos', href: '/watch' },
        ]
      },
      {
        title: 'Comprar',
        items: [
          { title: 'Correas', href: '/accesorios' },
          { title: 'Cargadores magnéticos', href: '/accesorios?tipo=energia' },
        ]
      },
      {
        title: 'Más de Watch',
        items: [
          { title: 'Soporte para Apple Watch', href: '/#contacto' },
          { title: 'AppleCare+', href: '/#contacto' },
          { title: 'watchOS', href: '/watch' },
        ]
      }
    ]
  },
  {
    name: 'Audio',
    href: '/audio',
    groups: [
      {
        title: 'Explorar Audio',
        items: [
          { title: 'AirPods Pro 3', href: '/product/airpods-pro-3', badge: 'Nuevo' },
          { title: 'AirPods 5 (Sin MagSafe)', href: '/product/airpods-5-sin-magsafe' },
          { title: 'AirPods 4 ANC', href: '/product/airpods-4-anc' },
          { title: 'AirPods 4', href: '/product/airpods-4' },
        ]
      },
      {
        title: 'Audio para el Hogar',
        items: [
          { title: 'HomePod', href: '/audio' },
          { title: 'HomePod mini', href: '/audio' },
        ]
      },
      {
        title: 'Más de Audio',
        items: [
          { title: 'Soporte de AirPods', href: '/#contacto' },
          { title: 'Apple Music', href: '/audio' },
        ]
      }
    ]
  },
  {
    name: 'Accesorios',
    href: '/accesorios',
    groups: [
      {
        title: 'Cargadores y Cables',
        items: [
          { title: '20W USB-C Power Adapter', href: '/product/20w-usb-c-power-adapter' },
          { title: '40W Dynamic Adapter (60W Max)', href: '/product/40w-dynamic-power-adapter-60w-max' },
          { title: 'Cable USB-C 1m', href: '/product/usb-c-cable-1m-open-box' },
          { title: 'Cable USB-C a Lightning 1m', href: '/product/usb-c-to-lightning-cable-1m-open-box' },
        ]
      },
      {
        title: 'Por Dispositivo',
        items: [
          { title: 'Accesorios para Mac', href: '/accesorios?tipo=accesorios-mac' },
          { title: 'Accesorios para iPad', href: '/accesorios?kind=tablet' },
          { title: 'Accesorios para iPhone', href: '/accesorios?brand=apple&kind=phone' },
          { title: 'Accesorios para Apple Watch', href: '/accesorios?kind=watch' },
        ]
      }
    ]
  },
  {
    name: 'Ofertas',
    href: '/shop?category=ofertas',
    highlight: true,
    badge: 'Hot',
    groups: [
      {
        title: 'Destacados',
        items: [
          { title: 'Descuentos del Mes', href: '/shop?category=ofertas' },
          { title: 'Combos & Bundles', href: '/shop?category=ofertas' },
          { title: 'Outlet', href: '/shop?category=ofertas' },
        ]
      },
      {
        title: 'Servicios',
        items: [
          { title: 'Plan Retoma', href: '/shop?category=ofertas' },
        ]
      }
    ]
  },
];

export default function Header() {
  const router = useRouter();
  const { openCart, totalCount } = useCart();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reduce = useReducedMotion();
  const duration = reduce ? 0 : 0.2;

  const handleMouseEnter = (catName: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(catName);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setActiveMenu(null);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  const activeCategoryData = categories.find((c) => c.name === activeMenu);

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-2 transition-all duration-300 font-sans">
      <div className="relative mx-auto max-w-[1024px] rounded-3xl bg-white/20 dark:bg-[#161617]/45 backdrop-blur-2xl saturate-[1.8] shadow-[0_4px_16px_rgba(0,0,0,0.12),0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
        <nav aria-label="Navegación principal" className="px-6 md:px-8 relative">
          <div className="h-[44px] flex items-center justify-between text-[12px] font-normal tracking-wide">
            {/* Logo (Apple Style) */}
            <Link
              href="/"
              aria-label="iZone Tech — inicio"
              className="flex items-center shrink-0 opacity-80 hover:opacity-100 transition-opacity text-[12px] font-semibold tracking-wide text-[#1D1D1F] dark:text-white whitespace-nowrap pl-1"
            >
              iZone Tech
            </Link>

            {/* Enlaces Desktop */}
            <div
              className="hidden md:flex items-center justify-center flex-1 gap-4 lg:gap-5 px-2 lg:px-4"
              onMouseLeave={handleMouseLeave}
            >
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="h-[44px] flex items-center"
                  onMouseEnter={() => handleMouseEnter(cat.name)}
                >
                  <Link
                    href={cat.href}
                    className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors px-2"
                  >
                    {cat.name}
                  </Link>
                </div>
              ))}
            </div>

            {/* Iconos de Acción */}
            <div className="flex items-center justify-end gap-4 md:gap-5 shrink-0 pr-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Buscar"
                className="opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Search className="w-3.5 h-3.5 text-[#1D1D1F] dark:text-white" />
              </button>

              <Link
                href="/#contacto"
                aria-label="Perfil"
                className="hidden md:flex opacity-80 hover:opacity-100 transition-opacity items-center justify-center"
              >
                <User className="w-4 h-4 text-[#1D1D1F] dark:text-white" />
              </Link>

              <button
                onClick={openCart}
                aria-label="Carrito"
                className="relative opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#1D1D1F] dark:text-white" />
                {totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 text-[#0071E3] font-semibold text-[9px] w-3 h-3 flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menú"
                className="md:hidden opacity-80 hover:opacity-100 transition-opacity ml-2"
              >
                {mobileMenuOpen ? <X className="w-4 h-4 text-[#1D1D1F]" /> : <Menu className="w-4 h-4 text-[#1D1D1F]" />}
              </button>
            </div>
          </div>

          {/* Buscador Desplegable */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                key="header-search"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration, ease: easeOut }}
                className="absolute top-full left-0 w-full rounded-b-2xl bg-white/70 dark:bg-[#161617]/70 backdrop-blur-2xl border-t border-black/5 pb-4 px-4 shadow-sm"
              >
                <form onSubmit={submitSearch} className="max-w-[680px] mx-auto mt-4 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input
                    type="search"
                    name="q"
                    placeholder="Buscar en iZone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    aria-label="Buscar productos"
                    className="w-full bg-black/5 dark:bg-white/10 text-[15px] text-[#1D1D1F] dark:text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:bg-black/10 transition-colors"
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* Mega Menú (Panel Desplegable al estilo Apple) */}
      <AnimatePresence>
        {activeCategoryData && activeCategoryData.groups && (
          <motion.div
            key={activeCategoryData.name}
            onMouseEnter={() => {
              if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration, ease: easeOut }}
            className="hidden md:block absolute top-full left-0 right-0 mx-auto mt-2 w-full max-w-[1024px] rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#161617]/70 backdrop-blur-2xl saturate-[1.8] shadow-[0_8px_24px_rgba(0,0,0,0.12)] origin-top overflow-hidden"
          >
            <div className="px-4 py-5 md:py-6 flex gap-6 md:gap-8 text-[12px]">
              {activeCategoryData.groups.map((group, idx) => (
                <div key={idx} className="flex-1 min-w-0 max-w-[200px]">
                  <h4 className="text-[10px] font-normal text-neutral-500 mb-2 tracking-wide uppercase">
                    {group.title}
                  </h4>
                  <ul className="space-y-1">
                    {group.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <Link
                          href={item.href}
                          onClick={() => setActiveMenu(null)}
                          className="block group/link py-0.5"
                        >
                          <span className="font-semibold text-[14px] leading-snug text-[#1D1D1F] dark:text-white/90 hover:text-black dark:hover:text-white transition-colors">
                            {item.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menú Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration, ease: easeOut }}
            className="md:hidden absolute top-full left-0 w-full h-[calc(100vh-44px)] bg-white dark:bg-black px-4 py-4 space-y-4 overflow-y-auto"
          >
            <form onSubmit={submitSearch} className="relative mb-6">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="search"
                name="q"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar productos"
                className="w-full bg-[#F5F5F7] dark:bg-neutral-900 text-sm pl-10 pr-4 py-2 rounded-lg outline-none"
              />
            </form>
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.name} className="border-b border-neutral-100 dark:border-neutral-900 pb-3">
                  <Link
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-bold text-[#1D1D1F] dark:text-white"
                  >
                    {cat.name}
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
