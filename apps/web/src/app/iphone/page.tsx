import { getProducts } from '@/lib/api';
import { CategoryHub, type CategoryHubConfig } from '@/components/shop/CategoryHub';
import { IPhoneComparison } from '@/components/shop/IPhoneComparison';
import { CATEGORY_MODELS } from '@/lib/category-models';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Todos los iPhone en Colombia | iPhone 17, iPhone 16 y más en iZone Tech',
  description: 'Descubre todos los iPhone disponibles en Colombia con garantía oficial de 1 año, 24 cuotas sin interés y envío inmediato.',
};

const iphoneConfig: CategoryHubConfig = {
  id: 'iphone',
  title: 'iPhone',
  chapterItems: CATEGORY_MODELS.iphone,
  hero: {
    badge: 'iPhone 17 Pro',
    title: 'Descuento hasta de $700.000*',
    description: 'Estrena en 24 cuotas sin interés.',
    primaryAction: { label: 'Comprar Serie Pro', filterId: 'pro' },
    slides: [
      {
        id: '17-pro',
        image: 'https://co.tiendasishop.com/cdn/shop/files/Agosto_WB_Parte17p_1_Web_Banner_3_copy_2.webp?v=1787241209&width=1200',
        imageMobile: 'https://co.tiendasishop.com/cdn/shop/files/Agosto_WB_Parte17p_1_Web_Banner_4_copy_2.webp?v=1787241220&width=750',
        alt: 'iPhone 17 Pro - Descuento hasta $700.000',
        link: '#catalogo-productos',
      },
      {
        id: '17',
        image: 'https://co.tiendasishop.com/cdn/shop/files/Agosto_WB_Parte_171_Web_Banner_3_copy.webp?v=1787233267&width=1200',
        imageMobile: 'https://co.tiendasishop.com/cdn/shop/files/Agosto_WB_Parte_171_Web_Banner_4_copy.webp?v=1787233273&width=750',
        alt: 'iPhone 17',
        link: '#catalogo-productos',
      },
      {
        id: 'choose',
        image: 'https://co.tiendasishop.com/cdn/shop/files/que_iphone_elegir_2025.webp?v=1757558233&width=1200',
        imageMobile: 'https://co.tiendasishop.com/cdn/shop/files/que_iphone_elegir_2025_movil.webp?v=1757558248&width=750',
        alt: '¿Qué iPhone elegir?',
        link: '#comparador',
      },
    ],
    legalNote: '**Beneficio válido en tiendas físicas y online. Aplica 0% de interés a 24 cuotas con Addi y tarjetas de crédito aliadas (Bancolombia, Davivienda, Banco de Bogotá). Ver TyC.',
  },
  filters: [
    { id: 'pro', label: 'Serie Pro', matchStrings: ['pro'] },
    { id: '17', label: 'iPhone 17', matchStrings: ['17'] },
    { id: '16', label: 'iPhone 16', matchStrings: ['16'] },
    { id: '15', label: 'iPhone 15', matchStrings: ['15'] },
    { id: 'se', label: 'iPhone SE', matchStrings: ['se'] },
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
