import { Star } from 'lucide-react';

/** Read-only stars for a real rating (rounded to the nearest whole star). */
export function StarRating({
  value,
  size = 'w-4 h-4',
  label,
}: {
  value: number;
  size?: string;
  label?: string;
}) {
  const filled = Math.round(value);
  return (
    <div
      className="flex text-[#F59E0B]"
      role="img"
      aria-label={label ?? `${value.toFixed(1)} de 5 estrellas`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={`${size} ${i <= filled ? 'fill-current' : 'text-neutral-300 dark:text-neutral-600'}`}
        />
      ))}
    </div>
  );
}

/** "4.8 ★★★★★ (12)" — renders nothing when there are no approved reviews. */
export function RatingSummary({
  average,
  count,
}: {
  average?: number | null;
  count?: number;
}) {
  if (!average || !count) return null;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[13px] font-bold">{average.toFixed(1)}</span>
      <StarRating value={average} />
      <span className="text-[13px] text-neutral-500">
        ({count} {count === 1 ? 'reseña' : 'reseñas'})
      </span>
    </div>
  );
}
