import { describe, expect, it } from 'vitest';
import { buildTemplate, DbVariant, parseCsv, planStockChanges } from './stock-loader';

const v = (over: Partial<DbVariant>): DbVariant => ({
  id: over.sku ?? 'id',
  sku: 'SKU',
  stock: 0,
  reservedStock: 0,
  productName: 'Producto',
  productActive: true,
  label: 'Blanco',
  ...over,
});

const DB: DbVariant[] = [
  v({ id: 'v1', sku: 'MK1E4LL/A', stock: 5, productName: 'iPhone Duo' }),
  v({ id: 'v2', sku: 'AP5-NOMAG', stock: 10, productName: 'AirPods 5' }),
  v({ id: 'v3', sku: 'MJQ54LL/A', stock: 10, reservedStock: 2, productName: 'iPhone 18 Pro' }),
  v({ id: 'v4', sku: 'OLD-1', stock: 3, productActive: false, productName: 'Viejo' }),
];

const csv = (body: string) => parseCsv(`sku_actual,stock,sku_nuevo\n${body}`);

describe('parseCsv', () => {
  it('lee CSV de Excel en español (;), con BOM y comillas', () => {
    const rows = parseCsv('﻿sku_actual;producto;stock\n"MK1E4LL/A";"iPhone; Duo";7\n\n');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ sku_actual: 'MK1E4LL/A', producto: 'iPhone; Duo', stock: '7' });
  });

  it('normaliza encabezados a minúsculas', () => {
    expect(parseCsv('SKU_ACTUAL,Stock\nA,1')[0]).toMatchObject({ sku_actual: 'A', stock: '1' });
  });
});

describe('planStockChanges', () => {
  it('propone solo los cambios reales (idempotente)', () => {
    const plan = planStockChanges(csv('MK1E4LL/A,5,\nAP5-NOMAG,12,\nMJQ54LL/A,,'), DB);
    expect(plan.errors).toEqual([]);
    expect(plan.unchanged).toBe(2);
    expect(plan.changes).toEqual([
      expect.objectContaining({ variantId: 'v2', stockFrom: 10, stockTo: 12 }),
    ]);
  });

  it('cambia el SKU inventado por el real', () => {
    const plan = planStockChanges(csv('AP5-NOMAG,,MXP65LL/A'), DB);
    expect(plan.changes[0]).toMatchObject({ sku: 'AP5-NOMAG', skuTo: 'MXP65LL/A' });
    expect(plan.changes[0].stockTo).toBeUndefined();
  });

  it('stock 0 es válido (agotado)', () => {
    const plan = planStockChanges(csv('MK1E4LL/A,0,'), DB);
    expect(plan.changes[0]).toMatchObject({ stockTo: 0 });
  });

  it.each([['-1'], ['3.5'], ['diez'], ['1e3']])('rechaza stock "%s"', (stock) => {
    const plan = planStockChanges(csv(`MK1E4LL/A,${stock},`), DB);
    expect(plan.errors).toHaveLength(1);
    expect(plan.changes).toHaveLength(0);
  });

  it('rechaza stock menor que lo reservado en pedidos abiertos', () => {
    const plan = planStockChanges(csv('MJQ54LL/A,1,'), DB);
    expect(plan.errors[0]).toMatch(/reservadas/);
  });

  it('rechaza SKU inexistente y SKU repetido en el CSV', () => {
    const plan = planStockChanges(csv('NO-EXISTE,1,\nMK1E4LL/A,1,\nMK1E4LL/A,2,'), DB);
    expect(plan.errors).toHaveLength(2);
    expect(plan.errors.join('\n')).toMatch(/no existe/);
    expect(plan.errors.join('\n')).toMatch(/repetido/);
  });

  it('rechaza un SKU nuevo que ya existe o que se repite en el CSV', () => {
    const plan = planStockChanges(csv('AP5-NOMAG,,MK1E4LL/A\nMJQ54LL/A,,NUEVO\nOLD-1,,NUEVO'), DB);
    expect(plan.errors).toHaveLength(2);
    expect(plan.errors[0]).toMatch(/ya lo usa/);
    expect(plan.errors[1]).toMatch(/también aparece/);
  });

  it('exige la columna sku_actual', () => {
    const plan = planStockChanges(parseCsv('sku,stock\nA,1'), DB);
    expect(plan.errors[0]).toMatch(/sku_actual/);
  });

  it('avisa de variantes activas que no vienen en el CSV y de productos inactivos', () => {
    const plan = planStockChanges(csv('OLD-1,4,'), DB);
    expect(plan.warnings.some((w) => w.includes('inactivo'))).toBe(true);
    expect(plan.warnings.filter((w) => w.includes('no está en el CSV'))).toHaveLength(3);
  });
});

describe('buildTemplate', () => {
  it('incluye solo variantes activas, con stock vacío para rellenar', () => {
    const out = buildTemplate(DB.map((d) => ({ ...d, price: '100' })));
    const rows = parseCsv(out);
    expect(rows.map((r) => r.sku_actual)).toEqual(['MK1E4LL/A', 'AP5-NOMAG', 'MJQ54LL/A']);
    expect(rows[0]).toMatchObject({ stock_en_bd: '5', stock: '', sku_nuevo: '' });
    // La plantilla recién generada no produce cambios.
    expect(planStockChanges(rows, DB).changes).toHaveLength(0);
  });
});
