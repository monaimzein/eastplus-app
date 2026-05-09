'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Send, Paperclip, ArrowLeft, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/I18nProvider'

export default function ChatTeaser() {
  const { t, dir, locale } = useI18n()
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight
  const phrases = t.chatTeaser.placeholders

  const [text, setText] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIdx]
    const speed = deleting ? 30 : 60
    const pause = deleting ? 600 : 1500

    if (!deleting && text === current) {
      const t1 = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t1)
    }
    if (deleting && text === '') {
      const t0 = setTimeout(() => {
        setDeleting(false)
        setPhraseIdx((i) => (i + 1) % phrases.length)
      }, 0)
      return () => clearTimeout(t0)
    }
    const t2 = setTimeout(() => {
      setText(deleting ? current.substring(0, text.length - 1) : current.substring(0, text.length + 1))
    }, speed)
    return () => clearTimeout(t2)
  }, [text, deleting, phraseIdx, phrases, locale])

  // reset when locale changes
  useEffect(() => {
    const t0 = setTimeout(() => {
      setText('')
      setPhraseIdx(0)
      setDeleting(false)
    }, 0)
    return () => clearTimeout(t0)
  }, [locale])

  return (
    <section className="relative section">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="eyebrow">— {t.quoteBanner.title}</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold leading-tight text-balance">
            {t.chatTeaser.title}
          </h2>
          <p className="mt-3 text-[var(--fg-muted)]">{t.chatTeaser.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 surface-card p-2 md:p-3 flex items-center gap-2"
        >
          <button
            type="button"
            className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] transition-colors"
            aria-label="Attach"
          >
            <Paperclip size={17} strokeWidth={1.6} />
          </button>
          <div className="flex-1 px-3 py-3 text-base text-[var(--fg)] truncate">
            <span>{text}</span>
            <span className="typing-cursor text-[var(--gold)]">|</span>
          </div>
          <Link href="/account/rfqs/new" className="btn-primary shrink-0">
            <Send size={15} />
            <span className="hidden sm:inline">{t.chatTeaser.send}</span>
            <Arrow size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
