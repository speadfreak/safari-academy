'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

export function SafariApp() {
  const { data, setData, route, refresh, preloaderDone } = useStore()

  // Initial bootstrap fetch.
  useEffect(() => {
    if (!data) {
      fetch('/api/v1/public/bootstrap')
        .then((r) => r.json())
        .then((j) => { if (j.success) setData(j.data) })
        .catch(() => {})
    }
  }, [data, setData])

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

  // While data is loading, render a minimal skeleton (the preloader handles the intro).
  if (!data) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-2 w-32 rounded-full bg-primary/40" />
          <div className="h-2 w-48 rounded-full bg-foreground/10" />
          <div className="text-xs text-foreground/50">Loading Safari Academy…</div>
        </div>
      </div>
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
    <div className="flex min-h-screen flex-col">
      <CustomCursor />
      <ScrollProgress />
      <Preloader />
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
  )
}
