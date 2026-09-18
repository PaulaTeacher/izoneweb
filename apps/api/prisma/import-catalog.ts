/**
 * Upsert de catálogo desde CSV (una fila = una variante).
 *
 * Uso:
 *   pnpm --filter api db:import -- ./prisma/mi-catalogo.csv
 *   pnpm --filter api db:import -- ./prisma/catalog-import.template.csv --dry-run
 *
 * NO borra pedidos ni el resto del catálogo. Si el slug/sku existe, actualiza.
 * NUNCA uses `db:seed` en producción (wipe total).
 *
 * Columnas: ver catalog-import.template.csv
 */
import * as fs from 'fs';
import * as path from 'path';
import {
  AccessoryMaterial,
  PrismaClient,
  ProductCondition,
  ProductKind,
} from '@prisma/client';

const prisma = new PrismaClient();

type Row = Record<string, string>;

function parseCsv(content: string): Row[] {
  const lines = content
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line, idx) => {
    const cols = splitCsvLine(line);
    const row: Row = {};
    headers.forEach((h, i) => {
      row[h] = (cols[i] ?? '').trim();
    });
    row.__line = String(idx + 2);
    return row;
  });
}

/** Minimal CSV splitter with double-quoted fields. */
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function pipeList(value: string): string[] {
  return value
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
}

function bool(value: string, fallback = false): boolean {
  if (!value) return fallback;
  return ['1', 'true', 'yes', 'si', 'sí'].includes(value.toLowerCase());
}

function num(value: string, fallback = 0): number {
  if (!value) return fallback;
  const n = Number(String(value).replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

function parseCondition(value: string): ProductCondition {
  const v = (value || 'NUEVO_SELLADO').toUpperCase();
  if (v in ProductCondition) return v as ProductCondition;
  return ProductCondition.NUEVO_SELLADO;
}

function parseMaterial(value: string): AccessoryMaterial | null {
  if (!value) return null;
  const v = value.toLowerCase();
  if (Object.values(AccessoryMaterial).includes(v as AccessoryMaterial)) {
    return v as AccessoryMaterial;
  }
  return AccessoryMaterial.otro;
}

function parseKind(value: string): ProductKind {
  return value === 'accessory' ? ProductKind.accessory : ProductKind.equipment;
}

async function ensureBrand(slug: string, name: string) {
  if (!slug) throw new Error('brandSlug es obligatorio');
  return prisma.brand.upsert({
    where: { slug },
    update: { name: name || slug },
    create: { slug, name: name || slug },
  });
}

async function ensureCategory(slug: string) {
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) {
    throw new Error(
      `Categoría "${slug}" no existe. Créala antes o usa una hoja existente (iphone, fundas, energia, …).`,
    );
  }
  return cat;
}

async function ensureDeviceModel(slug: string) {
  if (!slug) return null;
  const dm = await prisma.deviceModel.findUnique({ where: { slug } });
  if (!dm) {
    console.warn(`⚠ deviceModelSlug "${slug}" no existe — se omite el vínculo.`);
    return null;
  }
  return dm;
}

async function upsertProductFromRows(rows: Row[], dryRun: boolean) {
  const bySlug = new Map<string, Row[]>();
  for (const row of rows) {
    if (!row.slug || !row.sku) {
      throw new Error(`Línea ${row.__line}: slug y sku son obligatorios`);
    }
    const list = bySlug.get(row.slug) || [];
    list.push(row);
    bySlug.set(row.slug, list);
  }

  let productsTouched = 0;
  let variantsTouched = 0;

  for (const [slug, variantRows] of bySlug) {
    const head = variantRows[0];
    const kind = parseKind(head.productKind);
    const brand = await ensureBrand(head.brandSlug, head.brandName);
    const category = await ensureCategory(head.categorySlug);
    const deviceModel = await ensureDeviceModel(head.deviceModelSlug);
    const images = pipeList(head.images);
    const compatible = pipeList(head.compatibleWith);

    const productData = {
      name: head.name,
      subtitle: head.subtitle || null,
      description: head.description || head.name,
      heroBadge: head.heroBadge || null,
      images,
      isFeatured: bool(head.isFeatured, false),
      isActive: true,
      warrantyMonths: num(head.warrantyMonths, kind === 'accessory' ? 6 : 12),
      productKind: kind,
      seoTitle: head.seoTitle || null,
      seoDescription: head.seoDescription || null,
      brandId: brand.id,
      categoryId: category.id,
      deviceModelId: deviceModel?.id ?? null,
      erp_product_id: head.erp_product_id || null,
    };

    console.log(
      `${dryRun ? '[dry-run] ' : ''}Producto ${slug} (${kind}) · ${variantRows.length} variante(s)`,
    );

    if (dryRun) {
      productsTouched++;
      variantsTouched += variantRows.length;
      continue;
    }

    const product = await prisma.product.upsert({
      where: { slug },
      update: productData,
      create: { slug, ...productData },
    });
    productsTouched++;

    for (const row of variantRows) {
      const variantData = {
        productId: product.id,
        colorName: row.colorName || null,
        colorHex: row.colorHex || null,
        storage: row.storage || null,
        material: kind === 'accessory' ? parseMaterial(row.material) : null,
        condition: parseCondition(row.condition),
        price: num(row.price),
        comparePrice: row.comparePrice ? num(row.comparePrice) : null,
        featuredImage: row.featuredImage || null,
        stock: num(row.stock, 0),
        erp_variant_sku: row.erp_variant_sku || null,
      };

      if (!variantData.price || variantData.price <= 0) {
        throw new Error(`Línea ${row.__line}: price debe ser > 0 (sku ${row.sku})`);
      }

      await prisma.variant.upsert({
        where: { sku: row.sku },
        update: variantData,
        create: { sku: row.sku, ...variantData },
      });
      variantsTouched++;
    }

    if (kind === 'accessory') {
      await prisma.productCompatibility.deleteMany({ where: { productId: product.id } });
      const links: { productId: string; deviceModelId: string }[] = [];
      for (const modelSlug of compatible) {
        const dm = await prisma.deviceModel.findUnique({ where: { slug: modelSlug } });
        if (!dm) {
          console.warn(`⚠ compatibleWith "${modelSlug}" no existe — omitido`);
          continue;
        }
        links.push({ productId: product.id, deviceModelId: dm.id });
      }
      if (links.length) {
        await prisma.productCompatibility.createMany({ data: links });
      }
    }
  }

  return { productsTouched, variantsTouched };
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--');
  const dryRun = args.includes('--dry-run');
  const fileArg = args.find((a) => !a.startsWith('--'));

  if (!fileArg) {
    console.error(
      'Uso: pnpm --filter api db:import -- <archivo.csv> [--dry-run]\n' +
        'Plantilla: apps/api/prisma/catalog-import.template.csv',
    );
    process.exit(1);
  }

  const filePath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(filePath)) {
    throw new Error(`No existe el archivo: ${filePath}`);
  }

  const rows = parseCsv(fs.readFileSync(filePath, 'utf8'));
  if (!rows.length) {
    throw new Error('CSV vacío o sin filas de datos');
  }

  const result = await upsertProductFromRows(rows, dryRun);
  console.log(
    `✅ ${dryRun ? 'Simulación OK' : 'Import OK'}: ${result.productsTouched} producto(s), ${result.variantsTouched} variante(s).`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Import falló:', e.message || e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
