import { getProducts } from '@/lib/api';
import { CategoryHub, type CategoryHubConfig } from '@/components/shop/CategoryHub';
import { CATEGORY_MODELS } from '@/lib/category-models';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Apple Watch en Colombia | Ultra 3, Series 11 y SE 3 en iZone Tech',
  description:
    'Explora todos los modelos de Apple Watch en Colombia con garantía oficial de 1 año y entrega rápida.',
  path: '/watch',
});

const watchConfig: CategoryHubConfig = {
  id: 'watch',
  title: 'Apple Watch',
  chapterItems: CATEGORY_MODELS.watch,
  hero: {
    badge: 'Apple Watch Ultra 3',
    title: 'Descuento hasta de: $450.000*',
    description: 'Garantía oficial de 1 año y envío a toda Colombia.',
    discountText: '$ 450.000*',
    primaryAction: { label: 'Comprar Ultra 3', filterId: 'ultra' },
    image: 'https://co.tiendasishop.com/cdn/shop/files/AMZ_Family-Stripe_Apple_Watch_Ultra_3_ee9372a8-c677-4a58-9c60-3d62e6c00d33.png?v=1757544987&width=500',
    legalNote: '*Descuento válido en tiendas físicas y online, sujeto a disponibilidad. Ver términos y condiciones.',
  },
  filters: [
    { id: 'ultra', label: 'Apple Watch Ultra', matchStrings: ['ultra'] },
    { id: 'series', label: 'Apple Watch Series 11 / 10', matchStrings: ['series'] },
    { id: 'se', label: 'Apple Watch SE', matchStrings: ['se'] },
    { id: 'accessories', label: 'Correas y Accesorios', matchStrings: ['band', 'correa', 'charger', 'case'] },
  ],
};

export default async function WatchHubPage() {
  const initialProducts = await getProducts({ category: 'watch' });

  return (
    <CategoryHub
      initialProducts={initialProducts}
      config={watchConfig}
    />
  );
}
