'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, ArrowRight, Send } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '../page-shell'
import { extractMapSrc } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  campus: z.string().optional(),
  message: z.string().min(5, 'Message too short'),
  website: z.string().max(0).optional(),
})
type ContactForm = z.infer<typeof schema>

export function ContactPage() {
  const { data } = useStore()
  const settings = data?.settings || ({} as any)
  const branches = data?.branches || []
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({ resolver: zodResolver(schema) })

  const mapSrc = extractMapSrc(settings.mapEmbedUrl)

  const onSubmit = async (d: ContactForm) => {
    setSubmitting(true)
    try {
      const r = await fetch('/api/v1/public/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      })
      if (r.ok) {
        toast.success('Message sent! We\'ll be in touch soon.')
        reset()
      } else {
        toast.error('Could not send. Try again.')
      }
    } catch {
      toast.error('Network error.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageShell
      eyebrow="Contact"
      title={<>Let's <span className="text-gradient-yellow-green">talk</span>.</>}
      subtitle="Questions, visits, partnerships — we'd love to hear from you."
      crumbs={[{ label: 'Contact' }]}
    >
      {/* Contact cards */}
      <section className="py-16 md:py-20">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { Icon: Phone, label: 'Phone', value: settings.phone, href: `tel:${settings.phone}` },
              { Icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
              { Icon: MapPin, label: 'Address', value: settings.address },
              { Icon: Clock, label: 'Office Hours', value: settings.workingHours },
            ].map((c, i) => (
              <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-5 rounded-2xl bg-card border border-border/60">
                <c.Icon className="h-6 w-6 text-primary mb-3" />
                <div className="text-xs text-foreground/60 uppercase tracking-widest">{c.label}</div>
                {c.href ? <a href={c.href} className="text-sm font-semibold hover:text-primary mt-1 block">{c.value}</a> : <div className="text-sm font-semibold mt-1">{c.value}</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="pb-20 md:pb-28">
        <div className="container-cinematic grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <div>
            <h2 className="font-display text-3xl font-extrabold mb-4">Send us a <span className="text-gradient-yellow-green">message</span></h2>
            <p className="text-foreground/70 mb-6">Fill out the form and we'll respond within 48 hours.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Name" error={errors.name?.message}>
                  <input {...register('name')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <input type="email" {...register('email')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
                </Field>
                <Field label="Phone">
                  <input {...register('phone')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
                </Field>
                <Field label="Subject">
                  <input {...register('subject')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
                </Field>
              </div>
              <Field label="Campus">
                <select {...register('campus')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none">
                  <option value="">Any / General</option>
                  {branches.map((b) => <option key={b.id}>{b.name}</option>)}
                </select>
              </Field>
              <Field label="Message" error={errors.message?.message}>
                <textarea rows={5} {...register('message')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
              </Field>
              <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:brightness-105 transition disabled:opacity-60">
                {submitting ? 'Sending…' : <>Send <Send className="h-4 w-4" /></>}
              </button>
            </form>
          </div>

          {/* Map */}
          <div>
            <h2 className="font-display text-3xl font-extrabold mb-4">Visit our <span className="text-gradient-yellow-green">main branch</span></h2>
            <p className="text-foreground/70 mb-6">{settings.address}</p>
            <div className="rounded-2xl overflow-hidden border border-border/60 aspect-[4/3] lg:aspect-square bg-muted">
              {mapSrc ? (
                <iframe
                  src={mapSrc}
                  title="Main branch map"
                  loading="lazy"
                  className="h-full w-full"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-foreground/50 text-sm">Map not configured</div>
              )}
            </div>
            {settings.mapDirectionsUrl && (
              <a href={settings.mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                Get Directions <ArrowRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Branches quick contact */}
      <section className="py-16 md:py-20 bg-accent/15">
        <div className="container-cinematic">
          <h2 className="font-display text-2xl md:text-4xl font-extrabold mb-8 text-center">Quick campus <span className="text-gradient-yellow-green">contacts</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {branches.slice(0, 8).map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-card border border-border/60">
                <div className="font-semibold text-sm">{b.name}</div>
                {b.principal && <div className="text-xs text-foreground/60 mt-1">{b.principal}</div>}
                {b.phone && <a href={`tel:${b.phone}`} className="text-xs text-primary mt-2 block hover:underline">{b.phone}</a>}
                {b.email && <a href={`mailto:${b.email}`} className="text-xs text-primary hover:underline">{b.email}</a>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-foreground/70 mb-1.5">{label}</div>
      {children}
      {error && <div className="text-xs text-destructive mt-1">{error}</div>}
    </label>
  )
}
