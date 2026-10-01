'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const sc = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setVisible(sc > 400)
      setProgress(max > 0 ? Math.min(100, (sc / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const R = 22
  const C = 2 * Math.PI * R

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={handleClick}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="group fixed bottom-6 right-6 z-40 grid place-items-center h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg"
        >
          <svg className="absolute inset-0 -rotate-90" width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r={R} fill="none" stroke="currentColor" className="text-border" strokeWidth="2" />
            <circle
              cx="24" cy="24" r={R} fill="none" stroke="url(#bt-gradient)" strokeWidth="2"
              strokeDasharray={C} strokeDashoffset={C - (progress / 100) * C} strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.2s' }}
            />
            <defs>
              <linearGradient id="bt-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FFD500" />
                <stop offset="1" stopColor="#1FA64D" />
              </linearGradient>
            </defs>
          </svg>
          <ArrowUp className="h-4 w-4 text-foreground group-hover:text-primary transition" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
