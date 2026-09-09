import { getProducts } from '@/lib/api';
import { CategoryHub, type CategoryHubConfig } from '@/components/shop/CategoryHub';
import { CATEGORY_MODELS } from '@/lib/category-models';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Todos los Mac en Colombia | MacBook Neo, Air, Pro, iMac y Mac Studio en iZone Tech',
  description: 'Descubre los modelos más recientes de Mac en Colombia con chips M4 y M5, financiamiento a 24 cuotas sin interés y garantía oficial Apple.',
};

const macConfig: CategoryHubConfig = {
  id: 'mac',
  title: 'Mac',
  chapterItems: CATEGORY_MODELS.mac,
  hero: {
    badge: 'MacBook Pro M5',
    title: 'Descuento hasta de: $1.200.000*',
    description: 'Estrena en 24 cuotas sin interés.',
    discountText: '$ 1.200.000*',
    installmentsText: 'Estrena en 24 cuotas sin interés.**',
    primaryAction: { label: 'Comprar MacBook Pro', filterId: 'macbook-pro' },
    image: 'https://co.tiendasishop.com/cdn/shop/files/AMZ_Family-Stripe_MacBook_Pro_14-inch_M5__en-US.webp?v=1761188756&width=500',
    legalNote: '**Beneficio de 0% de interés a 24 cuotas diferidas con tarjetas de crédito participantes. Ver términos y condiciones.',
  },
  filters: [
    { id: 'neo', label: 'MacBook Neo', matchStrings: ['neo'] },
    { id: 'air', label: 'MacBook Air', matchStrings: ['air'] },
    { id: 'pro', label: 'MacBook Pro', matchStrings: ['pro'] },
    { id: 'imac', label: 'iMac', matchStrings: ['imac'] },
    { id: 'mini', label: 'Mac mini', matchStrings: ['mini'] },
    { id: 'studio', label: 'Mac Studio', matchStrings: ['studio'] },
  ],
};

export default async function MacHubPage() {
  const initialProducts = await getProducts({ category: 'mac' });

  return (
    <CategoryHub
      initialProducts={initialProducts}
      config={macConfig}
    />
  );
}
