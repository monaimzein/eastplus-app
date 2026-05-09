'use client'

import Image from 'next/image'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { SUPPLIER_LOGOS } from '@/lib/siteConfig'
import MarqueeRail from './MarqueeRail'

export default function SuppliersMarquee() {
  const { t, dir } = useI18n()

  return (
    <section className="relative section-tight bg-[var(--bg-2)] hairline-top hairline-bottom overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <span className="block w-10 h-px bg-[var(--gold)]" />
          <span className="text-[0.72rem] font-medium tracking-[0.22em] uppercase text-[var(--fg-muted)]">
            {t.suppliers.title}
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 start-0 w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--bg-2), transparent)' }} />
        <div className="absolute inset-y-0 end-0 w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--bg-2), transparent)' }} />

        <MarqueeRail direction={dir === 'rtl' ? 'right' : 'left'} speed={60} contentClassName="flex items-center gap-24 py-3 pe-24">
          {SUPPLIER_LOGOS.map((src, i) => (
            <div
              key={i}
              className="relative h-16 w-36 shrink-0 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            >
              <Image src={src} alt="Brand" fill sizes="128px" className="object-contain" />
            </div>
          ))}
        </MarqueeRail>
      </div>
    </section>
  )
}
