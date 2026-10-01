'use client'

import { create } from 'zustand'
import type { BootstrapData } from '@/lib/types'

export type RouteKey =
  | 'home' | 'about' | 'admissions' | 'academics' | 'campus-facilities'
  | 'student-life' | 'news' | 'news-detail' | 'events' | 'events-detail'
  | 'alumni' | 'virtual-tour' | 'branches' | 'branch-detail' | 'contact'
  | 'privacy' | 'terms' | 'faqs' | 'student-support' | 'parent-portal' | 'policies'
  | 'not-found'

export interface RouteState {
  route: RouteKey
  param?: string // slug or id
  anchor?: string // hash anchor for in-page scroll
}

interface AppState {
  data: BootstrapData | null
  setData: (d: BootstrapData) => void

  route: RouteState
  navigate: (route: RouteKey, param?: string, anchor?: string) => void

  adminOpen: boolean
  setAdminOpen: (v: boolean) => void

  commandOpen: boolean
  setCommandOpen: (v: boolean) => void

  preloaderDone: boolean
  setPreloaderDone: (v: boolean) => void

  mobileMenuOpen: boolean
  setMobileMenuOpen: (v: boolean) => void

  /** refreshes the bootstrap data from the server */
  refresh: () => Promise<void>
}

export const useStore = create<AppState>((set, get) => ({
  data: null,
  setData: (d) => set({ data: d }),

  route: { route: 'home' },
  navigate: (route, param, anchor) => {
    set({ route: { route, param, anchor }, mobileMenuOpen: false })
    // Scroll to top on route change unless an anchor is set.
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        if (anchor) {
          const el = document.getElementById(anchor)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            return
          }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 50)
    }
  },

  adminOpen: false,
  setAdminOpen: (v) => set({ adminOpen: v }),

  commandOpen: false,
  setCommandOpen: (v) => set({ commandOpen: v }),

  preloaderDone: false,
  setPreloaderDone: (v) => set({ preloaderDone: v }),

  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),

  refresh: async () => {
    try {
      const r = await fetch('/api/v1/public/bootstrap')
      const j = await r.json()
      if (j.success) set({ data: j.data })
    } catch {
      // ignore
    }
  },
}))
