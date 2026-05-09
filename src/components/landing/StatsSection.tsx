'use client'

import { motion, useInView, useMotionValue, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { STATS } from '@/lib/siteConfig'

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const mv = useMotionValue(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, to, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix
      },
    })
    return () => controls.stop()
  }, [inView, to, suffix, mv])

  return <span ref={ref}>0{suffix}</span>
}

export default function StatsSection() {
  const { t } = useI18n()

  return (
    <section className="relative section-tight">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)]">
          {STATS.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="bg-[var(--surface)] p-8 md:p-10"
            >
              <div className="text-4xl md:text-5xl font-semibold text-[var(--fg)] leading-none tabular-nums">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="block w-6 h-px bg-[var(--gold)]" />
                <span className="text-xs text-[var(--fg-muted)] font-medium tracking-wider uppercase">
                  {t.stats[s.key as keyof typeof t.stats]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
