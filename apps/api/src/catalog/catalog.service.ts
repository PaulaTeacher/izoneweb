import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function formatCOP(price: number): string {
  return `$ ${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

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

  /**
   * Árbol de navegación (mega menú): familias ordenadas con sus
   * subcategorías y un producto destacado por familia. Dirige el Header
   * del frontend en lugar de una lista hardcodeada.
   */
  async getMenu() {
    const families = await this.prisma.category.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { order: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    const menu = [];
    for (const family of families) {
      const familyCategoryIds = [family.id, ...family.children.map((c) => c.id)];

      const featured = await this.prisma.product.findFirst({
        where: {
          categoryId: { in: familyCategoryIds },
          isFeatured: true,
          isActive: true,
        },
        include: { variants: { orderBy: { price: 'asc' }, take: 1 } },
        orderBy: { createdAt: 'desc' },
      });

      let featuredProduct: unknown = undefined;
      if (featured) {
        const minPrice = featured.variants[0] ? Number(featured.variants[0].price) : 0;
        featuredProduct = {
          name: featured.name,
          description: featured.description,
          image: featured.images?.[0] ?? '',
          href: `/product/${featured.slug}`,
          price: minPrice ? `Desde ${formatCOP(minPrice)}` : '',
        };
      }

      menu.push({
        name: family.name,
        slug: family.slug,
        // TODO(Fase 2): apuntar a la PLP real `/${family.slug}`.
        href: '/#catalogo',
        badge: family.badge ?? undefined,
        highlight: family.highlight,
        subcategories: family.children.map((child) => ({
          title: child.name,
          href: '/#catalogo',
          description: child.description ?? undefined,
        })),
        featuredProduct,
      });
    }

    return menu;
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
