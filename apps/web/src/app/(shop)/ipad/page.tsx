import { getProducts } from '@/lib/api';
import { CategoryHub, type CategoryHubConfig } from '@/components/shop/CategoryHub';
import { CATEGORY_MODELS } from '@/lib/category-models';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Todos los iPad en Colombia | iPad Pro M5, iPad Air M4 y más en iZone Tech',
  description:
    'Descubre todos los modelos de iPad disponibles en Colombia con garantía oficial de 1 año y envío inmediato.',
  path: '/ipad',
});

const ipadConfig: CategoryHubConfig = {
  id: 'ipad',
  title: 'iPad',
  chapterItems: CATEGORY_MODELS.ipad,
  hero: {
    badge: 'iPad Pro 13" M5',
    title: 'Descuento hasta de: $600.000*',
    description: 'Garantía oficial de 1 año y envío a toda Colombia.',
    discountText: '$ 600.000*',
    primaryAction: { label: 'Comprar iPad Pro', filterId: 'ipad-pro' },
    image: 'https://co.tiendasishop.com/cdn/shop/files/AMZ_FamilyStripe_iPad_Pro_13.avif?v=1761240497&width=500',
    legalNote: '*Descuento válido en tiendas físicas y online, sujeto a disponibilidad. Ver términos y condiciones.',
  },
  filters: [
    { id: 'pro', label: 'iPad Pro', matchStrings: ['pro'] },
    { id: 'air', label: 'iPad Air', matchStrings: ['air'] },
    { id: 'ipad', label: 'iPad (11" / 10.ª gen)', matchStrings: ['ipad'] },
    { id: 'mini', label: 'iPad mini', matchStrings: ['mini'] },
    { id: 'accessories', label: 'Accesorios iPad', matchStrings: ['pencil', 'keyboard', 'funda', 'smart'] },
  ],
};

export default async function IPadHubPage() {
  const initialProducts = await getProducts({ category: 'ipad' });

  return (
    <CategoryHub
      initialProducts={initialProducts}
      config={ipadConfig}
    />
  );
}
