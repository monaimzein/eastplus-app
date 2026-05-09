'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { SITE } from '@/lib/siteConfig'
import { useI18n } from '@/lib/i18n/I18nProvider'

export default function WhatsAppButton() {
  const { dir, locale } = useI18n()
  const label = locale === 'ar' ? 'تواصل واتساب' : 'WhatsApp'
  const positionClass = dir === 'rtl' ? 'left-5' : 'right-5'

  return (
    <motion.a
      href={`https://wa.me/${SITE.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed bottom-6 ${positionClass} z-40 group`}
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping-soft" />
      <span className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/40">
        <MessageCircle size={22} />
        <span className="hidden md:inline text-sm font-semibold">{label}</span>
      </span>
    </motion.a>
  )
}
