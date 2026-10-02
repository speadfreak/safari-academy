'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useStore } from '@/lib/store'

/**
 * Cinematic Preloader — smooth, reliable, glitch-free.
 *
 * FLOW:
 * 1. Shows immediately on first paint (before data fetch completes).
 * 2. Progress bar animates 0→100 over ~2.5s (easeOutCubic).
 * 3. When progress hits 100% (regardless of data) → auto-exits.
 * 4. If data arrives before progress completes → jumps to 100% and exits.
 * 5. Skip button → jumps to 100% and exits immediately.
 * 6. Exit: the entire overlay slides up (y: -100%) revealing the site.
 * 7. Respects prefers-reduced-motion (instant exit).
 * 8. Only shows once per session.
 */
export function Preloader() {
  const setPreloaderDone = useStore((s) => s.setPreloaderDone)
  const preloaderDone = useStore((s) => s.preloaderDone)
  const data = useStore((s) => s.data)
  const tagline = data?.settings.preloaderTagline || 'Since 2005 • Your Kids, Our Kids'
  const enabled = data?.settings.preloaderEnabled !== 'false'

  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const rafRef = useRef(0)
  const finishedRef = useRef(false)

  // The exit function — called when progress reaches 100 OR user skips.
  const exit = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    setProgress(100)
    // Small delay so the user sees 100% before the curtain lifts.
    setTimeout(() => setExiting(true), 250)
  }

  // Main progress animation — runs to 100% over 2.5s, then exits.
  // If data arrives early, we fast-forward to 100%.
  useEffect(() => {
    if (!enabled || preloaderDone || exiting) return

    // Reduced-motion: skip straight to exit.
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      exit()
      return
    }

    const duration = 2500
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const p = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setProgress(Math.round(eased * 100))

      if (p < 1 && !finishedRef.current) {
        rafRef.current = requestAnimationFrame(tick)
      } else if (!finishedRef.current) {
        // Progress animation complete — exit.
        exit()
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, preloaderDone])

  // If data arrives before the progress animation finishes, fast-forward.
  useEffect(() => {
    if (data && !finishedRef.current && progress > 80) {
      // Data is ready and we're past 80% — jump to exit.
      exit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, progress])

  // After the exit animation completes, mark as done permanently.
  useEffect(() => {
    if (!exiting) return
    const t = setTimeout(() => setPreloaderDone(true), 1000)
    return () => clearTimeout(t)
  }, [exiting, setPreloaderDone])

  // Skip button handler.
  const handleSkip = () => {
    exit()
  }

  if (preloaderDone || !enabled) return null

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="preloader-overlay"
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-[#06130B] overflow-hidden"
          exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Aurora blobs — slow floating */}
          <motion.div
            className="absolute rounded-full blur-[100px] pointer-events-none"
            style={{ width: 500, height: 500, top: '5%', left: '0%', background: 'rgba(255, 213, 0, 0.25)' }}
            animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full blur-[100px] pointer-events-none"
            style={{ width: 450, height: 450, bottom: '0%', right: '5%', background: 'rgba(31, 166, 77, 0.22)' }}
            animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 0.9, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            {/* Logo with pulsing glow ring */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-8"
            >
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,213,0,0.4) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo.png"
                alt="Safari Academy"
                className="relative h-28 w-28 md:h-36 md:w-36 rounded-full shadow-2xl"
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
            >
              <span className="text-gradient-yellow-lime">SAFARI</span>{' '}
              <span className="text-white">ACADEMY</span>
            </motion.h1>

            {/* Tagline */}
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
                <div
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
              onClick={handleSkip}
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
