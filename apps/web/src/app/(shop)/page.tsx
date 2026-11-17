import type { Metadata } from 'next';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryCarousel } from '@/components/home/CategoryCarousel';
import { LaunchBentoGrid } from '@/components/home/LaunchBentoGrid';
import { FavoritesCarousel } from '@/components/home/FavoritesCarousel';
import { AccessoriesCarousel } from '@/components/home/AccessoriesCarousel';
import { TrustBanner } from '@/components/home/TrustBanner';
import { SocialFollow } from '@/components/home/SocialFollow';
import { PromoBanners } from '@/components/home/PromoBanners';
import StoreMap from '@/components/layout/StoreMap';
import { getFeaturedProducts, getHomeSummary } from '@/lib/api';

export const metadata: Metadata = {
  title: 'iZone Colombia | Tienda Apple, iPhone, Mac, iPad y Accesorios',
  description:
    'Compra productos Apple originales en Colombia con garantía oficial de 1 año, envíos seguros a nivel nacional y Trade-in en Bogotá.',
};

export default async function Home() {
  const [featured, homeSummary] = await Promise.all([
    getFeaturedProducts(8),
    getHomeSummary(),
  ]);

  return (
    <>
      <div className="flex flex-col -mt-16">
        <HeroCarousel slides={homeSummary.heroSlides} />
        <CategoryCarousel minPrices={homeSummary.categoryMinPrices} />
        <LaunchBentoGrid />
        <FavoritesCarousel products={featured} />
        <TrustBanner />
        <AccessoriesCarousel minPrices={homeSummary.accessoryMinPrices} />
        <PromoBanners />
        <SocialFollow />
      </div>
      <StoreMap />
    </>
  );
}
