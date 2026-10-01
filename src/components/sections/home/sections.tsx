'use client'

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Play, Quote, Trophy, CalendarDays, Newspaper, Star, Heart, Compass, Shield, HandHeart, Flame, Languages, Users, Globe, Cpu } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useReveal } from '@/lib/hooks'
import { formatDate, truncate, daysUntil } from '@/lib/utils'
import { MagneticButton } from '@/components/global/magnetic-button'

const ICONS: Record<string, any> = {
  Sparkles, Heart, Compass, Shield, HandHeart, Flame, Languages, Users, Globe, Cpu,
  Trophy, Star, Play, ArrowRight,
}

// ============================================================
// WELCOME
// ============================================================
export function WelcomeSection() {
  const { data, navigate } = useStore()
  const director = data?.teamLeadership?.find((t) => t.featured) || data?.teamLeadership?.[0]
  const { ref, visible } = useReveal()

  return (
    <section id="welcome" ref={ref as any} className="py-20 md:py-32 relative overflow-hidden">
      <div className="container-cinematic grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl glow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={director?.photo || data?.branches?.[0]?.coverImage || 'https://picsum.photos/seed/welcome/900/1100'}
              alt="Director"
              className="w-full aspect-[4/5] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06130B]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="text-xs uppercase tracking-widest text-[#FFE24D] mb-1">Director General</div>
              <div className="font-display text-2xl font-bold">{director?.name || 'Dr. Aklile Mekonnen'}</div>
              <div className="text-sm text-white/80">{director?.role}</div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-[#FFD500] -z-10 blur-2xl opacity-40" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/40 text-secondary-foreground text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" /> Welcome
          </span>
          <h2 className="mt-4 font-display text-3xl md:text-5xl font-extrabold tracking-tight">
            A school where <span className="text-gradient-yellow-green">curiosity</span> becomes <span className="text-gradient-yellow-green">character</span>.
          </h2>
          <p className="mt-6 text-base md:text-lg text-foreground/75 leading-relaxed">
            For two decades, Safari Academy has nurtured young minds across Addis Ababa. What began in 2005 with 8 staff and 107 students has grown into 6 campuses serving nearly 6,000 learners. Our motto — “Your Kids, Our Kids” — is the heartbeat of everything we do.
          </p>
          <blockquote className="mt-8 pl-5 border-l-4 border-primary italic text-foreground/80">
            “{director?.quote || 'Your Kids, Our Kids.'}”
          </blockquote>
          <div className="mt-8 flex flex-wrap gap-4">
            <MagneticButton as="button" onClick={() => navigate('about')} className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm hover:brightness-105 transition">
              Discover our story <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton as="button" onClick={() => navigate('admissions')} className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-accent/40 transition">
              Apply Now
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// WHY CHOOSE US (bento grid)
// ============================================================
export function WhyChooseSection() {
  const { data } = useStore()
  const features = (data?.features || []).filter((f) => f.section === 'whyChoose')
  const { ref, visible } = useReveal()

  return (
    <section id="whyChoose" ref={ref as any} className="py-20 md:py-32 bg-gradient-to-b from-background to-accent/20">
      <div className="container-cinematic">
        <SectionHeading
          eyebrow="Why Safari"
          title={<>Why families choose <span className="text-gradient-yellow-green">Safari Academy</span></>}
          subtitle="Six promises that shape every classroom, every interaction, every day."
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = ICONS[f.icon || 'Sparkles'] || Sparkles
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 30 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative p-6 rounded-3xl glass border border-border/60 hover:border-primary/40 transition-all"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-accent/10 transition" />
                <div className="relative">
                  <div className="grid place-items-center h-12 w-12 rounded-2xl bg-primary/15 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">{f.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// MARQUEE
// ============================================================
export function MarqueeStrip() {
  const items = ['Your Kids, Our Kids', 'Since 2005', '6,000+ Students', '560+ Staff', '6 Campuses', 'Academic Excellence', 'Integrity & Discipline', 'Innovation', 'Global Perspective', '20 Years of Excellence']
  return (
    <div className="relative overflow-hidden py-6 border-y border-border bg-gradient-to-r from-[#FFD500] via-[#FFE24D] to-[#B6F2A0]">
      <div className="marquee text-[#06130B] font-display font-extrabold text-2xl md:text-4xl uppercase tracking-tight">
        {Array.from({ length: 2 }).map((_, k) => (
          <span key={k}>
            {items.map((it) => (
              <span key={it} className="inline-flex items-center">
                <span className="px-6">{it}</span>
                <span className="text-[#0B5D2A]">✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// LEARNING PATH (pinned horizontal)
// ============================================================
export function LearningPathSection() {
  const { data, navigate } = useStore()
  const programs = data?.programs || []
  const { ref, visible } = useReveal()

  return (
    <section id="journey" ref={ref as any} className="py-20 md:py-32 bg-[#06130B] text-white relative overflow-hidden">
      <div className="aurora-blob" style={{ width: 360, height: 360, top: '20%', right: '-5%', background: '#1FA64D' }} />
      <div className="container-cinematic relative">
        <div className="text-center mb-12">
          <span className="text-[#FFE24D] text-xs font-semibold uppercase tracking-widest">The Safari Journey</span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold">
            From <span className="text-gradient-yellow-lime">first steps</span> to <span className="text-gradient-yellow-lime">university</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {programs.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              onClick={() => navigate('academics', undefined, 'programs')}
              className="group relative p-6 rounded-3xl glass border border-white/10 hover:border-[#FFD500]/40 cursor-pointer transition"
            >
              <div className="text-xs font-mono text-[#FFE24D]">0{i + 1}</div>
              <h3 className="mt-2 font-display text-2xl font-bold">{p.title}</h3>
              <div className="text-xs text-white/60">{p.agesRange}</div>
              <p className="mt-3 text-sm text-white/70 leading-relaxed line-clamp-3">{p.description}</p>
              <div className="mt-4 flex items-center gap-2 text-[#FFD500] text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </div>
              <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-[#FFD500]/10 blur-2xl group-hover:bg-[#FFD500]/30 transition" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// CAMPUSES SHOWCASE
// ============================================================
export function CampusesSection() {
  const { data, navigate } = useStore()
  const branches = (data?.branches || []).slice(0, 8)
  const { ref, visible } = useReveal()

  return (
    <section id="campuses" ref={ref as any} className="py-20 md:py-32">
      <div className="container-cinematic">
        <SectionHeading
          eyebrow="Our Campuses"
          title={<>Six campuses. <span className="text-gradient-yellow-green">One family.</span></>}
          subtitle="Each Safari campus has its own character, yet shares the same heartbeat of curiosity and care."
        />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {branches.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 40 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              onClick={() => navigate('branch-detail', b.slug)}
              className="group relative overflow-hidden rounded-3xl bg-card border border-border/60 hover:border-primary/40 cursor-pointer transition"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.coverImage || ''} alt={b.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06130B] via-[#06130B]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="text-[10px] uppercase tracking-widest text-[#FFE24D] mb-1">{b.tagline}</div>
                  <div className="font-display text-xl font-bold">{b.name}</div>
                  <div className="text-xs text-white/70 mt-1">{b.grades}</div>
                </div>
                {b.featured && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-[#FFD500] text-[#06130B] text-[10px] font-bold uppercase">Featured</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <MagneticButton as="button" onClick={() => navigate('branches')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm hover:brightness-105 transition">
            Explore all campuses <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// ADMISSIONS CTA with countdown
// ============================================================
export function AdmissionsCTASection() {
  const { data, navigate } = useStore()
  const deadline = data?.settings.admissionsDeadline
  const open = data?.settings.admissionsOpen === 'true'
  const days = deadline ? daysUntil(deadline) : 0

  return (
    <section id="admissions" className="py-20 md:py-28 relative overflow-hidden">
      <div className="container-cinematic">
        <div className="relative overflow-hidden rounded-3xl gradient-yellow-green p-8 md:p-16 text-[#06130B] grain-overlay">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD500]/30 to-[#1FA64D]/30 mix-blend-overlay" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              {open && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#06130B] text-[#FFE24D] text-xs font-bold uppercase tracking-widest">
                  <span className="h-2 w-2 rounded-full bg-[#FFE24D] animate-pulse" />
                  Admissions Open
                </span>
              )}
              <h2 className="mt-4 font-display text-3xl md:text-5xl font-extrabold leading-tight">
                Begin your child's<br />Safari adventure today.
              </h2>
              <p className="mt-4 text-[#06130B]/80 text-base md:text-lg max-w-md">
                Applications for the 2026/2027 academic year are now open. Limited seats available across all eight campuses.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <MagneticButton as="button" onClick={() => navigate('admissions')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#06130B] text-[#FFD500] font-bold text-sm hover:bg-[#0A1A0F] transition">
                  Apply Now <ArrowRight className="h-4 w-4" />
                </MagneticButton>
                <MagneticButton as="button" onClick={() => navigate('contact')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#06130B]/10 text-[#06130B] font-semibold text-sm hover:bg-[#06130B]/20 border border-[#06130B]/30 transition">
                  Book a Tour
                </MagneticButton>
              </div>
            </div>

            {deadline && (
              <div className="text-right">
                <div className="text-xs uppercase tracking-widest text-[#06130B]/70 mb-2">Application Deadline</div>
                <div className="font-display text-7xl md:text-8xl font-extrabold tabular-nums leading-none">{days}</div>
                <div className="text-sm font-semibold text-[#06130B]/80 mt-1">days remaining</div>
                <div className="mt-3 text-sm text-[#06130B]/70">{new Date(deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// NEWS PREVIEW
// ============================================================
export function NewsPreviewSection() {
  const { data, navigate } = useStore()
  const news = (data?.news || []).slice(0, 3)
  const { ref, visible } = useReveal()
  if (!news.length) return null
  return (
    <section id="news" ref={ref as any} className="py-20 md:py-32 bg-accent/10">
      <div className="container-cinematic">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <SectionHeading
            eyebrow="Latest News"
            title={<>Stories from <span className="text-gradient-yellow-green">our community</span></>}
            align="left"
          />
          <MagneticButton as="button" onClick={() => navigate('news')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground text-sm font-semibold hover:bg-accent/40 transition">
            View all news <ArrowRight className="h-3.5 w-3.5" />
          </MagneticButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((n, i) => (
            <motion.article
              key={n.id}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => navigate('news-detail', n.slug)}
              className="group cursor-pointer overflow-hidden rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition"
            >
              <div className="aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={n.coverImage || ''} alt={n.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-foreground/60 mb-2">
                  <Newspaper className="h-3.5 w-3.5 text-primary" />
                  {n.category}
                  <span>•</span>
                  {formatDate(n.publishedAt)}
                </div>
                <h3 className="font-display text-lg font-bold leading-snug group-hover:text-primary transition line-clamp-2">{n.title}</h3>
                <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{n.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// EVENTS PREVIEW
// ============================================================
export function EventsPreviewSection() {
  const { data, navigate } = useStore()
  const now = new Date()
  const upcoming = (data?.events || []).filter((e) => new Date(e.startDateTime) >= now).slice(0, 4)
  const { ref, visible } = useReveal()
  if (!upcoming.length) return null

  return (
    <section id="events" ref={ref as any} className="py-20 md:py-32">
      <div className="container-cinematic">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <SectionHeading
            eyebrow="Upcoming Events"
            title={<>Mark your <span className="text-gradient-yellow-green">calendar</span></>}
            align="left"
          />
          <MagneticButton as="button" onClick={() => navigate('events')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground text-sm font-semibold hover:bg-accent/40 transition">
            All events <ArrowRight className="h-3.5 w-3.5" />
          </MagneticButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {upcoming.map((e, i) => {
            const d = new Date(e.startDateTime)
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 30 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate('events-detail', e.slug)}
                className="group cursor-pointer p-5 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="grid place-items-center h-14 w-14 rounded-xl bg-primary/15 text-primary-foreground">
                    <div className="text-center">
                      <div className="text-xl font-extrabold leading-none text-primary">{d.getDate()}</div>
                      <div className="text-[10px] uppercase tracking-widest text-foreground/60">{d.toLocaleString('en-GB', { month: 'short' })}</div>
                    </div>
                  </div>
                  <div className="text-xs text-foreground/60">
                    <div className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {d.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="mt-1">{e.venue}</div>
                  </div>
                </div>
                <h3 className="font-display text-base font-bold leading-snug group-hover:text-primary transition line-clamp-2">{e.title}</h3>
                <p className="mt-1 text-xs text-foreground/60 line-clamp-2">{e.excerpt}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// TESTIMONIALS
// ============================================================
export function TestimonialsSection() {
  const { data } = useStore()
  const ts = data?.testimonials || []
  const { ref, visible } = useReveal()
  if (!ts.length) return null
  return (
    <section id="testimonials" ref={ref as any} className="py-20 md:py-32 bg-gradient-to-b from-background to-accent/15">
      <div className="container-cinematic">
        <SectionHeading
          eyebrow="Voices"
          title={<>What our <span className="text-gradient-yellow-green">community</span> says</>}
          subtitle="Parents, students, and alumni share their Safari stories."
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {ts.slice(0, 4).map((t, i) => (
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative p-6 md:p-8 rounded-3xl glass border border-border/60"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/30" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-[#FFD500] text-[#FFD500]" />
                ))}
              </div>
              <p className="text-foreground/85 italic leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                {t.avatar && <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />}
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-foreground/60">{t.role}</div>
                </div>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// ACHIEVEMENTS timeline
// ============================================================
export function AchievementsSection() {
  const { data } = useStore()
  const items = data?.achievements || []
  const { ref, visible } = useReveal()
  if (!items.length) return null
  return (
    <section id="achievements" ref={ref as any} className="py-20 md:py-32">
      <div className="container-cinematic">
        <SectionHeading
          eyebrow="Milestones"
          title={<>Our <span className="text-gradient-yellow-green">achievements</span></>}
          subtitle="Two decades of milestones that prove what's possible when curiosity meets opportunity."
        />
        <div className="mt-14 relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
          {items.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`relative mb-8 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:ml-auto md:pl-12'}`}
            >
              <div className={`absolute top-1.5 ${i % 2 === 0 ? '-left-0.5 md:left-auto md:-right-1.5' : '-left-0.5 md:-left-1.5'} h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20`} />
              <div className="p-5 rounded-2xl bg-card border border-border/60">
                <div className="text-xs font-mono text-primary mb-1">{a.year}</div>
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" /> {a.title}
                </h3>
                {a.description && <p className="mt-1 text-sm text-foreground/70">{a.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// ALUMNI SPOTLIGHT
// ============================================================
export function AlumniSpotlightSection() {
  const { data, navigate } = useStore()
  const alumni = (data?.alumni || []).filter((a) => a.featured).slice(0, 3)
  const { ref, visible } = useReveal()
  if (!alumni.length) return null
  return (
    <section id="alumni" ref={ref as any} className="py-20 md:py-32 bg-[#06130B] text-white relative overflow-hidden">
      <div className="aurora-blob" style={{ width: 380, height: 380, top: '10%', left: '-5%', background: '#FFD500' }} />
      <div className="container-cinematic relative">
        <SectionHeading
          eyebrow="Alumni Spotlight"
          title={<>Where are they <span className="text-gradient-yellow-lime">now?</span></>}
          subtitle="Safari alumni are shaping Ethiopia and the world."
          dark
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {alumni.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group p-6 rounded-3xl glass border border-white/10 hover:border-[#FFD500]/40 transition"
            >
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.photo || ''} alt={a.name} className="h-16 w-16 rounded-full object-cover border-2 border-[#FFD500]/40" />
                <div>
                  <div className="font-display text-lg font-bold">{a.name}</div>
                  <div className="text-xs text-[#FFE24D]">Class of {a.graduationYear}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/80 italic leading-relaxed">"{truncate(a.quote || '', 140)}"</p>
              <div className="mt-4 text-xs text-white/60">
                <div className="font-semibold text-white">{a.currentRole}</div>
                <div>{a.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <MagneticButton as="button" onClick={() => navigate('alumni')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFD500] text-[#06130B] font-bold text-sm hover:bg-[#FFE24D] transition">
            Meet more alumni <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// VIRTUAL TOUR TEASER
// ============================================================
export function VirtualTourTeaserSection() {
  const { data, navigate } = useStore()
  const slide = (data?.heroSlides || [])[2] || data?.branches?.[0]
  const { ref, visible } = useReveal()

  return (
    <section id="virtual-tour" ref={ref as any} className="py-20 md:py-32">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={visible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl aspect-[16/9] md:aspect-[21/9] cursor-pointer group"
          onClick={() => navigate('virtual-tour')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={(slide as any)?.mediaUrl || (slide as any)?.coverImage || 'https://picsum.photos/seed/vtour/1600/900'}
            alt="Virtual Tour"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06130B]/90 via-[#06130B]/40 to-[#06130B]/30" />
          <div className="absolute inset-0 grid place-items-center text-white">
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="mx-auto grid place-items-center h-20 w-20 md:h-24 md:w-24 rounded-full bg-[#FFD500] text-[#06130B] shadow-2xl pulse-glow"
              >
                <Play className="h-8 w-8 md:h-10 md:w-10 ml-1" fill="currentColor" />
              </motion.div>
              <h3 className="mt-6 font-display text-2xl md:text-5xl font-extrabold">Take the Virtual Tour</h3>
              <p className="mt-2 text-sm md:text-base text-white/80 max-w-lg mx-auto">Walk through all eight campuses from anywhere in the world.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// FINAL CTA
// ============================================================
export function FinalCTASection() {
  const { navigate } = useStore()
  const { ref, visible } = useReveal()
  return (
    <section id="final-cta" ref={ref as any} className="py-20 md:py-28">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl gradient-green-ink p-8 md:p-16 text-white grain-overlay"
        >
          <div className="aurora-blob" style={{ width: 320, height: 320, top: '-10%', right: '-5%', background: '#FFD500' }} />
          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-extrabold leading-tight">
              Your child's <span className="text-gradient-yellow-lime">future</span> starts here.
            </h2>
            <p className="mt-4 text-white/80 md:text-lg">
              Join 6,000+ families across Addis Ababa who chose Safari Academy — where every learner finds their spark.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <MagneticButton as="button" onClick={() => navigate('admissions')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFD500] text-[#06130B] font-bold text-sm hover:bg-[#FFE24D] transition shadow-xl">
                Apply Now <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton as="button" onClick={() => navigate('contact')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur text-white font-semibold text-sm hover:bg-white/20 border border-white/30 transition">
                Contact Us
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================
// Shared section heading
// ============================================================
export function SectionHeading({ eyebrow, title, subtitle, align = 'center', dark }: {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: string
  align?: 'left' | 'center'
  dark?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={align === 'center' ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}
    >
      {eyebrow && (
        <span className={`inline-block text-xs font-semibold uppercase tracking-widest ${dark ? 'text-[#FFE24D]' : 'text-primary'}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`mt-2 font-display text-3xl md:text-5xl font-extrabold tracking-tight ${dark ? 'text-white' : ''}`}>
        {title}
      </h2>
      {subtitle && <p className={`mt-4 text-base md:text-lg ${dark ? 'text-white/70' : 'text-foreground/70'}`}>{subtitle}</p>}
    </motion.div>
  )
}
