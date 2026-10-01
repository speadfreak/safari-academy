'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Users, Award } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '../page-shell'
import { formatDate } from '@/lib/utils'

const appSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  gradYear: z.string().min(2),
  program: z.string().optional(),
  message: z.string().optional(),
  website: z.string().max(0).optional(),
})
type AppForm = z.infer<typeof appSchema>

export function AlumniPage() {
  const { data } = useStore()
  const alumni = data?.alumni || []
  const stats = [
    { label: 'Alumni worldwide', value: 3200, suffix: '+' },
    { label: 'Countries', value: 24, suffix: '' },
    { label: 'Universities attended', value: 60, suffix: '+' },
  ]
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AppForm>({ resolver: zodResolver(appSchema) })

  const onSubmit = async (d: AppForm) => {
    setSubmitting(true)
    try {
      const r = await fetch('/api/v1/public/alumni-apply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      })
      if (r.ok) {
        toast.success('Application received! Welcome back to the Safari family.')
        reset()
      } else {
        toast.error('Could not submit. Try again.')
      }
    } catch {
      toast.error('Network error.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageShell
      eyebrow="Alumni"
      title={<>Once a Safari student, <span className="text-gradient-yellow-green">always family.</span></>}
      subtitle="3,200+ alumni across 24 countries — shaping Ethiopia and the world."
      crumbs={[{ label: 'Alumni' }]}
    >
      {/* Stats */}
      <section className="py-16">
        <div className="container-cinematic">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-3xl bg-card border border-border/60">
                <div className="font-display text-3xl md:text-5xl font-extrabold text-gradient-yellow-green">{s.value}{s.suffix}</div>
                <div className="text-xs md:text-sm text-foreground/70 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Distinguished alumni */}
      <section className="py-16 md:py-24">
        <div className="container-cinematic">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Distinguished Alumni</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Where are they <span className="text-gradient-yellow-green">now?</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumni.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group p-6 rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition"
              >
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.photo || ''} alt={a.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/30" />
                  <div>
                    <div className="font-display text-lg font-bold">{a.name}</div>
                    <div className="text-xs text-primary">Class of {a.graduationYear}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-foreground/70 italic leading-relaxed">"{a.quote}"</p>
                <div className="mt-4 text-xs">
                  <div className="font-semibold text-foreground/90">{a.currentRole}</div>
                  <div className="text-foreground/60">{a.company} • {a.sector}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Give back */}
      <section className="py-16 md:py-24 bg-accent/15">
        <div className="container-cinematic">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Heart className="h-10 w-10 text-primary mb-4" />
              <h2 className="font-display text-3xl md:text-4xl font-extrabold">Give back. <span className="text-gradient-yellow-green">Mentor.</span></h2>
              <p className="mt-4 text-foreground/70">From guest lectures to mentorship programs, internships to scholarships — your experience can light the path for the next generation.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-card border border-border/60 text-center">
                <Users className="h-7 w-7 text-primary mx-auto mb-2" />
                <div className="font-display text-2xl font-extrabold">120+</div>
                <div className="text-xs text-foreground/70">Active mentors</div>
              </div>
              <div className="p-5 rounded-2xl bg-card border border-border/60 text-center">
                <Award className="h-7 w-7 text-primary mx-auto mb-2" />
                <div className="font-display text-2xl font-extrabold">8</div>
                <div className="text-xs text-foreground/70">Scholarships funded</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join network */}
      <section className="py-16 md:py-24">
        <div className="container-cinematic max-w-2xl">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Join the network</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Become an <span className="text-gradient-yellow-green">alumni member</span></h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 rounded-3xl bg-card border border-border/60 space-y-4">
            <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <div className="text-xs font-semibold text-foreground/70 mb-1.5">Full Name</div>
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
                <div className="text-xs font-semibold text-foreground/70 mb-1.5">Graduation Year</div>
                <input {...register('gradYear')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
                {errors.gradYear && <div className="text-xs text-destructive mt-1">{errors.gradYear.message}</div>}
              </label>
            </div>
            <label className="block">
              <div className="text-xs font-semibold text-foreground/70 mb-1.5">Program / Campus</div>
              <input {...register('program')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
            </label>
            <label className="block">
              <div className="text-xs font-semibold text-foreground/70 mb-1.5">Message</div>
              <textarea rows={3} {...register('message')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
            </label>
            <button type="submit" disabled={submitting} className="w-full px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:brightness-105 transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {submitting ? 'Submitting…' : <>Join Network <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  )
}
