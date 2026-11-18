'use client';

import { startTransition, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * Se muestra cuando el catálogo no responde (p. ej. la API arrancando en frío).
 * Next no guarda en caché esta respuesta, así que reintentar vuelve a pedir datos.
 */
export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  // El error viene de un Server Component: refrescar pide de nuevo los datos al servidor.
  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        No pudimos cargar el catálogo
      </h1>
      <p className="mt-3 text-neutral-600">
        Estamos teniendo un problema momentáneo. Intenta de nuevo en unos segundos.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={retry}
          className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
        >
          Ir al inicio
        </Link>
      </div>
    </section>
  );
}
