import { Injectable, Logger, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccessoryMaterial, DeviceKind, Prisma, ProductKind } from '@prisma/client';
import { catalogCache } from './memory-cache';

/** Match Next.js catalog revalidate so SSR and API drop cache together. */
const LIST_CACHE_TTL_MS = 180_000;

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
export class CatalogService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CatalogService.name);

  constructor(private prisma: PrismaService) {}

  async onApplicationBootstrap() {
    const started = Date.now();
    try {
      await Promise.all([
        this.getMenu(),
        this.getCategories(),
        this.getProducts({ take: 8, sort: 'featured' }),
        this.getProducts({ take: 12 }),
        this.getProducts({ categorySlug: 'iphone' }),
        this.getProducts({ categorySlug: 'mac' }),
        this.getProducts({ categorySlug: 'ipad' }),
        this.getProducts({ categorySlug: 'watch' }),
        this.getProducts({ categorySlug: 'audio' }),
        this.getProducts({ productKind: 'accessory' }),
      ]);
      this.logger.log(`Catalog cache warmed in ${Date.now() - started}ms`);
    } catch (error) {
      this.logger.warn(
        `Catalog warmup skipped: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
  }

  /** Family (iphone) or leaf (iphone-16-pro) → that node plus children. */
  private categoryScope(slug: string): Prisma.CategoryWhereInput {
    const aliases = slug === 'watch' ? ['watch', 'apple-watch'] : [slug];
    return {
      isActive: true,
      OR: [{ slug: { in: aliases } }, { parent: { slug: { in: aliases }, isActive: true } }],
    };
  }

  private productsCacheKey(params: GetProductsParams): string {
    const stable: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === false || value === '') continue;
      stable[key] = value;
    }
    const ordered = Object.fromEntries(
      Object.keys(stable)
        .sort()
        .map((key) => [key, stable[key]]),
    );
    return `products:${JSON.stringify(ordered)}`;
  }

  async getProducts(params: GetProductsParams) {
    const cacheKey = this.productsCacheKey(params);
    const cached = catalogCache.get<unknown>(cacheKey);
    if (cached) return cached;

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

    const started = Date.now();
    const products = await this.prisma.product.findMany({
      relationLoadStrategy: 'join',
      where: {
        isActive: true,
        isFeatured: featured ? true : undefined,
        category: categorySlug ? this.categoryScope(categorySlug) : undefined,
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
    const elapsed = Date.now() - started;
    if (elapsed > 400) {
      this.logger.warn(`getProducts query ${elapsed}ms`);
    }

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

    return catalogCache.set(cacheKey, products, LIST_CACHE_TTL_MS);
  }

  async getCategories() {
    return catalogCache.getOrSet('categories', LIST_CACHE_TTL_MS, () =>
      this.prisma.category.findMany({
        relationLoadStrategy: 'join',
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
      }),
    );
  }

  async getMenu() {
    return catalogCache.getOrSet('menu', LIST_CACHE_TTL_MS, () => this.buildMenu());
  }

  private async buildMenu() {
    const families = await this.prisma.category.findMany({
      relationLoadStrategy: 'join',
      where: { parentId: null, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    const categoryIds = families.flatMap((family) => [
      family.id,
      ...family.children.map((child) => child.id),
    ]);

    const featuredProducts = categoryIds.length
      ? await this.prisma.product.findMany({
          relationLoadStrategy: 'join',
          where: {
            categoryId: { in: categoryIds },
            isFeatured: true,
            isActive: true,
          },
          include: { variants: { orderBy: { price: 'asc' }, take: 1 } },
          orderBy: { createdAt: 'desc' },
        })
      : [];

    return families.map((family) => {
      const href = familyHref(family.slug);
      const familyIds = new Set([family.id, ...family.children.map((child) => child.id)]);
      const featured = featuredProducts.find((product) => familyIds.has(product.categoryId));

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

      return {
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
      };
    });
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
      relationLoadStrategy: 'join',
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
      relationLoadStrategy: 'join',
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
      relationLoadStrategy: 'join',
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
