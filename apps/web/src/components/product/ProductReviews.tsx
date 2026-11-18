'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Review } from '@izone/shared-types';
import { submitReview } from '@/lib/api';
import { RatingSummary, StarRating } from './StarRating';
const dateFmt = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' });

export function ProductReviews({
  slug,
  productName,
  reviews,
  average,
  count,
}: {
  slug: string;
  productName: string;
  reviews: Review[];
  average?: number | null;
  count?: number;
}) {
  return (
    <section
      id="resenas"
      aria-labelledby="reviews-heading"
      className="mt-16 border-t border-neutral-200 dark:border-neutral-800 pt-10 scroll-mt-24"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2
            id="reviews-heading"
            className="text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-white"
          >
            Reseñas de {productName}
          </h2>
          <div className="mt-2">
            {count ? (
              <RatingSummary average={average} count={count} />
            ) : (
              <p className="text-sm text-neutral-500">
                Aún no hay reseñas. ¿Ya lo compraste? Cuéntanos tu experiencia.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-6">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-neutral-100 dark:border-neutral-900 pb-6">
              <div className="flex items-center gap-3">
                <StarRating value={r.rating} size="w-3.5 h-3.5" />
                <span className="text-sm font-semibold text-[#1D1D1F] dark:text-white">
                  {r.customerName}
                </span>
                <time dateTime={r.createdAt} className="text-xs text-neutral-400">
                  {dateFmt.format(new Date(r.createdAt))}
                </time>
              </div>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                {r.comment}
              </p>
            </li>
          ))}
        </ul>

        <ReviewForm slug={slug} />
      </div>
    </section>
  );
}

function ReviewForm({ slug }: { slug: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!rating) {
      setStatus('error');
      setError('Elige una calificación de 1 a 5 estrellas.');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      await submitReview(slug, {
        customerName: String(form.get('customerName') || ''),
        comment: String(form.get('comment') || ''),
        website: String(form.get('website') || ''),
        rating,
      });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'No pudimos enviar tu reseña.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 p-6 text-sm text-neutral-700 dark:text-neutral-300">
        <p className="font-semibold text-[#1D1D1F] dark:text-white mb-1">¡Gracias por tu reseña!</p>
        La publicaremos cuando nuestro equipo la revise.
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-2xl bg-neutral-50 dark:bg-neutral-900 p-6 space-y-4 self-start"
    >
      <h3 className="font-semibold text-[#1D1D1F] dark:text-white">Escribe una reseña</h3>

      <fieldset>
        <legend className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
          Calificación
        </legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              aria-label={`${i} ${i === 1 ? 'estrella' : 'estrellas'}`}
              aria-pressed={rating === i}
              className="p-0.5 text-[#F59E0B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0071E3] rounded"
            >
              <Star className={`w-6 h-6 ${i <= shown ? 'fill-current' : 'text-neutral-300 dark:text-neutral-600'}`} />
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Tu nombre</span>
        <input
          name="customerName"
          required
          minLength={2}
          maxLength={60}
          autoComplete="given-name"
          className="mt-1 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Tu reseña</span>
        <textarea
          name="comment"
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          className="mt-1 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
        />
      </label>

      {/* Honeypot anti-spam: oculto para personas */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {status === 'error' && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-full bg-[#0071E3] text-white text-sm font-medium py-2.5 disabled:opacity-60"
      >
        {status === 'sending' ? 'Enviando…' : 'Enviar reseña'}
      </button>
      <p className="text-[11px] text-neutral-500">
        Las reseñas se publican después de ser revisadas por nuestro equipo.
      </p>
    </form>
  );
}
