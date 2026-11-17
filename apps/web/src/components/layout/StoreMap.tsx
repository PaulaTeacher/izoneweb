const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.6104096997888!2d-74.06082792478288!3d4.663349995311524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bb91db73729%3A0x48e915588a4beca4!2sIzone%20Tech!5e0!3m2!1ses-419!2sco!4v1789848667460!5m2!1ses-419!2sco';

export default function StoreMap() {
  return (
    <section
      id="tiendas"
      aria-labelledby="store-map-heading"
      className="scroll-mt-24 bg-gradient-to-b from-white via-[#F5F5F7] to-[#E8E8ED] dark:from-black dark:via-neutral-950 dark:to-neutral-900"
    >
      <div className="container mx-auto px-4 pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Punto físico
          </p>
          <h2
            id="store-map-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-white md:text-3xl"
          >
            Visítanos en Bogotá
          </h2>
          <p className="mt-2 text-sm text-neutral-500 md:text-base">
            CC Unilago, Local L 1-143, Bogotá D.C.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm">
          <iframe
            title="iZone Tech en Google Maps"
            src={MAP_EMBED_SRC}
            className="block w-full h-[300px] md:h-[420px] border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  );
}
