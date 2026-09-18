'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/site';
import { easeOut } from '@/components/motion/FadeIn';

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
    cta: 'Seguir en Instagram',
    Icon: InstagramIcon,
    accent: 'from-[#F58529]/25 via-[#DD2A7B]/20 to-[#8134AF]/25',
    iconBg: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
  },
  {
    ...SOCIAL_LINKS.tiktok,
    description: 'Reviews reales y ofertas que se agotan.',
    cta: 'Seguir en TikTok',
    Icon: TikTokIcon,
    accent: 'from-cyan-400/20 via-transparent to-rose-400/20',
    iconBg: 'bg-neutral-950',
  },
] as const;

const stats = [
  { value: '+10 mil', label: 'Seguidores' },
  { value: '+7 M', label: 'Vistas' },
  { value: 'Bogotá', label: 'Apple & accesorios' },
] as const;

export function SocialFollow() {
  const reduce = useReducedMotion();

  return (
    <section
      id="redes"
      aria-labelledby="social-follow-heading"
      className="relative overflow-hidden bg-[#0B0B0C] text-white scroll-mt-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,113,227,0.28),transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(221,42,123,0.14),transparent_45%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
        aria-hidden
      />

      <div className="relative container mx-auto px-4 py-16 md:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, ease: easeOut }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7DB7F5]">
              Comunidad iZone
            </p>
            <h2
              id="social-follow-heading"
              className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
            >
              Síguenos en Instagram y TikTok
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-400 md:text-lg">
              Con más de{' '}
              <span className="font-medium text-white">10 mil seguidores</span> y más de{' '}
              <span className="font-medium text-white">7 millones de vistas</span>, somos uno de los
              comercios más destacados en venta de productos Apple y accesorios en Bogotá.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 sm:max-w-lg">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4, ease: easeOut, delay: 0.08 * index }}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 sm:text-sm">{stat.label}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>

          <div className="flex flex-col gap-3">
            {platforms.map((platform, index) => {
              const Icon = platform.Icon;
              return (
                <motion.a
                  key={platform.href}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${platform.cta} (${platform.handle})`}
                  initial={reduce ? false : { opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, ease: easeOut, delay: 0.1 + index * 0.08 }}
                  whileHover={reduce ? undefined : { y: -2 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 outline-none transition-[border-color,background-color] hover:border-white/25 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0C] sm:p-6"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${platform.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    aria-hidden
                  />
                  <div className="relative flex items-center gap-4">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-lg ${platform.iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold text-white">{platform.label}</p>
                        <span className="truncate text-sm text-neutral-500">{platform.handle}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-neutral-400">{platform.description}</p>
                    </div>
                    <span className="hidden items-center gap-1 text-sm font-medium text-white sm:inline-flex">
                      Seguir
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </motion.a>
              );
            })}

            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex items-center gap-2 px-1 pt-1 text-xs text-neutral-500"
            >
              <Play className="h-3.5 w-3.5 text-[#0071E3]" aria-hidden />
              Contenido nuevo cada semana: demos, stock y lanzamientos Apple.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
