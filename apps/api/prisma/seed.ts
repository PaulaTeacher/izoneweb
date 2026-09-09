import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================
// Taxonomía canónica (benchmark: iShop Colombia)
// Familia (parent = null) -> Subcategoría (parent = familia)
// Los datos de producto son placeholders estructurados: se
// reemplazarán por el catálogo real sin tocar la arquitectura.
// ============================================================

interface SubcategorySeed {
  name: string;
  slug: string;
  description?: string;
}

interface FamilySeed {
  name: string;
  slug: string;
  order: number;
  description?: string;
  badge?: string;
  highlight?: boolean;
  children?: SubcategorySeed[];
}

const TAXONOMY: FamilySeed[] = [
  {
    name: 'Mac',
    slug: 'mac',
    order: 1,
    description: 'Portátiles y computadores de escritorio con chip Apple.',
    children: [
      { name: 'MacBook Air', slug: 'macbook-air', description: 'Increíblemente delgada y rápida' },
      { name: 'MacBook Pro', slug: 'macbook-pro', description: 'Potencia profesional extrema' },
      { name: 'iMac', slug: 'imac', description: 'Todo en uno con pantalla 4.5K' },
      { name: 'Mac mini', slug: 'mac-mini', description: 'El pequeño hacelotodo' },
      { name: 'Mac Studio', slug: 'mac-studio', description: 'Rendimiento modular sin límites' },
    ],
  },
  {
    name: 'iPhone',
    slug: 'iphone',
    order: 2,
    badge: 'Nuevo',
    description: 'La familia completa de iPhone.',
    children: [
      { name: 'iPhone 16 Pro', slug: 'iphone-16-pro', description: 'Titanio con chip A18 Pro' },
      { name: 'iPhone 16', slug: 'iphone-16', description: 'Control de cámara y chip A18' },
      { name: 'iPhone 15', slug: 'iphone-15', description: 'Dynamic Island y cámara de 48 MP' },
      { name: 'iPhone 16e', slug: 'iphone-16e', description: 'La opción esencial' },
    ],
  },
  {
    name: 'iPad',
    slug: 'ipad',
    order: 3,
    description: 'Tabletas para crear, trabajar y jugar.',
    children: [
      { name: 'iPad Pro', slug: 'ipad-pro', description: 'Pantalla OLED Ultra Retina XDR' },
      { name: 'iPad Air', slug: 'ipad-air', description: 'Rendimiento versátil en 11" y 13"' },
      { name: 'iPad', slug: 'ipad-10', description: 'El iPad esencial para todo' },
      { name: 'iPad mini', slug: 'ipad-mini', description: 'Todo el poder en formato compacto' },
    ],
  },
  {
    name: 'Apple Watch',
    slug: 'apple-watch',
    order: 4,
    description: 'La mejor forma de cuidar tu salud.',
    children: [
      { name: 'Apple Watch Ultra 2', slug: 'apple-watch-ultra-2', description: 'Aventura y resistencia extrema' },
      { name: 'Apple Watch Series 10', slug: 'apple-watch-series-10', description: 'Diseño más delgado y pantalla mayor' },
      { name: 'Apple Watch SE', slug: 'apple-watch-se', description: 'Grandes funciones a precio accesible' },
    ],
  },
  {
    name: 'Audio',
    slug: 'audio',
    order: 5,
    description: 'AirPods y sonido para el hogar.',
    children: [
      { name: 'AirPods Pro', slug: 'airpods-pro', description: 'Cancelación activa de ruido pro' },
      { name: 'AirPods 4', slug: 'airpods-4', description: 'Audio espacial personalizado' },
      { name: 'AirPods Max', slug: 'airpods-max', description: 'Alta fidelidad acústica' },
      { name: 'HomePod', slug: 'homepod', description: 'Sonido envolvente para el hogar' },
    ],
  },
  {
    name: 'TV & Hogar',
    slug: 'tv-hogar',
    order: 6,
    description: 'Entretenimiento y hogar inteligente.',
    children: [
      { name: 'Apple TV 4K', slug: 'apple-tv-4k', description: 'Cine en casa con Apple TV 4K' },
      { name: 'HomePod mini', slug: 'homepod-mini', description: 'Gran sonido en formato compacto' },
    ],
  },
  {
    name: 'Accesorios',
    slug: 'accesorios',
    order: 7,
    description: 'Todo para complementar tus dispositivos.',
    children: [
      { name: 'Fundas y Protección', slug: 'fundas', description: 'Silicona, cuero fino y MagSafe' },
      { name: 'Cargadores y Cables', slug: 'cargadores', description: 'Adaptadores USB-C 20W y 35W' },
      { name: 'Baterías MagSafe', slug: 'baterias-magsafe', description: 'Energía extra en cualquier lugar' },
      { name: 'Soportes y Adaptadores', slug: 'soportes', description: 'Hubs multipuerto y docks' },
    ],
  },
  {
    name: 'Ofertas',
    slug: 'ofertas',
    order: 8,
    highlight: true,
    badge: 'Hot',
    description: 'Descuentos y oportunidades del mes.',
    children: [
      { name: 'Descuentos del Mes', slug: 'descuentos', description: 'Ahorra en referencias selectas' },
      { name: 'Reacondicionados', slug: 'reacondicionados', description: '100% funcionales con garantía' },
      { name: 'Combos & Bundles', slug: 'combos', description: 'Precio especial comprando junto' },
    ],
  },
];

async function main() {
  // --- Limpieza (respeta orden de FKs) ---
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  // Romper auto-relación padre/hijo antes de borrar categorías
  await prisma.category.updateMany({ data: { parentId: null } });
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.tag.deleteMany();

  // --- Marcas ---
  const brandApple = await prisma.brand.create({ data: { name: 'Apple', slug: 'apple' } });

  // --- Taxonomía (familias + subcategorías) ---
  const catId: Record<string, string> = {};
  for (const fam of TAXONOMY) {
    const family = await prisma.category.create({
      data: {
        name: fam.name,
        slug: fam.slug,
        description: fam.description,
        order: fam.order,
        badge: fam.badge,
        highlight: fam.highlight ?? false,
      },
    });
    catId[fam.slug] = family.id;

    let childOrder = 1;
    for (const sub of fam.children ?? []) {
      const child = await prisma.category.create({
        data: {
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          order: childOrder++,
          parentId: family.id,
        },
      });
      catId[sub.slug] = child.id;
    }
  }

  // --- Tags ---
  const tagNew = await prisma.tag.create({ data: { name: 'Nuevo', slug: 'nuevo' } });
  const tagPro = await prisma.tag.create({ data: { name: 'Pro', slug: 'pro' } });
  const tagBestSeller = await prisma.tag.create({ data: { name: 'Más Vendido', slug: 'mas-vendido' } });

  // --- Productos (asignados a subcategoría hoja) ---
  await prisma.product.create({
    data: {
      name: 'iPhone 16 Pro Max',
      slug: 'iphone-16-pro-max',
      description: 'El iPhone con la pantalla más grande y la mayor duración de batería.',
      seoTitle: 'Comprar iPhone 16 Pro Max en Bogotá | iZone Tech',
      seoDescription: 'Encuentra el nuevo iPhone 16 Pro Max al mejor precio en Colombia.',
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop'],
      brandId: brandApple.id,
      categoryId: catId['iphone-16-pro'],
      isFeatured: true,
      erp_product_id: 'ERP-IPH16PROMAX',
      tags: { connect: [{ id: tagNew.id }, { id: tagPro.id }] },
      variants: {
        create: [
          { color: 'Titanio Natural', storage: '256GB', price: 6499000, sku: 'IPH16PM-NAT-256', stock: 10, erp_variant_sku: 'V-IPH16PM-NAT-256' },
          { color: 'Titanio Negro', storage: '512GB', price: 7499000, sku: 'IPH16PM-BLK-512', stock: 5, erp_variant_sku: 'V-IPH16PM-BLK-512' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'iPhone 16 Pro',
      slug: 'iphone-16-pro',
      description: 'Diseñado con titanio. Superpotenciado por el chip A18 Pro.',
      seoTitle: 'Comprar iPhone 16 Pro en Bogotá | iZone Tech',
      seoDescription: 'Encuentra el nuevo iPhone 16 Pro al mejor precio en Colombia.',
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop'],
      brandId: brandApple.id,
      categoryId: catId['iphone-16-pro'],
      erp_product_id: 'ERP-IPH16PRO',
      tags: { connect: [{ id: tagNew.id }, { id: tagPro.id }] },
      variants: {
        create: [
          { color: 'Titanio Natural', storage: '256GB', price: 5499000, sku: 'IPH16PRO-NAT-256', stock: 15, erp_variant_sku: 'V-IPH16PRO-NAT-256' },
          { color: 'Titanio Negro', storage: '256GB', price: 5499000, sku: 'IPH16PRO-BLK-256', stock: 5, erp_variant_sku: 'V-IPH16PRO-BLK-256' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'MacBook Air M3',
      slug: 'macbook-air-m3',
      description: 'Súper ligera. Súper chip M3.',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop'],
      brandId: brandApple.id,
      categoryId: catId['macbook-air'],
      isFeatured: true,
      erp_product_id: 'ERP-MBAIRM3',
      tags: { connect: [{ id: tagNew.id }, { id: tagBestSeller.id }] },
      variants: {
        create: [
          { color: 'Medianoche', storage: '512GB', price: 6999000, sku: 'MBAIRM3-MID-512', stock: 8, erp_variant_sku: 'V-MBAIRM3-MID-512' },
          { color: 'Plata', storage: '256GB', price: 5999000, sku: 'MBAIRM3-SLV-256', stock: 12, erp_variant_sku: 'V-MBAIRM3-SLV-256' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'iPad Pro M4',
      slug: 'ipad-pro-m4',
      description: 'Ultradelgado y con el poder sin precedentes del chip M4.',
      images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop'],
      brandId: brandApple.id,
      categoryId: catId['ipad-pro'],
      isFeatured: true,
      erp_product_id: 'ERP-IPADPROM4',
      tags: { connect: [{ id: tagNew.id }, { id: tagPro.id }] },
      variants: {
        create: [
          { color: 'Negro Espacial', storage: '256GB', price: 4899000, sku: 'IPADPRO-M4-BLK-256', stock: 9, erp_variant_sku: 'V-IPADPRO-M4-BLK-256' },
          { color: 'Plata', storage: '512GB', price: 5899000, sku: 'IPADPRO-M4-SLV-512', stock: 6, erp_variant_sku: 'V-IPADPRO-M4-SLV-512' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Apple Watch Series 10',
      slug: 'apple-watch-series-10',
      description: 'Una pantalla monumental en el diseño más delgado jamás creado.',
      images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop'],
      brandId: brandApple.id,
      categoryId: catId['apple-watch-series-10'],
      isFeatured: true,
      erp_product_id: 'ERP-AWS10',
      tags: { connect: [{ id: tagNew.id }] },
      variants: {
        create: [
          { color: 'Aluminio Medianoche', storage: '42mm', price: 2199000, sku: 'AWS10-MID-42', stock: 14, erp_variant_sku: 'V-AWS10-MID-42' },
          { color: 'Aluminio Plata', storage: '46mm', price: 2499000, sku: 'AWS10-SLV-46', stock: 7, erp_variant_sku: 'V-AWS10-SLV-46' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'AirPods Pro (2.ª generación)',
      slug: 'airpods-pro-2',
      description: 'Cancelación Activa de Ruido hasta 2 veces mejor.',
      images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop'],
      brandId: brandApple.id,
      categoryId: catId['airpods-pro'],
      isFeatured: true,
      erp_product_id: 'ERP-AIRPRO2',
      tags: { connect: [{ id: tagPro.id }, { id: tagBestSeller.id }] },
      variants: {
        create: [
          { color: 'Blanco', price: 1199000, sku: 'AIRPRO2-WHT', stock: 25, erp_variant_sku: 'V-AIRPRO2-WHT' },
        ],
      },
    },
  });

  // --- Cupón de ejemplo ---
  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      description: '10% de descuento en tu primera compra',
      discountType: 'percentage',
      discountValue: 10,
      isActive: true,
    },
  });

  const familias = TAXONOMY.length;
  const subcats = TAXONOMY.reduce((n, f) => n + (f.children?.length ?? 0), 0);
  console.log(`✅ Seed completo: ${familias} familias, ${subcats} subcategorías, 6 productos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
