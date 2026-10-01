'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { AdminLogin } from './admin-login'
import { AdminShell } from './admin-shell'

export function AdminOverlay() {
  const { adminOpen, setAdminOpen } = useStore()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!adminOpen) return
    setChecking(true)
    fetch('/api/v1/admin/me')
      .then((r) => r.json())
      .then((j) => setAuthed(!!j.success))
      .finally(() => setChecking(false))
  }, [adminOpen])

  // Lock body scroll when open.
  useEffect(() => {
    if (adminOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [adminOpen])

  return (
    <AnimatePresence>
      {adminOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-[#06130B] text-white overflow-y-auto"
        >
          {checking ? (
            <div className="min-h-screen grid place-items-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-[#FFD500] animate-spin" />
                <div className="text-sm text-white/60">Checking session…</div>
              </div>
            </div>
          ) : !authed ? (
            <AdminLogin onSuccess={() => setAuthed(true)} onClose={() => setAdminOpen(false)} />
          ) : (
            <AdminShell onClose={() => { setAuthed(false); setAdminOpen(false) }} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
