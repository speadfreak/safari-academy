'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import { useStore } from '@/lib/store'

const KEY = 'safari-cookie-consent'

export function CookieBanner() {
  const { data } = useStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem(KEY)) {
      const t = setTimeout(() => setVisible(true), 1800)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(KEY, '1')
    setVisible(false)
  }

  const text = data?.settings?.cookieText || 'We use cookies to enhance your browsing experience. By continuing, you agree to our use of cookies.'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl"
        >
          <div className="glass-strong rounded-2xl border border-border/60 p-4 md:p-5 shadow-2xl flex items-center gap-4">
            <Cookie className="h-6 w-6 text-primary shrink-0 hidden sm:block" />
            <p className="text-xs md:text-sm text-foreground/80 flex-1">{text}</p>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={accept} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:brightness-105 transition">Accept</button>
              <button onClick={() => setVisible(false)} className="grid place-items-center h-8 w-8 rounded-full hover:bg-accent/40 transition" aria-label="Dismiss"><X className="h-4 w-4" /></button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
