import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async getProducts(params: { categorySlug?: string; search?: string }) {
    const { categorySlug, search } = params;
    return this.prisma.product.findMany({
      where: {
        category: categorySlug ? { slug: categorySlug } : undefined,
        name: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      include: {
        variants: true,
        category: true,
        brand: true,
      }
    });
  }

  async getProductBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: { variants: true, category: true, brand: true, reviews: { where: { isApproved: true } } }
    });
  }
}
