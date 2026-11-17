import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      variants: true,
    },
  });

  const output = products.map(p => ({
    name: p.name,
    slug: p.slug,
    category: p.category.name,
    isFeatured: p.isFeatured,
    variantsCount: p.variants.length,
    inStockVariants: p.variants.filter(v => v.stock > 0).length,
  }));

  console.log(JSON.stringify(output, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
