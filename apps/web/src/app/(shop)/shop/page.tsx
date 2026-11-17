import { getProducts, productMatchesCategory } from '@/lib/api';
import { ProductGrid } from '@/components/home/ProductGrid';
import { CategoryModelCarousel } from '@/components/shop/CategoryModelCarousel';
import { CATEGORY_MODELS } from '@/lib/category-models';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}): Promise<Metadata> {
  const category = searchParams.category?.toLowerCase();
  // Search queries are ephemeral — canonical stays on /shop to avoid duplicates.
  const path =
    category && !searchParams.q
      ? `/shop?category=${encodeURIComponent(category)}`
      : '/shop';

  return pageMetadata({
    title: category
      ? `Catálogo ${category} | iZone Tech`
      : 'Catálogo Apple y accesorios | iZone Tech',
    description:
      'Explora iPhone, Mac, iPad, Watch, Audio y accesorios con garantía oficial en Colombia.',
    path,
    index: !searchParams.q,
  });
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; compatibleWith?: string; material?: string };
}) {
  const categoryFilter = searchParams.category?.toLowerCase();
  const queryFilter = searchParams.q?.toLowerCase();

  const products = await getProducts({
    category: categoryFilter,
    search: queryFilter,
    compatibleWith: searchParams.compatibleWith,
    material: searchParams.material,
  });

  let filteredProducts = products;

  if (categoryFilter) {
    if (categoryFilter === 'ofertas') {
      filteredProducts = products.filter((p) => p.isFeatured || p.tags?.some(t => t.slug === 'oferta-especial' || t.slug === 'destacado'));
    } else {
      filteredProducts = products.filter(
        (p) =>
          productMatchesCategory(p, categoryFilter) ||
          p.name.toLowerCase().includes(categoryFilter) ||
          p.tags?.some((t) => t.slug?.toLowerCase() === categoryFilter || t.name?.toLowerCase().includes(categoryFilter)),
      );
    }
  }

  if (queryFilter) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(queryFilter) ||
      p.description.toLowerCase().includes(queryFilter)
    );
  }

  // Mapa de nombres bonitos para las categorías
  const categoryNames: Record<string, string> = {
    mac: 'Mac',
    iphone: 'iPhone',
    ipad: 'iPad',
    watch: 'Apple Watch',
    audio: 'Audio',
    accesorios: 'Accesorios',
    ofertas: 'Ofertas Especiales'
  };

  const title = categoryFilter ? categoryNames[categoryFilter] || categoryFilter : 'Catálogo Completo';
  const subtitle = queryFilter 
    ? `Resultados para "${searchParams.q}"`
    : `Encuentra todos los modelos y configuraciones disponibles.`;

  const categoryModels = categoryFilter ? CATEGORY_MODELS[categoryFilter] : null;

  return (
    <div className="w-full flex flex-col min-h-[60vh]">
      {/* Carrusel horizontal de modelos si está filtrado por categoría */}
      {categoryModels && (
        <section className="bg-white dark:bg-[#161617]">
          <CategoryModelCarousel items={categoryModels} />
        </section>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in flex-1">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
          <Link href="/" className="hover:text-black dark:hover:text-white transition">
            Inicio
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 dark:text-white font-medium capitalize">
            {title}
          </span>
        </nav>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white capitalize">
            {title}
          </h1>
          <p className="text-neutral-500 mt-2">
            {subtitle} ({filteredProducts.length} productos)
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <ProductGrid title="" products={filteredProducts} />
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-3xl p-12 text-center border border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xl font-bold mb-2">No se encontraron productos</h3>
            <p className="text-neutral-500 mb-6">
              Intenta con otra categoría o término de búsqueda.
            </p>
            <Link href="/shop" className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-sm font-medium hover:scale-105 transition-transform inline-block">
              Ver todo el catálogo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
