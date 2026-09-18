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
  hero: {
    badge: 'AirPods Pro 3',
    title: 'Descuento hasta de: $250.000*',
    description: 'Audio espacial personalizado y cancelación pro.',
    discountText: '$ 250.000*',
    primaryAction: { label: 'Comprar AirPods Pro', filterId: 'airpods-pro' },
    image: 'https://co.tiendasishop.com/cdn/shop/files/AMZ_FamilyStripe_airpods_Pro_Gen_3.webp?v=1757552175&width=500',
    legalNote: '*Descuento válido en tiendas físicas y online, sujeto a disponibilidad. Ver términos y condiciones.',
  },
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
