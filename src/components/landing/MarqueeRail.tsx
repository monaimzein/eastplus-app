'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type MarqueeRailProps = {
  children: ReactNode
  direction?: 'left' | 'right'
  speed?: number
  contentClassName?: string
}

export default function MarqueeRail({
  children,
  direction = 'left',
  speed = 16,
  contentClassName = '',
}: MarqueeRailProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const offsetRef = useRef(0)
  const contentWidthRef = useRef(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const applyTransform = () => {
      if (!trackRef.current || contentWidthRef.current === 0) return

      const x = direction === 'right'
        ? -contentWidthRef.current + offsetRef.current
        : -offsetRef.current

      trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`
    }

    const measure = () => {
      contentWidthRef.current = contentRef.current?.getBoundingClientRect().width ?? 0
      if (contentWidthRef.current > 0 && offsetRef.current >= contentWidthRef.current) {
        offsetRef.current = 0
      }
      applyTransform()
    }

    const step = (time: number) => {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = time
      }

      const delta = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      if (!pausedRef.current && contentWidthRef.current > 0) {
        offsetRef.current += speed * delta
        if (offsetRef.current >= contentWidthRef.current) {
          offsetRef.current -= contentWidthRef.current
        }
        applyTransform()
      }

      frameRef.current = requestAnimationFrame(step)
    }

    measure()

    const resizeObserver = new ResizeObserver(measure)
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }

    window.addEventListener('resize', measure)
    frameRef.current = requestAnimationFrame(step)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [direction, speed])

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => {
        pausedRef.current = true
      }}
      onMouseLeave={() => {
        pausedRef.current = false
      }}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div ref={contentRef} className={contentClassName}>
          {children}
        </div>
        <div aria-hidden className={contentClassName}>
          {children}
        </div>
      </div>
    </div>
  )
}