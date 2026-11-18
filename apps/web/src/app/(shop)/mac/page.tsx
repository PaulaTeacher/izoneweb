import { getProducts } from '@/lib/api';
import { CategoryHub, type CategoryHubConfig } from '@/components/shop/CategoryHub';
import { CATEGORY_MODELS } from '@/lib/category-models';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Todos los Mac en Colombia | MacBook Neo, Air, Pro, iMac y Mac Studio en iZone Tech',
  description:
    'Descubre los modelos más recientes de Mac en Colombia con chips M4 y M5 y garantía oficial Apple.',
  path: '/mac',
});

const macConfig: CategoryHubConfig = {
  id: 'mac',
  title: 'Mac',
  chapterItems: CATEGORY_MODELS.mac,
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
