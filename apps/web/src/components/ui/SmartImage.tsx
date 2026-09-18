import Image, { type ImageProps } from 'next/image';

const FALLBACK =
  'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=600&auto=format&fit=crop';

type SmartImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string | null;
  alt: string;
  fallback?: string;
};

/**
 * Thin next/image wrapper with a safe fallback for missing catalog URLs.
 * Prefer `fill` + sized parent (aspect-*) for CLS; use `priority` only for LCP candidates.
 */
export function SmartImage({
  src,
  alt,
  fallback = FALLBACK,
  sizes = '100vw',
  ...props
}: SmartImageProps) {
  const resolved = src && src.trim().length > 0 ? src : fallback;

  return <Image src={resolved} alt={alt} sizes={sizes} {...props} />;
}
