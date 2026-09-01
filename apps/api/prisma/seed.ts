import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.tag.deleteMany();

  const brandApple = await prisma.brand.create({ data: { name: 'Apple', slug: 'apple' } });
  const catSmartphones = await prisma.category.create({ data: { name: 'Smartphones', slug: 'smartphones' } });
  const catLaptops = await prisma.category.create({ data: { name: 'MacBooks', slug: 'macbooks' } });
  const catAudio = await prisma.category.create({ data: { name: 'Audio', slug: 'audio' } });
  const catWearables = await prisma.category.create({ data: { name: 'Apple Watch', slug: 'apple-watch' } });
  const catTablets = await prisma.category.create({ data: { name: 'iPad', slug: 'ipad' } });

  const tagNew = await prisma.tag.create({ data: { name: 'Nuevo', slug: 'nuevo' } });
  const tagPro = await prisma.tag.create({ data: { name: 'Pro', slug: 'pro' } });
  const tagBestSeller = await prisma.tag.create({ data: { name: 'Más Vendido', slug: 'mas-vendido' } });

  await prisma.product.create({
    data: {
      name: 'iPhone 16 Pro Max',
      slug: 'iphone-16-pro-max',
      description: 'El iPhone con la pantalla más grande y la mayor duración de batería.',
      seoTitle: 'Comprar iPhone 16 Pro Max en Bogotá | iZone Tech',
      seoDescription: 'Encuentra el nuevo iPhone 16 Pro Max al mejor precio en Colombia.',

      brandId: brandApple.id,
      categoryId: catSmartphones.id,
      erp_product_id: 'ERP-IPH16PROMAX',
      tags: { connect: [{ id: tagNew.id }, { id: tagPro.id }] },
      variants: {
        create: [
          { color: 'Titanio Natural', storage: '256GB', price: 6499000, sku: 'IPH16PM-NAT-256', stock: 10, erp_variant_sku: 'V-IPH16PM-NAT-256' },
          { color: 'Titanio Negro', storage: '512GB', price: 7499000, sku: 'IPH16PM-BLK-512', stock: 5, erp_variant_sku: 'V-IPH16PM-BLK-512' }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      name: 'iPhone 16 Pro',
      slug: 'iphone-16-pro',
      description: 'Diseñado con titanio. Superpotenciado por el chip A18 Pro.',
      seoTitle: 'Comprar iPhone 16 Pro en Bogotá | iZone Tech',
      seoDescription: 'Encuentra el nuevo iPhone 16 Pro al mejor precio en Colombia.',

      brandId: brandApple.id,
      categoryId: catSmartphones.id,
      erp_product_id: 'ERP-IPH16PRO',
      tags: { connect: [{ id: tagNew.id }, { id: tagPro.id }] },
      variants: {
        create: [
          { color: 'Titanio Natural', storage: '256GB', price: 5499000, sku: 'IPH16PRO-NAT-256', stock: 15, erp_variant_sku: 'V-IPH16PRO-NAT-256' },
          { color: 'Titanio Negro', storage: '256GB', price: 5499000, sku: 'IPH16PRO-BLK-256', stock: 5, erp_variant_sku: 'V-IPH16PRO-BLK-256' }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      name: 'MacBook Air M3',
      slug: 'macbook-air-m3',
      description: 'Súper ligera. Súper chip M3.',

      brandId: brandApple.id,
      categoryId: catLaptops.id,
      erp_product_id: 'ERP-MBAIRM3',
      tags: { connect: [{ id: tagNew.id }, { id: tagBestSeller.id }] },
      variants: {
        create: [
          { color: 'Medianoche', storage: '512GB', price: 6999000, sku: 'MBAIRM3-MID-512', stock: 8, erp_variant_sku: 'V-MBAIRM3-MID-512' },
          { color: 'Plata', storage: '256GB', price: 5999000, sku: 'MBAIRM3-SLV-256', stock: 12, erp_variant_sku: 'V-MBAIRM3-SLV-256' }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      name: 'AirPods Pro (2.ª generación)',
      slug: 'airpods-pro-2',
      description: 'Cancelación Activa de Ruido hasta 2 veces mejor.',

      brandId: brandApple.id,
      categoryId: catAudio.id,
      erp_product_id: 'ERP-AIRPRO2',
      tags: { connect: [{ id: tagPro.id }, { id: tagBestSeller.id }] },
      variants: {
        create: [
          { color: 'Blanco', price: 1199000, sku: 'AIRPRO2-WHT', stock: 25, erp_variant_sku: 'V-AIRPRO2-WHT' }
        ]
      }
    }
  });

  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      description: '10% de descuento en tu primera compra',
      discountType: 'percentage',
      discountValue: 10,
      isActive: true
    }
  });

  console.log('✅ Base de datos inicializada con productos semilla (Catálogo Apple).');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
