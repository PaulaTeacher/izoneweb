import { getProduct, getCompatibleAccessories } from '@/lib/api';
import { notFound } from 'next/navigation';
import VariantSelector from '@/components/product/VariantSelector';
import { CategoryModelCarousel } from '@/components/shop/CategoryModelCarousel';
import { ProductSpecsAccordion } from '@/components/product/ProductSpecsAccordion';
import { RecommendedAccessories } from '@/components/product/RecommendedAccessories';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RatingSummary } from '@/components/product/StarRating';
import { CATEGORY_MODELS } from '@/lib/category-models';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  buildProductJsonLd,
} from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'No encontrado', robots: { index: false, follow: true } };

  const title = product.seoTitle || `${product.name} precio Colombia | iZone Tech Bogotá`;
  const description =
    product.seoDescription ||
    `${product.description.slice(0, 140)}${product.description.length > 140 ? '…' : ''} Compra en iZone Tech Bogotá con garantía y envíos a Colombia.`;

  return buildPageMetadata({
    title,
    description,
    path: `/product/${product.slug}`,
    images: product.images?.[0] ? [product.images[0]] : undefined,
    type: 'product',
    keywords: [
      product.name,
      `${product.name} Colombia`,
      `${product.name} Bogotá`,
      product.brand?.name,
      'iZone Tech',
    ].filter(Boolean) as string[],
  });
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const compatibleAccessories = await getCompatibleAccessories(params.slug);
  const isAccessory = product.productKind === 'accessory';
  const compatibleModels = (product.compatibilities || [])
    .map((c) => c.deviceModel)
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const mainImage =
    product.images?.[0] ||
    product.variants?.find((v) => v.featuredImage)?.featuredImage ||
    '/images/chapternav/accessories.png';

  const catSlug = product.category?.slug?.toLowerCase() || '';
  const categoryKey = isAccessory
    ? 'accesorios'
    : product.name.toLowerCase().includes('iphone')
    ? 'iphone'
    : product.name.toLowerCase().includes('mac')
    ? 'mac'
    : product.name.toLowerCase().includes('ipad')
    ? 'ipad'
    : product.name.toLowerCase().includes('watch')
    ? 'watch'
    : product.name.toLowerCase().includes('airpod')
    ? 'audio'
    : catSlug;

  const categoryModels = CATEGORY_MODELS[categoryKey] || null;

  const sku = product.variants?.[0]?.sku || `IZ-${product.id.slice(0, 8).toUpperCase()}`;
  const hasRealOffer = product.variants?.some(
    (v) => v.comparePrice != null && Number(v.comparePrice) > Number(v.price),
  );

  const hubPath = isAccessory ? '/accesorios' : `/${categoryKey || 'shop'}`;
  const hubName = isAccessory ? 'Accesorios' : categoryKey || 'Catálogo';

  return (
    <div className="flex flex-col w-full bg-white dark:bg-black font-sans">
      <JsonLd data={buildProductJsonLd(product, { image: mainImage })} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: hubName, path: hubPath },
          { name: product.name, path: `/product/${product.slug}` },
        ])}
      />

      {!isAccessory && categoryModels && (
        <section className="bg-white dark:bg-[#161617]">
          <CategoryModelCarousel
            items={categoryModels}
            activeId={categoryModels.find(
              (m) =>
                m.href === `/product/${product.slug}` ||
                m.actionTarget === `/product/${product.slug}`,
            )?.id}
          />
        </section>
      )}

      <div className="max-w-[1240px] mx-auto px-4 py-6 w-full flex-1 md:pl-[7%] lg:pl-[10%]">
        <nav
          aria-label="Migas de pan"
          className="flex items-center gap-2 text-xs text-neutral-400 mb-6"
        >
          <Link href="/" className="hover:text-black dark:hover:text-white transition">
            Inicio
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={hubPath}
            className="hover:text-black dark:hover:text-white transition capitalize"
          >
            {hubName}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-700 dark:text-neutral-200 truncate max-w-[40ch]">
            {product.name}
          </span>
        </nav>

        <div className="max-w-xl">
          {!isAccessory && hasRealOffer && (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F68025]">
                OFERTA
              </span>
            </div>
          )}
          {isAccessory && product.brand?.name && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#0071E3] mb-2">
              {product.brand.name}
            </p>
          )}

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            {product.name}
          </h1>

          <p className="text-[11px] text-neutral-400 mt-1">SKU: {sku}</p>

          {product.reviewCount ? (
            <a href="#resenas" className="inline-block mt-2">
              <RatingSummary average={product.ratingAverage} count={product.reviewCount} />
            </a>
          ) : null}

          {isAccessory && compatibleModels.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                Sirve para
              </p>
              <div className="flex flex-wrap gap-2">
                {compatibleModels.map((m) => (
                  <Link
                    key={m.id}
                    href={`/accesorios?modelo=${m.slug}&brand=${m.brand?.slug || ''}`}
                    className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[#1D1D1F] hover:bg-black/5"
                  >
                    {m.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <VariantSelector product={product} />
        </div>

        <RecommendedAccessories productName={product.name} products={compatibleAccessories} />

        {!isAccessory && <ProductSpecsAccordion product={product} />}

        <ProductReviews
          slug={product.slug}
          productName={product.name}
          reviews={product.reviews || []}
          average={product.ratingAverage}
          count={product.reviewCount}
        />
      </div>
    </div>
  );
}
