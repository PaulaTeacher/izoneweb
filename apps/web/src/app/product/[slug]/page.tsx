import { getProduct } from '@/lib/api';
import { notFound } from 'next/navigation';
import VariantSelector from '@/components/product/VariantSelector';
import type { Metadata } from 'next';
import type { Variant } from '@izone/shared-types';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'No encontrado' };
  
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description,
      // images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  // JSON-LD SEO nativo completo para eCommerce
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: { '@type': 'Brand', name: product.brand?.name || 'iZone Tech' },
    // image: product.images?.[0],
    offers: product.variants.map((v: Variant) => ({
      '@type': 'Offer',
      priceCurrency: 'COP',
      price: v.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}?variant=${v.id}`,
    })),
    // review: product.reviews... (Añadir en Fase 3)
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: process.env.NEXT_PUBLIC_SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.category?.name || 'Catálogo',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/catalog${product.category ? `?category=${product.category.slug}` : ''}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
      },
    ],
  };

  return (
    <div className="container-tight py-12 md:py-20 animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-card rounded-4xl p-8 border shadow-sm">
        {/* Gallery */}
        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-3xl aspect-square flex flex-col items-center justify-center p-8 text-neutral-400">
          <span>[Galería HD]</span>
          <span className="text-sm">Integraremos Cloudinary en Fase 5</span>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <div className="text-sm font-medium tracking-wide text-neutral-500 mb-2 uppercase">
            {product.brand?.name || 'iZone Tech'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            {product.name}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed text-balance">
            {product.description}
          </p>

          <VariantSelector product={product} />
        </div>
      </div>
    </div>
  );
}
