'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Calculator, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/I18nProvider'

type ServiceKey = 'plumbing' | 'electrical' | 'construction' | 'sanitary' | 'insulation' | 'maintenance' | 'projects'

// Indicative SAR/m² ranges. Used only for instant directional estimates.
const RATE: Record<ServiceKey, { min: number; max: number }> = {
  plumbing:     { min: 80,  max: 160 },
  electrical:   { min: 70,  max: 150 },
  construction: { min: 220, max: 420 },
  sanitary:     { min: 180, max: 380 },
  insulation:   { min: 35,  max: 80 },
  maintenance:  { min: 25,  max: 60 },
  projects:     { min: 600, max: 1500 },
}

const SERVICES: ServiceKey[] = ['plumbing','electrical','construction','sanitary','insulation','maintenance','projects']

export default function QuoteCalculator() {
  const { t, locale, dir } = useI18n()
  const [service, setService] = useState<ServiceKey>('construction')
  const [area, setArea] = useState<number>(120)

  const estimate = useMemo(() => {
    const r = RATE[service]
    const safeArea = Math.max(0, Number.isFinite(area) ? area : 0)
    return {
      min: Math.round(r.min * safeArea),
      max: Math.round(r.max * safeArea),
    }
  }, [service, area])

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(n)

  const labels: Record<ServiceKey, { ar: string; en: string }> = {
    plumbing:     { ar: 'سباكة', en: 'Plumbing' },
    electrical:   { ar: 'كهرباء', en: 'Electrical' },
    construction: { ar: 'بناء', en: 'Construction' },
    sanitary:     { ar: 'أدوات صحية', en: 'Sanitary' },
    insulation:   { ar: 'عزل', en: 'Insulation' },
    maintenance:  { ar: 'صيانة', en: 'Maintenance' },
    projects:     { ar: 'مشاريع كاملة', en: 'Full projects' },
  }

  return (
    <section className="py-16 sm:py-24 bg-[var(--bg)]" dir={dir}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="surface-card rounded-3xl p-6 sm:p-10 grid md:grid-cols-2 gap-8 items-center border border-[var(--border)]">
          <div>
            <div className="inline-flex items-center gap-2 eyebrow mb-3">
              <Calculator size={16} />
              {locale === 'ar' ? 'حاسبة تقديرية' : 'Quick estimate'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              {locale === 'ar' ? 'احسب التكلفة في ثوانٍ' : 'Estimate cost in seconds'}
            </h2>
            <p className="text-[var(--fg-muted)] text-sm sm:text-base mb-6">
              {locale === 'ar'
                ? 'تقدير مبدئي حسب الخدمة والمساحة. للسعر النهائي اطلب عرض سعر مفصّل.'
                : 'Indicative estimate by service and area. Request a detailed quotation for the final price.'}
            </p>

            <label className="block mb-4">
              <span className="text-sm text-[var(--fg-muted)] mb-2 block">
                {locale === 'ar' ? 'الخدمة' : 'Service'}
              </span>
              <select
                value={service}
                onChange={(e) => setService(e.target.value as ServiceKey)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--gold)]"
              >
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{labels[s][locale]}</option>
                ))}
              </select>
            </label>

            <label className="block mb-4">
              <span className="text-sm text-[var(--fg-muted)] mb-2 block">
                {locale === 'ar' ? 'المساحة (م²)' : 'Area (m²)'}
              </span>
              <input
                type="number"
                min={0}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--gold)]"
              />
            </label>
          </div>

          <div className="bg-[var(--surface-2)] rounded-2xl p-6 border border-[var(--border)]">
            <p className="text-xs uppercase tracking-wider text-[var(--fg-muted)] mb-2">
              {locale === 'ar' ? 'النطاق التقديري' : 'Indicative range'}
            </p>
            <p className="text-3xl sm:text-4xl font-bold gold-text mb-1">
              {fmt(estimate.min)} – {fmt(estimate.max)}
            </p>
            <p className="text-sm text-[var(--fg-muted)] mb-6">
              {locale === 'ar' ? 'ريال سعودي' : 'SAR'}
            </p>
            <p className="text-xs text-[var(--fg-muted)] mb-6 leading-relaxed">
              {locale === 'ar'
                ? '* أرقام إرشادية فقط. السعر النهائي يعتمد على المواصفات والموقع وتفاصيل التنفيذ.'
                : '* Indicative figures only. Final price depends on specs, location and execution details.'}
            </p>
            <Link
              href="/account/rfqs/new"
              className="btn-primary w-full inline-flex items-center justify-center gap-2"
            >
              {t.common.requestQuote}
              <ArrowRight size={18} className={dir === 'rtl' ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
