// ============================================================
// iZone Tech — Shared Types & DTOs (v2)
// Paquete compartido entre frontend (Next.js) y backend (NestJS)
// ============================================================

// ======================== ENUMS ========================

export enum OrderStatus {
  DRAFT = 'draft',
  RESERVED = 'reserved',
  WA_CONTACTED = 'wa_contacted',
  PAYMENT_PENDING = 'payment_pending',
  PAID = 'paid',
  PREPARING = 'preparing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN_INVENTARIO = 'ADMIN_INVENTARIO',
  ASESOR_VENTAS = 'ASESOR_VENTAS',
  EDITOR = 'EDITOR',
}

export enum SyncStatus {
  SYNCED = 'synced',
  PENDING_SYNC = 'pending_sync',
  ERROR = 'error',
}

export enum ProductCondition {
  NUEVO_SELLADO = 'NUEVO_SELLADO',
  SEMINUEVO_CERTIFICADO = 'SEMINUEVO_CERTIFICADO',
  OPEN_BOX = 'OPEN_BOX',
}

export enum ProductKind {
  EQUIPMENT = 'equipment',
  ACCESSORY = 'accessory',
}

export enum DeviceKind {
  PHONE = 'phone',
  TABLET = 'tablet',
  LAPTOP = 'laptop',
  WATCH = 'watch',
}

export enum AccessoryMaterial {
  SILICONA = 'silicona',
  CUERO = 'cuero',
  HIBRIDO = 'hibrido',
  DISENO = 'diseno',
  OTRO = 'otro',
}

// ======================== ENTITIES ========================

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export interface DeviceModel {
  id: string;
  name: string;
  slug: string;
  kind: DeviceKind;
  year?: number | null;
  isActive: boolean;
  sortOrder: number;
  brandId: string;
  brand: Brand;
}

export interface ProductCompatibility {
  productId: string;
  deviceModelId: string;
  deviceModel?: DeviceModel;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  badge?: string | null;
  highlight?: boolean;
  isActive?: boolean;
  sortOrder: number;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
}

export interface MenuSubcategory {
  title: string;
  href: string;
  description?: string;
}

export interface MenuFeaturedProduct {
  name: string;
  description: string;
  image: string;
  href: string;
  price: string;
}

export interface MenuCategory {
  name: string;
  slug: string;
  href: string;
  badge?: string;
  highlight?: boolean;
  subcategories?: MenuSubcategory[];
  featuredProduct?: MenuFeaturedProduct;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Variant {
  id: string;
  productId: string;
  colorName?: string | null;
  colorHex?: string | null;
  storage?: string | null;
  material?: AccessoryMaterial | null;
  condition: ProductCondition;
  price: number;
  comparePrice?: number | null;
  sku: string;
  stock: number;
  reservedStock: number;
  featuredImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SpecDefinition {
  id: string;
  groupName: string;
  label: string;
  unit?: string | null;
  sortOrder: number;
}

export interface ProductSpec {
  id: string;
  productId: string;
  specId: string;
  spec: SpecDefinition;
  value: string;
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
  subtitle?: string | null;
  heroBadge?: string | null;
  description: string;
  images?: string[];
  isFeatured: boolean;
  isActive: boolean;
  isTradeInEligible: boolean;
  warrantyMonths: number;
  productKind: ProductKind;
  seoTitle?: string | null;
  seoDescription?: string | null;
  brandId: string;
  brand: Brand;
  categoryId: string;
  category: Category;
  deviceModelId?: string | null;
  deviceModel?: DeviceModel | null;
  tags: Tag[];
  variants: Variant[];
  specs: ProductSpec[];
  reviews: Review[];
  /** Promedio de reseñas aprobadas (null si no hay). */
  ratingAverage?: number | null;
  /** Número de reseñas aprobadas. */
  reviewCount?: number;
  compatibilities?: ProductCompatibility[];
  groupedSpecs?: Record<string, { label: string; value: string; unit?: string | null }[]>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  heroBadge?: string | null;
  description: string;
  images?: string[];
  brand: Brand;
  category: Category;
  variants: Pick<Variant, 'id' | 'colorName' | 'colorHex' | 'storage' | 'material' | 'condition' | 'price' | 'comparePrice' | 'stock'>[];
  isFeatured: boolean;
  isTradeInEligible: boolean;
  productKind?: ProductKind;
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
  orderRef: string;
  customerId?: string;
  customer?: Customer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  totalAmount: number;
  couponCode?: string;
  paymentMethod: string;
  status: OrderStatus;
  reservedUntil?: string | null;
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
  name?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ======================== TRADE-IN ========================

export interface TradeInModel {
  id: string;
  name: string;
  slug: string;
  brandSlug: string;
  categorySlug: string;
  baseValue: number;
  maxValue: number;
  image?: string | null;
  isActive: boolean;
}

export interface TradeInQuestionOption {
  label: string;
  deductionPercent: number;
}

export interface TradeInQuestion {
  id: string;
  question: string;
  description?: string | null;
  sortOrder: number;
  options: TradeInQuestionOption[];
  isActive: boolean;
}

export interface TradeInRequest {
  id: string;
  customerId?: string;
  tradeInModelId: string;
  tradeInModel: TradeInModel;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  answers: Record<string, string>;
  estimatedValue: number;
  status: string;
  notes?: string;
  createdAt: string;
}

// ======================== COMPARATOR ========================

export interface ComparisonSpec {
  group: string;
  label: string;
  unit?: string | null;
  values: string[];
}

export interface ComparisonProduct {
  id: string;
  name: string;
  slug: string;
  image?: string;
  startingPrice: number | null;
  brand: string;
  category: string;
}

export interface ComparisonResult {
  products: ComparisonProduct[];
  specs: ComparisonSpec[];
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
  orderId: string;
  orderRef: string;
  url: string;
  subtotal: number;
  discount: number;
  total: number;
}

export interface CreateProductDto {
  name: string;
  slug: string;
  subtitle?: string;
  heroBadge?: string;
  description: string;
  images?: string[];
  seoTitle?: string;
  seoDescription?: string;
  brandId: string;
  categoryId: string;
  tagIds?: string[];
  isFeatured?: boolean;
  isTradeInEligible?: boolean;
  warrantyMonths?: number;
  variants: CreateVariantDto[];
}

export interface CreateVariantDto {
  colorName?: string;
  colorHex?: string;
  storage?: string;
  material?: AccessoryMaterial;
  condition?: ProductCondition;
  price: number;
  comparePrice?: number;
  sku: string;
  stock: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CreateReviewDto {
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
  user: {
    id: string;
    email: string;
    name?: string | null;
    role: Role;
  };
}

export interface TradeInEstimateDto {
  tradeInModelId: string;
  answers: Record<string, string>;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
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
  condition?: ProductCondition;
  productKind?: ProductKind;
  compatibleWith?: string;
  material?: AccessoryMaterial;
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

export interface HomeHeroSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  priceText: string;
  badge?: string;
}

export interface HomeSummary {
  heroSlides: HomeHeroSlide[];
  categoryMinPrices: Record<string, number>;
  accessoryMinPrices: Record<string, number>;
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
 * Ejemplo: "Titanio Natural – 256GB" o "Negro – Silicona"
 */
export function variantLabel(
  variant: Pick<Variant, 'colorName' | 'storage' | 'material'>,
): string {
  const materialLabels: Record<string, string> = {
    silicona: 'Silicona',
    cuero: 'Cuero',
    hibrido: 'Híbrido',
    diseno: 'Diseño',
    otro: 'Otro',
  };
  const material = variant.material
    ? materialLabels[variant.material] || variant.material
    : null;
  const parts = [variant.colorName, material, variant.storage].filter(Boolean);
  return parts.join(' – ') || 'Estándar';
}

/**
 * Returns the condition label in Spanish.
 */
export function conditionLabel(condition: ProductCondition): string {
  const labels: Record<ProductCondition, string> = {
    [ProductCondition.NUEVO_SELLADO]: 'Nuevo Sellado',
    [ProductCondition.SEMINUEVO_CERTIFICADO]: 'Seminuevo Certificado',
    [ProductCondition.OPEN_BOX]: 'Open Box',
  };
  return labels[condition] || condition;
}

/**
 * Returns the available stock (total stock minus reserved).
 */
export function availableStock(variant: Pick<Variant, 'stock' | 'reservedStock'>): number {
  return Math.max(0, variant.stock - variant.reservedStock);
}
