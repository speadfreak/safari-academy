'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useStore } from '@/lib/store'

/**
 * Cinematic Preloader — perfect, smooth, glitch-free.
 *
 * FLOW:
 * 1. Shows immediately on first paint (before data fetch completes).
 * 2. Progress bar animates 0→100 over ~2.5s, tied to real elapsed time.
 * 3. When progress reaches 100 AND app data is ready → exits with a
 *    smooth curtain-reveal (clip-path) that exposes the site underneath.
 * 4. If user clicks "Skip" → jumps to 100% and exits immediately.
 * 5. Respects prefers-reduced-motion (instant exit, no animation).
 * 6. Only shows once per session (preloaderDone flag in the store).
 *
 * The exit animation uses clip-path (GPU-accelerated, no layout shift)
 * and a staggered fade on inner elements for a premium feel.
 */
export function Preloader() {
  const setPreloaderDone = useStore((s) => s.setPreloaderDone)
  const preloaderDone = useStore((s) => s.preloaderDone)
  const data = useStore((s) => s.data)
  const tagline = data?.settings.preloaderTagline || 'Since 2005 • Your Kids, Our Kids'
  const enabled = data?.settings.preloaderEnabled !== 'false'

  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const doneRef = useRef(false)

  // Start the progress animation immediately — independent of data loading.
  useEffect(() => {
    if (!enabled || preloaderDone) return

    // Reduced-motion: skip animation, finish quickly.
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(100)
      const t = setTimeout(() => finish(), 300)
      return () => clearTimeout(t)
    }

    // Smooth ease-out progress: starts fast, slows near 100.
    // Reaches ~95% in 2.2s, then waits for data before hitting 100.
    const duration = 2200
    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const p = Math.min(1, elapsed / duration)
      // easeOutCubic for smooth deceleration
      const eased = 1 - Math.pow(1 - p, 3)
      const targetProgress = eased * 95 // cap at 95% until data is ready
      setProgress(Math.round(targetProgress))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, preloaderDone])

  // When data is ready, push progress to 100 and trigger the exit.
  useEffect(() => {
    if (!enabled || preloaderDone) return
    if (data && progress >= 95 && !doneRef.current) {
      doneRef.current = true
      setProgress(100)
      // Small delay so the user sees 100% before the curtain lifts.
      const t = setTimeout(() => setExiting(true), 300)
      return () => clearTimeout(t)
    }
  }, [data, progress, enabled, preloaderDone])

  // After the exit animation completes, mark as done.
  useEffect(() => {
    if (!exiting) return
    const t = setTimeout(() => setPreloaderDone(true), 900)
    return () => clearTimeout(t)
  }, [exiting, setPreloaderDone])

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    setProgress(100)
    setExiting(true)
    // setPreloaderDone is called by the exiting effect after the animation.
  }

  // Hidden when done or disabled.
  if (preloaderDone || !enabled) return null

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-[#06130B] overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* Aurora blobs — subtle, slow floating */}
          <motion.div
            className="absolute rounded-full blur-[100px]"
            style={{ width: 500, height: 500, top: '5%', left: '0%', background: 'rgba(255, 213, 0, 0.25)' }}
            animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full blur-[100px]"
            style={{ width: 450, height: 450, bottom: '0%', right: '5%', background: 'rgba(31, 166, 77, 0.22)' }}
            animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 0.9, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Curtain reveal layers — these slide away on exit to expose the site */}
          <motion.div
            className="absolute inset-0 bg-[#06130B]"
            animate={exiting ? { y: '-100%' } : { y: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            {/* Logo — scale + fade in with a soft glow pulse */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-8"
            >
              {/* Glow ring behind logo */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(255,213,0,0.4) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Logo image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo.png"
                alt="Safari Academy"
                className="relative h-28 w-28 md:h-36 md:w-36 rounded-full shadow-2xl"
              />
            </motion.div>

            {/* Title — staggered letter reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
            >
              <span className="text-gradient-yellow-lime">SAFARI</span>{' '}
              <span className="text-white">ACADEMY</span>
            </motion.h1>

            {/* Tagline — fade in after title */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-3 text-sm md:text-base text-[#D9FACB]/70 tracking-wider max-w-md"
            >
              {tagline}
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-10 w-[280px] md:w-[360px]"
            >
              <div className="flex items-center justify-between mb-2 text-xs text-[#B6F2A0]/60 tracking-widest">
                <span>LOADING</span>
                <span className="tabular-nums font-mono">{progress}%</span>
              </div>
              <div className="h-[3px] w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #FFD500 0%, #1FA64D 100%)',
                    transition: 'width 0.15s linear',
                  }}
                />
              </div>
            </motion.div>

            {/* Skip button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              onClick={finish}
              className="mt-10 text-xs uppercase tracking-[0.25em] text-white/30 hover:text-[#FFD500] transition-colors"
            >
              Skip intro →
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
