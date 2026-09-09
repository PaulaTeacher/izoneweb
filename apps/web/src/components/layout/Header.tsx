'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

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
          { title: 'MacBook Air', href: '/mac', description: 'Chip M2 y M3' },
          { title: 'MacBook Pro', href: '/mac', description: 'Chip M3, M3 Pro y M3 Max' },
          { title: 'iMac', href: '/mac', description: '24 pulgadas' },
          { title: 'Mac mini', href: '/mac', description: 'Chip M2 y M2 Pro' },
          { title: 'Mac Studio', href: '/mac', description: 'Chip M2 Max y M2 Ultra' },
          { title: 'Mac Pro', href: '/mac' },
          { title: 'Monitores', href: '/mac', description: 'Studio Display y Pro Display XDR' },
        ]
      },
      {
        title: 'Comprar Mac',
        items: [
          { title: 'Comprar Mac', href: '/mac' },
          { title: 'Accesorios para Mac', href: '/shop?category=accesorios' },
          { title: 'Plan Retoma', href: '/shop?category=ofertas' },
          { title: 'Financiación', href: '/shop?category=ofertas' },
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
          { title: 'iPhone 16 Pro', href: '/product/iphone-16-pro', description: 'Lo último en titanio', badge: 'Nuevo' },
          { title: 'iPhone 16', href: '/iphone', description: 'Potente y colorido', badge: 'Nuevo' },
          { title: 'iPhone 15 Pro', href: '/iphone' },
          { title: 'iPhone 15', href: '/iphone' },
          { title: 'iPhone 14', href: '/iphone' },
          { title: 'iPhone 13', href: '/iphone' },
          { title: 'iPhone SE', href: '/iphone' },
        ]
      },
      {
        title: 'Comprar iPhone',
        items: [
          { title: 'Comprar iPhone', href: '/iphone' },
          { title: 'Accesorios para iPhone', href: '/shop?category=accesorios' },
          { title: 'MagSafe', href: '/shop?category=accesorios' },
          { title: 'Plan Retoma', href: '/shop?category=ofertas' },
        ]
      },
      {
        title: 'Más de iPhone',
        items: [
          { title: 'Soporte para iPhone', href: '/#contacto' },
          { title: 'AppleCare+', href: '/#contacto' },
          { title: 'iOS 18', href: '/iphone' },
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
          { title: 'iPad Pro', href: '/ipad', description: 'El más avanzado' },
          { title: 'iPad Air', href: '/ipad', description: 'Ligero y potente' },
          { title: 'iPad', href: '/ipad', description: '10.ª generación' },
          { title: 'iPad mini', href: '/ipad', description: 'Potencia en tu mano' },
        ]
      },
      {
        title: 'Accesorios para iPad',
        items: [
          { title: 'Apple Pencil', href: '/shop?category=accesorios' },
          { title: 'Teclados', href: '/shop?category=accesorios', description: 'Magic Keyboard' },
          { title: 'Fundas', href: '/shop?category=accesorios' },
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
          { title: 'Apple Watch Ultra 2', href: '/watch' },
          { title: 'Apple Watch Series 10', href: '/watch', badge: 'Nuevo' },
          { title: 'Apple Watch Series 9', href: '/watch' },
          { title: 'Apple Watch SE', href: '/watch' },
        ]
      },
      {
        title: 'Comprar',
        items: [
          { title: 'Correas', href: '/shop?category=accesorios' },
          { title: 'Cargadores magnéticos', href: '/shop?category=accesorios' },
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
          { title: 'AirPods Pro (2.ª generación)', href: '/audio' },
          { title: 'AirPods 4', href: '/audio', badge: 'Nuevo' },
          { title: 'AirPods Max', href: '/audio' },
          { title: 'AirPods (3.ª generación)', href: '/audio' },
          { title: 'EarPods', href: '/audio' },
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
    href: '/shop?category=accesorios',
    groups: [
      {
        title: 'Por Categoría',
        items: [
          { title: 'Fundas y Protección', href: '/shop?category=accesorios' },
          { title: 'Energía y Cables', href: '/shop?category=accesorios' },
          { title: 'Audio y Música', href: '/shop?category=accesorios' },
          { title: 'Almacenamiento', href: '/shop?category=accesorios' },
          { title: 'MagSafe', href: '/shop?category=accesorios' },
        ]
      },
      {
        title: 'Por Dispositivo',
        items: [
          { title: 'Accesorios para Mac', href: '/shop?category=accesorios' },
          { title: 'Accesorios para iPad', href: '/shop?category=accesorios' },
          { title: 'Accesorios para iPhone', href: '/shop?category=accesorios' },
          { title: 'Accesorios para Apple Watch', href: '/shop?category=accesorios' },
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
          { title: 'Financiación Addi', href: '/shop?category=ofertas' },
        ]
      }
    ]
  },
];

export default function Header() {
  const { openCart, totalCount } = useCart();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    <header className="sticky top-0 z-50 w-full transition-all duration-300 font-sans">
      {/* Fondo del Header: Cristal de Apple siempre activo */}
      <div
        className="absolute inset-0 w-full h-full -z-10 bg-white/40 dark:bg-[#161617]/70 backdrop-blur-2xl saturate-[1.8] border-b border-black/5 dark:border-white/5 transition-all duration-300"
      />

      <nav aria-label="Navegación principal" className="max-w-[1024px] mx-auto px-4 relative">
        <div className="h-[44px] flex items-center justify-between text-[12px] font-normal tracking-wide">
          {/* Logo (Apple Style) */}
          <Link href="/" className="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity w-8">
            <Sparkles className="w-[15px] h-[15px] text-[#1D1D1F] dark:text-white" />
          </Link>

          {/* Enlaces Desktop */}
          <div
            className="hidden md:flex items-center justify-between flex-1 px-4 lg:px-8"
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
          <div className="flex items-center justify-end gap-4 md:gap-6 w-auto md:w-16">
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
        {searchOpen && (
          <div className="absolute top-full left-0 w-full bg-white/70 dark:bg-[#161617]/70 backdrop-blur-2xl border-b border-black/5 pb-4 px-4 shadow-sm animate-fade-in">
            <div className="max-w-[680px] mx-auto mt-4 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar en iZone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-black/5 dark:bg-white/10 text-[15px] text-[#1D1D1F] dark:text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:bg-black/10 transition-colors"
              />
            </div>
          </div>
        )}
      </nav>

      {/* Mega Menú (Panel Desplegable al estilo Apple) */}
      {activeCategoryData && activeCategoryData.groups && (
        <div
          onMouseEnter={() => {
            if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
          className="hidden md:block absolute top-full left-0 w-full bg-white/70 dark:bg-[#161617]/70 backdrop-blur-2xl saturate-[1.8] shadow-sm transition-all duration-300 origin-top animate-in fade-in slide-in-from-top-2"
        >
          <div className="max-w-[1024px] mx-auto px-4 py-10 flex gap-12 text-[12px]">
            {activeCategoryData.groups.map((group, idx) => (
              <div key={idx} className="flex-1 max-w-[240px]">
                <h4 className="text-[11px] font-normal text-neutral-500 mb-3 tracking-wide">
                  {group.title}
                </h4>
                <ul className="space-y-2">
                  {group.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        onClick={() => setActiveMenu(null)}
                        className="block group/link"
                      >
                        <span className="font-semibold text-[19px] text-[#1D1D1F] dark:text-white/90 hover:text-black dark:hover:text-white transition-colors">
                          {item.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menú Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-[calc(100vh-44px)] bg-white dark:bg-black px-4 py-4 space-y-4 animate-fade-in overflow-y-auto">
          <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-[#F5F5F7] dark:bg-neutral-900 text-sm pl-10 pr-4 py-2 rounded-lg outline-none"
            />
          </div>
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
        </div>
      )}
    </header>
  );
}
