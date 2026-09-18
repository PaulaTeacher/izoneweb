'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import {
  adminFetch,
  clearAdminSession,
  getAdminToken,
  getAdminUser,
  type AdminSessionUser,
} from '@/lib/admin-api';

type VariantRow = {
  id: string;
  sku: string;
  price: number | string;
  comparePrice?: number | string | null;
  stock: number;
  colorName?: string | null;
  storage?: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  productKind: string;
  brand?: { name: string } | null;
  category?: { name: string } | null;
  variants: VariantRow[];
};

const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function money(v: number | string | null | undefined) {
  const n = typeof v === 'string' ? Number(v) : v ?? 0;
  return cop.format(n);
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminSessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<{
    product: ProductRow;
    variant: VariantRow;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    setUser(getAdminUser());
    setReady(true);
  }, [router]);

  const load = useCallback(async (q?: string) => {
    setLoading(true);
    setError('');
    try {
      const qs = q?.trim() ? `?search=${encodeURIComponent(q.trim())}` : '';
      const data = await adminFetch<ProductRow[]>(`/admin/products${qs}`);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) void load();
  }, [ready, load]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    void load(search);
  };

  const saveVariant = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const price = Number(fd.get('price'));
    const stock = Number(fd.get('stock'));
    const compareRaw = String(fd.get('comparePrice') || '').trim();
    const productActive = fd.get('isActive') === 'on';

    try {
      await adminFetch(`/admin/variants/${editing.variant.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          price,
          stock,
          comparePrice: compareRaw === '' ? null : Number(compareRaw),
        }),
      });
      if (productActive !== editing.product.isActive) {
        await adminFetch(`/admin/products/${editing.product.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ isActive: productActive }),
        });
      }
      setEditing(null);
      await load(search);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-neutral-500">
        Cargando…
      </div>
    );
  }

  return (
    <AdminShell user={user}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Edita precio, stock y visibilidad. El catálogo público usa ISR.
          </p>
        </div>
        <form onSubmit={onSearch} className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nombre, slug o SKU"
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm w-64 outline-none focus:border-neutral-900"
          />
          <button
            type="submit"
            className="rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-medium"
          >
            Buscar
          </button>
        </form>
      </div>

      {error ? (
        <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      ) : null}

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Variantes</th>
              <th className="px-4 py-3 font-medium">Desde</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  Cargando productos…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  Sin resultados
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const minPrice = p.variants.reduce(
                  (min, v) => Math.min(min, Number(v.price)),
                  Infinity,
                );
                const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={p.id} className="border-t border-neutral-100">
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {p.brand?.name} · {p.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-500 hidden md:table-cell">
                      {p.variants.length}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {Number.isFinite(minPrice) ? money(minPrice) : '—'}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{totalStock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          p.isActive
                            ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-xs'
                            : 'text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md text-xs'
                        }
                      >
                        {p.isActive ? 'Activo' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({
                            product: p,
                            variant: p.variants[0],
                          })
                        }
                        disabled={!p.variants.length}
                        className="text-neutral-900 font-medium hover:underline disabled:opacity-40"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={saveVariant}
            className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-xl"
          >
            <div>
              <h2 className="text-lg font-semibold">{editing.product.name}</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Variante · {editing.variant.sku}
                {editing.variant.colorName ? ` · ${editing.variant.colorName}` : ''}
                {editing.variant.storage ? ` · ${editing.variant.storage}` : ''}
              </p>
            </div>

            {editing.product.variants.length > 1 ? (
              <label className="block text-sm">
                <span className="text-neutral-600">Variante</span>
                <select
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5"
                  value={editing.variant.id}
                  onChange={(e) => {
                    const v = editing.product.variants.find((x) => x.id === e.target.value);
                    if (v) setEditing({ ...editing, variant: v });
                  }}
                >
                  {editing.product.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.sku} · {money(v.price)} · stock {v.stock}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <label className="block text-sm">
              <span className="text-neutral-600">Precio (COP)</span>
              <input
                key={`price-${editing.variant.id}`}
                name="price"
                type="number"
                min={0}
                step={1}
                required
                defaultValue={Number(editing.variant.price)}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5"
              />
            </label>

            <label className="block text-sm">
              <span className="text-neutral-600">Precio tachado (opcional)</span>
              <input
                key={`compare-${editing.variant.id}`}
                name="comparePrice"
                type="number"
                min={0}
                step={1}
                defaultValue={
                  editing.variant.comparePrice != null
                    ? Number(editing.variant.comparePrice)
                    : ''
                }
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5"
              />
            </label>

            <label className="block text-sm">
              <span className="text-neutral-600">Stock</span>
              <input
                key={`stock-${editing.variant.id}`}
                name="stock"
                type="number"
                min={0}
                step={1}
                required
                defaultValue={editing.variant.stock}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5"
              />
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={editing.product.isActive}
                className="rounded border-neutral-300"
              />
              Producto visible en tienda
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-neutral-900 text-white py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <p className="mt-4 text-xs text-neutral-400">
        Tip: si la sesión caduca te redirige a login.{' '}
        <button
          type="button"
          className="underline"
          onClick={() => {
            clearAdminSession();
            router.replace('/admin/login');
          }}
        >
          Forzar logout
        </button>
      </p>
    </AdminShell>
  );
}
