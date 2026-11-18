import { ArrowUpRight } from 'lucide-react';
import { SOCIAL_LINKS, SOCIAL_STATS } from '@/lib/site';
import { TikTokFacade } from './TikTokFacade';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.33 6.33 0 0 0 3.16 15.3a6.33 6.33 0 0 0 6.33 6.33 6.33 6.33 0 0 0 6.33-6.33V8.73a8.18 8.18 0 0 0 4.77 1.52V6.84a4.85 4.85 0 0 1-1-.15z" />
    </svg>
  );
}

const platforms = [
  {
    ...SOCIAL_LINKS.instagram,
    description: 'Lanzamientos, unboxings y tip del día.',
    Icon: InstagramIcon,
    accent: 'from-[#F58529]/30 via-[#DD2A7B]/25 to-[#8134AF]/30',
    iconBg: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    focus: 'focus-visible:outline-[#DD2A7B]',
  },
  {
    ...SOCIAL_LINKS.tiktok,
    description: 'Reviews reales y ofertas que se agotan.',
    Icon: TikTokIcon,
    accent: 'from-[#25F4EE]/25 via-transparent to-[#FE2C55]/25',
    iconBg: 'bg-neutral-950 ring-1 ring-white/10',
    focus: 'focus-visible:outline-[#25F4EE]',
  },
] as const;

/**
 * Componente de servidor: todo el contenido llega visible en el HTML. La
 * animación de entrada es CSS (.reveal en globals.css) y solo corre si el
 * navegador la soporta y el usuario no pidió reducir el movimiento.
 */
export function SocialFollow() {
  return (
    <section
      id="redes"
      aria-labelledby="social-follow-heading"
      className="relative overflow-hidden bg-[#141416] text-white scroll-mt-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(255,255,255,0.10),transparent_50%)]"
        aria-hidden
      />

      <div className="relative container mx-auto px-4 py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <div className="reveal">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Comunidad iZone
            </p>
            <h2
              id="social-follow-heading"
              className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Síguenos en Instagram y TikTok
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-300">
              Somos uno de los comercios más activos en venta de productos Apple y accesorios en
              Bogotá: lanzamientos, demos y entregas reales cada semana.
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:max-w-lg">
              {SOCIAL_STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-xs leading-snug text-neutral-400 sm:text-sm">
                    {stat.label}
                  </dt>
                  <dd className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className="reveal flex flex-col gap-3">
            {platforms.map(({ Icon, ...platform }) => (
              <li key={platform.href}>
                <a
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 outline outline-2 outline-offset-2 outline-transparent transition-[border-color,background-color,translate] hover:border-white/25 hover:bg-white/[0.07] motion-safe:hover:-translate-y-0.5 ${platform.focus}`}
                >
                  <span
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${platform.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    aria-hidden
                  />
                  <span className="relative flex items-center gap-4">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-lg ${platform.iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-base font-semibold text-white">{platform.label}</span>
                        <span className="truncate text-sm text-neutral-400">{platform.handle}</span>
                      </span>
                      <span className="mt-0.5 block text-sm text-neutral-300">
                        {platform.description}
                      </span>
                    </span>
                    <span className="hidden items-center gap-1 text-sm font-medium text-white sm:inline-flex">
                      Seguir
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                    <span className="sr-only">(abre en una pestaña nueva)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal mt-10">
          <TikTokFacade username="izonetechbogota" href={SOCIAL_LINKS.tiktok.href} />
        </div>
      </div>
    </section>
  );
}
