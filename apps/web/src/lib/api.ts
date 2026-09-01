import type {
  Product,
  WhatsappCheckoutResponse,
  CartItem,
} from '@izone/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/catalog/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    console.error('API Connection Error — is the backend running?');
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

export async function checkoutWhatsapp(
  items: Pick<CartItem, 'variantId' | 'quantity'>[],
  customerName: string,
): Promise<WhatsappCheckoutResponse> {
  const res = await fetch(`${API_URL}/whatsapp/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, customerName }),
  });
  return res.json();
}
