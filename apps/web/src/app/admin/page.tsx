'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import {
  ProductEditor,
  type AdminProduct,
} from '@/components/admin/ProductEditor';
import {
  adminFetch,
  clearAdminSession,
  getAdminToken,
  getAdminUser,
  type AdminSessionUser,
} from '@/lib/admin-api';

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
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editor, setEditor] = useState<
    | { mode: 'create'; product: null }
    | { mode: 'edit'; product: AdminProduct }
    | null
  >(null);

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
      const data = await adminFetch<AdminProduct[]>(`/admin/products${qs}`);
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

  const openEdit = async (product: AdminProduct) => {
    setError('');
    try {
      const full = await adminFetch<AdminProduct>(`/admin/products/${product.id}`);
      setEditor({ mode: 'edit', product: full });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo abrir el producto');
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
            Crea productos con variantes, stock, precios e imágenes. El check{' '}
            <span className="font-medium text-neutral-700">Destacado</span> alimenta
            “Los favoritos del momento” en el Home.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form onSubmit={onSearch} className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar nombre, slug o SKU"
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm w-56 outline-none focus:border-neutral-900"
            />
            <button
              type="submit"
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium"
            >
              Buscar
            </button>
          </form>
          <button
            type="button"
            onClick={() => setEditor({ mode: 'create', product: null })}
            className="rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-medium"
          >
            Nuevo producto
          </button>
        </div>
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
                const totalStock = p.variants.reduce((s, v) => s + Number(v.stock || 0), 0);
                const thumb = p.images?.[0];
                return (
                  <tr key={p.id} className="border-t border-neutral-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumb}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover border border-neutral-100 bg-neutral-50"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-neutral-100" />
                        )}
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-neutral-400 mt-0.5">
                            {p.brand?.name} · {p.slug}
                          </div>
                        </div>
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
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={
                            p.isActive
                              ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-xs'
                              : 'text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md text-xs'
                          }
                        >
                          {p.isActive ? 'Activo' : 'Oculto'}
                        </span>
                        {p.isFeatured ? (
                          <span className="text-[#0071E3] bg-blue-50 px-2 py-0.5 rounded-md text-xs">
                            Home
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => void openEdit(p)}
                        className="text-neutral-900 font-medium hover:underline"
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

      {editor ? (
        <ProductEditor
          mode={editor.mode}
          product={editor.product}
          onClose={() => setEditor(null)}
          onSaved={() => void load(search)}
        />
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
