import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccessoryMaterial, DeviceKind, Prisma, ProductKind } from '@prisma/client';

interface GetProductsParams {
  categorySlug?: string;
  search?: string;
  tagSlug?: string;
  brandSlug?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  productKind?: string;
  compatibleWith?: string;
  material?: string;
  deviceBrand?: string;
  deviceKind?: string;
  featured?: boolean;
  take?: number;
}

const FAMILY_HREF: Record<string, string> = {
  mac: '/mac',
  iphone: '/iphone',
  ipad: '/ipad',
  'apple-watch': '/watch',
  audio: '/audio',
  accesorios: '/accesorios',
  ofertas: '/shop?category=ofertas',
};

function formatCOP(price: number): string {
  return `$ ${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

function familyHref(slug: string): string {
  return FAMILY_HREF[slug] ?? `/${slug}`;
}

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  /** Family (iphone) or leaf (iphone-16-pro) → that node plus children. */
  private async resolveCategoryAndDescendantIds(slug: string): Promise<string[]> {
    const aliases = slug === 'watch' ? ['watch', 'apple-watch'] : [slug];
    const category = await this.prisma.category.findFirst({
      where: { slug: { in: aliases }, isActive: true },
      include: { children: { where: { isActive: true }, select: { id: true } } },
    });
    if (!category) return [];
    return [category.id, ...category.children.map((c) => c.id)];
  }

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
      productKind,
      compatibleWith,
      material,
      deviceBrand,
      deviceKind,
      featured,
      take,
    } = params;

    const variantFilter: Prisma.VariantWhereInput = {};
    if (condition) {
      variantFilter.condition = condition as Prisma.VariantWhereInput['condition'];
    }
    if (material && Object.values(AccessoryMaterial).includes(material as AccessoryMaterial)) {
      variantFilter.material = material as AccessoryMaterial;
    }
    if (minPrice !== undefined) {
      variantFilter.price = { gte: minPrice };
    }
    if (maxPrice !== undefined) {
      variantFilter.price = {
        ...(typeof variantFilter.price === 'object' && variantFilter.price ? variantFilter.price : {}),
        lte: maxPrice,
      };
    }

    // Build sort
    let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] =
      { createdAt: 'desc' };
    if (sort === 'name_asc') orderBy = { name: 'asc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    if (featured || sort === 'featured') {
      orderBy = [{ isFeatured: 'desc' }, { updatedAt: 'desc' }];
    }

    const categoryIds = categorySlug
      ? await this.resolveCategoryAndDescendantIds(categorySlug)
      : undefined;

    if (categorySlug && categoryIds && categoryIds.length === 0) {
      return [];
    }

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: featured ? true : undefined,
        categoryId: categoryIds ? { in: categoryIds } : undefined,
        brand: brandSlug ? { slug: brandSlug } : undefined,
        tags: tagSlug ? { some: { slug: tagSlug } } : undefined,
        productKind:
          productKind === 'equipment' || productKind === 'accessory'
            ? (productKind as ProductKind)
            : undefined,
        name: search
          ? { contains: search, mode: 'insensitive' }
          : undefined,
        ...(compatibleWith || deviceBrand || deviceKind
          ? {
              compatibilities: {
                some: {
                  deviceModel: {
                    isActive: true,
                    slug: compatibleWith || undefined,
                    brand: deviceBrand ? { slug: deviceBrand } : undefined,
                    kind:
                      deviceKind && Object.values(DeviceKind).includes(deviceKind as DeviceKind)
                        ? (deviceKind as DeviceKind)
                        : undefined,
                  },
                },
              },
            }
          : {}),
        ...(Object.keys(variantFilter).length > 0
          ? { variants: { some: variantFilter } }
          : {}),
      },
      include: {
        variants: {
          orderBy: { price: 'asc' },
        },
        category: { include: { parent: true } },
        brand: true,
        tags: true,
      },
      orderBy,
      take: take ? Math.min(Math.max(take, 1), 48) : undefined,
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
      where: { parentId: null, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async getMenu() {
    const families = await this.prisma.category.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    const menu = [];
    for (const family of families) {
      const familyCategoryIds = [family.id, ...family.children.map((c) => c.id)];
      const href = familyHref(family.slug);

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
        const minPrice = featured.variants[0]
          ? Number(featured.variants[0].price)
          : 0;
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
        href,
        badge: family.badge ?? undefined,
        highlight: family.highlight,
        subcategories: family.children.map((child) => ({
          title: child.name,
          href,
          description: child.description ?? undefined,
        })),
        featuredProduct,
      });
    }

    return menu;
  }

  async getBrands() {
    return this.prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true, deviceModels: true },
        },
      },
    });
  }

  async getDeviceModels(params: { brandSlug?: string; kind?: string }) {
    const { brandSlug, kind } = params;
    return this.prisma.deviceModel.findMany({
      where: {
        isActive: true,
        brand: brandSlug ? { slug: brandSlug } : undefined,
        kind:
          kind && Object.values(DeviceKind).includes(kind as DeviceKind)
            ? (kind as DeviceKind)
            : undefined,
      },
      include: { brand: true },
      orderBy: [{ kind: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        variants: {
          orderBy: { price: 'asc' },
        },
        category: { include: { parent: true } },
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
        deviceModel: { include: { brand: true } },
        compatibilities: {
          include: { deviceModel: { include: { brand: true } } },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto "${slug}" no encontrado`);
    }

    // Storefront público: productos ocultos desde Admin no deben romper ni indexarse
    if (!product.isActive) {
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

  async getAccessoriesForProduct(slug: string, limit = 8) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        deviceModelId: true,
        slug: true,
        productKind: true,
        compatibilities: { select: { deviceModelId: true } },
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto "${slug}" no encontrado`);
    }

    let deviceModelIds: string[] = [];

    if (product.deviceModelId) {
      deviceModelIds = [product.deviceModelId];
    } else {
      const bySlug = await this.prisma.deviceModel.findUnique({
        where: { slug: product.slug },
        select: { id: true },
      });
      if (bySlug) deviceModelIds = [bySlug.id];
    }

    if (product.productKind === 'accessory') {
      deviceModelIds = [
        ...new Set([
          ...deviceModelIds,
          ...product.compatibilities.map((c) => c.deviceModelId),
        ]),
      ];
    }

    if (deviceModelIds.length === 0) {
      return [];
    }

    return this.prisma.product.findMany({
      where: {
        isActive: true,
        productKind: 'accessory',
        id: { not: product.id },
        compatibilities: { some: { deviceModelId: { in: deviceModelIds } } },
      },
      include: {
        variants: { orderBy: { price: 'asc' } },
        category: { include: { parent: true } },
        brand: true,
        tags: true,
      },
      take: Math.min(Math.max(limit, 1), 24),
      orderBy: { isFeatured: 'desc' },
    });
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
        category: { include: { parent: true } },
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
