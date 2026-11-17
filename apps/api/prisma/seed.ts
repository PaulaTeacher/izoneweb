import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface SubcategorySeed {
  name: string;
  slug: string;
  description?: string;
}

interface FamilySeed {
  name: string;
  slug: string;
  sortOrder: number;
  description?: string;
  badge?: string;
  highlight?: boolean;
  children: SubcategorySeed[];
}

/** Familias + hojas alineadas al Header y a las PLP actuales (no iPhone 16-only). */
const TAXONOMY: FamilySeed[] = [
  {
    name: 'Mac',
    slug: 'mac',
    sortOrder: 1,
    description: 'Potencia y rendimiento en cada modelo.',
    children: [
      { name: 'MacBook Air', slug: 'macbook-air', description: 'Chip M2 y M3' },
      { name: 'MacBook Pro', slug: 'macbook-pro', description: 'Chip M3, M3 Pro y M3 Max' },
      { name: 'iMac', slug: 'imac', description: '24 pulgadas' },
      { name: 'Mac mini', slug: 'mac-mini', description: 'Chip M2 y M2 Pro' },
      { name: 'Mac Studio', slug: 'mac-studio', description: 'Chip M2 Max y M2 Ultra' },
      { name: 'Mac Pro', slug: 'mac-pro' },
      { name: 'Monitores', slug: 'monitores', description: 'Studio Display y Pro Display XDR' },
    ],
  },
  {
    name: 'iPhone',
    slug: 'iphone',
    sortOrder: 2,
    badge: 'Nuevo',
    description: 'La línea de smartphones más avanzada del mundo.',
    children: [
      { name: 'iPhone 17 Pro', slug: 'iphone-17-pro', description: 'Titanio y chip A19 Pro' },
      { name: 'iPhone 17', slug: 'iphone-17', description: 'Potente y colorido' },
      { name: 'iPhone 17e', slug: 'iphone-17e', description: 'La opción esencial' },
      { name: 'iPhone Air', slug: 'iphone-air', description: 'El más delgado' },
      { name: 'iPhone 16 Pro', slug: 'iphone-16-pro', description: 'Titanio con chip A18 Pro' },
      { name: 'iPhone 16', slug: 'iphone-16', description: 'Control de cámara y chip A18' },
      { name: 'iPhone 16e', slug: 'iphone-16e' },
      { name: 'iPhone 15', slug: 'iphone-15' },
      { name: 'iPhone 14', slug: 'iphone-14' },
      { name: 'iPhone 13', slug: 'iphone-13' },
      { name: 'iPhone SE', slug: 'iphone-se' },
    ],
  },
  {
    name: 'iPad',
    slug: 'ipad',
    sortOrder: 3,
    description: 'Tu siguiente computadora no es una computadora.',
    children: [
      { name: 'iPad Pro', slug: 'ipad-pro', description: 'El más avanzado' },
      { name: 'iPad Air', slug: 'ipad-air', description: 'Ligero y potente' },
      { name: 'iPad', slug: 'ipad-11', description: '10.ª / 11.ª generación' },
      { name: 'iPad mini', slug: 'ipad-mini', description: 'Potencia en tu mano' },
    ],
  },
  {
    name: 'Apple Watch',
    slug: 'apple-watch',
    sortOrder: 4,
    description: 'El reloj inteligente más avanzado.',
    children: [
      { name: 'Apple Watch Ultra 3', slug: 'apple-watch-ultra-3' },
      { name: 'Apple Watch Series 11', slug: 'apple-watch-series-11' },
      { name: 'Apple Watch Series 10', slug: 'apple-watch-series-10' },
      { name: 'Apple Watch SE 3', slug: 'apple-watch-se-3' },
    ],
  },
  {
    name: 'Audio',
    slug: 'audio',
    sortOrder: 5,
    description: 'AirPods y accesorios de audio premium.',
    children: [
      { name: 'AirPods Pro', slug: 'airpods-pro', description: '2.ª generación' },
      { name: 'AirPods 4', slug: 'airpods-4' },
      { name: 'AirPods Max', slug: 'airpods-max' },
      { name: 'HomePod', slug: 'homepod' },
      { name: 'HomePod mini', slug: 'homepod-mini' },
    ],
  },
  {
    name: 'Accesorios',
    slug: 'accesorios',
    sortOrder: 6,
    description: 'Fundas, cargadores y más.',
    children: [
      { name: 'Fundas y Protección', slug: 'fundas' },
      { name: 'Energía y Power Banks', slug: 'energia' },
      { name: 'Cables y Hubs', slug: 'cables-hubs' },
      { name: 'Accesorios Mac', slug: 'accesorios-mac' },
      { name: 'MagSafe', slug: 'magsafe' },
      { name: 'Almacenamiento', slug: 'almacenamiento' },
    ],
  },
  {
    name: 'Ofertas',
    slug: 'ofertas',
    sortOrder: 7,
    highlight: true,
    badge: 'Hot',
    description: 'Descuentos y oportunidades del mes.',
    children: [
      { name: 'Descuentos del Mes', slug: 'descuentos' },
      { name: 'Combos & Bundles', slug: 'combos' },
      { name: 'Outlet', slug: 'outlet' },
    ],
  },
];

async function main() {
  // Clean up in dependency order
  await prisma.productCompatibility.deleteMany();
  await prisma.tradeInRequest.deleteMany();
  await prisma.tradeInQuestion.deleteMany();
  await prisma.tradeInModel.deleteMany();
  await prisma.productSpec.deleteMany();
  await prisma.specDefinition.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.deviceModel.deleteMany();
  await prisma.category.updateMany({ data: { parentId: null } });
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.customer.deleteMany();

  // ======================== BRANDS ========================
  const brandApple = await prisma.brand.create({
    data: { name: 'Apple', slug: 'apple', logoUrl: null },
  });
  const brandSamsung = await prisma.brand.create({
    data: { name: 'Samsung', slug: 'samsung' },
  });
  const brandXiaomi = await prisma.brand.create({
    data: { name: 'Xiaomi', slug: 'xiaomi' },
  });
  const brandSpigen = await prisma.brand.create({
    data: { name: 'Spigen', slug: 'spigen' },
  });
  const brandAnker = await prisma.brand.create({
    data: { name: 'Anker', slug: 'anker' },
  });
  const brandIzone = await prisma.brand.create({
    data: { name: 'iZone', slug: 'izone' },
  });

  // ======================== CATEGORIES (familia → hoja) ========================
  const catId: Record<string, string> = {};
  for (const fam of TAXONOMY) {
    const family = await prisma.category.create({
      data: {
        name: fam.name,
        slug: fam.slug,
        description: fam.description,
        sortOrder: fam.sortOrder,
        badge: fam.badge,
        highlight: fam.highlight ?? false,
      },
    });
    catId[fam.slug] = family.id;

    let childOrder = 1;
    for (const sub of fam.children) {
      const child = await prisma.category.create({
        data: {
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          sortOrder: childOrder++,
          parentId: family.id,
        },
      });
      catId[sub.slug] = child.id;
    }
  }

  // ======================== TAGS ========================
  const tagNew = await prisma.tag.create({ data: { name: 'Nuevo', slug: 'nuevo' } });
  const tagPro = await prisma.tag.create({ data: { name: 'Pro', slug: 'pro' } });
  const tagBestSeller = await prisma.tag.create({ data: { name: 'Más Vendido', slug: 'mas-vendido' } });
  const tagSemiNuevo = await prisma.tag.create({ data: { name: 'Seminuevo Certificado', slug: 'seminuevo' } });
  const tagOpenBox = await prisma.tag.create({ data: { name: 'Open Box', slug: 'open-box' } });

  // ======================== SPEC DEFINITIONS ========================
  const specChip = await prisma.specDefinition.create({
    data: { groupName: 'Rendimiento', label: 'Chip', sortOrder: 1 },
  });
  const specDisplay = await prisma.specDefinition.create({
    data: { groupName: 'Pantalla', label: 'Tamaño de pantalla', unit: 'pulgadas', sortOrder: 2 },
  });
  const specDisplayType = await prisma.specDefinition.create({
    data: { groupName: 'Pantalla', label: 'Tecnología de pantalla', sortOrder: 3 },
  });
  const specMainCamera = await prisma.specDefinition.create({
    data: { groupName: 'Cámara', label: 'Cámara principal', unit: 'MP', sortOrder: 4 },
  });
  const specFrontCamera = await prisma.specDefinition.create({
    data: { groupName: 'Cámara', label: 'Cámara frontal', unit: 'MP', sortOrder: 5 },
  });
  const specBattery = await prisma.specDefinition.create({
    data: { groupName: 'Batería', label: 'Duración de batería', sortOrder: 6 },
  });
  const specBiometric = await prisma.specDefinition.create({
    data: { groupName: 'Seguridad', label: 'Biometría', sortOrder: 7 },
  });
  const specResistance = await prisma.specDefinition.create({
    data: { groupName: 'Diseño', label: 'Resistencia al agua', sortOrder: 8 },
  });
  const specConnectivity = await prisma.specDefinition.create({
    data: { groupName: 'Conectividad', label: 'Conectividad', sortOrder: 9 },
  });

  // ======================== PRODUCTS ========================

  // --- iPhone 17 Pro ---
  const iphone17Pro = await prisma.product.create({
    data: {
      name: 'iPhone 17 Pro',
      slug: 'iphone-17-pro',
      subtitle: 'Titanio. Chip A19 Pro. El iPhone Pro más avanzado.',
      heroBadge: 'NUEVO',
      description: 'iPhone 17 Pro con chip A19 Pro, diseño en titanio y Control de la Cámara. Pantalla Super Retina XDR y sistema de cámaras Pro de 48 MP.',
      isFeatured: true,
      isActive: true,
      isTradeInEligible: true,
      warrantyMonths: 12,
      seoTitle: 'Comprar iPhone 17 Pro en Bogotá | iZone Tech',
      seoDescription: 'iPhone 17 Pro con chip A19 Pro y titanio. Garantía oficial de 1 año y envíos a toda Colombia.',
      images: [
        'https://co.tiendasishop.com/cdn/shop/files/AMZ_Family-Stripe_iPhone_17_pro_max.avif?v=1757555392&width=800',
      ],
      brandId: brandApple.id,
      categoryId: catId['iphone-17-pro'],
      erp_product_id: 'ERP-IPH17PRO',
      tags: { connect: [{ id: tagNew.id }, { id: tagPro.id }] },
      variants: {
        create: [
          { colorName: 'Titanio Natural', colorHex: '#BEB4A8', storage: '256GB', condition: 'NUEVO_SELLADO', price: 5749000, comparePrice: 6499000, sku: 'IPH17PRO-NAT-256', stock: 10, erp_variant_sku: 'V-IPH17PRO-NAT-256' },
          { colorName: 'Titanio Negro', colorHex: '#3C3C3C', storage: '256GB', condition: 'NUEVO_SELLADO', price: 5749000, comparePrice: 6499000, sku: 'IPH17PRO-BLK-256', stock: 8, erp_variant_sku: 'V-IPH17PRO-BLK-256' },
          { colorName: 'Titanio Blanco', colorHex: '#F5F5F0', storage: '512GB', condition: 'NUEVO_SELLADO', price: 6749000, comparePrice: 7499000, sku: 'IPH17PRO-WHT-512', stock: 4, erp_variant_sku: 'V-IPH17PRO-WHT-512' },
        ],
      },
    },
  });

  await prisma.productSpec.createMany({
    data: [
      { productId: iphone17Pro.id, specId: specChip.id, value: 'A19 Pro' },
      { productId: iphone17Pro.id, specId: specDisplay.id, value: '6.3' },
      { productId: iphone17Pro.id, specId: specDisplayType.id, value: 'Super Retina XDR OLED, ProMotion 120Hz, Always-On' },
      { productId: iphone17Pro.id, specId: specMainCamera.id, value: '48 MP (Principal) + 48 MP (Ultra angular) + 12 MP (Teleobjetivo 5x)' },
      { productId: iphone17Pro.id, specId: specFrontCamera.id, value: '12' },
      { productId: iphone17Pro.id, specId: specBattery.id, value: 'Hasta 28 horas de reproducción de video' },
      { productId: iphone17Pro.id, specId: specBiometric.id, value: 'Face ID' },
      { productId: iphone17Pro.id, specId: specResistance.id, value: 'IP68 (6 metros, 30 minutos)' },
      { productId: iphone17Pro.id, specId: specConnectivity.id, value: '5G, Wi-Fi 7, Bluetooth 5.3, USB-C 3.0, NFC' },
    ],
  });

  // --- iPhone 16 Pro Max ---
  const iphone16ProMax = await prisma.product.create({
    data: {
      name: 'iPhone 16 Pro Max',
      slug: 'iphone-16-pro-max',
      subtitle: 'Titanio. Tan fuerte. Tan ligero. Tan Pro.',
      heroBadge: 'NUEVO',
      description: 'El iPhone con la pantalla más grande y la mayor duración de batería de todos los tiempos. Con el chip A18 Pro, control de la cámara y un sistema de cámara pro de 48 MP.',
      isFeatured: true,
      isActive: true,
      isTradeInEligible: true,
      warrantyMonths: 12,
      seoTitle: 'Comprar iPhone 16 Pro Max en Bogotá | iZone Tech',
      seoDescription: 'Encuentra el nuevo iPhone 16 Pro Max al mejor precio en Colombia. Titanio, chip A18 Pro, cámara de 48MP.',
      images: [
        '/images/products/iphone-17-silver.jpg',
      ],
      brandId: brandApple.id,
      categoryId: catId['iphone-16-pro'],
      erp_product_id: 'ERP-IPH16PROMAX',
      tags: { connect: [{ id: tagNew.id }, { id: tagPro.id }] },
      variants: {
        create: [
          { colorName: 'Titanio Natural', colorHex: '#BEB4A8', storage: '256GB', condition: 'NUEVO_SELLADO', price: 6499000, sku: 'IPH16PM-NAT-256', stock: 10, erp_variant_sku: 'V-IPH16PM-NAT-256' },
          { colorName: 'Titanio Negro', colorHex: '#3C3C3C', storage: '256GB', condition: 'NUEVO_SELLADO', price: 6499000, sku: 'IPH16PM-BLK-256', stock: 8, erp_variant_sku: 'V-IPH16PM-BLK-256' },
          { colorName: 'Titanio Blanco', colorHex: '#F5F5F0', storage: '512GB', condition: 'NUEVO_SELLADO', price: 7499000, sku: 'IPH16PM-WHT-512', stock: 5, erp_variant_sku: 'V-IPH16PM-WHT-512' },
          { colorName: 'Titanio Desierto', colorHex: '#C2A77D', storage: '1TB', condition: 'NUEVO_SELLADO', price: 9299000, sku: 'IPH16PM-DST-1TB', stock: 3, erp_variant_sku: 'V-IPH16PM-DST-1TB' },
          // Seminuevo certificado
          { colorName: 'Titanio Natural', colorHex: '#BEB4A8', storage: '256GB', condition: 'SEMINUEVO_CERTIFICADO', price: 5299000, comparePrice: 6499000, sku: 'IPH16PM-NAT-256-SN', stock: 2, erp_variant_sku: 'V-IPH16PM-NAT-256-SN' },
        ],
      },
    },
  });

  // Add specs for iPhone 16 Pro Max
  await prisma.productSpec.createMany({
    data: [
      { productId: iphone16ProMax.id, specId: specChip.id, value: 'A18 Pro' },
      { productId: iphone16ProMax.id, specId: specDisplay.id, value: '6.9' },
      { productId: iphone16ProMax.id, specId: specDisplayType.id, value: 'Super Retina XDR OLED, ProMotion 120Hz, Always-On' },
      { productId: iphone16ProMax.id, specId: specMainCamera.id, value: '48 MP (Principal) + 48 MP (Ultra angular) + 12 MP (Teleobjetivo 5x)' },
      { productId: iphone16ProMax.id, specId: specFrontCamera.id, value: '12' },
      { productId: iphone16ProMax.id, specId: specBattery.id, value: 'Hasta 33 horas de reproducción de video' },
      { productId: iphone16ProMax.id, specId: specBiometric.id, value: 'Face ID' },
      { productId: iphone16ProMax.id, specId: specResistance.id, value: 'IP68 (6 metros, 30 minutos)' },
      { productId: iphone16ProMax.id, specId: specConnectivity.id, value: '5G, Wi-Fi 7, Bluetooth 5.3, USB-C 3.0, NFC' },
    ],
  });

  // --- iPhone 16 Pro ---
  const iphone16Pro = await prisma.product.create({
    data: {
      name: 'iPhone 16 Pro',
      slug: 'iphone-16-pro',
      subtitle: 'Diseñado con titanio. Superpotenciado por el chip A18 Pro.',
      heroBadge: 'NUEVO',
      description: 'iPhone 16 Pro. Con el chip A18 Pro, control de la cámara, pantalla Super Retina XDR de 6.3 pulgadas y un diseño de titanio increíblemente resistente y ligero.',
      isFeatured: true,
      isActive: true,
      isTradeInEligible: true,
      warrantyMonths: 12,
      seoTitle: 'Comprar iPhone 16 Pro en Bogotá | iZone Tech',
      seoDescription: 'Encuentra el nuevo iPhone 16 Pro al mejor precio en Colombia.',
      images: [
        '/images/products/iphone-17-silver.jpg',
      ],
      brandId: brandApple.id,
      categoryId: catId['iphone-16-pro'],
      erp_product_id: 'ERP-IPH16PRO',
      tags: { connect: [{ id: tagNew.id }, { id: tagPro.id }] },
      variants: {
        create: [
          { colorName: 'Titanio Natural', colorHex: '#BEB4A8', storage: '256GB', condition: 'NUEVO_SELLADO', price: 5499000, sku: 'IPH16PRO-NAT-256', stock: 15, erp_variant_sku: 'V-IPH16PRO-NAT-256' },
          { colorName: 'Titanio Negro', colorHex: '#3C3C3C', storage: '256GB', condition: 'NUEVO_SELLADO', price: 5499000, sku: 'IPH16PRO-BLK-256', stock: 5, erp_variant_sku: 'V-IPH16PRO-BLK-256' },
          { colorName: 'Titanio Blanco', colorHex: '#F5F5F0', storage: '512GB', condition: 'NUEVO_SELLADO', price: 6499000, sku: 'IPH16PRO-WHT-512', stock: 4, erp_variant_sku: 'V-IPH16PRO-WHT-512' },
        ],
      },
    },
  });

  await prisma.productSpec.createMany({
    data: [
      { productId: iphone16Pro.id, specId: specChip.id, value: 'A18 Pro' },
      { productId: iphone16Pro.id, specId: specDisplay.id, value: '6.3' },
      { productId: iphone16Pro.id, specId: specDisplayType.id, value: 'Super Retina XDR OLED, ProMotion 120Hz, Always-On' },
      { productId: iphone16Pro.id, specId: specMainCamera.id, value: '48 MP (Principal) + 48 MP (Ultra angular) + 12 MP (Teleobjetivo 5x)' },
      { productId: iphone16Pro.id, specId: specFrontCamera.id, value: '12' },
      { productId: iphone16Pro.id, specId: specBattery.id, value: 'Hasta 27 horas de reproducción de video' },
      { productId: iphone16Pro.id, specId: specBiometric.id, value: 'Face ID' },
      { productId: iphone16Pro.id, specId: specResistance.id, value: 'IP68 (6 metros, 30 minutos)' },
      { productId: iphone16Pro.id, specId: specConnectivity.id, value: '5G, Wi-Fi 7, Bluetooth 5.3, USB-C 3.0, NFC' },
    ],
  });

  // --- MacBook Air M3 ---
  const macbookAirM3 = await prisma.product.create({
    data: {
      name: 'MacBook Air M3',
      slug: 'macbook-air-m3',
      subtitle: 'Súper ligera. Súper chip M3.',
      heroBadge: 'MÁS VENDIDO',
      description: 'MacBook Air con chip M3. Rendimiento espectacular en un diseño increíblemente delgado y ligero. Hasta 18 horas de batería.',
      isFeatured: true,
      isActive: true,
      isTradeInEligible: true,
      warrantyMonths: 12,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
      ],
      brandId: brandApple.id,
      categoryId: catId['macbook-air'],
      erp_product_id: 'ERP-MBAIRM3',
      tags: { connect: [{ id: tagNew.id }, { id: tagBestSeller.id }] },
      variants: {
        create: [
          { colorName: 'Medianoche', colorHex: '#1D1D2C', storage: '256GB', condition: 'NUEVO_SELLADO', price: 5999000, sku: 'MBAIRM3-MID-256', stock: 12, erp_variant_sku: 'V-MBAIRM3-MID-256' },
          { colorName: 'Plata', colorHex: '#E3E4E5', storage: '512GB', condition: 'NUEVO_SELLADO', price: 6999000, sku: 'MBAIRM3-SLV-512', stock: 8, erp_variant_sku: 'V-MBAIRM3-SLV-512' },
          { colorName: 'Estelar', colorHex: '#F0E7D8', storage: '512GB', condition: 'NUEVO_SELLADO', price: 6999000, sku: 'MBAIRM3-STR-512', stock: 6, erp_variant_sku: 'V-MBAIRM3-STR-512' },
          // Open Box
          { colorName: 'Medianoche', colorHex: '#1D1D2C', storage: '256GB', condition: 'OPEN_BOX', price: 5199000, comparePrice: 5999000, sku: 'MBAIRM3-MID-256-OB', stock: 1, erp_variant_sku: 'V-MBAIRM3-MID-256-OB' },
        ],
      },
    },
  });

  // --- AirPods Pro 2 ---
  await prisma.product.create({
    data: {
      name: 'AirPods Pro (2.ª generación)',
      slug: 'airpods-pro-2',
      subtitle: 'Audio adaptativo. Ahora con interacción gestual.',
      heroBadge: 'TOP VENTAS',
      description: 'AirPods Pro con cancelación activa de ruido hasta 2 veces mejor, audio adaptativo y un estuche con altavoz y localización precisa.',
      isFeatured: false,
      isActive: true,
      isTradeInEligible: false,
      warrantyMonths: 12,
      images: [
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop',
      ],
      brandId: brandApple.id,
      categoryId: catId['airpods-pro'],
      erp_product_id: 'ERP-AIRPRO2',
      tags: { connect: [{ id: tagPro.id }, { id: tagBestSeller.id }] },
      variants: {
        create: [
          { colorName: 'Blanco', colorHex: '#F5F5F5', condition: 'NUEVO_SELLADO', price: 1199000, sku: 'AIRPRO2-WHT', stock: 25, erp_variant_sku: 'V-AIRPRO2-WHT' },
        ],
      },
    },
  });

  // ======================== DEVICE MODELS (finder de accesorios) ========================
  const deviceModels = await Promise.all(
    [
      { name: 'iPhone 17 Pro', slug: 'iphone-17-pro', kind: 'phone' as const, year: 2025, brandId: brandApple.id, sortOrder: 1 },
      { name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max', kind: 'phone' as const, year: 2024, brandId: brandApple.id, sortOrder: 2 },
      { name: 'iPhone 16 Pro', slug: 'iphone-16-pro', kind: 'phone' as const, year: 2024, brandId: brandApple.id, sortOrder: 3 },
      { name: 'Galaxy S24 Ultra', slug: 'galaxy-s24-ultra', kind: 'phone' as const, year: 2024, brandId: brandSamsung.id, sortOrder: 4 },
      { name: 'Galaxy S24', slug: 'galaxy-s24', kind: 'phone' as const, year: 2024, brandId: brandSamsung.id, sortOrder: 5 },
      { name: 'Xiaomi 14', slug: 'xiaomi-14', kind: 'phone' as const, year: 2024, brandId: brandXiaomi.id, sortOrder: 6 },
      { name: 'MacBook Air 13" M3', slug: 'macbook-air-13-m3', kind: 'laptop' as const, year: 2024, brandId: brandApple.id, sortOrder: 7 },
      { name: 'iPad Pro 11"', slug: 'ipad-pro-11', kind: 'tablet' as const, year: 2024, brandId: brandApple.id, sortOrder: 8 },
    ].map((dm) => prisma.deviceModel.create({ data: dm })),
  );
  const dmId = Object.fromEntries(deviceModels.map((d) => [d.slug, d.id]));

  await prisma.product.update({
    where: { slug: 'iphone-17-pro' },
    data: { deviceModelId: dmId['iphone-17-pro'] },
  });
  await prisma.product.update({
    where: { slug: 'iphone-16-pro-max' },
    data: { deviceModelId: dmId['iphone-16-pro-max'] },
  });
  await prisma.product.update({
    where: { slug: 'iphone-16-pro' },
    data: { deviceModelId: dmId['iphone-16-pro'] },
  });
  await prisma.product.update({
    where: { slug: 'macbook-air-m3' },
    data: { deviceModelId: dmId['macbook-air-13-m3'] },
  });

  // ======================== ACCESSORIES ========================
  const caseSilicone = await prisma.product.create({
    data: {
      name: 'Funda Silicona MagSafe',
      slug: 'funda-silicona-magsafe',
      subtitle: 'Ajuste preciso. Colores vivos. MagSafe.',
      heroBadge: 'NUEVO',
      description: 'Funda de silicona con imanes MagSafe. Compatible con varios iPhone Pro. Colores y SKU por variante.',
      isFeatured: true,
      isActive: true,
      productKind: 'accessory',
      warrantyMonths: 6,
      images: ['/images/chapternav/accessories.png'],
      brandId: brandSpigen.id,
      categoryId: catId['fundas'],
      erp_product_id: 'ERP-CASE-SIL-MS',
      variants: {
        create: [
          { colorName: 'Negro', colorHex: '#1D1D1F', material: 'silicona', condition: 'NUEVO_SELLADO', price: 89000, sku: 'CASE-SIL-BLK', stock: 40 },
          { colorName: 'Azul', colorHex: '#0071E3', material: 'silicona', condition: 'NUEVO_SELLADO', price: 89000, sku: 'CASE-SIL-BLU', stock: 28 },
          { colorName: 'Rosa', colorHex: '#E8A0BF', material: 'silicona', condition: 'NUEVO_SELLADO', price: 89000, sku: 'CASE-SIL-PNK', stock: 18 },
        ],
      },
    },
  });
  await prisma.productCompatibility.createMany({
    data: [
      { productId: caseSilicone.id, deviceModelId: dmId['iphone-16-pro'] },
      { productId: caseSilicone.id, deviceModelId: dmId['iphone-16-pro-max'] },
      { productId: caseSilicone.id, deviceModelId: dmId['iphone-17-pro'] },
    ],
  });

  const caseLeather = await prisma.product.create({
    data: {
      name: 'Funda de Cuero iZone',
      slug: 'funda-cuero-izone',
      subtitle: 'Cuero genuino. Perfil fino.',
      description: 'Funda de cuero con interior de microfibra. Tacto premium para iPhone 16 Pro.',
      isFeatured: false,
      isActive: true,
      productKind: 'accessory',
      warrantyMonths: 6,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a31?q=80&w=800&auto=format&fit=crop'],
      brandId: brandIzone.id,
      categoryId: catId['fundas'],
      erp_product_id: 'ERP-CASE-LTH',
      variants: {
        create: [
          { colorName: 'Marrón', colorHex: '#6B4F3A', material: 'cuero', condition: 'NUEVO_SELLADO', price: 149000, sku: 'CASE-LTH-BRN', stock: 12 },
          { colorName: 'Negro', colorHex: '#1D1D1F', material: 'cuero', condition: 'NUEVO_SELLADO', price: 149000, sku: 'CASE-LTH-BLK', stock: 10 },
        ],
      },
    },
  });
  await prisma.productCompatibility.createMany({
    data: [{ productId: caseLeather.id, deviceModelId: dmId['iphone-16-pro'] }],
  });

  const caseSamsung = await prisma.product.create({
    data: {
      name: 'Funda Diseño Galaxy',
      slug: 'funda-diseno-galaxy',
      subtitle: 'Prints exclusivos para Galaxy S24.',
      description: 'Fundas con diseño gráfico para Galaxy S24 y S24 Ultra. Varios colores y referencias.',
      isFeatured: true,
      isActive: true,
      productKind: 'accessory',
      warrantyMonths: 3,
      images: ['https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=800&auto=format&fit=crop'],
      brandId: brandIzone.id,
      categoryId: catId['fundas'],
      erp_product_id: 'ERP-CASE-GAL',
      variants: {
        create: [
          { colorName: 'Abstracto Azul', colorHex: '#3B82F6', material: 'diseno', condition: 'NUEVO_SELLADO', price: 59000, sku: 'CASE-GAL-ABS', stock: 22 },
          { colorName: 'Mármol', colorHex: '#E7E5E4', material: 'diseno', condition: 'NUEVO_SELLADO', price: 59000, sku: 'CASE-GAL-MRB', stock: 16 },
        ],
      },
    },
  });
  await prisma.productCompatibility.createMany({
    data: [
      { productId: caseSamsung.id, deviceModelId: dmId['galaxy-s24'] },
      { productId: caseSamsung.id, deviceModelId: dmId['galaxy-s24-ultra'] },
    ],
  });

  const powerBank = await prisma.product.create({
    data: {
      name: 'Power Bank Anker 10.000 mAh',
      slug: 'power-bank-anker-10000',
      subtitle: 'Carga rápida USB-C. Compacto.',
      heroBadge: 'MÁS VENDIDO',
      description: 'Batería portátil de 10.000 mAh con USB-C. Sirve para iPhone, Galaxy y Xiaomi.',
      isFeatured: true,
      isActive: true,
      productKind: 'accessory',
      warrantyMonths: 12,
      images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800&auto=format&fit=crop'],
      brandId: brandAnker.id,
      categoryId: catId['energia'],
      erp_product_id: 'ERP-PB-ANK-10K',
      variants: {
        create: [
          { colorName: 'Negro', colorHex: '#111111', material: 'otro', condition: 'NUEVO_SELLADO', price: 189000, sku: 'PB-ANK-10K-BLK', stock: 30 },
          { colorName: 'Blanco', colorHex: '#F5F5F7', material: 'otro', condition: 'NUEVO_SELLADO', price: 189000, sku: 'PB-ANK-10K-WHT', stock: 14 },
        ],
      },
    },
  });
  await prisma.productCompatibility.createMany({
    data: [
      { productId: powerBank.id, deviceModelId: dmId['iphone-16-pro'] },
      { productId: powerBank.id, deviceModelId: dmId['iphone-17-pro'] },
      { productId: powerBank.id, deviceModelId: dmId['galaxy-s24'] },
      { productId: powerBank.id, deviceModelId: dmId['xiaomi-14'] },
    ],
  });

  const macHub = await prisma.product.create({
    data: {
      name: 'Hub USB-C 7 en 1',
      slug: 'hub-usbc-7en1',
      subtitle: 'HDMI, SD y USB-A para MacBook.',
      description: 'Hub USB-C compacto para MacBook Air M3: HDMI 4K, lectora SD y puertos USB-A.',
      isFeatured: true,
      isActive: true,
      productKind: 'accessory',
      warrantyMonths: 12,
      images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=800&auto=format&fit=crop'],
      brandId: brandAnker.id,
      categoryId: catId['accesorios-mac'],
      erp_product_id: 'ERP-HUB-USB7',
      variants: {
        create: [
          { colorName: 'Gris espacial', colorHex: '#4B5563', material: 'otro', condition: 'NUEVO_SELLADO', price: 219000, sku: 'HUB-USB7-SPG', stock: 20 },
        ],
      },
    },
  });
  await prisma.productCompatibility.createMany({
    data: [{ productId: macHub.id, deviceModelId: dmId['macbook-air-13-m3'] }],
  });

  const macSleeve = await prisma.product.create({
    data: {
      name: 'Funda Neopreno MacBook Air 13"',
      slug: 'funda-macbook-air-13',
      subtitle: 'Protección ligera para el día a día.',
      description: 'Sleeve de neopreno para MacBook Air 13" M3. Interior suave y cierre elástico.',
      isFeatured: false,
      isActive: true,
      productKind: 'accessory',
      warrantyMonths: 3,
      images: ['https://images.unsplash.com/photo-1541807084-5980d6e0c4e0?q=80&w=800&auto=format&fit=crop'],
      brandId: brandIzone.id,
      categoryId: catId['accesorios-mac'],
      erp_product_id: 'ERP-SLV-MBA13',
      variants: {
        create: [
          { colorName: 'Gris', colorHex: '#6B7280', material: 'otro', condition: 'NUEVO_SELLADO', price: 79000, sku: 'SLV-MBA13-GRY', stock: 15 },
        ],
      },
    },
  });
  await prisma.productCompatibility.createMany({
    data: [{ productId: macSleeve.id, deviceModelId: dmId['macbook-air-13-m3'] }],
  });

  // ======================== TRADE-IN MODELS ========================
  await prisma.tradeInModel.create({
    data: { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', brandSlug: 'apple', categorySlug: 'iphone', baseValue: 3200000, maxValue: 3800000 },
  });
  await prisma.tradeInModel.create({
    data: { name: 'iPhone 15 Pro', slug: 'iphone-15-pro', brandSlug: 'apple', categorySlug: 'iphone', baseValue: 2700000, maxValue: 3200000 },
  });
  await prisma.tradeInModel.create({
    data: { name: 'iPhone 14 Pro Max', slug: 'iphone-14-pro-max', brandSlug: 'apple', categorySlug: 'iphone', baseValue: 2200000, maxValue: 2800000 },
  });
  await prisma.tradeInModel.create({
    data: { name: 'iPhone 14 Pro', slug: 'iphone-14-pro', brandSlug: 'apple', categorySlug: 'iphone', baseValue: 1800000, maxValue: 2400000 },
  });
  await prisma.tradeInModel.create({
    data: { name: 'iPhone 13 Pro Max', slug: 'iphone-13-pro-max', brandSlug: 'apple', categorySlug: 'iphone', baseValue: 1500000, maxValue: 2000000 },
  });
  await prisma.tradeInModel.create({
    data: { name: 'iPhone 13', slug: 'iphone-13', brandSlug: 'apple', categorySlug: 'iphone', baseValue: 900000, maxValue: 1300000 },
  });

  // ======================== TRADE-IN QUESTIONS ========================
  await prisma.tradeInQuestion.create({
    data: {
      question: '¿La pantalla del dispositivo está en buen estado?',
      description: 'Sin grietas, manchas, píxeles muertos o quemaduras.',
      sortOrder: 1,
      options: JSON.stringify([
        { label: 'Sí, perfecta', deductionPercent: 0 },
        { label: 'Tiene rayones leves', deductionPercent: 10 },
        { label: 'Tiene grietas o daño visible', deductionPercent: 35 },
      ]),
    },
  });
  await prisma.tradeInQuestion.create({
    data: {
      question: '¿El dispositivo enciende y funciona correctamente?',
      description: 'Incluye carga, sonido, cámara y conectividad.',
      sortOrder: 2,
      options: JSON.stringify([
        { label: 'Sí, todo funciona', deductionPercent: 0 },
        { label: 'Tiene algún problema menor', deductionPercent: 15 },
        { label: 'No enciende o tiene fallas graves', deductionPercent: 50 },
      ]),
    },
  });
  await prisma.tradeInQuestion.create({
    data: {
      question: '¿La batería tiene buena salud?',
      description: 'Puedes verificar en Ajustes > Batería > Salud de la Batería.',
      sortOrder: 3,
      options: JSON.stringify([
        { label: '85% o más', deductionPercent: 0 },
        { label: 'Entre 70% y 84%', deductionPercent: 10 },
        { label: 'Menos de 70%', deductionPercent: 20 },
      ]),
    },
  });
  await prisma.tradeInQuestion.create({
    data: {
      question: '¿Cuenta con la caja original y accesorios?',
      description: 'Caja original, cable y documentación.',
      sortOrder: 4,
      options: JSON.stringify([
        { label: 'Sí, completo', deductionPercent: 0 },
        { label: 'Solo el equipo', deductionPercent: 5 },
      ]),
    },
  });

  // ======================== COUPON ========================
  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      description: '10% de descuento en tu primera compra',
      discountType: 'percentage',
      discountValue: 10,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'RETOMA5',
      description: '5% adicional al usar Plan Retoma',
      discountType: 'percentage',
      discountValue: 5,
      isActive: true,
    },
  });

  console.log('✅ Base de datos poblada con taxonomía jerárquica.');
  const familias = TAXONOMY.length;
  const subcats = TAXONOMY.reduce((n, f) => n + f.children.length, 0);
  console.log(`   🌳 ${familias} familias, ${subcats} subcategorías`);
  console.log('   📦 Productos Apple + 6 accesorios de ejemplo (colores/materiales)');
  console.log('   📱 8 device models (Apple, Samsung, Xiaomi) para finder');
  console.log('   📊 Especificaciones técnicas para comparador');
  console.log('   📱 6 modelos de Trade-In con 4 preguntas de evaluación');
  console.log('   🎟️ 2 cupones activos');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
