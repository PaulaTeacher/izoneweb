'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { StarRating } from '@/components/product/StarRating';
import {
  adminFetch,
  bustStorefrontCache,
  getAdminToken,
  getAdminUser,
  type AdminSessionUser,
} from '@/lib/admin-api';

type ReviewRow = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product: { name: string; slug: string };
};

const TABS = [
  { value: 'pending', label: 'Pendientes' },
  { value: 'approved', label: 'Publicadas' },
  { value: 'all', label: 'Todas' },
] as const;

type Tab = (typeof TABS)[number]['value'];

const dateFmt = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

export default function AdminReviewsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminSessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>('pending');
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace('/admin/login');
      return;
    }
    setUser(getAdminUser());
    setReady(true);
  }, [router]);

  const load = useCallback(async (status: Tab) => {
    setLoading(true);
    setError('');
    try {
      setReviews(await adminFetch<ReviewRow[]>(`/admin/reviews?status=${status}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar reseñas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) void load(tab);
  }, [ready, tab, load]);

  const act = async (review: ReviewRow, action: 'approve' | 'hide' | 'delete') => {
    if (action === 'delete' && !window.confirm('¿Eliminar esta reseña? No se puede deshacer.')) {
      return;
    }
    setBusyId(review.id);
    setError('');
    try {
      if (action === 'delete') {
        await adminFetch(`/admin/reviews/${review.id}`, { method: 'DELETE' });
      } else {
        await adminFetch(`/admin/reviews/${review.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ isApproved: action === 'approve' }),
        });
      }
      await bustStorefrontCache();
      await load(tab);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la reseña');
    } finally {
      setBusyId(null);
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Reseñas</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Las reseñas que envían los clientes quedan pendientes hasta que las apruebes. Solo las
          publicadas se muestran en la tienda y en Google.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm border ${
              tab === t.value
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Cargando…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-neutral-500">No hay reseñas en esta vista.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <StarRating value={r.rating} size="w-3.5 h-3.5" />
                <span className="font-semibold">{r.customerName}</span>
                <a
                  href={`/product/${r.product.slug}#resenas`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0071E3] hover:underline"
                >
                  {r.product.name}
                </a>
                <span className="text-neutral-400">{dateFmt.format(new Date(r.createdAt))}</span>
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                    r.isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {r.isApproved ? 'Publicada' : 'Pendiente'}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-700 whitespace-pre-line">{r.comment}</p>
              <div className="mt-3 flex gap-2">
                {r.isApproved ? (
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => act(r, 'hide')}
                    className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-50"
                  >
                    Ocultar
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => act(r, 'approve')}
                    className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white hover:bg-neutral-800 disabled:opacity-50"
                  >
                    Aprobar
                  </button>
                )}
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => act(r, 'delete')}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
