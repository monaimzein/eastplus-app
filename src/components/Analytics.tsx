import Script from 'next/script'

/**
 * Analytics scripts: GA4 + Meta Pixel.
 * Both are render conditionally based on env vars so dev builds stay clean.
 *
 * Required envs (any subset):
 *   - NEXT_PUBLIC_GA4_ID  (e.g. G-XXXXXXXXXX)
 *   - NEXT_PUBLIC_META_PIXEL_ID
 */
export default function Analytics() {
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID
  const meta = process.env.NEXT_PUBLIC_META_PIXEL_ID

  return (
    <>
      {ga4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {meta && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${meta}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  )
}

/** Programmatic conversion helper — call from RFQ submit handlers. */
export function trackRfqSubmit(metadata?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
  w.gtag?.('event', 'rfq_submit', metadata ?? {})
  w.fbq?.('track', 'Lead', metadata ?? {})
}
