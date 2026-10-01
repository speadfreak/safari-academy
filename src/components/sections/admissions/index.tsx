'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Calendar, FileText, ClipboardCheck, Search, Users, PartyPopper, Download, CheckCircle2, ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '../page-shell'
import { MagneticButton } from '@/components/global/magnetic-button'
import { formatDate } from '@/lib/utils'

const STEP_ICONS: Record<string, any> = { Search, FileText, ClipboardCheck, Users, PartyPopper }

const inquirySchema = z.object({
  parentName: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  studentName: z.string().optional(),
  gradeLevel: z.string().optional(),
  campus: z.string().optional(),
  message: z.string().optional(),
  website: z.string().max(0).optional(), // honeypot
})

type InquiryForm = z.infer<typeof inquirySchema>

export function AdmissionsPage() {
  const { data } = useStore()
  const steps = data?.admissionSteps || []
  const requirements = data?.admissionRequirements || []
  const dates = data?.importantDates || []
  const scholarships = data?.scholarships || []
  const feeTables = data?.feeTables || []
  const branches = data?.branches || []
  const [activeLevel, setActiveLevel] = useState(requirements[0]?.level || 'KG')
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InquiryForm>({ resolver: zodResolver(inquirySchema) })

  const onSubmit = async (d: InquiryForm) => {
    setSubmitting(true)
    try {
      const r = await fetch('/api/v1/public/inquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      })
      if (r.ok) {
        toast.success('Inquiry received! Our admissions team will reach out within 48 hours.')
        reset()
      } else {
        toast.error('Could not submit. Please try again.')
      }
    } catch {
      toast.error('Network error. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageShell
      eyebrow="Admissions"
      title={<>Your child's <span className="text-gradient-yellow-green">Safari</span> starts here.</>}
      subtitle="A simple, supportive journey from inquiry to enrollment — designed around your family."
      image={data?.branches?.[0]?.coverImage}
      crumbs={[{ label: 'Admissions' }]}
    >
      {/* PROCESS STEPS */}
      <section className="py-20 md:py-28">
        <div className="container-cinematic">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Admission Process</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Five simple <span className="text-gradient-yellow-green">steps</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((s, i) => {
              const Icon = STEP_ICONS[s.icon || 'Search'] || Search
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative p-6 rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition"
                >
                  <div className="text-xs font-mono text-primary mb-2">0{i + 1}</div>
                  <div className="grid place-items-center h-12 w-12 rounded-2xl bg-primary/15 text-primary mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold mb-1.5">{s.title}</h3>
                  <p className="text-xs text-foreground/70 leading-relaxed">{s.description}</p>
                  {i < steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-3 h-4 w-4 text-primary/40 -translate-y-1/2" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="py-20 md:py-28 bg-accent/15">
        <div className="container-cinematic">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Requirements</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">What to <span className="text-gradient-yellow-green">prepare</span></h2>
          </div>
          <div className="flex justify-center gap-2 flex-wrap mb-8">
            {requirements.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveLevel(r.level)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${activeLevel === r.level ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:border-primary/40'}`}
              >
                {r.level}
              </button>
            ))}
          </div>
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-card border border-border/60">
            <ul className="space-y-3">
              {(requirements.find((r) => r.level === activeLevel)?.items || []).map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground/80">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* IMPORTANT DATES */}
      <section className="py-20 md:py-28">
        <div className="container-cinematic">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Important Dates</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">2026/2027 <span className="text-gradient-yellow-green">calendar</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {dates.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border/60"
              >
                <div className="grid place-items-center h-14 w-14 rounded-xl bg-primary/15 text-primary shrink-0">
                  <div className="text-center">
                    <div className="text-lg font-extrabold leading-none">{new Date(d.date).getDate()}</div>
                    <div className="text-[10px] uppercase tracking-widest">{new Date(d.date).toLocaleString('en-GB', { month: 'short' })}</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold">{d.label}</div>
                  {d.description && <div className="text-xs text-foreground/70 mt-1">{d.description}</div>}
                  <div className="text-xs text-primary mt-1">{formatDate(d.date)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TUITION */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-accent/15">
        <div className="container-cinematic">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Tuition & Fees</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">2025/2026 <span className="text-gradient-yellow-green">academic year</span></h2>
          </div>
          {feeTables.map((t) => (
            <div key={t.id} className="max-w-5xl mx-auto mb-10">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h3 className="font-display text-xl font-bold">{t.title}</h3>
                  <p className="text-xs text-foreground/60">{t.academicYear} • {t.currency}</p>
                </div>
                {t.pdfUrl && (
                  <a href={t.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold hover:brightness-105 transition">
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                )}
              </div>
              {/* Desktop table */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-border/60">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60">
                    <tr>
                      <th className="text-left p-4 font-semibold">Level</th>
                      {t.columns.map((c) => (
                        <th key={c.id} className="text-right p-4 font-semibold">{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((r, i) => (
                      <tr key={r.id} className={`${r.highlight ? 'bg-primary/10' : i % 2 === 0 ? 'bg-card' : 'bg-muted/40'} hover:bg-accent/30 transition`}>
                        <td className="p-4 font-medium">{r.label}{r.highlight && <span className="ml-2 text-[10px] uppercase font-bold text-primary bg-primary/15 px-2 py-0.5 rounded-full">Popular</span>}</td>
                        {r.cells.map((c, k) => (
                          <td key={k} className="text-right p-4 tabular-nums">{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div className="md:hidden grid gap-3">
                {t.rows.map((r) => (
                  <div key={r.id} className={`p-4 rounded-2xl border ${r.highlight ? 'border-primary/40 bg-primary/5' : 'border-border/60 bg-card'}`}>
                    <div className="font-bold mb-2">{r.label}</div>
                    {t.columns.map((c, k) => (
                      <div key={c.id} className="flex justify-between text-sm py-1 border-b border-border/40 last:border-0">
                        <span className="text-foreground/70">{c.label}</span>
                        <span className="tabular-nums font-medium">{r.cells[k]}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {t.note && <p className="mt-3 text-xs text-foreground/60 italic">{t.note}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* SCHOLARSHIPS */}
      <section className="py-20 md:py-28">
        <div className="container-cinematic">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Scholarships & Aid</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Investing in <span className="text-gradient-yellow-green">potential</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {scholarships.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition"
              >
                <h3 className="font-display text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-foreground/70 mb-4">{s.description}</p>
                <div className="text-xs space-y-1">
                  {s.amount && <div><span className="text-foreground/50">Amount:</span> <span className="font-semibold text-primary">{s.amount}</span></div>}
                  {s.eligibility && <div><span className="text-foreground/50">Eligibility:</span> {s.eligibility}</div>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-accent/20">
        <div className="container-cinematic max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Begin your journey</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Submit an <span className="text-gradient-yellow-green">inquiry</span></h2>
            <p className="mt-3 text-foreground/70">Our admissions team will respond within 48 hours.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 rounded-3xl bg-card border border-border/60 space-y-4">
            <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Parent / Guardian Name" error={errors.parentName?.message}>
                <input {...register('parentName')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input type="email" {...register('email')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
              </Field>
              <Field label="Phone">
                <input {...register('phone')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
              </Field>
              <Field label="Student Name">
                <input {...register('studentName')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
              </Field>
              <Field label="Grade Level">
                <select {...register('gradeLevel')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none">
                  <option value="">Select</option>
                  <option>KG</option>
                  <option>Primary</option>
                  <option>Middle</option>
                  <option>High</option>
                </select>
              </Field>
              <Field label="Campus">
                <select {...register('campus')} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none">
                  <option value="">Any campus</option>
                  {branches.map((b) => <option key={b.id}>{b.name}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Message">
              <textarea {...register('message')} rows={4} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none" />
            </Field>
            <button type="submit" disabled={submitting} className="w-full px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:brightness-105 transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {submitting ? 'Submitting…' : <>Submit Inquiry <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
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
