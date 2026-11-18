import type { Metadata } from 'next';
import { TradeInCalculator, type TargetDevice } from '@/components/shop/TradeInCalculator';
import { getProducts } from '@/lib/api';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Plan Retoma Apple en Bogotá | iZone Tech',
  description:
    'Cotiza tu iPhone actual como parte de pago para llevarte el nuevo iPhone Duo, iPhone 18 Pro Max o MacBook Air M5 en iZone Tech (CC Unilago, Bogotá).',
  path: '/trade-in',
});

export default async function TradeInPage({
  searchParams,
}: {
  searchParams?: { target?: string };
}) {
  const iphones = await getProducts({ category: 'iphone' }).catch(() => []);
  const targetDevices: TargetDevice[] = iphones
    .filter((p) => p.isActive !== false)
    .flatMap((p) => {
      const pricedVariants = (p.variants ?? [])
        .map((v) => ({ variant: v, price: Number(v.price) }))
        .filter((entry) => Number.isFinite(entry.price) && entry.price > 0)
        .sort((a, b) => a.price - b.price);
      if (pricedVariants.length === 0) return [];
      const minEntry = pricedVariants[0];
      const storageSuffix = minEntry.variant.storage ? ` (${minEntry.variant.storage})` : '';
      return [{ slug: p.slug, name: `${p.name}${storageSuffix}`, price: minEntry.price }];
    });

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0071E3] mb-2">
            Plan Retoma iZone Tech
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-white mb-4">
            Entrega tu equipo actual y estrena el nuevo iPhone.
          </h1>
          <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400">
            Calcula en segundos un valor estimado de retoma y agenda tu revisión técnica en nuestro punto físico en CC Unilago, Bogotá.
          </p>
        </div>

        <TradeInCalculator initialTargetSlug={searchParams?.target} targetDevices={targetDevices} />
      </div>
    </div>
  );
}
