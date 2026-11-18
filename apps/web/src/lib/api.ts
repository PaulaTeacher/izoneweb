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

/**
 * Cloud Run escala a cero: la primera petición tras inactividad puede tardar
 * varios segundos en arrancar la API. Damos margen y reintentamos una vez.
 */
export const CATALOG_FETCH_TIMEOUT_MS = 12_000;
const CATALOG_RETRY_DELAY_MS = 500;

/**
 * La API del catálogo no respondió (red, timeout o 5xx). Es distinto de un 404:
 * se lanza para que Next muestre el error boundary y NO guarde en caché (ISR)
 * una página vacía o un "producto no existe".
 */
export class CatalogUnavailableError extends Error {
  constructor(path: string, cause?: unknown) {
    super(`Catálogo no disponible: ${path}`);
    this.name = 'CatalogUnavailableError';
    this.cause = cause;
  }
}

/** Fallback a datos mock solo fuera de producción (dev local sin API). */
function mockFallbackEnabled(): boolean {
  return process.env.NODE_ENV !== 'production';
}

async function fetchOnce(path: string, revalidateSeconds: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CATALOG_FETCH_TIMEOUT_MS);
  try {
    return await fetch(`${API_URL}${path}`, {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds, tags: ['catalog'] },
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Devuelve la respuesta de la API si respondió (2xx o 4xx).
 * Lanza CatalogUnavailableError si no se pudo contactar o respondió 5xx,
 * tras un reintento.
 */
export async function fetchCatalog(
  path: string,
  revalidateSeconds = 180,
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, CATALOG_RETRY_DELAY_MS));
    }
    try {
      const res = await fetchOnce(path, revalidateSeconds);
      if (res.status < 500) return res;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
  }
  throw new CatalogUnavailableError(path, lastError);
}

/** JSON de una respuesta 2xx; si el cuerpo no es JSON válido, la API está mal. */
async function readJson(res: Response, path: string): Promise<unknown> {
  try {
    return await res.json();
  } catch (err) {
    throw new CatalogUnavailableError(path, err);
  }
}

/**
 * Ejecuta una lectura del catálogo. Si la API no está disponible:
 * en dev usa `fallback()`; en producción relanza el error.
 */
async function withFallback<T>(read: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await read();
  } catch (err) {
    if (err instanceof CatalogUnavailableError && mockFallbackEnabled()) {
      return fallback();
    }
    throw err;
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
  const path = `/catalog/products${query}`;

  return withFallback(
    async () => {
      const res = await fetchCatalog(path);
      if (!res.ok) return [];
      const data = await readJson(res, path);
      if (!Array.isArray(data)) throw new CatalogUnavailableError(path);
      return data as Product[];
    },
    () => filterMockProducts(params),
  );
}

/** Solo dev: filtra los productos mock como lo haría la API. */
function filterMockProducts(params?: {
  category?: string;
  search?: string;
  tag?: string;
  featured?: boolean;
  take?: number;
  sort?: string;
}): Product[] {
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
  const path = '/catalog/categories';
  return withFallback(
    async () => {
      const res = await fetchCatalog(path, 300);
      const data = res.ok ? await readJson(res, path) : null;
      if (Array.isArray(data) && data.length > 0) return data as Category[];
      return FALLBACK_CATEGORIES;
    },
    () => FALLBACK_CATEGORIES,
  );
}

const FALLBACK_CATEGORIES: Category[] = [
  { id: 'cat-mac', name: 'Mac', slug: 'mac', sortOrder: 1 },
  { id: 'cat-iphone', name: 'iPhone', slug: 'iphone', sortOrder: 2 },
  { id: 'cat-ipad', name: 'iPad', slug: 'ipad', sortOrder: 3 },
  { id: 'cat-watch', name: 'Apple Watch', slug: 'watch', sortOrder: 4 },
  { id: 'cat-audio', name: 'Audio', slug: 'audio', sortOrder: 5 },
  { id: 'cat-acc', name: 'Accesorios', slug: 'accesorios', sortOrder: 6 },
];

export async function getMenu(): Promise<MenuCategory[]> {
  try {
    const res = await fetchCatalog('/catalog/menu', 300);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // Header sigue hardcodeado; este cliente es para la siguiente fase.
  }
  return [];
}

const EMPTY_HOME_SUMMARY: HomeSummary = {
  heroSlides: [],
  categoryMinPrices: {},
  accessoryMinPrices: {},
};

export async function getHomeSummary(): Promise<HomeSummary> {
  const path = '/catalog/home-summary';
  return withFallback(
    async () => {
      const res = await fetchCatalog(path, 180);
      if (!res.ok) return EMPTY_HOME_SUMMARY;
      const data = (await readJson(res, path)) as Partial<HomeSummary> | null;
      if (!data || !Array.isArray(data.heroSlides)) throw new CatalogUnavailableError(path);
      return {
        heroSlides: data.heroSlides,
        categoryMinPrices: data.categoryMinPrices ?? {},
        accessoryMinPrices: data.accessoryMinPrices ?? {},
      };
    },
    () => EMPTY_HOME_SUMMARY,
  );
}

/**
 * Producto por slug.
 * - `null` solo si la API respondió 404/4xx (el producto no existe → notFound()).
 * - Si la API no responde: lanza CatalogUnavailableError en producción
 *   (Next muestra error/reintento y no cachea un 404 falso); en dev usa mocks.
 */
export async function getProduct(slug: string): Promise<Product | null> {
  const path = `/catalog/products/${encodeURIComponent(slug)}`;
  return withFallback(
    async () => {
      const res = await fetchCatalog(path, 60);
      if (!res.ok) return null;
      const data = (await readJson(res, path)) as Product | null;
      if (!data || !data.id) throw new CatalogUnavailableError(path);
      return data;
    },
    () => MOCK_PRODUCTS.find((p) => p.slug === slug) || null,
  );
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
    if (res.ok) {
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
    const res = await fetchCatalog(
      `/catalog/products/${encodeURIComponent(slug)}/accessories`,
      60,
    );
    if (res.ok) {
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

export interface ReviewSubmission {
  customerName: string;
  rating: number;
  comment: string;
  /** Honeypot: must stay empty. */
  website?: string;
}

/** Envía una reseña; queda pendiente hasta que un admin la apruebe. */
export async function submitReview(slug: string, payload: ReviewSubmission): Promise<void> {
  const res = await fetch(`${API_URL}/catalog/products/${encodeURIComponent(slug)}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.status === 429) {
    throw new Error('Has enviado varias reseñas seguidas. Intenta de nuevo en unos minutos.');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = Array.isArray(err.message) ? err.message[0] : err.message;
    throw new Error(msg || 'No pudimos enviar tu reseña. Intenta de nuevo.');
  }
}
