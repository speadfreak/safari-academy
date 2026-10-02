'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Preloader } from '@/components/global/preloader'
import { Navbar } from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import { BackToTop } from '@/components/global/back-to-top'
import { CustomCursor } from '@/components/global/custom-cursor'
import { ScrollProgress } from '@/components/global/scroll-progress'
import { CommandPalette } from '@/components/global/command-palette'
import { CookieBanner } from '@/components/global/cookie-banner'
import { AdminOverlay } from '@/components/admin/admin-overlay'

import { HomePage } from '@/components/sections/home'
import { AboutPage } from '@/components/sections/about'
import { AdmissionsPage } from '@/components/sections/admissions'
import { AcademicsPage } from '@/components/sections/academics'
import { StudentLifePage, CampusFacilitiesPage } from '@/components/sections/student-life'
import { NewsListPage, NewsDetailPage } from '@/components/sections/news'
import { EventsListPage, EventDetailPage } from '@/components/sections/events'
import { AlumniPage } from '@/components/sections/alumni'
import { VirtualTourPage } from '@/components/sections/virtual-tour'
import { BranchesListPage, BranchDetailPage } from '@/components/sections/branches'
import { ContactPage } from '@/components/sections/contact'
import { LegalPage, FaqsPage, PoliciesPage, StudentSupportPage, ParentPortalPage, NotFoundPage } from '@/components/sections/legal'

type LoadState = 'loading' | 'error' | 'ready'

export function SafariApp() {
  const { data, setData, route, preloaderDone } = useStore()
  const [state, setState] = useState<LoadState>(data ? 'ready' : 'loading')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [retryCount, setRetryCount] = useState(0)

  // Initial bootstrap fetch — with error handling and auto-retry.
  useEffect(() => {
    if (data) {
      setState('ready')
      return
    }
    let cancelled = false
    setState('loading')

    const load = async () => {
      try {
        const r = await fetch('/api/v1/public/bootstrap', { cache: 'no-store' })
        if (!r.ok) {
          // Try to parse the error JSON; fall back to the status text.
          let detail = `HTTP ${r.status}`
          try {
            const j = await r.json()
            if (j?.error) detail = j.error
            else if (j?.message) detail = j.message
          } catch {
            /* response wasn't JSON (likely an HTML error page) */
          }
          if (cancelled) return
          setErrorMsg(detail)
          setState('error')
          return
        }
        const j = await r.json()
        if (cancelled) return
        if (j.success && j.data) {
          setData(j.data)
          setState('ready')
        } else {
          setErrorMsg(j.error || 'The server returned an unexpected response.')
          setState('error')
        }
      } catch (e: any) {
        if (cancelled) return
        setErrorMsg(e?.message || 'Network error — could not reach the server.')
        setState('error')
      }
    }
    load()
    return () => { cancelled = true }
  }, [data, setData, retryCount])

  // Apply the favicon from settings dynamically.
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!data?.settings?.favicon) return
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = data.settings.favicon
  }, [data?.settings?.favicon])

  // Open admin via #admin hash.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const check = () => {
      if (window.location.hash === '#admin') useStore.getState().setAdminOpen(true)
      if (window.location.hash === '#home' || window.location.hash === '') useStore.getState().setAdminOpen(false)
    }
    check()
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [])

  // The Preloader renders on every state (loading, error, ready) so it never
  // unmounts/remounts during transitions — eliminating the glitch.
  // It manages its own visibility via the preloaderDone store flag.

  // Loading + error screens (before the main app is ready).
  if (!data) {
    if (state === 'error') {
      return (
        <>
          <Preloader />
          <div className="min-h-screen grid place-items-center bg-[#06130B] text-white px-6">
            <div className="max-w-md w-full text-center">
              <div className="mx-auto mb-6 grid place-items-center h-16 w-16 rounded-full bg-[#FFD500]/15 text-[#FFD500]">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-3">Couldn&apos;t load Safari Academy</h1>
              <p className="text-sm text-white/70 mb-2">
                The site data couldn&apos;t be loaded from the server.
              </p>
              {errorMsg && (
                <p className="text-xs text-white/50 mb-6 font-mono break-words bg-white/5 rounded-lg p-3 border border-white/10">
                  {errorMsg}
                </p>
              )}
              {!errorMsg && <div className="mb-6" />}
              <div className="text-xs text-white/50 mb-6 space-y-1">
                <p>If this is a fresh deploy, please check:</p>
                <p>• <code className="text-[#FFE24D]">DATABASE_URL</code> and <code className="text-[#FFE24D]">DIRECT_URL</code> are set in Vercel env vars</p>
                <p>• The database has been created (<code className="text-[#FFE24D]">prisma db push</code> ran during build)</p>
                <p>• The database has been seeded (empty DB → no content to load)</p>
              </div>
              <button
                onClick={() => { setState('loading'); setRetryCount((c) => c + 1) }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFD500] text-[#06130B] font-bold text-sm hover:bg-[#FFE24D] transition"
              >
                <RefreshCw className="h-4 w-4" /> Try again
              </button>
            </div>
          </div>
        </>
      )
    }
    // loading — Preloader shows on top; the skeleton is behind it.
    return (
      <>
        <Preloader />
        <div className="min-h-screen grid place-items-center bg-background">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-2 w-32 rounded-full bg-primary/40" />
            <div className="h-2 w-48 rounded-full bg-foreground/10" />
            <div className="text-xs text-foreground/50">Loading Safari Academy…</div>
          </div>
        </div>
      </>
    )
  }

  const isNotFound = route.route === 'not-found'

  const renderRoute = () => {
    switch (route.route) {
      case 'home': return <HomePage />
      case 'about': return <AboutPage />
      case 'admissions': return <AdmissionsPage />
      case 'academics': return <AcademicsPage />
      case 'campus-facilities': return <CampusFacilitiesPage />
      case 'student-life': return <StudentLifePage />
      case 'news': return <NewsListPage />
      case 'news-detail': return <NewsDetailPage />
      case 'events': return <EventsListPage />
      case 'events-detail': return <EventDetailPage />
      case 'alumni': return <AlumniPage />
      case 'virtual-tour': return <VirtualTourPage />
      case 'branches': return <BranchesListPage />
      case 'branch-detail': return <BranchDetailPage />
      case 'contact': return <ContactPage />
      case 'privacy': return <LegalPage slug="privacy" />
      case 'terms': return <LegalPage slug="terms" />
      case 'faqs': return <FaqsPage />
      case 'policies': return <PoliciesPage />
      case 'student-support': return <StudentSupportPage />
      case 'parent-portal': return <ParentPortalPage />
      default: return <NotFoundPage />
    }
  }

  return (
    <>
      <Preloader />
      <div className="flex min-h-screen flex-col">
        <CustomCursor />
        <ScrollProgress />
        <CommandPalette />

        {!isNotFound && <Navbar />}

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={route.route + (route.param || '')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderRoute()}
            </motion.div>
          </AnimatePresence>
        </main>

        {!isNotFound && <Footer />}
        {!isNotFound && <BackToTop />}
        <CookieBanner />
        <AdminOverlay />
      </div>
    </>
  )
}

