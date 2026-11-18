/**
 * Lógica pura (sin BD) del cargador de stock/SKUs. Ver load-stock.ts.
 */

export interface DbVariant {
  id: string;
  sku: string;
  stock: number;
  reservedStock: number;
  productName: string;
  productActive: boolean;
  label: string;
}

export interface StockChange {
  variantId: string;
  sku: string;
  productName: string;
  label: string;
  stockFrom: number;
  stockTo?: number;
  skuTo?: string;
}

export interface StockPlan {
  changes: StockChange[];
  unchanged: number;
  errors: string[];
  warnings: string[];
}

export type CsvRow = Record<string, string> & { __line: string };

/** Separador: Google Sheets exporta ',' y Excel en español suele usar ';'. */
function detectDelimiter(header: string): ',' | ';' {
  const commas = (header.match(/,/g) || []).length;
  const semis = (header.match(/;/g) || []).length;
  return semis > commas ? ';' : ',';
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === delimiter) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((c) => c.trim());
}

export function parseCsv(content: string): CsvRow[] {
  const lines = content.replace(/^﻿/, '').split(/\r?\n/);
  const headerIdx = lines.findIndex((l) => l.trim() !== '');
  if (headerIdx === -1) return [];
  const delimiter = detectDelimiter(lines[headerIdx]);
  const headers = splitCsvLine(lines[headerIdx], delimiter).map((h) => h.toLowerCase());
  const rows: CsvRow[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = splitCsvLine(lines[i], delimiter);
    const row = { __line: String(i + 1) } as CsvRow;
    headers.forEach((h, idx) => {
      row[h] = cols[idx] ?? '';
    });
    rows.push(row);
  }
  return rows;
}

/**
 * Calcula los cambios a aplicar. Nunca propone borrar, ni tocar precios/nombres.
 * Columnas usadas: sku_actual (obligatoria), stock y sku_nuevo (vacías = sin cambio).
 */
export function planStockChanges(rows: CsvRow[], variants: DbVariant[]): StockPlan {
  const errors: string[] = [];
  const warnings: string[] = [];
  const changes: StockChange[] = [];
  let unchanged = 0;

  if (rows.length > 0 && !('sku_actual' in rows[0])) {
    return {
      changes,
      unchanged,
      errors: ['Falta la columna "sku_actual" en el CSV.'],
      warnings,
    };
  }

  const bySku = new Map(variants.map((v) => [v.sku, v]));
  const seenSku = new Set<string>();
  const newSkus = new Map<string, string>(); // skuTo -> línea

  for (const row of rows) {
    const where = `línea ${row.__line}`;
    const sku = (row.sku_actual ?? '').trim();
    if (!sku) {
      errors.push(`${where}: sku_actual vacío.`);
      continue;
    }
    if (seenSku.has(sku)) {
      errors.push(`${where}: el SKU ${sku} está repetido en el CSV.`);
      continue;
    }
    seenSku.add(sku);

    const variant = bySku.get(sku);
    if (!variant) {
      errors.push(`${where}: el SKU ${sku} no existe en la base de datos.`);
      continue;
    }

    const change: StockChange = {
      variantId: variant.id,
      sku,
      productName: variant.productName,
      label: variant.label,
      stockFrom: variant.stock,
    };

    const rawStock = (row.stock ?? '').trim();
    if (rawStock !== '') {
      if (!/^\d+$/.test(rawStock)) {
        errors.push(`${where} (${sku}): stock "${rawStock}" no es un entero ≥ 0.`);
      } else {
        const stock = Number(rawStock);
        if (stock < variant.reservedStock) {
          errors.push(
            `${where} (${sku}): stock ${stock} es menor que las unidades reservadas en pedidos abiertos (${variant.reservedStock}).`,
          );
        } else if (stock !== variant.stock) {
          change.stockTo = stock;
        }
      }
    }

    const skuTo = (row.sku_nuevo ?? '').trim();
    if (skuTo && skuTo !== sku) {
      const other = bySku.get(skuTo);
      if (other) {
        errors.push(`${where} (${sku}): el SKU nuevo ${skuTo} ya lo usa otra variante (${other.productName}).`);
      } else if (newSkus.has(skuTo)) {
        errors.push(`${where} (${sku}): el SKU nuevo ${skuTo} también aparece en la línea ${newSkus.get(skuTo)}.`);
      } else if (!/^[A-Za-z0-9][A-Za-z0-9/._-]*$/.test(skuTo)) {
        errors.push(`${where} (${sku}): el SKU nuevo "${skuTo}" tiene caracteres no válidos.`);
      } else {
        newSkus.set(skuTo, row.__line);
        change.skuTo = skuTo;
      }
    }

    if (!variant.productActive && (change.stockTo !== undefined || change.skuTo)) {
      warnings.push(`${sku} pertenece a un producto inactivo (${variant.productName}).`);
    }

    if (change.stockTo !== undefined || change.skuTo) changes.push(change);
    else unchanged++;
  }

  const missing = variants.filter((v) => v.productActive && !seenSku.has(v.sku));
  for (const v of missing) {
    warnings.push(`${v.sku} (${v.productName} · ${v.label}) no está en el CSV: no se toca.`);
  }

  return { changes, unchanged, errors, warnings };
}

function csvCell(value: string | number): string {
  const s = String(value);
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Plantilla con las variantes activas: la usuaria rellena "stock" y, si aplica, "sku_nuevo". */
export function buildTemplate(
  variants: (DbVariant & { price: string })[],
): string {
  const header = ['sku_actual', 'producto', 'variante', 'precio', 'stock_en_bd', 'stock', 'sku_nuevo'];
  const lines = variants
    .filter((v) => v.productActive)
    .map((v) => [v.sku, v.productName, v.label, v.price, v.stock, '', ''].map(csvCell).join(','));
  return [header.join(','), ...lines].join('\n') + '\n';
}
