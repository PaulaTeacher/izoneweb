import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryCarousel } from '@/components/home/CategoryCarousel';
import { FavoritesCarousel } from '@/components/home/FavoritesCarousel';
import { AccessoriesCarousel } from '@/components/home/AccessoriesCarousel';
import { TrustBanner } from '@/components/home/TrustBanner';
import { SocialFollow } from '@/components/home/SocialFollow';
import { PromoBanners } from '@/components/home/PromoBanners';

export default function Home() {
  return (
    <div className="flex flex-col -mt-16">
      <HeroCarousel />
      <CategoryCarousel />
      <FavoritesCarousel />
      <AccessoriesCarousel />
      <TrustBanner />
      <SocialFollow />
      <PromoBanners />
    </div>
  );
}
