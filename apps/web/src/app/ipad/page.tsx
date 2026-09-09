import { getProducts } from '@/lib/api';
import { CategoryHub, type CategoryHubConfig } from '@/components/shop/CategoryHub';
import { CATEGORY_MODELS } from '@/lib/category-models';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Todos los iPad en Colombia | iPad Pro M5, iPad Air M4 y más en iZone Tech',
  description: 'Descubre todos los modelos de iPad disponibles en Colombia con garantía oficial de 1 año, 24 cuotas sin interés y envío inmediato.',
};

const ipadConfig: CategoryHubConfig = {
  id: 'ipad',
  title: 'iPad',
  chapterItems: CATEGORY_MODELS.ipad,
  hero: {
    badge: 'iPad Pro 13" M5',
    title: 'Descuento hasta de: $600.000*',
    description: 'Estrena en 24 cuotas sin interés.',
    discountText: '$ 600.000*',
    installmentsText: 'Estrena en 24 cuotas sin interés.**',
    primaryAction: { label: 'Comprar iPad Pro', filterId: 'ipad-pro' },
    image: 'https://co.tiendasishop.com/cdn/shop/files/AMZ_FamilyStripe_iPad_Pro_13.avif?v=1761240497&width=500',
    legalNote: '**Beneficio válido en tiendas físicas y online. Aplica 0% de interés a 24 cuotas con Addi y tarjetas aliadas (Bancolombia, Davivienda, Banco de Bogotá).',
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
