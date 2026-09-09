import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clean up in dependency order
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
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.customer.deleteMany();

  // ======================== BRANDS ========================
  const brandApple = await prisma.brand.create({
    data: { name: 'Apple', slug: 'apple', logoUrl: null },
  });

  // ======================== CATEGORIES ========================
  const catSmartphones = await prisma.category.create({
    data: { name: 'iPhone', slug: 'iphone', description: 'La línea de smartphones más avanzada del mundo.', sortOrder: 1 },
  });
  const catLaptops = await prisma.category.create({
    data: { name: 'Mac', slug: 'mac', description: 'Potencia y rendimiento en cada modelo.', sortOrder: 2 },
  });
  const catTablets = await prisma.category.create({
    data: { name: 'iPad', slug: 'ipad', description: 'Tu siguiente computadora no es una computadora.', sortOrder: 3 },
  });
  const catWearables = await prisma.category.create({
    data: { name: 'Apple Watch', slug: 'apple-watch', description: 'El reloj inteligente más avanzado.', sortOrder: 4 },
  });
  const catAudio = await prisma.category.create({
    data: { name: 'Audio', slug: 'audio', description: 'AirPods y accesorios de audio premium.', sortOrder: 5 },
  });
  const catAccessories = await prisma.category.create({
    data: { name: 'Accesorios', slug: 'accesorios', description: 'Fundas, cargadores y más.', sortOrder: 6 },
  });

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
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
      ],
      brandId: brandApple.id,
      categoryId: catSmartphones.id,
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
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
      ],
      brandId: brandApple.id,
      categoryId: catSmartphones.id,
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
      categoryId: catLaptops.id,
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
      categoryId: catAudio.id,
      erp_product_id: 'ERP-AIRPRO2',
      tags: { connect: [{ id: tagPro.id }, { id: tagBestSeller.id }] },
      variants: {
        create: [
          { colorName: 'Blanco', colorHex: '#F5F5F5', condition: 'NUEVO_SELLADO', price: 1199000, sku: 'AIRPRO2-WHT', stock: 25, erp_variant_sku: 'V-AIRPRO2-WHT' },
        ],
      },
    },
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

  console.log('✅ Base de datos Supabase poblada exitosamente con esquema v2.');
  console.log('   📦 4 productos con variantes (nuevos + seminuevos + open box)');
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
