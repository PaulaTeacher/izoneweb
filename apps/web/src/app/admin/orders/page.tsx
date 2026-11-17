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

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number | string;
};

type OrderRow = {
  id: string;
  orderRef: string;
  status: string;
  paymentMethod: string;
  subtotal: number | string;
  discount: number | string;
  totalAmount: number | string;
  couponCode?: string | null;
  shippingName?: string | null;
  shippingPhone?: string | null;
  shippingCity?: string | null;
  shippingAddress?: string | null;
  shippingNotes?: string | null;
  reservedUntil?: string | null;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'reserved', label: 'Reservado' },
  { value: 'wa_contacted', label: 'Contactado WA' },
  { value: 'payment_pending', label: 'Pago pendiente' },
  { value: 'paid', label: 'Pagado' },
  { value: 'preparing', label: 'Preparando' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
] as const;

const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  STATUS_OPTIONS.filter((s) => s.value).map((s) => [s.value, s.label]),
);

const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function money(v: number | string | null | undefined) {
  return cop.format(typeof v === 'string' ? Number(v) : v ?? 0);
}

function shortRef(order: OrderRow) {
  return (order.orderRef || order.id).slice(0, 8).toUpperCase();
}

function statusClass(status: string) {
  switch (status) {
    case 'paid':
    case 'completed':
    case 'delivered':
      return 'bg-emerald-50 text-emerald-700';
    case 'cancelled':
      return 'bg-red-50 text-red-700';
    case 'reserved':
    case 'wa_contacted':
    case 'payment_pending':
      return 'bg-amber-50 text-amber-800';
    default:
      return 'bg-neutral-100 text-neutral-600';
  }
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminSessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<OrderRow | null>(null);
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

  const load = useCallback(async (q?: string, st?: string) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (q?.trim()) params.set('search', q.trim());
      if (st) params.set('status', st);
      params.set('take', '80');
      const qs = params.toString() ? `?${params}` : '';
      const data = await adminFetch<OrderRow[]>(`/admin/orders${qs}`);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) void load(search, status);
  }, [ready, load]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFilter = (e: FormEvent) => {
    e.preventDefault();
    void load(search, status);
  };

  const openDetail = async (order: OrderRow) => {
    setError('');
    try {
      const full = await adminFetch<OrderRow>(`/admin/orders/${order.id}`);
      setSelected(full);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo abrir el pedido');
    }
  };

  const changeStatus = async (next: string) => {
    if (!selected || next === selected.status) return;
    setSaving(true);
    setError('');
    try {
      const updated = await adminFetch<OrderRow>(`/admin/orders/${selected.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: next }),
      });
      setSelected(updated);
      await load(search, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el estado');
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
          <h1 className="text-2xl font-bold tracking-tight">Pedidos WhatsApp</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Leads y reservas generadas desde el checkout. Cambia el estado para liberar o
            confirmar inventario.
          </p>
        </div>
        <form onSubmit={onFilter} className="flex flex-wrap gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nombre, teléfono, ciudad…"
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm w-56 outline-none focus:border-neutral-900"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value || 'all'} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-medium"
          >
            Filtrar
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
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Cliente</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Fecha</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  Cargando pedidos…
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  Aún no hay pedidos WhatsApp
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3">
                    <div className="font-medium">#{shortRef(o)}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">
                      {o.items.length} ítem{o.items.length === 1 ? '' : 's'}
                      {o.couponCode ? ` · ${o.couponCode}` : ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div>{o.shippingName || '—'}</div>
                    <div className="text-xs text-neutral-400">
                      {[o.shippingPhone, o.shippingCity].filter(Boolean).join(' · ') || 'Sin datos'}
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums font-medium">{money(o.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${statusClass(o.status)}`}
                    >
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 hidden sm:table-cell text-xs">
                    {new Date(o.createdAt).toLocaleString('es-CO', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => void openDetail(o)}
                      className="text-neutral-900 font-medium hover:underline"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-xl">
            <div className="sticky top-0 bg-white border-b border-neutral-100 px-5 py-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Pedido #{shortRef(selected)}</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {new Date(selected.createdAt).toLocaleString('es-CO')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm"
              >
                Cerrar
              </button>
            </div>

            <div className="px-5 py-5 space-y-5">
              <section className="space-y-1 text-sm">
                <h3 className="font-semibold text-neutral-900">Cliente</h3>
                <p>{selected.shippingName || '—'}</p>
                <p className="text-neutral-500">{selected.shippingPhone || 'Sin teléfono'}</p>
                <p className="text-neutral-500">
                  {[selected.shippingCity, selected.shippingAddress].filter(Boolean).join(' · ') ||
                    'Sin dirección'}
                </p>
                {selected.shippingNotes ? (
                  <p className="text-neutral-500">Notas: {selected.shippingNotes}</p>
                ) : null}
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-neutral-900">Productos</h3>
                <ul className="divide-y divide-neutral-100 rounded-xl border border-neutral-200">
                  {selected.items.map((item) => (
                    <li key={item.id} className="px-3 py-2.5 text-sm flex justify-between gap-3">
                      <span>
                        {item.quantity}× {item.name}
                      </span>
                      <span className="tabular-nums text-neutral-600 shrink-0">
                        {money(Number(item.price) * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="text-sm space-y-1 pt-1">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span>{money(selected.subtotal)}</span>
                  </div>
                  {Number(selected.discount) > 0 ? (
                    <div className="flex justify-between text-neutral-500">
                      <span>Descuento{selected.couponCode ? ` (${selected.couponCode})` : ''}</span>
                      <span>-{money(selected.discount)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{money(selected.totalAmount)}</span>
                  </div>
                </div>
              </section>

              <label className="block text-sm">
                <span className="text-neutral-600">Estado</span>
                <select
                  value={selected.status}
                  disabled={saving}
                  onChange={(e) => void changeStatus(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 disabled:opacity-60"
                >
                  {STATUS_OPTIONS.filter((s) => s.value).map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Cancelar libera stock reservado. Pagado/completado descuenta inventario.
                </span>
              </label>
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-xs text-neutral-400">
        Tip:{' '}
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
