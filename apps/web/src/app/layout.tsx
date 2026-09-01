import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'iZone Tech | Ecosistema Apple en Bogotá',
    template: '%s | iZone Tech',
  },
  description:
    'Tu tienda premium de productos Apple y accesorios de tecnología en Bogotá, Colombia. iPhone, MacBook, iPad, Apple Watch y AirPods.',
  keywords: [
    'Apple',
    'iPhone',
    'MacBook',
    'iPad',
    'AirPods',
    'Apple Watch',
    'Bogotá',
    'Colombia',
    'tienda Apple',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'iZone Tech',
    title: 'iZone Tech | Ecosistema Apple en Bogotá',
    description:
      'Tu tienda premium de productos Apple y accesorios de tecnología en Bogotá, Colombia.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iZone Tech | Ecosistema Apple en Bogotá',
    description:
      'Tu tienda premium de productos Apple y accesorios de tecnología en Bogotá, Colombia.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD LocalBusiness for SEO
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'iZone Tech',
  description:
    'Tienda premium de productos Apple y accesorios de tecnología en Bogotá.',
  url: 'https://izonetech.co',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bogotá',
    addressCountry: 'CO',
  },
  priceRange: '$$$',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
