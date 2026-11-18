import { getProducts } from '@/lib/api';
import { CategoryHub, type CategoryHubConfig } from '@/components/shop/CategoryHub';
import { IPhoneComparison } from '@/components/shop/IPhoneComparison';
import { CATEGORY_MODELS } from '@/lib/category-models';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Todos los iPhone en Colombia | iPhone 17, iPhone 16 y más en iZone Tech',
  description:
    'Descubre todos los iPhone disponibles en Colombia con garantía oficial de 1 año y envío inmediato.',
  path: '/iphone',
});

const iphoneConfig: CategoryHubConfig = {
  id: 'iphone',
  title: 'iPhone',
  chapterItems: CATEGORY_MODELS.iphone,
  filters: [
    { id: 'pro', label: 'Serie Pro', matchStrings: ['pro'] },
    { id: '17', label: 'iPhone 17', matchStrings: ['17'] },
    { id: '16', label: 'iPhone 16', matchStrings: ['16'] },
  ],
  comparisonComponent: <IPhoneComparison />,
};

export default async function IPhoneHubPage() {
  const initialProducts = await getProducts({ category: 'iphone' });

  return (
    <CategoryHub
      initialProducts={initialProducts}
      config={iphoneConfig}
    />
  );
}
