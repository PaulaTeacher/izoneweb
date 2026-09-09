import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

interface GetProductsParams {
  categorySlug?: string;
  search?: string;
  tagSlug?: string;
  brandSlug?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async getProducts(params: GetProductsParams) {
    const {
      categorySlug,
      search,
      tagSlug,
      brandSlug,
      condition,
      minPrice,
      maxPrice,
      sort,
    } = params;

    // Build variant filter for price range and condition
    const variantFilter: Prisma.VariantWhereInput = {};
    if (condition) {
      variantFilter.condition = condition as any;
    }
    if (minPrice !== undefined) {
      variantFilter.price = { ...(variantFilter.price as any), gte: minPrice };
    }
    if (maxPrice !== undefined) {
      variantFilter.price = { ...(variantFilter.price as any), lte: maxPrice };
    }

    // Build sort
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'name_asc') orderBy = { name: 'asc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        category: categorySlug ? { slug: categorySlug } : undefined,
        brand: brandSlug ? { slug: brandSlug } : undefined,
        tags: tagSlug ? { some: { slug: tagSlug } } : undefined,
        name: search
          ? { contains: search, mode: 'insensitive' }
          : undefined,
        // Filter products that have at least one matching variant
        ...(Object.keys(variantFilter).length > 0
          ? { variants: { some: variantFilter } }
          : {}),
      },
      include: {
        variants: {
          orderBy: { price: 'asc' },
        },
        category: true,
        brand: true,
        tags: true,
      },
      orderBy,
    });

    // Post-query sort by price if needed (since price is on variants)
    if (sort === 'price_asc') {
      products.sort((a, b) => {
        const aMin = Math.min(...a.variants.map((v) => Number(v.price)));
        const bMin = Math.min(...b.variants.map((v) => Number(v.price)));
        return aMin - bMin;
      });
    }
    if (sort === 'price_desc') {
      products.sort((a, b) => {
        const aMin = Math.min(...a.variants.map((v) => Number(v.price)));
        const bMin = Math.min(...b.variants.map((v) => Number(v.price)));
        return bMin - aMin;
      });
    }

    return products;
  }

  async getCategories() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async getBrands() {
    return this.prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        variants: {
          orderBy: { price: 'asc' },
        },
        category: true,
        brand: true,
        tags: true,
        specs: {
          include: {
            spec: true,
          },
          orderBy: {
            spec: { sortOrder: 'asc' },
          },
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto "${slug}" no encontrado`);
    }

    // Group specs by category for frontend rendering
    const groupedSpecs: Record<string, { label: string; value: string; unit?: string | null }[]> = {};
    for (const ps of product.specs) {
      const group = ps.spec.groupName;
      if (!groupedSpecs[group]) {
        groupedSpecs[group] = [];
      }
      groupedSpecs[group].push({
        label: ps.spec.label,
        value: ps.value,
        unit: ps.spec.unit,
      });
    }

    return {
      ...product,
      groupedSpecs,
    };
  }

  async compareProducts(slugs: string[]) {
    const products = await this.prisma.product.findMany({
      where: {
        slug: { in: slugs },
        isActive: true,
      },
      include: {
        variants: {
          where: { condition: 'NUEVO_SELLADO' },
          orderBy: { price: 'asc' },
          take: 1,
        },
        brand: true,
        category: true,
        specs: {
          include: { spec: true },
          orderBy: { spec: { sortOrder: 'asc' } },
        },
      },
    });

    if (products.length === 0) {
      throw new NotFoundException('No se encontraron productos para comparar');
    }

    // Collect all unique spec definitions across products
    const allSpecIds = new Set<string>();
    for (const p of products) {
      for (const ps of p.specs) {
        allSpecIds.add(ps.specId);
      }
    }

    // Get all spec definitions
    const specDefs = await this.prisma.specDefinition.findMany({
      where: { id: { in: Array.from(allSpecIds) } },
      orderBy: { sortOrder: 'asc' },
    });

    // Build comparison matrix
    const comparison = specDefs.map((sd) => ({
      group: sd.groupName,
      label: sd.label,
      unit: sd.unit,
      values: products.map((p) => {
        const ps = p.specs.find((s) => s.specId === sd.id);
        return ps?.value ?? '—';
      }),
    }));

    return {
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        image: p.images?.[0],
        startingPrice: p.variants[0] ? Number(p.variants[0].price) : null,
        brand: p.brand.name,
        category: p.category.name,
      })),
      specs: comparison,
    };
  }
}
