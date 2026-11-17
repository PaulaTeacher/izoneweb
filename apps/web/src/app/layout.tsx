import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { JsonLd } from '@/components/seo/JsonLd';
import { Analytics } from '@/components/seo/Analytics';
import {
  absoluteUrl,
  getSiteUrl,
  localBusinessJsonLd,
  organizationJsonLd,
} from '@/lib/site';
import {
  getSearchVerification,
  SITE,
  websiteJsonLd,
} from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE.defaultTitle,
    template: '%s | iZone Tech',
  },
  description: SITE.defaultDescription,
  applicationName: SITE.name,
  keywords: [
    'Apple Colombia',
    'iZone Tech',
    'iPhone Bogotá',
    'MacBook Colombia',
    'Tienda Apple Bogotá',
    'AirPods Colombia',
    'Apple Watch Bogotá',
    'accesorios Apple Colombia',
  ],
  authors: [{ name: SITE.legalName, url: getSiteUrl() }],
  creator: SITE.name,
  publisher: SITE.legalName,
  category: 'ecommerce',
  alternates: {
    canonical: absoluteUrl('/'),
    languages: {
      'es-CO': absoluteUrl('/'),
    },
  },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: absoluteUrl('/'),
    siteName: `${SITE.name} Colombia`,
    title: 'iZone Tech — Especialistas en Apple en Colombia',
    description: SITE.defaultDescription,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'iZone Tech — Apple en Bogotá, Colombia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iZone Tech | Apple en Bogotá',
    description:
      'iPhones, MacBooks, iPads y AirPods con garantía oficial y envíos a toda Colombia.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: getSearchVerification(),
  other: {
    'geo.region': 'CO-DC',
    'geo.placename': 'Bogotá',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CO" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs" />
      </head>
      <body className="font-sans antialiased bg-[#F5F5F7] text-[#1D1D1F] flex flex-col min-h-screen selection:bg-[#0071E3] selection:text-white">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={localBusinessJsonLd} />
        <JsonLd data={websiteJsonLd()} />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
