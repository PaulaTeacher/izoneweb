import type {
  Product,
  Category,
  MenuCategory,
  WhatsappCheckoutResponse,
  DeviceModel,
  HomeSummary,
} from '@izone/shared-types';
import { MOCK_PRODUCTS } from './mock-products';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const FAMILY_ALIASES: Record<string, string[]> = {
  watch: ['watch', 'apple-watch'],
  'apple-watch': ['watch', 'apple-watch'],
};

export function productMatchesCategory(product: Product, category: string): boolean {
  const needle = category.toLowerCase();
  const slugs = FAMILY_ALIASES[needle] || [needle];
  const own = product.category?.slug?.toLowerCase();
  const parent = product.category?.parent?.slug?.toLowerCase();
  return slugs.some((s) => own === s || parent === s);
}

const CATALOG_FETCH_TIMEOUT_MS = 4000;

async function fetchCatalog(
  path: string,
  revalidateSeconds = 180,
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CATALOG_FETCH_TIMEOUT_MS);
  try {
    return await fetch(`${API_URL}${path}`, {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds, tags: ['catalog'] },
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function getProducts(params?: {
  category?: string;
  search?: string;
  tag?: string;
  brand?: string;
  productKind?: string;
  compatibleWith?: string;
  material?: string;
  deviceBrand?: string;
  deviceKind?: string;
  featured?: boolean;
  take?: number;
  sort?: string;
}): Promise<Product[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.tag) searchParams.set('tag', params.tag);
    if (params?.brand) searchParams.set('brand', params.brand);
    if (params?.productKind) searchParams.set('productKind', params.productKind);
    if (params?.compatibleWith) searchParams.set('compatibleWith', params.compatibleWith);
    if (params?.material) searchParams.set('material', params.material);
    if (params?.deviceBrand) searchParams.set('deviceBrand', params.deviceBrand);
    if (params?.deviceKind) searchParams.set('deviceKind', params.deviceKind);
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.take) searchParams.set('take', String(params.take));
    if (params?.sort) searchParams.set('sort', params.sort);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await fetchCatalog(`/catalog/products${query}`);
    if (res?.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch {
    // API no disponible, usar datos locales estructurados
  }

  // Fallback con productos mock realistas (compatible 100% con schema backend)
  let results = [...MOCK_PRODUCTS];
  if (params?.featured) {
    results = results.filter((p) => p.isFeatured);
  }
  if (params?.category) {
    const cat = params.category.toLowerCase();
    results = results.filter(
      (p) =>
        productMatchesCategory(p, cat) ||
        p.name.toLowerCase().includes(cat) ||
        (cat === 'iphone' && p.name.toLowerCase().startsWith('iphone')) ||
        (cat === 'mac' && p.name.toLowerCase().includes('mac'))
    );
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (params?.tag) {
    const t = params.tag.toLowerCase();
    results = results.filter((p) =>
      p.tags?.some((tag) => tag.slug.toLowerCase() === t)
    );
  }

  if (params?.sort === 'featured') {
    results.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }

  if (params?.take) {
    results = results.slice(0, params.take);
  }

  return results;
}

/** Destacados para Home: un solo request, featured primero. */
export async function getFeaturedProducts(take = 8): Promise<Product[]> {
  return getProducts({ take, sort: 'featured' });
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetchCatalog('/catalog/categories', 300);
    if (res?.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // Fallback
  }

  return [
    { id: 'cat-mac', name: 'Mac', slug: 'mac', sortOrder: 1 },
    { id: 'cat-iphone', name: 'iPhone', slug: 'iphone', sortOrder: 2 },
    { id: 'cat-ipad', name: 'iPad', slug: 'ipad', sortOrder: 3 },
    { id: 'cat-watch', name: 'Apple Watch', slug: 'watch', sortOrder: 4 },
    { id: 'cat-audio', name: 'Audio', slug: 'audio', sortOrder: 5 },
    { id: 'cat-acc', name: 'Accesorios', slug: 'accesorios', sortOrder: 6 },
  ];
}

export async function getMenu(): Promise<MenuCategory[]> {
  try {
    const res = await fetchCatalog('/catalog/menu', 300);
    if (res?.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // Header sigue hardcodeado; este cliente es para la siguiente fase.
  }
  return [];
}

export async function getHomeSummary(): Promise<HomeSummary> {
  try {
    const res = await fetchCatalog('/catalog/home-summary', 180);
    if (res?.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.heroSlides)) {
        return {
          heroSlides: data.heroSlides,
          categoryMinPrices: data.categoryMinPrices ?? {},
          accessoryMinPrices: data.accessoryMinPrices ?? {},
        };
      }
    }
  } catch {
    // Fallback estático en los componentes del Home
  }
  return {
    heroSlides: [],
    categoryMinPrices: {},
    accessoryMinPrices: {},
  };
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetchCatalog(`/catalog/products/${slug}`, 60);
    if (res?.ok) {
      const data = await res.json();
      if (data && data.id) return data;
    }
  } catch {
    // Fallback
  }
  return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
}

export async function getDeviceModels(params?: {
  brand?: string;
  kind?: string;
}): Promise<DeviceModel[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.brand) searchParams.set('brand', params.brand);
    if (params?.kind) searchParams.set('kind', params.kind);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await fetchCatalog(`/catalog/device-models${query}`, 300);
    if (res?.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch {
    // API no disponible
  }
  return [];
}

export async function getCompatibleAccessories(slug: string): Promise<Product[]> {
  try {
    const res = await fetchCatalog(`/catalog/products/${slug}/accessories`, 60);
    if (res?.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch {
    // API no disponible
  }
  return [];
}

export interface CouponValidationResult {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
}

export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<CouponValidationResult | null> {
  try {
    const res = await fetch(
      `${API_URL}/whatsapp/coupon/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`,
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export interface CheckoutPayload {
  items: { variantId: string; quantity: number; hasProtection?: boolean }[];
  customerName: string;
  couponCode?: string;
  shipping?: {
    name: string;
    phone?: string;
    address?: string;
    city?: string;
    notes?: string;
  };
}

export async function checkoutWhatsapp(
  payload: CheckoutPayload,
): Promise<WhatsappCheckoutResponse> {
  const res = await fetch(`${API_URL}/whatsapp/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error en checkout');
  }
  return res.json();
}
