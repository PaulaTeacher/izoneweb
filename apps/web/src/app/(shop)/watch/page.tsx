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
