import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AccessoryMaterial,
  OrderStatus,
  Prisma,
  ProductCondition,
  ProductKind,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { catalogCache } from '../catalog/memory-cache';
import {
  CreateProductDto,
  CreateVariantDto,
  UpdateProductBundleDto,
  UpdateProductDto,
  UpdateVariantDto,
} from './dto/admin-catalog.dto';
import { UpdateOrderStatusDto } from './dto/admin-orders.dto';

const RESERVED_PIPELINE: OrderStatus[] = [
  OrderStatus.reserved,
  OrderStatus.wa_contacted,
  OrderStatus.payment_pending,
];

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private invalidateCatalogCache() {
    catalogCache.clear();
  }

  listProducts(params: { search?: string; productKind?: string; take?: number }) {
    const take = Math.min(Math.max(params.take || 100, 1), 300);
    const where: Prisma.ProductWhereInput = {};

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { slug: { contains: params.search, mode: 'insensitive' } },
        { variants: { some: { sku: { contains: params.search, mode: 'insensitive' } } } },
      ];
    }
    if (params.productKind === 'equipment' || params.productKind === 'accessory') {
      where.productKind = params.productKind as ProductKind;
    }

    return this.prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: { include: { parent: true } },
        variants: { orderBy: { price: 'asc' } },
      },
      orderBy: [{ updatedAt: 'desc' }],
      take,
    });
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: { include: { parent: true } },
        variants: { orderBy: { price: 'asc' } },
        compatibilities: {
          include: { deviceModel: { include: { brand: true } } },
        },
      },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    await this.ensureProduct(id);
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        subtitle: data.subtitle,
        description: data.description,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        images: data.images,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        warrantyMonths: data.warrantyMonths,
      },
      include: {
        brand: true,
        category: true,
        variants: { orderBy: { price: 'asc' } },
      },
    });
    this.invalidateCatalogCache();
    return product;
  }

  /**
   * Actualiza producto + variantes en una sola transacción.
   * Evita que la tienda quede con precio nuevo y stock viejo (o viceversa).
   */
  async updateProductBundle(id: string, data: UpdateProductBundleDto) {
    await this.ensureProduct(id);

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.product.update({
          where: { id },
          data: {
            name: data.name,
            subtitle: data.subtitle,
            description: data.description,
            isActive: data.isActive,
            isFeatured: data.isFeatured,
            images: data.images ? this.cleanImages(data.images) : undefined,
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
            warrantyMonths: data.warrantyMonths,
          },
        });

        for (const v of data.variants || []) {
          const variantData = {
            sku: v.sku.trim(),
            price: v.price,
            comparePrice: v.comparePrice ?? null,
            stock: v.stock ?? 0,
            colorName: v.colorName ?? null,
            colorHex: v.colorHex ?? null,
            storage: v.storage ?? null,
            featuredImage: v.featuredImage ?? null,
            condition: (v.condition as ProductCondition) || undefined,
            material: v.material === undefined
              ? undefined
              : v.material === null
                ? null
                : (v.material as AccessoryMaterial),
          };

          if (v.id) {
            const owned = await tx.variant.findFirst({
              where: { id: v.id, productId: id },
              select: { id: true },
            });
            if (!owned) {
              throw new NotFoundException(`Variante ${v.id} no pertenece al producto`);
            }
            await tx.variant.update({
              where: { id: v.id },
              data: variantData,
            });
          } else {
            await tx.variant.create({
              data: {
                productId: id,
                ...variantData,
                condition:
                  (v.condition as ProductCondition) || ProductCondition.NUEVO_SELLADO,
                material: v.material ? (v.material as AccessoryMaterial) : null,
                stock: v.stock ?? 0,
              },
            });
          }
        }
      });
    } catch (error) {
      this.rethrowUnique(error, 'Slug o SKU ya existe');
    }

    this.invalidateCatalogCache();
    return this.getProduct(id);
  }

  async updateVariant(id: string, data: UpdateVariantDto) {
    const variant = await this.prisma.variant.findUnique({ where: { id } });
    if (!variant) throw new NotFoundException('Variante no encontrada');

    try {
      const updated = await this.prisma.variant.update({
        where: { id },
        data: {
          sku: data.sku,
          price: data.price,
          comparePrice: data.comparePrice === undefined ? undefined : data.comparePrice,
          stock: data.stock,
          colorName: data.colorName,
          colorHex: data.colorHex,
          storage: data.storage,
          featuredImage: data.featuredImage,
          condition: data.condition as ProductCondition | undefined,
          material:
            data.material === undefined
              ? undefined
              : data.material === null
                ? null
                : (data.material as AccessoryMaterial),
        },
        include: { product: { select: { id: true, slug: true, name: true } } },
      });
      this.invalidateCatalogCache();
      return updated;
    } catch (error) {
      this.rethrowUnique(error, 'SKU ya existe');
    }
  }

  async createVariant(productId: string, data: CreateVariantDto) {
    await this.ensureProduct(productId);
    try {
      const created = await this.prisma.variant.create({
        data: {
          productId,
          sku: data.sku.trim(),
          price: data.price,
          comparePrice: data.comparePrice ?? null,
          stock: data.stock ?? 0,
          colorName: data.colorName ?? null,
          colorHex: data.colorHex ?? null,
          storage: data.storage ?? null,
          featuredImage: data.featuredImage ?? null,
          condition: (data.condition as ProductCondition) || ProductCondition.NUEVO_SELLADO,
          material: data.material ? (data.material as AccessoryMaterial) : null,
        },
        include: { product: { select: { id: true, slug: true, name: true } } },
      });
      this.invalidateCatalogCache();
      return created;
    } catch (error) {
      this.rethrowUnique(error, 'SKU ya existe');
    }
  }

  async createProduct(data: CreateProductDto) {
    try {
      const created = await this.prisma.product.create({
        data: {
          name: data.name.trim(),
          slug: data.slug.trim(),
          description: data.description.trim(),
          brandId: data.brandId,
          categoryId: data.categoryId,
          productKind: (data.productKind as ProductKind) || ProductKind.equipment,
          images: this.cleanImages(data.images),
          isActive: data.isActive ?? true,
          isFeatured: data.isFeatured ?? false,
          seoTitle: data.seoTitle ?? null,
          seoDescription: data.seoDescription ?? null,
          variants: data.variants?.length
            ? {
                create: data.variants.map((v) => ({
                  sku: v.sku.trim(),
                  price: v.price,
                  comparePrice: v.comparePrice ?? null,
                  stock: v.stock ?? 0,
                  colorName: v.colorName ?? null,
                  colorHex: v.colorHex ?? null,
                  storage: v.storage ?? null,
                  featuredImage: v.featuredImage ?? null,
                  condition:
                    (v.condition as ProductCondition) || ProductCondition.NUEVO_SELLADO,
                  material: v.material ? (v.material as AccessoryMaterial) : null,
                })),
              }
            : undefined,
        },
        include: {
          brand: true,
          category: true,
          variants: { orderBy: { price: 'asc' } },
        },
      });
      this.invalidateCatalogCache();
      return created;
    } catch (error) {
      this.rethrowUnique(error, 'Slug o SKU ya existe');
    }
  }

  listBrands() {
    return this.prisma.brand.findMany({ orderBy: { name: 'asc' } });
  }

  listCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { parent: true },
    });
  }

  listOrders(params: { search?: string; status?: OrderStatus; take?: number }) {
    const take = Math.min(Math.max(params.take || 50, 1), 200);
    const where: Prisma.OrderWhereInput = {};

    if (params.status) where.status = params.status;
    if (params.search?.trim()) {
      const q = params.search.trim();
      where.OR = [
        { id: { contains: q, mode: 'insensitive' } },
        { orderRef: { contains: q, mode: 'insensitive' } },
        { shippingName: { contains: q, mode: 'insensitive' } },
        { shippingPhone: { contains: q, mode: 'insensitive' } },
        { shippingCity: { contains: q, mode: 'insensitive' } },
        { couponCode: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: { orderBy: { name: 'asc' } },
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  async getOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { id: true, slug: true, name: true, images: true } },
            variant: {
              select: {
                id: true,
                sku: true,
                colorName: true,
                storage: true,
                featuredImage: true,
              },
            },
          },
        },
        customer: true,
      },
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');
    return order;
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');

    const next = data.status;
    const prev = order.status;

    return this.prisma.$transaction(async (tx) => {
      if (
        next === OrderStatus.cancelled &&
        RESERVED_PIPELINE.includes(prev)
      ) {
        for (const item of order.items) {
          if (!item.variantId) continue;
          const variant = await tx.variant.findUnique({
            where: { id: item.variantId },
            select: { reservedStock: true },
          });
          if (!variant) continue;
          await tx.variant.update({
            where: { id: item.variantId },
            data: {
              reservedStock: Math.max(0, variant.reservedStock - item.quantity),
            },
          });
        }
      }

      if (
        (next === OrderStatus.paid ||
          next === OrderStatus.preparing ||
          next === OrderStatus.completed) &&
        RESERVED_PIPELINE.includes(prev)
      ) {
        for (const item of order.items) {
          if (!item.variantId) continue;
          const variant = await tx.variant.findUnique({
            where: { id: item.variantId },
            select: { stock: true, reservedStock: true },
          });
          if (!variant) continue;
          await tx.variant.update({
            where: { id: item.variantId },
            data: {
              stock: Math.max(0, variant.stock - item.quantity),
              reservedStock: Math.max(0, variant.reservedStock - item.quantity),
            },
          });
        }
      }

      return tx.order.update({
        where: { id },
        data: { status: next },
        include: {
          items: true,
          customer: true,
        },
      });
    });
  }

  private cleanImages(images?: string[]) {
    if (!images?.length) return [];
    return images.map((url) => url.trim()).filter(Boolean);
  }

  private async ensureProduct(id: string) {
    const exists = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Producto no encontrado');
  }

  private rethrowUnique(error: unknown, message: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(message);
    }
    throw error;
  }
}
