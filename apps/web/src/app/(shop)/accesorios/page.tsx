import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getDeviceModels, getProducts } from '@/lib/api';
import { AccessoriesFinder } from '@/components/shop/AccessoriesFinder';
import { ProductGrid } from '@/components/home/ProductGrid';
import { FadeIn } from '@/components/motion/FadeIn';
import type { AccesoriosQuery } from '@/lib/accessories';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Accesorios para celular y Mac | Fundas, power banks y más',
  description:
    'Encuentra fundas de silicona, cuero y diseño, power banks y accesorios para Mac. Filtra por marca y modelo de tu dispositivo.',
  path: '/accesorios',
});

export default async function AccesoriosPage({
  searchParams,
}: {
  searchParams: AccesoriosQuery;
}) {
  const tipo = searchParams.tipo;
  const kind =
    searchParams.kind || (tipo === 'accesorios-mac' ? 'laptop' : undefined);

  const [products, deviceModels] = await Promise.all([
    getProducts({
      category: tipo || 'accesorios',
      productKind: 'accessory',
      compatibleWith: searchParams.modelo,
      material: searchParams.material,
      deviceBrand: searchParams.brand,
      deviceKind: kind,
      brand: searchParams.marca,
    }),
    getDeviceModels(),
  ]);

  const query: AccesoriosQuery = {
    tipo: searchParams.tipo,
    brand: searchParams.brand,
    modelo: searchParams.modelo,
    material: searchParams.material,
    kind,
    marca: searchParams.marca,
  };

  const resultsKey = [
    query.tipo,
    query.brand,
    query.modelo,
    query.material,
    query.kind,
    query.marca,
  ].filter(Boolean).join('|') || 'all';

  return (
    <div className="w-full flex flex-col min-h-[60vh] bg-[#F5F5F7]">
      <div className="container mx-auto px-4 py-8 max-w-7xl flex-1">
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
          <Link href="/" className="hover:text-black transition">
            Inicio
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 font-medium">Accesorios</span>
        </nav>

        <FadeIn className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            Accesorios
          </h1>
          <p className="text-neutral-500 mt-2 max-w-2xl">
            Elige tipo, marca y modelo de tu dispositivo. Fundas, energía y Mac,
            sin mezclar el catálogo Apple.
          </p>
        </FadeIn>

        <FadeIn delay={0.04} className="bg-white rounded-3xl border border-black/5 p-6 md:p-8 mb-10">
          <AccessoriesFinder query={query} deviceModels={deviceModels} />
        </FadeIn>

        <FadeIn key={resultsKey} delay={0.08}>
          {products.length > 0 ? (
            <ProductGrid
              title="Resultados"
              subtitle={`${products.length} producto${products.length === 1 ? '' : 's'}`}
              products={products}
              compact
            />
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-black/5">
              <h3 className="text-xl font-bold mb-2">No hay accesorios con ese filtro</h3>
              <p className="text-neutral-500 mb-6">
                Prueba otro modelo o quita el material.
              </p>
              <Link
                href="/accesorios"
                className="bg-[#1D1D1F] text-white px-6 py-3 rounded-full text-sm font-medium inline-block"
              >
                Ver todos los accesorios
              </Link>
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
