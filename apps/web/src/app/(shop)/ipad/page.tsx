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
