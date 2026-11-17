import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';

interface BentoCardItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  priceText: string;
  href: string;
  image: string;
  featured?: boolean;
  dark?: boolean;
}

const BENTO_ITEMS: BentoCardItem[] = [
  {
    id: 'iphone-duo',
    badge: 'Lanzamiento Estrella',
    title: 'iPhone Duo. El primer iPhone plegable.',
    subtitle: 'Pantalla de 7.6″ Super Retina XDR, chip A20 Pro y estructura de titanio.',
    priceText: 'Desde $ 9.650.000',
    href: '/product/iphone-duo',
    image: '/images/banners/bento-iphone-duo.webp',
    featured: true,
    dark: true,
  },
  {
    id: 'iphone-18-pro',
    badge: 'Nuevo Acabado Burgundy',
    title: 'iPhone 18 Pro y 18 Pro Max',
    subtitle: 'Potencia Pro de última generación en 256GB eSIM.',
    priceText: 'Desde $ 4.800.000',
    href: '/product/iphone-18-pro-max',
    image: '/images/banners/bento-iphone-18-pro.webp',
    dark: false,
  },
  {
    id: 'macbook-m5-neo',
    badge: 'Potencia Apple',
    title: 'MacBook Air 13″ M5 y MacBook Neo A18 Pro',
    subtitle: 'Rendimiento portátil para trabajo, estudio y creación.',
    priceText: 'Desde $ 2.550.000',
    href: '/mac',
    image: '/images/banners/bento-macbook-m5.webp',
    dark: false,
  },
  {
    id: 'energia-accesorios',
    badge: 'Esenciales',
    title: 'Cargadores 20W / 40W, Cables USB-C y Apple Pencil',
    subtitle: 'Accesorios originales Apple listos para entrega hoy en Bogotá.',
    priceText: 'Desde $ 75.000',
    href: '/accesorios',
    image: '/images/banners/bento-accesorios.webp',
    dark: false,
  },
];

export function LaunchBentoGrid() {
  return (
    <section
      aria-labelledby="launch-bento-heading"
      className="py-16 bg-[#F5F5F7] dark:bg-neutral-950 border-b border-neutral-200/70 dark:border-neutral-900"
    >
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0071E3] mb-2">
              Lo último de Apple en Colombia
            </p>
            <h2
              id="launch-bento-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F] dark:text-white"
            >
              Novedades que acaban de llegar.
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0071E3] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3] rounded-md"
          >
            Ver todo el catálogo <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENTO_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`group block rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3] ${
                item.featured ? 'md:col-span-2 lg:row-span-2' : 'lg:col-span-1'
              } ${item.id === 'energia-accesorios' ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <article
                className={`relative h-full min-h-[280px] rounded-3xl p-7 flex flex-col justify-between overflow-clip border transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl ${
                  item.dark
                    ? 'bg-[#141416] text-white border-neutral-800'
                    : 'bg-white dark:bg-neutral-900 text-[#1D1D1F] dark:text-white border-neutral-200/80 dark:border-neutral-800'
                }`}
              >
                <div className="relative z-10 min-w-0 max-w-md">
                  <span
                    className={`inline-block text-[11px] font-bold uppercase tracking-wider mb-2 ${
                      item.dark ? 'text-sky-400' : 'text-[#0071E3]'
                    }`}
                  >
                    {item.badge}
                  </span>
                  <h3
                    className={`font-bold tracking-tight leading-tight mb-2 ${
                      item.featured ? 'text-2xl md:text-3xl' : 'text-xl'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed mb-4 ${
                      item.dark ? 'text-neutral-300' : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>

                <div className="relative z-10 mt-auto flex items-center justify-between gap-4 pt-4">
                  <span className="text-sm font-bold">{item.priceText}</span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                      item.dark
                        ? 'bg-white text-black group-hover:bg-neutral-200'
                        : 'bg-[#0071E3] text-white group-hover:bg-[#0077ED]'
                    }`}
                  >
                    Explorar <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </div>

                <div
                  className={`relative mt-5 w-full ${
                    item.featured ? 'aspect-[16/10]' : 'aspect-[16/9] max-h-40'
                  } rounded-2xl overflow-clip`}
                >
                  <SmartImage
                    src={item.image}
                    alt=""
                    fill
                    sizes={
                      item.featured
                        ? '(max-width: 1024px) 100vw, 50vw'
                        : '(max-width: 768px) 100vw, 25vw'
                    }
                    className={`transition-transform duration-500 group-hover:scale-105 ${
                      item.dark
                        ? 'object-cover object-center'
                        : 'object-contain p-2 mix-blend-multiply dark:mix-blend-normal'
                    }`}
                  />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
