'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Menu, X, Moon, Sun, Search, ArrowUpRight, Phone, Mail, MapPin,
  Home as HomeIcon, Info, GraduationCap, BookOpen, Building2, Newspaper, CalendarDays,
  Users, Compass, Phone as PhoneIcon, Shield, Compass as Explore, Send, FileText, HelpCircle,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useStore, RouteKey } from '@/lib/store'
import { MagneticButton } from './magnetic-button'
import { cn } from '@/lib/utils'

interface MenuItem {
  label: string
  route?: RouteKey
  anchor?: string
  icon?: any
  children?: MenuItem[]
}

const MENU: MenuItem[] = [
  { label: 'Home', route: 'home', icon: HomeIcon },
  {
    label: 'About', icon: Info, children: [
      { label: 'About Us', route: 'about' },
      { label: 'Admissions', route: 'admissions' },
      { label: 'Academics', route: 'academics' },
      { label: 'Campus & Facilities', route: 'campus-facilities' },
    ],
  },
  { label: 'Student Life', route: 'student-life', icon: BookOpen },
  { label: 'News', route: 'news', icon: Newspaper },
  { label: 'Events', route: 'events', icon: CalendarDays },
  { label: 'Alumni', route: 'alumni', icon: Users },
  {
    label: 'Explore', icon: Compass, children: [
      { label: 'Latest News', route: 'news' },
      { label: 'Upcoming Events', route: 'events' },
      { label: 'Virtual Tour', route: 'virtual-tour' },
      { label: 'Branches', route: 'branches' },
      { label: 'Privacy Policy', route: 'privacy' },
      { label: 'Terms of Service', route: 'terms' },
    ],
  },
  { label: 'Contact', route: 'contact', icon: PhoneIcon },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { route, navigate, setCommandOpen, setAdminOpen, data, mobileMenuOpen, setMobileMenuOpen } = useStore()

  useEffect(() => {
    setMounted(true)
    let lastY = 0
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 30)
      if (y > lastY && y > 200 && !mobileMenuOpen) setHidden(true)
      else setHidden(false)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mobileMenuOpen])

  const onNav = (item: MenuItem) => {
    if (item.children) return
    setMegaOpen(null)
    navigate(item.route!, item.anchor)
  }

  const isDark = mounted && theme === 'dark'

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-colors duration-300',
          scrolled || megaOpen ? 'glass-strong border-b border-border/60 shadow-sm' : 'bg-transparent'
        )}
        onMouseLeave={() => setMegaOpen(null)}
      >
        <nav className="container-cinematic flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 group"
            aria-label="Safari Academy home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-sm.png"
              alt="Safari Academy"
              className="h-10 md:h-12 w-auto rounded-full transition-transform group-hover:scale-105 shadow-md"
            />
            <span className="font-display text-lg md:text-xl font-extrabold tracking-tight leading-none hidden sm:block">
              <span className="text-primary">SAFARI</span>{' '}
              <span className="text-foreground">ACADEMY</span>
            </span>
          </button>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-1">
            {MENU.map((item) => (
              <div key={item.label} className="relative">
                <button
                  onMouseEnter={() => setMegaOpen(item.children ? item.label : null)}
                  onClick={() => item.children ? setMegaOpen(megaOpen === item.label ? null : item.label) : onNav(item)}
                  className={cn(
                    'px-3 py-2 text-sm font-medium flex items-center gap-1 rounded-md transition-colors',
                    route.route === item.route
                      ? 'text-primary'
                      : 'text-foreground/80 hover:text-foreground'
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', megaOpen === item.label && 'rotate-180')} />}
                </button>

                {/* Mega menu */}
                <AnimatePresence>
                  {item.children && megaOpen === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-3"
                    >
                      <div className="glass-strong rounded-2xl border border-border/60 shadow-2xl p-2 min-w-[240px]">
                        {item.children.map((c) => (
                          <button
                            key={c.label}
                            onClick={() => { onNav(c); setMegaOpen(null) }}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-accent/40 hover:text-primary transition flex items-center gap-2 group"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => setCommandOpen(true)}
              aria-label="Search (Cmd+K)"
              className="hidden sm:grid place-items-center h-9 w-9 rounded-full hover:bg-accent/40 transition"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="grid place-items-center h-9 w-9 rounded-full hover:bg-accent/40 transition"
            >
              {mounted && (isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
            </button>
            <MagneticButton
              strength={0.25}
              onClick={() => navigate('admissions')}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#FFD500] text-[#06130B] hover:bg-[#FFE24D] transition shadow-md pulse-glow"
            >
              Apply Now
            </MagneticButton>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              className="lg:hidden grid place-items-center h-10 w-10 rounded-full hover:bg-accent/40 transition"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden bg-background/95 backdrop-blur-xl pt-20 overflow-y-auto"
          >
            <div className="container-cinematic pb-16">
              {MENU.map((item, idx) => (
                <MobileItem key={item.label} item={item} index={idx} />
              ))}
              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('admissions') }}
                  className="px-6 py-3 rounded-full text-center font-semibold bg-[#FFD500] text-[#06130B]"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); setAdminOpen(true) }}
                  className="px-6 py-3 rounded-full text-center font-medium border border-border"
                >
                  Admin Login
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function MobileItem({ item, index }: { item: MenuItem; index: number }) {
  const [open, setOpen] = useState(false)
  const { navigate, setMobileMenuOpen } = useStore()
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.04 * index }}
      className="border-b border-border/40"
    >
      <button
        onClick={() => {
          if (item.children) setOpen(!open)
          else { setMobileMenuOpen(false); navigate(item.route!, item.anchor) }
        }}
        className="w-full flex items-center justify-between py-4 text-left text-lg font-semibold"
      >
        <span className="flex items-center gap-3">
          {item.icon && <item.icon className="h-5 w-5 text-primary" />}
          {item.label}
        </span>
        {item.children && <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />}
      </button>
      <AnimatePresence>
        {open && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-8 pb-2 flex flex-col gap-1">
              {item.children.map((c) => (
                <button
                  key={c.label}
                  onClick={() => { setMobileMenuOpen(false); navigate(c.route!, c.anchor) }}
                  className="py-2 text-left text-foreground/80 hover:text-primary transition"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
