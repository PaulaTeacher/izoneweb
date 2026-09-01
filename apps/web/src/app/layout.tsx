import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import CartDrawer from '@/components/cart/CartDrawer';
import { CartProvider } from '@/lib/cart-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'iZone Tech | Lo Último de Apple en Colombia',
    template: '%s | iZone Tech',
  },
  description:
    'Venta oficial de iPhones, MacBooks, iPads y accesorios Apple en Bogotá y Colombia. Garantía directa, asesoría experta y envíos a todo el país.',
  keywords: [
    'Apple Colombia',
    'iPhone 16 Pro',
    'MacBook Air M3',
    'AirPods Pro 2',
    'Apple Watch',
    'Tecnología Bogotá',
    'iZone Tech',
  ],
  authors: [{ name: 'iZone Tech' }],
  creator: 'iZone Tech',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: '/',
    siteName: 'iZone Tech',
    title: 'iZone Tech — Especialistas en Apple en Colombia',
    description:
      'Compra tu próximo iPhone, Mac o accesorio con garantía y atención personalizada inmediata por WhatsApp.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'iZone Tech Apple Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iZone Tech | Lo Último de Apple en Colombia',
    description: 'iPhones, MacBooks, iPads y AirPods con garantía oficial.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-sans antialiased bg-[#F5F5F7] dark:bg-black text-neutral-900 dark:text-neutral-50 flex flex-col min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 py-12 text-center text-xs text-neutral-500">
            <div className="container mx-auto px-4 space-y-4">
              <p>© {new Date().getFullYear()} iZone Tech Colombia. Todos los derechos reservados.</p>
              <p>
                Los nombres comerciales y marcas mencionadas son propiedad de sus respectivos dueños (Apple Inc.).
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
