import { getProducts } from '@/lib/api';
import { CategoryHub, type CategoryHubConfig } from '@/components/shop/CategoryHub';
import { CATEGORY_MODELS } from '@/lib/category-models';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'AirPods y Audio en Colombia | AirPods Pro 3, AirPods 4 y Max en iZone Tech',
  description:
    'Descubre la línea completa de audio Apple en Colombia. AirPods Pro 3, AirPods 4 con cancelación activa, AirPods Max y HomePod.',
  path: '/audio',
});

const audioConfig: CategoryHubConfig = {
  id: 'audio',
  title: 'Audio',
  chapterItems: CATEGORY_MODELS.audio,
  filters: [
    { id: 'pro', label: 'AirPods Pro', matchStrings: ['pro'] },
    { id: 'airpods', label: 'AirPods 4', matchStrings: ['4', 'gen'] },
    { id: 'max', label: 'AirPods Max', matchStrings: ['max'] },
    { id: 'homepod', label: 'HomePod', matchStrings: ['homepod'] },
    { id: 'accessories', label: 'Accesorios de Audio', matchStrings: ['case', 'cable', 'charger', 'tips'] },
  ],
};

export default async function AudioHubPage() {
  const initialProducts = await getProducts({ category: 'audio' });

  return (
    <CategoryHub
      initialProducts={initialProducts}
      config={audioConfig}
    />
  );
}
