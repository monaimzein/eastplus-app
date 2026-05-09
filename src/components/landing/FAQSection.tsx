'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useI18n } from '@/lib/i18n/I18nProvider'
import SectionHeader from './SectionHeader'

export default function FAQSection() {
  const { t } = useI18n()
  const [open, setOpen] = useState<number | null>(0)

  const items = t.faq.items as { q: string; a: string }[]

  // Inject FAQ Schema.org for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }

  return (
    <section className="py-24 sm:py-32 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          num="09"
          title={t.faq.title}
          subtitle={t.faq.subtitle}
          align="center"
        />

        <div className="max-w-3xl mx-auto space-y-2">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={`rounded-xl border transition-colors ${
                  isOpen
                    ? 'border-[var(--gold)]/30 bg-[var(--surface)]'
                    : 'border-[var(--border)] bg-[var(--surface)]/50 hover:border-[var(--border-strong)]'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 px-6 py-5 text-start"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-medium text-[var(--fg)]">{item.q}</span>
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isOpen ? 'bg-[var(--gold)] text-[var(--primary-fg)]' : 'bg-[var(--surface-2)] text-[var(--fg-muted)]'
                    }`}
                  >
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-[14px] leading-[1.85] text-[var(--fg-muted)] text-pretty">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
