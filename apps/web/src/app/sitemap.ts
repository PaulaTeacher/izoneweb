import type { MetadataRoute } from 'next';
import { CatalogUnavailableError, getProducts } from '@/lib/api';
import { absoluteUrl } from '@/lib/site';

const STATIC_PATHS = [
  '/',
  '/iphone',
  '/mac',
  '/ipad',
  '/watch',
  '/audio',
  '/accesorios',
  '/trade-in',
  '/shop',
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : path.startsWith('/shop') ? 0.7 : 0.85,
  }));

  // AI discovery surface
  staticEntries.push({
    url: absoluteUrl('/llms.txt'),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.3,
  });

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productEntries = products
      .filter((p) => p.slug && p.isActive !== false)
      .map((p) => ({
        url: absoluteUrl(`/product/${p.slug}`),
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      }));
  } catch (err) {
    // API caída: en producción no publicar (ni cachear) un sitemap sin productos.
    if (err instanceof CatalogUnavailableError) throw err;
  }

  return [...staticEntries, ...productEntries];
}
