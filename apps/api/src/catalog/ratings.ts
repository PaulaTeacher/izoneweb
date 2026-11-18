/** Average rating (1 decimal) and count from approved reviews. */
export function summarizeRatings(reviews: { rating: number }[]): {
  ratingAverage: number | null;
  reviewCount: number;
} {
  if (!reviews.length) return { ratingAverage: null, reviewCount: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    ratingAverage: Math.round((sum / reviews.length) * 10) / 10,
    reviewCount: reviews.length,
  };
}
