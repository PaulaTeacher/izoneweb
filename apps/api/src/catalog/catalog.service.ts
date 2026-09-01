import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async getProducts(params: {
    categorySlug?: string;
    search?: string;
    tagSlug?: string;
    brandSlug?: string;
  }) {
    const { categorySlug, search, tagSlug, brandSlug } = params;
    return this.prisma.product.findMany({
      where: {
        category: categorySlug ? { slug: categorySlug } : undefined,
        brand: brandSlug ? { slug: brandSlug } : undefined,
        tags: tagSlug ? { some: { slug: tagSlug } } : undefined,
        name: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      include: {
        variants: true,
        category: true,
        brand: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async getProductBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        category: true,
        brand: true,
        tags: true,
        reviews: { where: { isApproved: true } },
      },
    });
  }
}
