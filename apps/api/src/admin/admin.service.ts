import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AccessoryMaterial,
  Prisma,
  ProductCondition,
  ProductKind,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductDto,
  CreateVariantDto,
  UpdateProductBundleDto,
  UpdateProductDto,
  UpdateVariantDto,
} from './dto/admin-catalog.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.product.update({
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

    return this.getProduct(id);
  }

  async updateVariant(id: string, data: UpdateVariantDto) {
    const variant = await this.prisma.variant.findUnique({ where: { id } });
    if (!variant) throw new NotFoundException('Variante no encontrada');

    try {
      return await this.prisma.variant.update({
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
    } catch (error) {
      this.rethrowUnique(error, 'SKU ya existe');
    }
  }

  async createVariant(productId: string, data: CreateVariantDto) {
    await this.ensureProduct(productId);
    try {
      return await this.prisma.variant.create({
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
    } catch (error) {
      this.rethrowUnique(error, 'SKU ya existe');
    }
  }

  async createProduct(data: CreateProductDto) {
    try {
      return await this.prisma.product.create({
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
