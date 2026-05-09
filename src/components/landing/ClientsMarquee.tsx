'use client'

import { useI18n } from '@/lib/i18n/I18nProvider'
import MarqueeRail from './MarqueeRail'

const CLIENTS = [
  { ar: 'مجموعة الراجحي', en: 'Al Rajhi Group' },
  { ar: 'شركة المراعي', en: 'Almarai Co.' },
  { ar: 'سابك', en: 'SABIC' },
  { ar: 'أرامكو', en: 'Aramco' },
  { ar: 'البنك الأهلي', en: 'SNB' },
  { ar: 'مدن', en: 'MODON' },
  { ar: 'روشن', en: 'ROSHN' },
  { ar: 'نيوم', en: 'NEOM' },
]

export default function ClientsMarquee() {
  const { t, locale, dir } = useI18n()

  return (
    <section className="relative section-tight overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <span className="block w-10 h-px bg-[var(--gold)]" />
          <span className="text-[0.72rem] font-medium tracking-[0.22em] uppercase text-[var(--fg-muted)]">
            {t.clients.title}
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="absolute inset-y-0 start-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--bg), transparent)' }}
        />
        <div
          className="absolute inset-y-0 end-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--bg), transparent)' }}
        />

        <MarqueeRail direction={dir === 'rtl' ? 'right' : 'left'} speed={60} contentClassName="flex items-center gap-20 py-2 pe-20">
          {CLIENTS.map((c, i) => (
            <div
              key={i}
              className="h-12 px-2 shrink-0 flex items-center justify-center gap-3 group"
            >
              <span className="h-1 w-1 rounded-full bg-[var(--fg-subtle)] group-hover:bg-[var(--gold)] transition-colors" />
              <span className="text-base font-medium tracking-wide text-[var(--fg-muted)] group-hover:text-[var(--fg)] whitespace-nowrap transition-colors">
                {locale === 'ar' ? c.ar : c.en}
              </span>
            </div>
          ))}
        </MarqueeRail>
      </div>
    </section>
  )
}
