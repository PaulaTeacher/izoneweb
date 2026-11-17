import { getProduct, getCompatibleAccessories } from '@/lib/api';
import { notFound } from 'next/navigation';
import VariantSelector from '@/components/product/VariantSelector';
import { CategoryModelCarousel } from '@/components/shop/CategoryModelCarousel';
import { ProductSpecsAccordion } from '@/components/product/ProductSpecsAccordion';
import { RecommendedAccessories } from '@/components/product/RecommendedAccessories';
import { CATEGORY_MODELS } from '@/lib/category-models';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Star, Info, Sparkles } from 'lucide-react';
import {
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  buildProductJsonLd,
} from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { SmartImage } from '@/components/ui/SmartImage';

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

  const isPlaceholder = !product.images?.[0] || product.images[0].includes('unsplash');
  const mainImage = isPlaceholder
    ? product.name.toLowerCase().includes('iphone')
      ? 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-1-202409?wid=1000&hei=800&fmt=png-alpha'
      : product.name.toLowerCase().includes('macbook')
      ? 'https://co.tiendasishop.com/cdn/shop/files/AMZ_FamilyStripe_MacBook_Air_15_in_M4__en-US.avif?v=1772739119&width=800'
      : product.images?.[0] || 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-1-202409?wid=1000&hei=800&fmt=png-alpha'
    : product.images[0];

  // Detectar categoría para el carrusel superior persistente
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

  // SKU y Barcode referenciales estilo iShop
  const sku = product.variants?.[0]?.sku || `IZ-${product.id.slice(0, 8).toUpperCase()}`;
  const barcode = '195950627541';

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

      {/* 1. Carrusel Horizontal de Modelos Persistente (Exacto a iShop) */}
      {!isAccessory && categoryModels && (
        <section className="w-full bg-white dark:bg-[#121212] sticky top-[44px] z-30 shadow-xs">
          <CategoryModelCarousel
            items={categoryModels}
            activeId={categoryModels.find((m) => m.href?.includes(product.slug))?.id}
          />
        </section>
      )}

      <div className="max-w-[1240px] mx-auto px-4 py-6 w-full flex-1">
        {/* Breadcrumb Navigation */}
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

        {/* Grid Principal del Producto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Lado Izquierdo: Galería Multimedia */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-[#FBFBFD] dark:bg-neutral-900/60 rounded-3xl p-8 md:p-12 border border-neutral-200/70 dark:border-neutral-800 shadow-xs aspect-square flex items-center justify-center relative overflow-hidden group">
              <SmartImage
                src={mainImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-contain p-8 md:p-12 drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-transform duration-500"
              />

              {!isAccessory && (
              <div className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md rounded-full text-[11px] font-bold text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>Apple Intelligence</span>
              </div>
              )}
            </div>

            {/* Miniaturas de vista previa de galería */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className="relative w-16 h-16 rounded-xl border border-neutral-200 dark:border-neutral-800 p-1 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900 hover:border-[#0071E3] transition-colors overflow-hidden"
                  >
                    <SmartImage src={img} alt="" fill sizes="64px" className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lado Derecho: Bloque Comercial y VariantSelector */}
          <div className="lg:col-span-5 flex flex-col">
            {!isAccessory && (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F68025]">
                OFERTA · UNIDADES LIMITADAS
              </span>
            </div>
            )}
            {isAccessory && product.brand?.name && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#0071E3] mb-2">
                {product.brand.name}
              </p>
            )}

            {/* Título del Producto */}
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* SKU y Barcode */}
            <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-3">
              <span>SKU: {sku}</span>
              <span>•</span>
              <span>Barcode: {barcode}</span>
            </div>

            {/* Social Proof: Puntuación de Reseñas y Ventas en 30 días */}
            <div className="flex items-center gap-3 mt-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold">4.9</span>
                <div className="flex text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-xs text-neutral-400">(202 reseñas)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#0071E3]">
                <span>150+ vendidos en 30 días</span>
                <Info className="w-3 h-3 text-neutral-400" />
              </div>
            </div>

            {/* Notificación de Envío Gratis */}
            <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-2 bg-neutral-50 dark:bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
              Este producto tiene <strong className="text-neutral-900 dark:text-white">Envío Gratis</strong> y aplica{' '}
              <span className="text-[#0071E3] font-semibold">entrega el mismo día</span> en Bogotá.
            </div>

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

            {/* Selector Integral de Variantes y Acciones */}
            <VariantSelector product={product} />
          </div>
        </div>

        {/* Módulo Cross-Sell: Los más elegidos con este producto */}
        <RecommendedAccessories productName={product.name} products={compatibleAccessories} />

        {/* Acordeón de Especificaciones Técnicas y Contenido de la Caja */}
        {!isAccessory && <ProductSpecsAccordion product={product} />}
      </div>
    </div>
  );
}
