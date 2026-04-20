'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Send } from 'lucide-react'

const phrases = [
  'أفضل سعر مواد بناء',
  'توريد كابلات كهرباء',
  'مواسير سباكة للمشاريع',
  'أدوات صحية بالجملة',
  'مواد تشطيب فاخرة',
]

export default function HeroSection() {
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const phrase = phrases[currentPhrase]
    let timeout: NodeJS.Timeout

    if (!isDeleting && displayText === phrase) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setCurrentPhrase((prev) => (prev + 1) % phrases.length)
    } else if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1))
      }, 30)
    } else {
      timeout = setTimeout(() => {
        setDisplayText(phrase.slice(0, displayText.length + 1))
      }, 80)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentPhrase])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
      {/* Decorative orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-[#DCBE81]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#DCBE81]/5 rounded-full blur-3xl" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DCBE81' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-transparent to-[#1A1A1A]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DCBE81]/30 bg-[#DCBE81]/10 text-[#DCBE81] text-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#DCBE81] animate-pulse" />
            منصة التوريد الأولى في المملكة
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
            نوفر لك كل احتياجات
            <br />
            <span className="gold-text">مشروعك</span> بأفضل سعر
            <br />
            خلال <span className="gold-text">24 ساعة</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            منصة متخصصة في توريد مواد البناء والسباكة والكهرباء والتشطيبات
            للمقاولين والمطورين العقاريين
          </p>

          {/* Typing Input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative flex items-center bg-white/10 backdrop-blur-lg border border-[#DCBE81]/20 rounded-2xl p-2">
              <div className="flex-1 px-4 py-3 text-right">
                <span className="text-gray-300 text-lg">
                  {displayText}
                  <span className="typing-cursor text-[#DCBE81]">|</span>
                </span>
              </div>
              <Link
                href="/rfq/new"
                className="flex items-center gap-2 px-6 py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shrink-0"
              >
                <Send size={18} className="rotate-180" />
                طلب عرض سعر
              </Link>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12"
          >
            {[
              { value: '+500', label: 'عميل نشط' },
              { value: '+1000', label: 'عرض سعر منجز' },
              { value: '24h', label: 'متوسط وقت الرد' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#DCBE81]">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#DCBE81]/40 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-[#DCBE81]" />
        </div>
      </motion.div>
    </section>
  )
}
