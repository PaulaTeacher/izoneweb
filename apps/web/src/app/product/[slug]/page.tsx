import { getProduct } from '@/lib/api';
import { notFound } from 'next/navigation';
import VariantSelector from '@/components/product/VariantSelector';
import type { Metadata } from 'next';
import type { Variant } from '@izone/shared-types';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'No encontrado' };

  return {
    title: product.seoTitle || `${product.name} | iZone Tech`,
    description: product.seoDescription || product.description,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const mainImage =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000';

  // JSON-LD SEO nativo completo para eCommerce
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: { '@type': 'Brand', name: product.brand?.name || 'Apple' },
    image: mainImage,
    offers: product.variants.map((v: Variant) => ({
      '@type': 'Offer',
      priceCurrency: 'COP',
      price: v.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/product/${product.slug}?variant=${v.id}`,
    })),
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link href="/" className="hover:text-black dark:hover:text-white transition">
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span>{product.category?.name || 'Catálogo'}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 dark:text-white font-medium">
          {product.name}
        </span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Product Gallery */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border shadow-sm aspect-square flex items-center justify-center overflow-hidden">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover object-center rounded-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Product Info & Variant Selector */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              {product.brand?.name || 'Apple'}
            </span>
            {product.tags?.[0] && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                {product.tags[0].name}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-neutral-900 dark:text-white">
            {product.name}
          </h1>

          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {product.description}
          </p>

          <VariantSelector product={product} />
        </div>
      </div>
    </div>
  );
}
