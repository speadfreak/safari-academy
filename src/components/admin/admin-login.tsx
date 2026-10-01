'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, ArrowRight, X, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export function AdminLogin({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [email, setEmail] = useState('admin@safariacademy.com')
  const [password, setPassword] = useState('ChangeMe123!')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await fetch('/api/v1/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const j = await r.json()
      if (j.success) {
        toast.success('Welcome back!')
        onSuccess()
      } else {
        toast.error(j.error || 'Login failed')
      }
    } catch {
      toast.error('Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden grid place-items-center px-6">
      <div className="aurora-blob" style={{ width: 380, height: 380, top: '5%', left: '5%', background: '#FFD500' }} />
      <div className="aurora-blob" style={{ width: 360, height: 360, bottom: '5%', right: '5%', background: '#1FA64D' }} />

      <button onClick={onClose} className="absolute top-6 right-6 grid place-items-center h-10 w-10 rounded-full hover:bg-white/10 transition" aria-label="Close admin">
        <X className="h-5 w-5" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="Safari Academy" className="h-16 w-16 mx-auto rounded-full shadow-lg" />
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD500]/15 border border-[#FFD500]/30 text-[#FFE24D] text-xs font-semibold uppercase tracking-widest">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin Control Room
          </div>
        </div>

        <form onSubmit={submit} className="p-8 rounded-3xl glass-strong border border-white/10 space-y-5">
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#FFD500]/60 focus:border-[#FFD500] outline-none text-white placeholder:text-white/30" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-white/70 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#FFD500]/60 focus:border-[#FFD500] outline-none text-white placeholder:text-white/30" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full px-4 py-3 rounded-full bg-[#FFD500] text-[#06130B] font-bold hover:bg-[#FFE24D] transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {loading ? 'Signing in…' : <>Sign In <ArrowRight className="h-4 w-4" /></>}
          </button>
          <div className="text-xs text-white/50 text-center pt-2 border-t border-white/10">
            Default: <span className="text-white/80 font-mono">admin@safariacademy.com</span> / <span className="text-white/80 font-mono">ChangeMe123!</span>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
