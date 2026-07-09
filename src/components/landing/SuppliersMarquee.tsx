'use client'

import Image from 'next/image'
import { useI18n } from '@/lib/i18n/I18nProvider'

const ELEC_LOGOS = Array.from({ length: 19 }, (_, i) => `/images/logos/elec/EastPlus-Profile-2026-${26 + i}.png`)
const WATER_LOGOS = Array.from({ length: 15 }, (_, i) => `/images/logos/water/EastPlus-Profile-${45 + i}.png`)

export default function SuppliersMarquee() {
  const { locale } = useI18n()

  // Duplicate to ensure smooth infinite scroll
  const dupElec = [...ELEC_LOGOS, ...ELEC_LOGOS, ...ELEC_LOGOS]
  const dupWater = [...WATER_LOGOS, ...WATER_LOGOS, ...WATER_LOGOS]

  return (
    <section className="relative section-tight bg-[var(--bg-2)] hairline-top hairline-bottom overflow-hidden py-14 md:py-20 flex flex-col gap-10">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="flex items-center gap-4 mb-4">
          <span className="block w-10 h-px bg-[var(--gold)]" />
          <span className="text-[0.72rem] font-medium tracking-[0.22em] uppercase text-[var(--fg-muted)]">
            {locale === 'ar' ? 'موردونا وعلاماتنا التجارية' : 'Our Suppliers & Brands'}
          </span>
        </div>
      </div>

      {/* Row 1: Electrical Suppliers */}
      <div className="relative flex flex-col gap-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <h3 className="text-sm font-semibold text-[var(--fg)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
            {locale === 'ar' ? 'موردو الكهرباء' : 'Electrical Suppliers'}
          </h3>
        </div>

        {/* Marquee Wrapper forced LTR for bulletproof layout & animation */}
        <div 
          dir="ltr"
          className="relative overflow-hidden w-full flex py-2 mt-2 select-none"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
          }}
        >
          {/* Track 1 */}
          <div 
            className="flex items-center shrink-0 animate-[marquee_55s_linear_infinite] hover:[animation-play-state:paused]"
          >
            {dupElec.map((src, i) => (
              <div
                key={`elec-1-${i}`}
                className="relative h-14 w-28 md:h-16 md:w-36 shrink-0 bg-white rounded-2xl p-3 border border-[var(--border)] hover:scale-105 transition-all duration-300 flex items-center justify-center mx-4 md:mx-6 grayscale opacity-75 hover:grayscale-0 hover:opacity-100 cursor-pointer shadow-sm shadow-black/5"
              >
                <Image 
                  src={src} 
                  alt="Electrical Brand" 
                  fill 
                  sizes="128px" 
                  className="object-contain p-2 select-none pointer-events-none rounded-xl" 
                />
              </div>
            ))}
          </div>

          {/* Track 2 */}
          <div 
            aria-hidden="true"
            className="flex items-center shrink-0 animate-[marquee_55s_linear_infinite] hover:[animation-play-state:paused]"
          >
            {dupElec.map((src, i) => (
              <div
                key={`elec-2-${i}`}
                className="relative h-14 w-28 md:h-16 md:w-36 shrink-0 bg-white rounded-2xl p-3 border border-[var(--border)] hover:scale-105 transition-all duration-300 flex items-center justify-center mx-4 md:mx-6 grayscale opacity-75 hover:grayscale-0 hover:opacity-100 cursor-pointer shadow-sm shadow-black/5"
              >
                <Image 
                  src={src} 
                  alt="Electrical Brand" 
                  fill 
                  sizes="128px" 
                  className="object-contain p-2 select-none pointer-events-none rounded-xl" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Plumbing Suppliers */}
      <div className="relative flex flex-col gap-4 mt-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <h3 className="text-sm font-semibold text-[var(--fg)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
            {locale === 'ar' ? 'موردو السباكة' : 'Plumbing Suppliers'}
          </h3>
        </div>

        {/* Marquee Wrapper forced LTR for bulletproof layout & animation */}
        <div 
          dir="ltr"
          className="relative overflow-hidden w-full flex py-2 mt-2 select-none"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
          }}
        >
          {/* Track 1 - reverse direction */}
          <div 
            className="flex items-center shrink-0 animate-[marquee-reverse_50s_linear_infinite] hover:[animation-play-state:paused]"
          >
            {dupWater.map((src, i) => (
              <div
                key={`water-1-${i}`}
                className="relative h-14 w-28 md:h-16 md:w-36 shrink-0 bg-white rounded-2xl p-3 border border-[var(--border)] hover:scale-105 transition-all duration-300 flex items-center justify-center mx-4 md:mx-6 grayscale opacity-75 hover:grayscale-0 hover:opacity-100 cursor-pointer shadow-sm shadow-black/5"
              >
                <Image 
                  src={src} 
                  alt="Plumbing Brand" 
                  fill 
                  sizes="128px" 
                  className="object-contain p-2 select-none pointer-events-none rounded-xl" 
                />
              </div>
            ))}
          </div>

          {/* Track 2 */}
          <div 
            aria-hidden="true"
            className="flex items-center shrink-0 animate-[marquee-reverse_50s_linear_infinite] hover:[animation-play-state:paused]"
          >
            {dupWater.map((src, i) => (
              <div
                key={`water-2-${i}`}
                className="relative h-14 w-28 md:h-16 md:w-36 shrink-0 bg-white rounded-2xl p-3 border border-[var(--border)] hover:scale-105 transition-all duration-300 flex items-center justify-center mx-4 md:mx-6 grayscale opacity-75 hover:grayscale-0 hover:opacity-100 cursor-pointer shadow-sm shadow-black/5"
              >
                <Image 
                  src={src} 
                  alt="Plumbing Brand" 
                  fill 
                  sizes="128px" 
                  className="object-contain p-2 select-none pointer-events-none rounded-xl" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}} />
    </section>
  )
}
