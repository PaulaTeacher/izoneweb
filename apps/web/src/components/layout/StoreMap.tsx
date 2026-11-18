import { MapPin, Navigation } from 'lucide-react';

const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.6104096997888!2d-74.06082792478288!3d4.663349995311524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bb91db73729%3A0x48e915588a4beca4!2sIzone%20Tech!5e0!3m2!1ses-419!2sco!4v1789848667460!5m2!1ses-419!2sco';

const DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=Izone%20Tech%2C%20Ak%2015%20%2378-33%2C%20Bogot%C3%A1';

export default function StoreMap() {
  return (
    <section
      id="tiendas"
      aria-labelledby="store-map-heading"
      className="scroll-mt-24 bg-[#F5F5F7] dark:bg-neutral-950"
    >
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Punto físico
            </p>
            <h2
              id="store-map-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-white md:text-3xl"
            >
              Visítanos en Bogotá
            </h2>
            <p className="mt-3 flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
              <span>
                CC Unilago, Local L 1-143
                <br />
                Ak 15 #78-33, Bogotá D.C.
              </span>
            </p>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0071E3] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0062c4]"
            >
              <Navigation className="h-4 w-4" aria-hidden />
              Cómo llegar
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm">
            <iframe
              title="iZone Tech en Google Maps"
              src={MAP_EMBED_SRC}
              className="block w-full h-[220px] md:h-[280px] border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
