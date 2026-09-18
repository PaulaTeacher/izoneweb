import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  absoluteUrl,
  getSiteUrl,
  localBusinessJsonLd,
  organizationJsonLd,
} from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'iZone Tech | Especialistas en Apple en Bogotá y Colombia',
    template: '%s | iZone Tech',
  },
  description:
    'Tienda oficial de tecnología especializada en Apple en Bogotá y Colombia. Compra iPhone 16 Pro, MacBook M3, iPad, Apple Watch y AirPods con garantía oficial de 1 año, pagos seguros con PSE y despacho nacional inmediato.',
  keywords: [
    'Apple Colombia',
    'iZone Tech',
    'Mac Center Colombia',
    'iShop Colombia',
    'iPhone 16 Pro Bogotá',
    'MacBook Air M3',
    'AirPods Pro 2',
    'Apple Watch Series 10',
    'Tienda Apple Bogotá',
  ],
  authors: [{ name: 'iZone Tech Colombia' }],
  creator: 'iZone Tech',
  alternates: {
    canonical: absoluteUrl('/'),
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: absoluteUrl('/'),
    siteName: 'iZone Tech Colombia',
    title: 'iZone Tech — Especialistas en Apple en Colombia',
    description:
      'Compra tu próximo iPhone, MacBook, iPad o accesorio con garantía oficial de 1 año y atención directa por WhatsApp en Bogotá.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'iZone Tech Apple Store Colombia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iZone Tech | Especialistas en Apple en Bogotá',
    description: 'iPhones, MacBooks, iPads y AirPods con garantía oficial y envíos a toda Colombia.',
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
    <html lang="es" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-sans antialiased bg-[#F5F5F7] text-[#1D1D1F] flex flex-col min-h-screen selection:bg-[#0071E3] selection:text-white">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={localBusinessJsonLd} />
        {children}
      </body>
    </html>
  );
}
