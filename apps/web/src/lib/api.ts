import type {
  Product,
  Category,
  MenuCategory,
  WhatsappCheckoutResponse,
} from '@izone/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getProducts(params?: {
  category?: string;
  search?: string;
  tag?: string;
}): Promise<Product[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.tag) searchParams.set('tag', params.tag);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await fetch(`${API_URL}/catalog/products${query}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/catalog/categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getMenu(): Promise<MenuCategory[]> {
  try {
    const res = await fetch(`${API_URL}/catalog/menu`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/catalog/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
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
  items: { variantId: string; quantity: number }[];
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
