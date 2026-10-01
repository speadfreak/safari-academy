'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sparkles, ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useCountUp } from '@/lib/hooks'
import { MagneticButton } from '@/components/global/magnetic-button'

export function HomeHero() {
  const { data, navigate } = useStore()
  const slides = data?.heroSlides || []
  const [idx, setIdx] = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6500)
    return () => clearInterval(id)
  }, [slides.length])

  if (!slides.length) return null
  const slide = slides[idx]

  const stats = [
    { label: 'Students', value: 5000, suffix: '+' },
    { label: 'Teachers', value: 350, suffix: '+' },
    { label: 'Campuses', value: 8, suffix: '' },
    { label: 'Years of Excellence', value: 20, suffix: '+' },
  ]

  const ctaRoute = (link?: string | null) => {
    if (!link) return 'admissions' as const
    if (link.startsWith('#')) return 'admissions' as const
    return (link as any)
  }
  const ctaAnchor = (link?: string | null) => link && link.startsWith('#') ? link.slice(1) : undefined

  return (
    <section className="relative h-screen min-h-[680px] w-full overflow-hidden bg-[#06130B]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.mediaUrl} alt={slide.title} className="h-full w-full object-cover ken-burns" />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, rgba(6,19,11,${0.4 + slide.overlay / 100}) 0%, rgba(6,19,11,${0.2 + slide.overlay / 200}) 50%, rgba(6,19,11,${0.5 + slide.overlay / 100}) 100%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      <FireflyCanvas />

      <div className="aurora-blob" style={{ width: 360, height: 360, top: '5%', left: '-5%', background: '#FFD500' }} />
      <div className="aurora-blob" style={{ width: 320, height: 320, bottom: '5%', right: '-5%', background: '#1FA64D' }} />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 container-cinematic flex flex-col justify-center text-[#FBFFF6] pt-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD500]/15 border border-[#FFD500]/30 text-[#FFE24D] text-xs font-semibold tracking-widest uppercase backdrop-blur-md w-fit"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Since 2005 • Addis Ababa, Ethiopia
          </motion.span>

          <motion.h1
            key={slide.id + '-title'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-5 font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter max-w-5xl"
          >
            <SplitText text={slide.title} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 max-w-2xl text-base md:text-xl text-white/85 leading-relaxed"
          >
            {slide.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            {slide.ctaLabel && (
              <MagneticButton
                as="button"
                onClick={() => navigate(ctaRoute(slide.ctaLink), undefined, ctaAnchor(slide.ctaLink))}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FFD500] text-[#06130B] font-bold text-sm md:text-base hover:bg-[#FFE24D] transition shadow-xl pulse-glow"
              >
                {slide.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            )}
            {slide.cta2Label && (
              <MagneticButton
                as="button"
                onClick={() => navigate(ctaRoute(slide.cta2Link), undefined, ctaAnchor(slide.cta2Link))}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 backdrop-blur-md text-white font-semibold text-sm md:text-base hover:bg-white/20 border border-white/30 transition"
              >
                {slide.cta2Label}
              </MagneticButton>
            )}
          </motion.div>

          <div className="mt-10 flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIdx(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === idx ? 36 : 18, background: i === idx ? '#FFD500' : 'rgba(255,255,255,0.3)' }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          onViewportEnter={() => setStatsVisible(true)}
          viewport={{ once: true }}
          className="relative container-cinematic pb-8"
        >
          <div className="glass-strong rounded-2xl border border-white/15 px-5 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s, i) => (
              <StatItem key={s.label} {...s} start={statsVisible} delay={i * 0.1} />
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 flex flex-col items-center gap-1 pointer-events-none z-20"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="h-4 w-4 scroll-indicator" />
      </motion.div>
    </section>
  )
}

function StatItem({ label, value, suffix, start, delay }: { label: string; value: number; suffix: string; start: boolean; delay: number }) {
  const n = useCountUp(value, 1500, start)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={start ? { opacity: 1, y: 0 } : {}}
      transition={{ delay }}
      className="text-center"
    >
      <div className="font-display text-2xl md:text-4xl font-extrabold text-gradient-yellow-lime tabular-nums">
        {n}{suffix}
      </div>
      <div className="text-xs md:text-sm text-white/70 mt-1 tracking-wider uppercase">{label}</div>
    </motion.div>
  )
}

function SplitText({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <span className="inline-block">
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 + wi * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

function FireflyCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[2]">
      {Array.from({ length: 18 }).map((_, i) => {
        const size = Math.random() * 4 + 2
        const left = Math.random() * 100
        const top = Math.random() * 100
        const delay = Math.random() * 4
        const duration = Math.random() * 6 + 6
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size, left: `${left}%`, top: `${top}%`,
              background: i % 3 === 0 ? '#FFD500' : i % 3 === 1 ? '#B6F2A0' : '#FFE24D',
              boxShadow: `0 0 ${size * 3}px ${size}px ${i % 2 === 0 ? 'rgba(255,213,0,0.6)' : 'rgba(182,242,160,0.5)'}`,
            }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        )
      })}
    </div>
  )
}
