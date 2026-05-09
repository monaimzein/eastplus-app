'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/I18nProvider'
import SectionHeader from './SectionHeader'

export default function ProcessTimelineSection() {
  const { t } = useI18n()
  const steps = t.process.steps as { t: string; d: string }[]

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          num="10"
          title={t.process.title}
          subtitle={t.process.subtitle}
        />

        <div className="relative">
          {/* horizontal line behind dots — desktop */}
          <div
            className="hidden lg:block absolute top-[34px] start-[8%] end-[8%] h-px"
            style={{
              background:
                'linear-gradient(to right, transparent, var(--border-strong), transparent)',
            }}
            aria-hidden
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="relative z-10 mx-auto w-[68px] h-[68px] rounded-full border border-[var(--gold)]/40 bg-[var(--bg)] flex items-center justify-center text-[var(--gold)] text-lg font-semibold">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-6 text-[15px] font-semibold text-[var(--fg)]">{s.t}</h3>
                <p className="mt-2 text-[13px] leading-[1.85] text-[var(--fg-muted)] text-pretty">
                  {s.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
