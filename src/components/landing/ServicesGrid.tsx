'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Droplets, Zap, HardHat, ShowerHead, Shield, Wrench, Building2, ArrowLeft, ArrowRight,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { SERVICES } from '@/lib/siteConfig'

const ICONS = {
  Droplets, Zap, HardHat, ShowerHead, Shield, Wrench, Building2,
} as const

export default function ServicesGrid() {
  const { t, dir } = useI18n()
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <section id="services" className="relative section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="eyebrow">— 01</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold leading-tight text-balance">
              {t.services.title}
            </h2>
          </div>
          <p className="md:text-end text-[var(--fg-muted)] max-w-md">
            {t.services.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)]">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon as keyof typeof ICONS]
            const data = t.services.items[s.key]
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
                className="group relative bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors duration-300"
              >
                <Link href={s.href} className="block p-7 lg:p-8 h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center text-[var(--gold)] bg-[color-mix(in_srgb,var(--gold)_10%,transparent)] border border-[color-mix(in_srgb,var(--gold)_18%,transparent)] group-hover:bg-[var(--gold)] group-hover:text-[var(--primary-fg)] transition-colors duration-300">
                      <Icon size={20} strokeWidth={1.6} />
                    </div>
                    <span className="text-[0.7rem] font-medium tabular-nums text-[var(--fg-subtle)] tracking-widest">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-[var(--fg)]">{data.title}</h3>
                  <p className="mt-2 text-sm text-[var(--fg-muted)] leading-relaxed line-clamp-3">
                    {data.desc}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--fg-muted)] group-hover:text-[var(--gold)] transition-colors">
                    {t.common.learnMore}
                    <Arrow size={14} className="transition-transform duration-300 group-hover:translate-x-[-2px] rtl:group-hover:translate-x-[2px]" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
