'use client'

import { toast } from 'sonner'
import { useState, useCallback } from 'react'

export async function adminFetch<T = any>(url: string, opts?: RequestInit): Promise<T | null> {
  try {
    const r = await fetch(url, opts)
    const j = await r.json()
    if (!j.success) {
      toast.error(j.error || 'Request failed')
      return null
    }
    return j.data as T
  } catch {
    toast.error('Network error')
    return null
  }
}

export function useResource<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const d = await adminFetch<T>(url)
    setData(d)
    setLoading(false)
  }, [url])

  return { data, setData, loading, refresh }
}

export function adminJson(method: string, body: any) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export function AdminCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white/[0.03] border border-white/10 ${className}`}>{children}</div>
}

export function AdminButton({ children, onClick, variant = 'primary', size = 'md', type = 'button', disabled, className = '' }: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md'
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}) {
  const variants = {
    primary: 'bg-[#FFD500] text-[#06130B] hover:bg-[#FFE24D]',
    ghost: 'bg-white/5 text-white hover:bg-white/10',
    danger: 'bg-red-500/15 text-red-300 hover:bg-red-500/25',
    outline: 'border border-white/20 text-white hover:bg-white/5',
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#FFD500]/40 focus:border-[#FFD500] outline-none text-sm text-white placeholder:text-white/30 ${props.className || ''}`}
    />
  )
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-[#FFD500]/40 focus:border-[#FFD500] outline-none text-sm text-white placeholder:text-white/30 ${props.className || ''}`}
    />
  )
}

export function AdminLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold text-white/70 mb-1.5">{children}</div>
}

export function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <AdminLabel>{label}</AdminLabel>
      {children}
    </label>
  )
}

export function AdminEmpty({ text }: { text: string }) {
  return <div className="text-center py-16 text-white/40 text-sm">{text}</div>
}

export function AdminLoading() {
  return (
    <div className="grid place-items-center py-16">
      <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-[#FFD500] animate-spin" />
    </div>
  )
}
