'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

const TIKTOK_ORIGIN = 'https://www.tiktok.com';
const EMBED_SRC = `${TIKTOK_ORIGIN}/embed.js`;
const EMBED_HEIGHT = 480;
/** Si TikTok no termina en este tiempo, se ofrece abrir el perfil directamente. */
const SLOW_MS = 12_000;

/** Abre la conexión (DNS + TLS) con TikTok sin enviar ninguna petición ni cookie. */
let preconnected = false;
function preconnectTikTok() {
  if (preconnected) return;
  preconnected = true;
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = TIKTOK_ORIGIN;
  document.head.appendChild(link);
}

/**
 * Fachada del perfil de TikTok: no se descarga nada de TikTok (ni scripts ni
 * cookies) hasta que el visitante hace clic en "Ver videos aquí".
 *
 * Para que se sienta rápido:
 * - Al acercar el cursor, enfocar o tocar el botón se precalienta la conexión.
 * - Tras el clic se muestra al instante un esqueleto de carga, que se retira
 *   cuando el iframe de TikTok ya tiene su alto real.
 */
export function TikTokFacade({ username, href }: { username: string; href: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'slow'>('idle');
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== 'loading') return;
    const box = boxRef.current;
    if (!box) return;

    // embed.js solo escanea los blockquotes al cargar; se reinserta cada vez.
    document.querySelectorAll(`script[src="${EMBED_SRC}"]`).forEach((s) => s.remove());
    const script = document.createElement('script');
    script.src = EMBED_SRC;
    script.async = true;
    document.body.appendChild(script);

    // TikTok reemplaza el blockquote por un iframe de 1px y le pone el alto
    // real cuando su contenido está listo: ese es el momento de mostrarlo.
    let resizeObserver: ResizeObserver | undefined;
    const watchIframe = () => {
      const iframe = box.querySelector('iframe');
      if (!iframe || resizeObserver) return;
      resizeObserver = new ResizeObserver(() => {
        if (iframe.getBoundingClientRect().height > 200) setStatus('ready');
      });
      resizeObserver.observe(iframe);
    };
    const mutationObserver = new MutationObserver(watchIframe);
    mutationObserver.observe(box, { childList: true, subtree: true });

    const slowTimer = window.setTimeout(
      () => setStatus((s) => (s === 'loading' ? 'slow' : s)),
      SLOW_MS,
    );

    return () => {
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
      window.clearTimeout(slowTimer);
    };
  }, [status]);

  if (status !== 'idle') {
    const showSkeleton = status === 'loading' || status === 'slow';
    return (
      <div
        ref={boxRef}
        className="relative mx-auto w-full max-w-[780px]"
        style={{ minHeight: EMBED_HEIGHT }}
        aria-busy={showSkeleton}
      >
        <blockquote
          className="tiktok-embed"
          cite={href}
          data-unique-id={username}
          data-embed-type="creator"
          style={{ maxWidth: 780, minWidth: 288, margin: 0 }}
        >
          <section>
            <a href={href} target="_blank" rel="noopener noreferrer">
              @{username}
            </a>
          </section>
        </blockquote>

        {showSkeleton && (
          <div
            className="absolute inset-0 z-10 flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#1c1c1f] p-6"
            role="status"
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 rounded-full bg-white/10 motion-safe:animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-white/10 motion-safe:animate-pulse" />
                <div className="h-3 w-56 max-w-full rounded bg-white/10 motion-safe:animate-pulse" />
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`rounded-xl bg-white/10 motion-safe:animate-pulse ${i > 1 ? 'hidden sm:block' : ''}`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-neutral-300">
              {status === 'slow' ? (
                <>
                  TikTok está tardando más de lo normal.{' '}
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-white underline underline-offset-4"
                  >
                    Abrir en TikTok<span className="sr-only"> (abre en una pestaña nueva)</span>
                  </a>
                </>
              ) : (
                'Cargando videos de TikTok…'
              )}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Lo último en nuestro TikTok</h3>
          <p className="mt-1 text-sm text-neutral-400">
            Unboxings, demos y entregas reales de @{username}.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setStatus('loading')}
            onPointerEnter={preconnectTikTok}
            onTouchStart={preconnectTikTok}
            onFocus={preconnectTikTok}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-950 outline outline-2 outline-offset-2 outline-transparent transition-colors hover:bg-neutral-200 focus-visible:outline-[#25F4EE]"
          >
            <Play className="h-4 w-4 fill-current" aria-hidden />
            Ver videos aquí
          </button>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-3 py-2.5 text-sm font-medium text-neutral-300 underline-offset-4 outline outline-2 outline-offset-2 outline-transparent hover:text-white hover:underline focus-visible:outline-[#25F4EE]"
          >
            Abrir en TikTok<span className="sr-only"> (abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>
      <p className="mt-3 text-xs text-neutral-400">
        Al ver los videos aquí, TikTok puede usar cookies propias.
      </p>
    </div>
  );
}
