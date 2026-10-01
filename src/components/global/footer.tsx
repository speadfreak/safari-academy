'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, Send,
  ArrowUpRight, Heart, ExternalLink, MessageCircle,
} from 'lucide-react'
import { useStore, RouteKey } from '@/lib/store'
import { toast } from 'sonner'

export function Footer() {
  const { data, navigate } = useStore()
  const settings = data?.settings || {} as any
  const branches = (data?.branches || []).slice(0, 8)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      const r = await fetch('/api/v1/public/newsletter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (r.ok) {
        toast.success('Subscribed! Welcome to the Safari family.')
        setEmail('')
      } else {
        toast.error('Could not subscribe. Try again later.')
      }
    } catch {
      toast.error('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const linkClasses = 'text-foreground/70 hover:text-primary animated-underline transition-colors'

  const navTo = (route: RouteKey, anchor?: string) => navigate(route, undefined, anchor)

  return (
    <footer className="relative mt-auto bg-gradient-to-b from-background to-[#06130B] dark:to-[#06130B] text-foreground pt-20 pb-8 overflow-hidden grain-overlay">
      {/* Wave divider */}
      <div className="absolute top-0 inset-x-0 -translate-y-px text-background">
        <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" className="w-full h-12">
          <path d="M0 100 C 240 20 480 20 720 60 C 960 100 1200 100 1440 40 L 1440 100 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Aurora */}
      <div className="aurora-blob" style={{ width: 320, height: 320, top: '20%', left: '5%', background: '#FFD500' }} />
      <div className="aurora-blob" style={{ width: 360, height: 360, bottom: '0%', right: '0%', background: '#1FA64D' }} />

      <div className="container-cinematic relative z-10">
        {/* Big wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="font-display text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-gradient-yellow-green leading-none">
            SAFARI ACADEMY
          </h2>
          <p className="mt-3 text-sm md:text-base text-foreground/60 tracking-widest uppercase">
            {settings.tagline || 'Nurturing Young Minds • Building Ethiopia\'s Future Leaders'}
          </p>
        </motion.div>

        {/* Marquee */}
        <div className="relative overflow-hidden border-y border-border/40 py-4 mb-14">
          <div className="marquee text-sm md:text-base font-semibold text-foreground/50">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} className="inline-flex items-center">
                {['CURIOSITY', 'CHARACTER', 'COMMUNITY', 'COURAGE', 'COMPASSION', 'CREATIVITY'].map((w) => (
                  <span key={w} className="inline-flex items-center">
                    <span className="px-6">{w}</span>
                    <span className="text-primary">•</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-14">
          {/* Brand */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-sm.png" alt="Safari Academy" className="h-14 w-14 mb-4 rounded-full shadow-lg" />
            <h3 className="text-base font-bold mb-4 text-primary">Safari Academy</h3>
            <p className="text-sm text-foreground/70 mb-4 leading-relaxed">{settings.footerText}</p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-3 items-start"><MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span>{settings.address}</span></li>
              <li className="flex gap-3 items-start"><Phone className="h-4 w-4 text-primary mt-0.5 shrink-0" /><a href={`tel:${settings.phone}`} className={linkClasses}>{settings.phone}</a></li>
              <li className="flex gap-3 items-start"><Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" /><a href={`mailto:${settings.email}`} className={linkClasses}>{settings.email}</a></li>
              <li className="flex gap-3 items-start"><Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span>{settings.workingHours}</span></li>
            </ul>
            <div className="flex items-center gap-2 mt-5">
              {[
                { Icon: Facebook, href: settings.facebook, label: 'Facebook' },
                { Icon: Instagram, href: settings.instagram, label: 'Instagram' },
                { Icon: Twitter, href: settings.twitter, label: 'Twitter' },
                { Icon: Youtube, href: settings.youtube, label: 'YouTube' },
                { Icon: Send, href: settings.telegram, label: 'Telegram' },
              ].map(({ Icon, href, label }) => href ? (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="grid place-items-center h-9 w-9 rounded-full bg-foreground/5 hover:bg-primary hover:text-[#06130B] transition">
                  <Icon className="h-4 w-4" />
                </a>
              ) : null)}
            </div>
          </div>

          {/* Useful links */}
          <div>
            <h3 className="text-base font-bold mb-4 text-primary">Useful Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', route: 'home' as RouteKey },
                { label: 'About Us', route: 'about' as RouteKey },
                { label: 'Programs', route: 'academics' as RouteKey, anchor: 'programs' },
                { label: 'Admissions', route: 'admissions' as RouteKey },
                { label: 'Contact', route: 'contact' as RouteKey },
              ].map((l) => (
                <li key={l.label}>
                  <button onClick={() => navTo(l.route, l.anchor)} className={linkClasses}>{l.label}</button>
                </li>
              ))}
            </ul>
            <h4 className="text-sm font-semibold mt-6 mb-3 text-foreground/90">Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => navTo('faqs')} className={linkClasses}>FAQs</button></li>
              <li><button onClick={() => navTo('student-support')} className={linkClasses}>Student Support</button></li>
              <li><button onClick={() => navTo('parent-portal')} className={linkClasses}>Parent Portal</button></li>
              <li><button onClick={() => navTo('policies')} className={linkClasses}>Policies</button></li>
              <li><button onClick={() => navTo('privacy')} className={linkClasses}>Privacy Policy</button></li>
            </ul>
          </div>

          {/* Campuses */}
          <div>
            <h3 className="text-base font-bold mb-4 text-primary">Our Campuses</h3>
            <ul className="space-y-2.5 text-sm">
              {branches.map((b) => (
                <li key={b.id}>
                  <button onClick={() => navigate('branch-detail', b.slug)} className={linkClasses}>
                    {b.name}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => navigate('branches')} className="inline-flex items-center gap-1 text-primary font-medium hover:text-[#FFE24D]">
                  View all campuses <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Academics + Newsletter */}
          <div>
            <h3 className="text-base font-bold mb-4 text-primary">Academics</h3>
            <ul className="space-y-2.5 text-sm mb-6">
              {[
                { label: 'School Overview', route: 'academics' as RouteKey, anchor: 'overview' },
                { label: 'Curriculum', route: 'academics' as RouteKey, anchor: 'curriculum' },
                { label: 'School Trips', route: 'academics' as RouteKey, anchor: 'trips' },
                { label: 'Extracurricular Activities', route: 'academics' as RouteKey, anchor: 'extracurricular' },
                { label: 'Student Life', route: 'student-life' as RouteKey },
              ].map((l) => (
                <li key={l.label}>
                  <button onClick={() => navTo(l.route, l.anchor)} className={linkClasses}>{l.label}</button>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-semibold mb-3 text-foreground/90">Newsletter</h4>
            <form onSubmit={onSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none text-sm"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? 'Subscribing…' : <>Subscribe <Send className="h-3.5 w-3.5" /></>}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-foreground/60">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span>{settings.copyrightText || '© 2026 Safari Academy. All Rights Reserved.'}</span>
            <span className="hidden md:inline text-foreground/30">|</span>
            <span>Since {settings.since || '2005'} • Nurturing Young Minds • Building Ethiopia's Future Leaders</span>
          </div>
          <a
            href={settings.creditLink || 'https://onyx-jj.onrender.com/'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-primary transition"
          >
            <Heart className="h-3 w-3 text-[#FFD500]" fill="currentColor" />
            {settings.creditText || 'Designed with passion by Joseph James'}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href={`https://wa.me/${(settings.whatsapp || '').replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 left-6 z-40 grid place-items-center h-12 w-12 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </footer>
  )
}
