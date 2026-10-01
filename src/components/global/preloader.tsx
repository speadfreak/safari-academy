'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'

export function Preloader() {
  const setPreloaderDone = useStore((s) => s.setPreloaderDone)
  const preloaderDone = useStore((s) => s.preloaderDone)
  const data = useStore((s) => s.data)
  const tagline = data?.settings.preloaderTagline || 'Since 2005 • Nurturing Young Minds'
  const enabled = data?.settings.preloaderEnabled !== 'false'
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!enabled || preloaderDone) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(100)
      const t = setTimeout(finish, 400)
      return () => clearTimeout(t)
    }
    let p = 0
    const id = setInterval(() => {
      p += Math.random() * 14 + 4
      if (p >= 100) {
        p = 100
        clearInterval(id)
        setTimeout(finish, 400)
      }
      setProgress(Math.min(100, Math.round(p)))
    }, 110)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, preloaderDone])

  const finish = () => setPreloaderDone(true)

  if (preloaderDone || !enabled) return null

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-[#06130B] grain-overlay"
        exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      >
        <div className="aurora-blob" style={{ width: 420, height: 420, top: '10%', left: '10%', background: '#FFD500' }} />
        <div className="aurora-blob" style={{ width: 380, height: 380, bottom: '5%', right: '5%', background: '#1FA64D' }} />

        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mb-8"
          >
            <svg width="92" height="92" viewBox="0 0 64 64" fill="none">
              <motion.path
                d="M9 46 L18 28 L24 38 L31 24 L41 46 Z"
                fill="url(#pre-g)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
              />
              <defs>
                <linearGradient id="pre-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FFD500" />
                  <stop offset="1" stopColor="#1FA64D" />
                </linearGradient>
              </defs>
              <motion.circle cx="38" cy="24" r="5" fill="#FFD500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
              />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-gradient-yellow-lime"
          >
            SAFARI ACADEMY
          </motion.h1>

          <p className="mt-3 text-sm md:text-base text-[#D9FACB]/80 tracking-wider max-w-md">{tagline}</p>

          <div className="mt-10 w-[280px] md:w-[360px]">
            <div className="flex items-center justify-between mb-2 text-xs text-[#B6F2A0]/70 tracking-widest">
              <span>LOADING</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #FFD500, #1FA64D)' }}
              />
            </div>
          </div>

          <button
            onClick={finish}
            className="mt-10 text-xs uppercase tracking-[0.25em] text-white/40 hover:text-[#FFD500] transition"
          >
            Skip intro →
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
