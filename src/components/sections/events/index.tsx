'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CalendarDays, MapPin, ChevronLeft, ArrowRight, Users, Clock, Share2, Copy } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '../page-shell'
import { formatDateTime, formatDate, daysUntil } from '@/lib/utils'

export function EventsListPage() {
  const { data, navigate } = useStore()
  const events = data?.events || []
  const [mode, setMode] = useState<'upcoming' | 'past'>('upcoming')
  const now = new Date()
  const filtered = events.filter((e) => mode === 'upcoming' ? new Date(e.startDateTime) >= now : new Date(e.startDateTime) < now).sort((a, b) => mode === 'upcoming' ? new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime() : new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime())
  const next = filtered[0]
  const countdown = next ? daysUntil(next.startDateTime) : 0

  return (
    <PageShell
      eyebrow="Events"
      title={<>What's <span className="text-gradient-yellow-green">happening</span> at Safari.</>}
      subtitle="Sports days, science fairs, graduations, and cultural celebrations."
      crumbs={[{ label: 'Events' }]}
    >
      {/* Countdown banner */}
      {next && mode === 'upcoming' && (
        <section className="py-12 md:py-16">
          <div className="container-cinematic">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl gradient-yellow-green p-8 md:p-12 text-[#06130B] grain-overlay"
            >
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#06130B]/70 mb-2">Next event in</div>
                  <div className="font-display text-7xl md:text-8xl font-extrabold tabular-nums leading-none">{countdown}</div>
                  <div className="text-sm font-semibold mt-1">days</div>
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-4xl font-extrabold leading-tight">{next.title}</h2>
                  <p className="mt-2 text-[#06130B]/80">{next.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{formatDateTime(next.startDateTime)}</span>
                    {next.venue && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{next.venue}</span>}
                  </div>
                  <button onClick={() => navigate('events-detail', next.slug)} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#06130B] text-[#FFD500] font-bold text-sm hover:bg-[#0A1A0F] transition">
                    View details <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-20">
        <div className="container-cinematic">
          <div className="flex gap-2 mb-8">
            <button onClick={() => setMode('upcoming')} className={`px-5 py-2 rounded-full text-sm font-semibold transition ${mode === 'upcoming' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>Upcoming</button>
            <button onClick={() => setMode('past')} className={`px-5 py-2 rounded-full text-sm font-semibold transition ${mode === 'past' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>Past</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((e, i) => {
              const d = new Date(e.startDateTime)
              return (
                <motion.article
                  key={e.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate('events-detail', e.slug)}
                  className="group cursor-pointer overflow-hidden rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={e.coverImage || ''} alt={e.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-3 left-3 grid place-items-center h-14 w-14 rounded-xl bg-[#FFD500] text-[#06130B]">
                      <div className="text-center">
                        <div className="text-lg font-extrabold leading-none">{d.getDate()}</div>
                        <div className="text-[10px] uppercase tracking-widest font-bold">{d.toLocaleString('en-GB', { month: 'short' })}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-foreground/60 mb-2 flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />{e.category}
                      {e.venue && <><span>•</span><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.venue}</span></>}
                    </div>
                    <h3 className="font-display text-lg font-bold leading-snug group-hover:text-primary transition line-clamp-2">{e.title}</h3>
                    <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{e.excerpt}</p>
                  </div>
                </motion.article>
              )
            })}
          </div>
          {!filtered.length && <div className="text-center py-20 text-foreground/60">No {mode} events.</div>}
        </div>
      </section>
    </PageShell>
  )
}

const regSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  count: z.coerce.number().int().min(1).max(20).default(1),
  note: z.string().optional(),
  website: z.string().max(0).optional(),
})
type RegForm = z.infer<typeof regSchema>

export function EventDetailPage() {
  const { data, navigate, route } = useStore()
  const slug = route.param
  const events = data?.events || []
  const ev = events.find((e) => e.slug === slug)
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RegForm>({ resolver: zodResolver(regSchema), defaultValues: { count: 1 } })

  if (!ev) {
    return (
      <PageShell eyebrow="Not Found" title="Event not found" crumbs={[{ label: 'Events' }]}>
        <div className="container-cinematic py-20 text-center">
          <button onClick={() => navigate('events')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
            <ChevronLeft className="h-4 w-4" /> Back to Events
          </button>
        </div>
      </PageShell>
    )
  }

  const copyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  const onSubmit = async (d: RegForm) => {
    setSubmitting(true)
    try {
      const r = await fetch('/api/v1/public/event-register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...d, eventId: ev.id }),
      })
      if (r.ok) {
        toast.success('Registration received! We\'ll be in touch.')
        reset()
      } else {
        toast.error('Could not register. Try again.')
      }
    } catch {
      toast.error('Network error.')
    } finally {
      setSubmitting(false)
    }
  }

  const d = new Date(ev.startDateTime)
  const related = events.filter((e) => e.id !== ev.id && e.category === ev.category).slice(0, 3)

  return (
    <article>
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden bg-[#06130B]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ev.coverImage || ''} alt={ev.title} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06130B] via-[#06130B]/50 to-transparent" />
        <div className="relative container-cinematic pt-32 pb-10 h-full flex flex-col justify-end text-white">
          <button onClick={() => navigate('events')} className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-[#FFE24D] mb-4 w-fit">
            <ChevronLeft className="h-3.5 w-3.5" /> Back to Events
          </button>
          <div className="text-xs text-[#FFE24D] uppercase tracking-widest mb-3">{ev.category}</div>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-4xl">{ev.title}</h1>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/80">
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{formatDateTime(ev.startDateTime)}</span>
            {ev.venue && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{ev.venue}</span>}
            {ev._count && <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" />{ev._count.registrations} registered</span>}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-cinematic grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {ev.excerpt && <p className="text-lg md:text-xl text-foreground/80 mb-8 font-medium leading-relaxed">{ev.excerpt}</p>}
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-img:rounded-2xl" dangerouslySetInnerHTML={{ __html: ev.body }} />
            <div className="mt-10 p-5 rounded-2xl bg-card border border-border/60 flex items-center gap-3">
              <Share2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">Share:</span>
              <button onClick={copyLink} className="grid place-items-center h-9 w-9 rounded-full bg-background hover:bg-accent/40 transition" title="Copy link"><Copy className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="p-5 rounded-2xl bg-card border border-border/60 sticky top-24">
              <h3 className="font-display text-base font-bold mb-4">Event details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3"><CalendarDays className="h-4 w-4 text-primary mt-0.5" /><div><div className="text-foreground/60 text-xs">When</div><div className="font-medium">{formatDateTime(ev.startDateTime)}</div></div></div>
                {ev.venue && <div className="flex items-start gap-3"><MapPin className="h-4 w-4 text-primary mt-0.5" /><div><div className="text-foreground/60 text-xs">Where</div><div className="font-medium">{ev.venue}</div></div></div>}
                <div className="flex items-start gap-3"><Clock className="h-4 w-4 text-primary mt-0.5" /><div><div className="text-foreground/60 text-xs">Countdown</div><div className="font-medium">{daysUntil(ev.startDateTime)} days</div></div></div>
              </div>
              <button onClick={() => {
                // Add to calendar (.ics)
                const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${new Date(ev.startDateTime).toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nDTEND:${ev.endDateTime ? new Date(ev.endDateTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : ''}\nSUMMARY:${ev.title}\nLOCATION:${ev.venue || ''}\nEND:VEVENT\nEND:VCALENDAR`
                const blob = new Blob([ics], { type: 'text/calendar' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url; a.download = `${ev.slug}.ics`; a.click()
                URL.revokeObjectURL(url)
              }} className="mt-5 w-full px-4 py-2.5 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm hover:brightness-105 transition">Add to Calendar</button>
            </div>
          </aside>
        </div>
      </section>

      {/* Registration */}
      {ev.registrationOpen && (
        <section className="py-16 md:py-20 bg-accent/15">
          <div className="container-cinematic max-w-2xl">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Register</span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold">Reserve your <span className="text-gradient-yellow-green">spot</span></h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 rounded-3xl bg-card border border-border/60 space-y-4">
              <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />
              <div className="grid md:grid-cols-2 gap-4">
                <label className="block">
                  <div className="text-xs font-semibold text-foreground/70 mb-1.5">Name</div>
                  <input {...register('name')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
                  {errors.name && <div className="text-xs text-destructive mt-1">{errors.name.message}</div>}
                </label>
                <label className="block">
                  <div className="text-xs font-semibold text-foreground/70 mb-1.5">Email</div>
                  <input type="email" {...register('email')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
                  {errors.email && <div className="text-xs text-destructive mt-1">{errors.email.message}</div>}
                </label>
                <label className="block">
                  <div className="text-xs font-semibold text-foreground/70 mb-1.5">Phone</div>
                  <input {...register('phone')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
                </label>
                <label className="block">
                  <div className="text-xs font-semibold text-foreground/70 mb-1.5">Number attending</div>
                  <input type="number" min={1} max={20} {...register('count')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
                </label>
              </div>
              <label className="block">
                <div className="text-xs font-semibold text-foreground/70 mb-1.5">Note (optional)</div>
                <textarea rows={3} {...register('note')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
              </label>
              <button type="submit" disabled={submitting} className="w-full px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:brightness-105 transition disabled:opacity-60">Register</button>
            </form>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16">
          <div className="container-cinematic">
            <h2 className="font-display text-2xl font-extrabold mb-6">Related events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r) => (
                <div key={r.id} onClick={() => navigate('events-detail', r.slug)} className="group cursor-pointer overflow-hidden rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition">
                  <div className="aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.coverImage || ''} alt={r.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-foreground/60 mb-1">{formatDate(r.startDateTime)}</div>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition">{r.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
