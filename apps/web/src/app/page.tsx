import { getProducts } from '@/lib/api';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryCarousel } from '@/components/home/CategoryCarousel';
import { FavoritesCarousel } from '@/components/home/FavoritesCarousel';
import { AccessoriesCarousel } from '@/components/home/AccessoriesCarousel';
import { TrustBanner } from '@/components/home/TrustBanner';
import { PromoBanners } from '@/components/home/PromoBanners';
import { ProductGrid } from '@/components/home/ProductGrid';

export default async function Home() {
  const products = await getProducts();
  
  // En un caso real, podríamos filtrar los productos por categoría
  // Para el demo, dividiremos la lista actual
  const macProducts = products.filter(p => p.category?.slug === 'mac' || p.name.toLowerCase().includes('mac'));
  const iphoneProducts = products.filter(p => p.category?.slug === 'iphone' || p.name.toLowerCase().includes('iphone'));
  const accessoriesProducts = products.filter(p => p.category?.slug === 'accesorios' || p.name.toLowerCase().includes('airpods') || p.name.toLowerCase().includes('cable') || p.name.toLowerCase().includes('cargador') || p.name.toLowerCase().includes('case'));
  const otherProducts = products.filter(p => 
    p.category?.slug !== 'mac' && 
    p.category?.slug !== 'iphone' && 
    p.category?.slug !== 'accesorios' &&
    !p.name.toLowerCase().includes('mac') && 
    !p.name.toLowerCase().includes('iphone') &&
    !p.name.toLowerCase().includes('airpods') &&
    !p.name.toLowerCase().includes('cable')
  );

  return (
    <div className="flex flex-col -mt-16">
      {/* Hero Banner Estilo Apple */}
      <HeroCarousel />

      {/* Carrusel Rápido de Categorías */}
      <CategoryCarousel />

      {/* Los favoritos del momento */}
      <FavoritesCarousel />

      {/* Accesorios */}
      <AccessoriesCarousel />

      {/* Value Proposition Bar */}
      <TrustBanner />

      {/* Banners Promocionales (Retoma y Financiación) */}
      <PromoBanners />

      {/* Catálogo de Productos */}
      <div className="bg-neutral-50 dark:bg-neutral-950 py-12 flex flex-col gap-8">
        {iphoneProducts.length > 0 && (
          <ProductGrid 
            title="iPhone" 
            subtitle="Diseñados para ser amados." 
            products={iphoneProducts} 
          />
        )}
        
        {macProducts.length > 0 && (
          <ProductGrid 
            title="Mac" 
            subtitle="Poder de sobra para lo que sea." 
            products={macProducts} 
          />
        )}

        {accessoriesProducts.length > 0 && (
          <ProductGrid 
            title="Completa tu ecosistema" 
            subtitle="Accesorios esenciales para tus dispositivos." 
            products={accessoriesProducts} 
          />
        )}

        {otherProducts.length > 0 && (
          <ProductGrid 
            title="Descubre más" 
            subtitle="Encuentra lo que buscas en nuestro catálogo completo." 
            products={otherProducts} 
          />
        )}
      </div>
    </div>
  );
}
