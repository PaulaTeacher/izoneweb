import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryCarousel } from '@/components/home/CategoryCarousel';
import { FavoritesCarousel } from '@/components/home/FavoritesCarousel';
import { AccessoriesCarousel } from '@/components/home/AccessoriesCarousel';
import { TrustBanner } from '@/components/home/TrustBanner';
import { SocialFollow } from '@/components/home/SocialFollow';
import { PromoBanners } from '@/components/home/PromoBanners';
import StoreMap from '@/components/layout/StoreMap';
import { getFeaturedProducts } from '@/lib/api';

export default async function Home() {
  const featured = await getFeaturedProducts(8);

  return (
    <>
      <div className="flex flex-col -mt-16">
        <HeroCarousel />
        <CategoryCarousel />
        <FavoritesCarousel products={featured} />
        <TrustBanner />
        <AccessoriesCarousel />
        <PromoBanners />
        <SocialFollow />
      </div>
      <StoreMap />
    </>
  );
}
