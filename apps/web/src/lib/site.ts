import type { Metadata } from 'next';

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

/** Metadata helpers with a clean canonical (no tracking / filter noise). */
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
      telephone: `+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567'}`,
    },
  ],
};

export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ElectronicsStore',
  name: 'iZone Tech',
  image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200',
  url: getSiteUrl(),
  telephone: `+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567'}`,
  priceRange: '$$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Cra. 15 # 93-60, Chicó Norte',
    addressLocality: 'Bogotá',
    addressRegion: 'Cundinamarca',
    postalCode: '110221',
    addressCountry: 'CO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 4.6761,
    longitude: -74.0485,
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
  areaServed: {
    '@type': 'Country',
    name: 'Colombia',
  },
};
