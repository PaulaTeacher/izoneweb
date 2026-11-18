import Script from 'next/script';
import { getAnalyticsIds } from '@/lib/seo';

/**
 * Carga GTM, GA4 y Meta Pixel solo si hay IDs en las variables de entorno.
 *
 * Rendimiento: los "stubs" (dataLayer, gtag, fbq) son unas pocas líneas y se
 * definen enseguida, así ningún evento se pierde (PageView, clics a WhatsApp…):
 * quedan en cola. Las librerías pesadas de Google y Meta (≈150-250 KB) se
 * descargan con `lazyOnload`, cuando la página ya cargó y el navegador está
 * libre, para no competir con la carga inicial. Al llegar, procesan la cola.
 */
export function Analytics() {
  const { gaId, gtmId, metaPixelId } = getAnalyticsIds();

  return (
    <>
      {gtmId ? (
        <>
          <Script id="gtm-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
          `}</Script>
          <Script
            id="gtm-lib"
            src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
            strategy="lazyOnload"
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      ) : null}

      {!gtmId && gaId ? (
        <>
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${gaId}', { anonymize_ip: true });
          `}</Script>
          <Script
            id="ga4-lib"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="lazyOnload"
          />
        </>
      ) : null}

      {metaPixelId ? (
        <>
          {/* Stub oficial de Meta sin la inserción del script: fbq encola. */}
          <Script id="meta-pixel-init" strategy="afterInteractive">{`
            !function(f){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];}(window);
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}</Script>
          <Script
            id="meta-pixel-lib"
            src="https://connect.facebook.net/en_US/fbevents.js"
            strategy="lazyOnload"
          />
        </>
      ) : null}
    </>
  );
}
