'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  num: string
  title: string
  subtitle?: string
  align?: 'start' | 'center'
  children?: ReactNode
}

/**
 * Refined, calm section header used across landing sections.
 * - Number eyebrow (e.g. "— 02")
 * - Plain large heading (no gold gradient)
 * - Optional subtitle aligned to the end on desktop
 */
export default function SectionHeader({
  num,
  title,
  subtitle,
  align = 'start',
  children,
}: SectionHeaderProps) {
  if (align === 'center') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="max-w-2xl mx-auto text-center mb-14"
      >
        <span className="eyebrow">— {num}</span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-semibold leading-tight text-balance">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-[var(--fg-muted)]">{subtitle}</p>
        )}
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
    >
      <div className="max-w-2xl">
        <span className="eyebrow">— {num}</span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-semibold leading-tight text-balance">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="md:text-end text-[var(--fg-muted)] max-w-md">{subtitle}</p>
      )}
      {children}
    </motion.div>
  )
}
