/// <reference types="node" />
/**
 * Carga de stock real y SKUs desde un CSV. Idempotente y SIN escritura por defecto.
 *
 *   # 1) Generar la plantilla con las variantes activas (solo lectura)
 *   pnpm --filter api db:load-stock -- --template ./prisma/stock.csv
 *
 *   # 2) Ver qué cambiaría (dry-run, por defecto)
 *   pnpm --filter api db:load-stock -- ./prisma/stock.csv
 *
 *   # 3) Aplicar (una sola transacción; si algo falla, no cambia nada)
 *   pnpm --filter api db:load-stock -- ./prisma/stock.csv --apply
 *
 * Columnas: sku_actual (obligatoria), stock, sku_nuevo. Vacío = sin cambio.
 * Nunca borra variantes ni toca precios, nombres o productos.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { buildTemplate, parseCsv, planStockChanges } from './stock-loader';

// Cargar apps/api/.env si las variables no vienen del entorno (Node >= 21).
if (!process.env.DATABASE_URL && fs.existsSync(path.resolve('.env'))) {
  process.loadEnvFile(path.resolve('.env'));
}

const prisma = new PrismaClient();

async function loadVariants() {
  const rows = await prisma.variant.findMany({
    include: { product: { select: { name: true, isActive: true, slug: true } } },
    orderBy: [{ product: { slug: 'asc' } }, { sku: 'asc' }],
  });
  return rows.map((v) => ({
    id: v.id,
    sku: v.sku,
    stock: v.stock,
    reservedStock: v.reservedStock,
    productName: v.product.name,
    productActive: v.product.isActive,
    label: [v.colorName, v.storage, v.condition !== 'NUEVO_SELLADO' ? v.condition : null]
      .filter(Boolean)
      .join(' · '),
    price: v.price.toString(),
  }));
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--');
  const templateIdx = args.indexOf('--template');

  if (templateIdx !== -1) {
    const out = args[templateIdx + 1];
    if (!out) throw new Error('Uso: --template <archivo.csv>');
    const target = path.resolve(out);
    if (fs.existsSync(target) && !args.includes('--overwrite')) {
      throw new Error(`${target} ya existe. Usa --overwrite para reemplazarlo.`);
    }
    fs.writeFileSync(target, buildTemplate(await loadVariants()), 'utf8');
    console.log(`Plantilla escrita en ${target}. Rellena "stock" (y "sku_nuevo" si aplica).`);
    return;
  }

  const apply = args.includes('--apply');
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) {
    console.error('Uso: pnpm --filter api db:load-stock -- <archivo.csv> [--apply]');
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync(path.resolve(file), 'utf8'));
  const variants = await loadVariants();
  const plan = planStockChanges(rows, variants);

  for (const w of plan.warnings) console.warn(`⚠️  ${w}`);
  for (const e of plan.errors) console.error(`❌ ${e}`);

  console.log(`\nCambios (${plan.changes.length}), sin cambios: ${plan.unchanged}`);
  for (const c of plan.changes) {
    const parts: string[] = [];
    if (c.stockTo !== undefined) parts.push(`stock ${c.stockFrom} → ${c.stockTo}`);
    if (c.skuTo) parts.push(`SKU ${c.sku} → ${c.skuTo}`);
    console.log(`  • ${c.productName} · ${c.label} [${c.sku}]: ${parts.join(', ')}`);
  }

  if (plan.errors.length > 0) {
    console.error(`\n${plan.errors.length} error(es): no se aplicó nada. Corrige el CSV y vuelve a ejecutar.`);
    process.exit(1);
  }
  if (!apply) {
    console.log('\nDRY-RUN: no se escribió nada. Añade --apply para aplicar estos cambios.');
    return;
  }
  if (plan.changes.length === 0) {
    console.log('\nNada que aplicar.');
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const c of plan.changes) {
      // Condicional a lo leído: si alguien cambió la variante entretanto, se aborta todo.
      const { count } = await tx.variant.updateMany({
        where: { id: c.variantId, sku: c.sku, stock: c.stockFrom },
        data: {
          ...(c.stockTo !== undefined ? { stock: c.stockTo } : {}),
          ...(c.skuTo ? { sku: c.skuTo } : {}),
        },
      });
      if (count !== 1) {
        throw new Error(`La variante ${c.sku} cambió durante la carga; no se aplicó nada.`);
      }
    }
  });
  console.log(`\n✅ Aplicados ${plan.changes.length} cambio(s).`);
}

main()
  .catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
