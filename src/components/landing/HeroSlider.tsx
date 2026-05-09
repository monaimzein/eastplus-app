'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { HERO_SLIDES } from '@/lib/siteConfig'

export default function HeroSlider() {
  const { t, dir } = useI18n()
  const { resolvedTheme, theme } = useTheme()
  const isRTL = dir === 'rtl'
  const Arrow = isRTL ? ArrowLeft : ArrowRight
  const [mounted, setMounted] = useState(false)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: isRTL ? 'rtl' : 'ltr', duration: 35 },
    [Autoplay({ delay: 7000, stopOnInteraction: false })],
  )
  const [selected, setSelected] = useState(0)
  const isDark = !mounted || resolvedTheme === 'dark' || theme === 'dark'

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    const t0 = setTimeout(onSelect, 0)
    return () => {
      clearTimeout(t0)
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const slidesContent = [
    { eyebrow: t.hero.slide1Eyebrow, title: t.hero.slide1Title, sub: t.hero.slide1Sub },
    { eyebrow: t.hero.slide2Eyebrow, title: t.hero.slide2Title, sub: t.hero.slide2Sub },
    { eyebrow: t.hero.slide3Eyebrow, title: t.hero.slide3Title, sub: t.hero.slide3Sub },
  ]

  return (
    <section className="relative -mt-20 h-[100svh] min-h-[620px] max-h-[860px] w-full overflow-hidden">
      {/* Slides */}
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">
          {HERO_SLIDES.map((slide, i) => (
            <div key={slide.image} className="relative h-full min-w-0 flex-[0_0_100%]">
              <Image
                src={slide.image}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover scale-105 motion-safe:animate-[float_18s_ease-in-out_infinite]"
                style={{ filter: isDark ? 'saturate(0.85) brightness(0.78)' : 'saturate(1.02) brightness(1.02) contrast(0.94)' }}
              />
              <div className="absolute inset-0" style={{
                background: isDark
                  ? 'linear-gradient(180deg, rgba(10,10,11,0.55) 0%, rgba(10,10,11,0.55) 40%, rgba(10,10,11,0.85) 100%)'
                  : 'linear-gradient(180deg, rgba(255,250,240,0.10) 0%, rgba(255,248,236,0.26) 40%, rgba(246,238,223,0.88) 100%)',
              }} />
              <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-black/55 to-transparent' : 'bg-gradient-to-r from-white/70 via-white/20 to-transparent'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center pt-20">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 text-[var(--gold)]">
                <span className="block w-10 h-px bg-[var(--gold)]" />
                <span className="text-[0.72rem] font-medium tracking-[0.25em] uppercase">
                  {slidesContent[selected].eyebrow}
                </span>
              </div>

              <h1 className={`mt-6 text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold leading-[1.08] text-balance whitespace-pre-line ${isDark ? 'text-white' : 'text-[var(--fg)]'}`}>
                {slidesContent[selected].title}
              </h1>

              <p className={`mt-5 text-base sm:text-lg max-w-xl leading-relaxed font-light ${isDark ? 'text-white/70' : 'text-[var(--fg-muted)]'}`}>
                {slidesContent[selected].sub}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/account/rfqs/new" className="btn-primary">
                  {t.hero.ctaPrimary}
                  <Arrow size={15} />
                </Link>
                <Link
                  href="/services"
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-[0.7rem] text-[0.92rem] font-medium transition-colors ${isDark ? 'text-white/90 hover:text-white border border-white/15 hover:border-white/40' : 'text-[var(--fg)] border border-[var(--border)] hover:border-[var(--gold)]/40 hover:text-[var(--gold)] bg-white/50 backdrop-blur-sm'}`}
                >
                  {t.hero.ctaSecondary}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicator — minimal counter + line */}
      <div className="absolute bottom-10 inset-x-0 z-10">
        <div className={`max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between ${isDark ? 'text-white/70' : 'text-[var(--fg-muted)]'}`}>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium tabular-nums tracking-widest">
              {String(selected + 1).padStart(2, '0')}
              <span className="opacity-40 mx-1.5">/</span>
              {String(HERO_SLIDES.length).padStart(2, '0')}
            </span>
            <div className={`h-px w-32 overflow-hidden ${isDark ? 'bg-white/15' : 'bg-[var(--border)]'}`}>
              <motion.div
                key={selected}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 7, ease: 'linear' }}
                className="h-full bg-[var(--gold)]"
              />
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Slide ${i + 1}`}
                className="text-xs font-medium tabular-nums px-2 py-1 transition-colors"
                style={{ color: selected === i ? 'var(--gold)' : isDark ? 'rgba(255,255,255,0.35)' : 'rgba(77,77,77,0.55)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-20 bg-gradient-to-b from-transparent to-[var(--bg)]" />
    </section>
  )
}
