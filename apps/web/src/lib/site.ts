import type { Metadata } from 'next';
import { getWhatsappNumber } from '@/lib/whatsapp';

/** Canonical social profiles for iZone Tech Colombia. */
export const SOCIAL_LINKS = {
  instagram: {
    href: 'https://www.instagram.com/izonetech_col/',
    handle: '@izonetech_col',
    label: 'Instagram',
  },
  tiktok: {
    href: 'https://www.tiktok.com/@izonetechbogota',
    handle: '@izonetechbogota',
    label: 'TikTok',
  },
} as const;

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export function absoluteUrl(path = '/') {
  const base = getSiteUrl();
  if (!path || path === '/') return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Lightweight metadata helper (canonical + OG). Prefer buildPageMetadata from @/lib/seo for richer pages. */
export function pageMetadata({
  title,
  description,
  path,
  images,
  index = true,
}: {
  title?: string;
  description?: string;
  path: string;
  images?: string[];
  index?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical },
    openGraph: {
      url: canonical,
      locale: 'es_CO',
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(images?.length ? { images: images.map((url) => ({ url })) } : {}),
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'iZone Tech Colombia',
  legalName: 'iZone Tech Colombia S.A.S.',
  url: getSiteUrl(),
  logo: absoluteUrl('/favicon.ico'),
  taxID: '901.458.789-2',
  sameAs: [SOCIAL_LINKS.instagram.href, SOCIAL_LINKS.tiktok.href],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: 'CO',
      availableLanguage: ['Spanish'],
      telephone: `+${getWhatsappNumber()}`,
    },
  ],
};

export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ElectronicsStore',
  '@id': `${getSiteUrl()}/#store`,
  name: 'iZone Tech',
  image: `${getSiteUrl()}/images/products/iphone-17-silver.jpg`,
  url: getSiteUrl(),
  telephone: `+${getWhatsappNumber()}`,
  priceRange: '$$$',
  currenciesAccepted: 'COP',
  paymentAccepted: 'Cash, Credit Card, Debit Card, PSE',
  sameAs: [SOCIAL_LINKS.instagram.href, SOCIAL_LINKS.tiktok.href],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'CC Unilago, Local L 1-143',
    addressLocality: 'Bogotá',
    addressRegion: 'Cundinamarca',
    postalCode: '110221',
    addressCountry: 'CO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 4.66335,
    longitude: -74.06083,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      opens: '10:00',
      closes: '19:00',
    },
  ],
  areaServed: [
    {
      '@type': 'City',
      name: 'Bogotá',
    },
    {
      '@type': 'Country',
      name: 'Colombia',
    },
  ],
};
