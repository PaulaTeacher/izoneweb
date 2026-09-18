import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProductKind } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductDto,
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

  async updateVariant(id: string, data: UpdateVariantDto) {
    const variant = await this.prisma.variant.findUnique({ where: { id } });
    if (!variant) throw new NotFoundException('Variante no encontrada');

    return this.prisma.variant.update({
      where: { id },
      data: {
        price: data.price,
        comparePrice: data.comparePrice === undefined ? undefined : data.comparePrice,
        stock: data.stock,
        colorName: data.colorName,
        featuredImage: data.featuredImage,
      },
      include: { product: { select: { id: true, slug: true, name: true } } },
    });
  }

  async createProduct(data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        brandId: data.brandId,
        categoryId: data.categoryId,
        productKind: (data.productKind as ProductKind) || ProductKind.equipment,
        images: data.images || [],
        isActive: true,
      },
      include: {
        brand: true,
        category: true,
        variants: true,
      },
    });
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

  private async ensureProduct(id: string) {
    const exists = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Producto no encontrado');
  }
}
