import Link from 'next/link';
import { getProducts } from '@/lib/api';
import { formatCOP } from '@izone/shared-types';
import type { Product } from '@izone/shared-types';

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 3);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-black text-white py-32 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">iPhone 16 Pro</h1>
        <p className="text-xl md:text-2xl text-neutral-400 mb-10">
          Diseñado con titanio. Superpotenciado por el chip A18 Pro.
        </p>
        <Link
          href="/product/iphone-16-pro"
          className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-neutral-200 transition"
        >
          Comprar ahora
        </Link>
      </section>

      {/* Bento Grid */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((p: Product, i: number) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className={`group relative bg-white rounded-3xl p-8 border hover:shadow-xl transition-all overflow-hidden ${
                i === 0 ? 'md:col-span-2 md:row-span-2 min-h-[400px]' : 'min-h-[250px]'
              }`}
            >
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                  <p className="text-neutral-500">{p.description}</p>
                </div>
                <span className="mt-4 font-semibold inline-block">
                  Desde {p.variants[0] ? formatCOP(p.variants[0].price) : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
