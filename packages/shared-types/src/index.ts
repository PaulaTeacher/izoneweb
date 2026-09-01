// ============================================================
// iZone Tech — Shared Types & DTOs
// Paquete compartido entre frontend (Next.js) y backend (NestJS)
// ============================================================

// ======================== ENUMS ========================

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  EDITOR = 'EDITOR',
}

export enum SyncStatus {
  SYNCED = 'synced',
  PENDING_SYNC = 'pending_sync',
  ERROR = 'error',
}

// ======================== ENTITIES ========================

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Variant {
  id: string;
  productId: string;
  color?: string;
  storage?: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images?: string[];
  seoTitle?: string;
  seoDescription?: string;
  brandId: string;
  brand: Brand;
  categoryId: string;
  category: Category;
  tags: Tag[];
  variants: Variant[];
  reviews: Review[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  images?: string[];
  brand: Brand;
  category: Category;
  variants: Pick<Variant, 'id' | 'color' | 'storage' | 'price' | 'stock'>[];
  isFeatured: boolean;
}

export interface Customer {
  id: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  name: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerId?: string;
  customer?: Customer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  couponCode?: string;
  paymentMethod: string;
  status: OrderStatus;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  validFrom: string;
  validUntil?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// ======================== DTOs ========================

export interface CartItem {
  variantId: string;
  quantity: number;
  // Client-side enrichment
  product?: Product;
  variant?: Variant;
}

export interface WhatsappCheckoutDto {
  items: CartItem[];
  customerName: string;
  customerPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingNotes?: string;
}

export interface WhatsappCheckoutResponse {
  url: string;
  total: number;
  formattedTotal: string;
}

export interface CreateProductDto {
  name: string;
  slug: string;
  description: string;
  images?: string[];
  seoTitle?: string;
  seoDescription?: string;
  brandId: string;
  categoryId: string;
  tagIds?: string[];
  isFeatured?: boolean;
  variants: CreateVariantDto[];
}

export interface CreateVariantDto {
  color?: string;
  storage?: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  images?: string[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CreateReviewDto {
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
}

export interface CreateOrderDto {
  items: CartItem[];
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingNotes?: string;
  couponCode?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<AdminUser, 'createdAt' | 'updatedAt'>;
}

// ======================== API RESPONSES ========================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CatalogFilters {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'name_asc' | 'name_desc';
  page?: number;
  pageSize?: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

// ======================== UTILITIES ========================

/**
 * Formatea un precio numérico a formato COP colombiano.
 * Ejemplo: 5499000 → "$ 5.499.000"
 */
export function formatCOP(price: number): string {
  return `$ ${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

/**
 * Genera un label legible para una variante.
 * Ejemplo: "Titanio Natural - 256GB"
 */
export function variantLabel(variant: Pick<Variant, 'color' | 'storage'>): string {
  const parts = [variant.color, variant.storage].filter(Boolean);
  return parts.join(' – ') || 'Estándar';
}
