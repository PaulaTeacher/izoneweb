import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function upsertBrand(name: string, slug: string) {
  return prisma.brand.upsert({
    where: { slug },
    update: { name },
    create: { name, slug },
  });
}

async function upsertCategory(name: string, slug: string, parentId: string, sortOrder: number) {
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return existing;
  return prisma.category.create({
    data: { name, slug, parentId, sortOrder, isActive: true },
  });
}

async function main() {
  const brandApple = await upsertBrand('Apple', 'apple');
  const brandSamsung = await upsertBrand('Samsung', 'samsung');
  const brandXiaomi = await upsertBrand('Xiaomi', 'xiaomi');
  const brandSpigen = await upsertBrand('Spigen', 'spigen');
  const brandAnker = await upsertBrand('Anker', 'anker');
  const brandIzone = await upsertBrand('iZone', 'izone');

  const accesorios = await prisma.category.findUnique({ where: { slug: 'accesorios' } });
  if (!accesorios) {
    throw new Error('Falta la categoría accesorios. Corre el seed completo primero.');
  }

  const fundas =
    (await prisma.category.findUnique({ where: { slug: 'fundas' } })) ??
    (await upsertCategory('Fundas y Protección', 'fundas', accesorios.id, 1));
  const energia =
    (await prisma.category.findUnique({ where: { slug: 'energia' } })) ??
    (await upsertCategory('Energía y Power Banks', 'energia', accesorios.id, 2));
  const accMac =
    (await prisma.category.findUnique({ where: { slug: 'accesorios-mac' } })) ??
    (await upsertCategory('Accesorios Mac', 'accesorios-mac', accesorios.id, 4));
  await upsertCategory('Cables y Hubs', 'cables-hubs', accesorios.id, 3);

  const models = [
    { name: 'iPhone 17 Pro', slug: 'iphone-17-pro', kind: 'phone' as const, year: 2025, brandId: brandApple.id, sortOrder: 1 },
    { name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max', kind: 'phone' as const, year: 2024, brandId: brandApple.id, sortOrder: 2 },
    { name: 'iPhone 16 Pro', slug: 'iphone-16-pro', kind: 'phone' as const, year: 2024, brandId: brandApple.id, sortOrder: 3 },
    { name: 'Galaxy S24 Ultra', slug: 'galaxy-s24-ultra', kind: 'phone' as const, year: 2024, brandId: brandSamsung.id, sortOrder: 4 },
    { name: 'Galaxy S24', slug: 'galaxy-s24', kind: 'phone' as const, year: 2024, brandId: brandSamsung.id, sortOrder: 5 },
    { name: 'Xiaomi 14', slug: 'xiaomi-14', kind: 'phone' as const, year: 2024, brandId: brandXiaomi.id, sortOrder: 6 },
    { name: 'MacBook Air 13" M3', slug: 'macbook-air-13-m3', kind: 'laptop' as const, year: 2024, brandId: brandApple.id, sortOrder: 7 },
    { name: 'iPad Pro 11"', slug: 'ipad-pro-11', kind: 'tablet' as const, year: 2024, brandId: brandApple.id, sortOrder: 8 },
  ];

  const dmId: Record<string, string> = {};
  for (const dm of models) {
    const row = await prisma.deviceModel.upsert({
      where: { slug: dm.slug },
      update: { name: dm.name, kind: dm.kind, year: dm.year, brandId: dm.brandId, sortOrder: dm.sortOrder },
      create: dm,
    });
    dmId[dm.slug] = row.id;
  }

  const equipmentLinks: [string, string][] = [
    ['iphone-17-pro', 'iphone-17-pro'],
    ['iphone-16-pro-max', 'iphone-16-pro-max'],
    ['iphone-16-pro', 'iphone-16-pro'],
    ['macbook-air-m3', 'macbook-air-13-m3'],
  ];
  for (const [productSlug, modelSlug] of equipmentLinks) {
    const product = await prisma.product.findUnique({ where: { slug: productSlug } });
    if (product) {
      await prisma.product.update({
        where: { slug: productSlug },
        data: { deviceModelId: dmId[modelSlug] },
      });
    }
  }

  async function upsertAccessory(input: {
    name: string;
    slug: string;
    subtitle: string;
    description: string;
    heroBadge?: string;
    brandId: string;
    categoryId: string;
    erp: string;
    compatible: string[];
    variants: {
      colorName: string;
      colorHex: string;
      material: 'silicona' | 'cuero' | 'hibrido' | 'diseno' | 'otro';
      price: number;
      sku: string;
      stock: number;
    }[];
  }) {
    const existing = await prisma.product.findUnique({ where: { slug: input.slug } });
    const product = existing
      ? await prisma.product.update({
          where: { slug: input.slug },
          data: {
            name: input.name,
            subtitle: input.subtitle,
            description: input.description,
            heroBadge: input.heroBadge,
            productKind: 'accessory',
            brandId: input.brandId,
            categoryId: input.categoryId,
            isActive: true,
          },
        })
      : await prisma.product.create({
          data: {
            name: input.name,
            slug: input.slug,
            subtitle: input.subtitle,
            description: input.description,
            heroBadge: input.heroBadge,
            images: [],
            isFeatured: true,
            isActive: true,
            productKind: 'accessory',
            warrantyMonths: 6,
            brandId: input.brandId,
            categoryId: input.categoryId,
            erp_product_id: input.erp,
            variants: { create: input.variants.map((v) => ({ ...v, condition: 'NUEVO_SELLADO' as const })) },
          },
        });

    if (existing) {
      for (const v of input.variants) {
        await prisma.variant.upsert({
          where: { sku: v.sku },
          update: { colorName: v.colorName, colorHex: v.colorHex, material: v.material, price: v.price, stock: v.stock },
          create: {
            productId: product.id,
            ...v,
            condition: 'NUEVO_SELLADO',
          },
        });
      }
    }

    await prisma.productCompatibility.deleteMany({ where: { productId: product.id } });
    await prisma.productCompatibility.createMany({
      data: input.compatible.map((slug) => ({
        productId: product.id,
        deviceModelId: dmId[slug],
      })),
    });
  }

  await upsertAccessory({
    name: 'Funda Silicona MagSafe',
    slug: 'funda-silicona-magsafe',
    subtitle: 'Ajuste preciso. Colores vivos. MagSafe.',
    description: 'Funda de silicona con imanes MagSafe. Compatible con varios iPhone Pro.',
    heroBadge: 'NUEVO',
    brandId: brandSpigen.id,
    categoryId: fundas.id,
    erp: 'ERP-CASE-SIL-MS',
    compatible: ['iphone-16-pro', 'iphone-16-pro-max', 'iphone-17-pro'],
    variants: [
      { colorName: 'Negro', colorHex: '#1D1D1F', material: 'silicona', price: 89000, sku: 'CASE-SIL-BLK', stock: 40 },
      { colorName: 'Azul', colorHex: '#0071E3', material: 'silicona', price: 89000, sku: 'CASE-SIL-BLU', stock: 28 },
      { colorName: 'Rosa', colorHex: '#E8A0BF', material: 'silicona', price: 89000, sku: 'CASE-SIL-PNK', stock: 18 },
    ],
  });

  await upsertAccessory({
    name: 'Funda de Cuero iZone',
    slug: 'funda-cuero-izone',
    subtitle: 'Cuero genuino. Perfil fino.',
    description: 'Funda de cuero con interior de microfibra para iPhone 16 Pro.',
    brandId: brandIzone.id,
    categoryId: fundas.id,
    erp: 'ERP-CASE-LTH',
    compatible: ['iphone-16-pro'],
    variants: [
      { colorName: 'Marrón', colorHex: '#6B4F3A', material: 'cuero', price: 149000, sku: 'CASE-LTH-BRN', stock: 12 },
      { colorName: 'Negro', colorHex: '#1D1D1F', material: 'cuero', price: 149000, sku: 'CASE-LTH-BLK', stock: 10 },
    ],
  });

  await upsertAccessory({
    name: 'Funda Diseño Galaxy',
    slug: 'funda-diseno-galaxy',
    subtitle: 'Prints exclusivos para Galaxy S24.',
    description: 'Fundas con diseño gráfico para Galaxy S24 y S24 Ultra.',
    brandId: brandIzone.id,
    categoryId: fundas.id,
    erp: 'ERP-CASE-GAL',
    compatible: ['galaxy-s24', 'galaxy-s24-ultra'],
    variants: [
      { colorName: 'Abstracto Azul', colorHex: '#3B82F6', material: 'diseno', price: 59000, sku: 'CASE-GAL-ABS', stock: 22 },
      { colorName: 'Mármol', colorHex: '#E7E5E4', material: 'diseno', price: 59000, sku: 'CASE-GAL-MRB', stock: 16 },
    ],
  });

  await upsertAccessory({
    name: 'Power Bank Anker 10.000 mAh',
    slug: 'power-bank-anker-10000',
    subtitle: 'Carga rápida USB-C. Compacto.',
    description: 'Batería portátil de 10.000 mAh con USB-C para iPhone, Galaxy y Xiaomi.',
    heroBadge: 'MÁS VENDIDO',
    brandId: brandAnker.id,
    categoryId: energia.id,
    erp: 'ERP-PB-ANK-10K',
    compatible: ['iphone-16-pro', 'iphone-17-pro', 'galaxy-s24', 'xiaomi-14'],
    variants: [
      { colorName: 'Negro', colorHex: '#111111', material: 'otro', price: 189000, sku: 'PB-ANK-10K-BLK', stock: 30 },
      { colorName: 'Blanco', colorHex: '#F5F5F7', material: 'otro', price: 189000, sku: 'PB-ANK-10K-WHT', stock: 14 },
    ],
  });

  await upsertAccessory({
    name: 'Hub USB-C 7 en 1',
    slug: 'hub-usbc-7en1',
    subtitle: 'HDMI, SD y USB-A para MacBook.',
    description: 'Hub USB-C compacto para MacBook Air M3.',
    brandId: brandAnker.id,
    categoryId: accMac.id,
    erp: 'ERP-HUB-USB7',
    compatible: ['macbook-air-13-m3'],
    variants: [
      { colorName: 'Gris espacial', colorHex: '#4B5563', material: 'otro', price: 219000, sku: 'HUB-USB7-SPG', stock: 20 },
    ],
  });

  await upsertAccessory({
    name: 'Funda Neopreno MacBook Air 13"',
    slug: 'funda-macbook-air-13',
    subtitle: 'Protección ligera para el día a día.',
    description: 'Sleeve de neopreno para MacBook Air 13" M3.',
    brandId: brandIzone.id,
    categoryId: accMac.id,
    erp: 'ERP-SLV-MBA13',
    compatible: ['macbook-air-13-m3'],
    variants: [
      { colorName: 'Gris', colorHex: '#6B7280', material: 'otro', price: 79000, sku: 'SLV-MBA13-GRY', stock: 15 },
    ],
  });

  console.log('✅ Accesorios y device models upserted (catálogo Apple intacto).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
