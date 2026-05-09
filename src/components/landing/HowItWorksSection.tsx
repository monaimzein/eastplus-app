'use client'

import { motion } from 'framer-motion'
import { UserPlus, Upload, FileCheck2, Truck } from 'lucide-react'
import { useI18n } from '@/lib/i18n/I18nProvider'
import SectionHeader from './SectionHeader'

const ICONS = [UserPlus, Upload, FileCheck2, Truck]

export default function HowItWorksSection() {
  const { t } = useI18n()

  return (
    <section className="relative section hairline-top hairline-bottom">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader num="03" title={t.howItWorks.title} subtitle={t.howItWorks.subtitle} />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)]">
          {t.howItWorks.steps.map((step, i) => {
            const Icon = ICONS[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors p-7 lg:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.7rem] font-medium tabular-nums text-[var(--gold)] tracking-widest">
                    STEP {String(i + 1).padStart(2, '0')}
                  </span>
                  <Icon size={18} strokeWidth={1.6} className="text-[var(--fg-subtle)]" />
                </div>

                <h3 className="mt-8 text-base font-semibold text-[var(--fg)]">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--fg-muted)] leading-relaxed">
                  {step.desc}
                </p>

                {i < ICONS.length - 1 && (
                  <span className="hidden lg:block absolute end-0 top-1/2 -translate-y-1/2 w-3 h-px bg-[var(--gold)]" />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
