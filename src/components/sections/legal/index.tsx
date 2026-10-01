'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollText, FileText, ExternalLink, HelpCircle, LifeBuoy, GraduationCap, ChevronDown } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '../page-shell'

export function LegalPage({ slug }: { slug: 'privacy' | 'terms' }) {
  const { data } = useStore()
  const page = data?.legalPages.find((p) => p.slug === slug)
  if (!page) {
    return (
      <PageShell eyebrow="Legal" title="Page not found" crumbs={[{ label: slug === 'privacy' ? 'Privacy' : 'Terms' }]}>
        <div className="container-cinematic py-20 text-center text-foreground/60">This page is being updated. Please check back soon.</div>
      </PageShell>
    )
  }
  return (
    <PageShell
      eyebrow="Legal"
      title={page.title}
      subtitle={`Last updated: ${page.updatedAt || 'Recently'}`}
      crumbs={[{ label: page.title }]}
    >
      <section className="py-16 md:py-24">
        <div className="container-cinematic grid lg:grid-cols-4 gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="text-xs font-semibold text-foreground/60 uppercase tracking-widest mb-3">On this page</div>
              <ul className="space-y-2 text-sm">
                {(page.body.match(/<h2[^>]*>([^<]+)<\/h2>/g) || []).map((h, i) => {
                  const text = h.replace(/<[^>]+>/g, '')
                  return (
                    <li key={i}><a href={`#sec-${i}`} className="text-foreground/70 hover:text-primary transition">{text}</a></li>
                  )
                })}
              </ul>
            </div>
          </aside>
          <article className="lg:col-span-3 prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-headings:scroll-mt-24"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        </div>
      </section>
    </PageShell>
  )
}

export function FaqsPage() {
  const { data } = useStore()
  const faqs = data?.faqs || []
  const cats = Array.from(new Set(faqs.map((f) => f.category)))
  return (
    <PageShell
      eyebrow="Support"
      title={<>Frequently asked <span className="text-gradient-yellow-green">questions</span></>}
      subtitle="Quick answers to the things families ask us most."
      crumbs={[{ label: 'FAQs' }]}
    >
      <section className="py-16 md:py-24">
        <div className="container-cinematic max-w-3xl">
          {cats.map((c) => (
            <div key={c} className="mb-10">
              <h2 className="font-display text-xl font-bold mb-4 text-primary">{c}</h2>
              <div className="space-y-3">
                {faqs.filter((f) => f.category === c).map((f) => (
                  <FaqRow key={f.id} q={f.question} a={f.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl bg-card border border-border/60 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left">
        <span className="font-semibold flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" />{q}</span>
        <ChevronDown className={`h-4 w-4 text-foreground/60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4 text-sm text-foreground/75 leading-relaxed" dangerouslySetInnerHTML={{ __html: a }} />}
    </div>
  )
}

export function PoliciesPage() {
  const { data } = useStore()
  const policies = data?.policies || []
  return (
    <PageShell
      eyebrow="Support"
      title={<>School <span className="text-gradient-yellow-green">policies</span></>}
      subtitle="The frameworks that keep our community safe, fair, and thriving."
      crumbs={[{ label: 'Policies' }]}
    >
      <section className="py-16 md:py-24">
        <div className="container-cinematic max-w-3xl">
          <div className="space-y-4">
            {policies.map((p) => (
              <div key={p.id} className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition">
                <div className="grid place-items-center h-10 w-10 rounded-xl bg-primary/15 text-primary shrink-0"><FileText className="h-5 w-5" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold">{p.title}</h3>
                  {p.description && <p className="text-sm text-foreground/70 mt-1">{p.description}</p>}
                </div>
                {p.fileUrl && <a href={p.fileUrl} target="_blank" rel="noopener noreferrer" className="grid place-items-center h-9 w-9 rounded-full bg-background hover:bg-accent/40 transition"><ExternalLink className="h-4 w-4" /></a>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}

export function StudentSupportPage() {
  return (
    <PageShell
      eyebrow="Support"
      title={<>Student <span className="text-gradient-yellow-green">support</span></>}
      subtitle="Counseling, learning support, health, and wellbeing — every student seen, heard, and cared for."
      crumbs={[{ label: 'Student Support' }]}
    >
      <section className="py-16 md:py-24">
        <div className="container-cinematic max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { Icon: LifeBuoy, title: 'Counseling', desc: 'Confidential counseling with trained professionals at every campus.' },
              { Icon: GraduationCap, title: 'Learning Support', desc: 'Personalized learning plans and in-class support for diverse needs.' },
              { Icon: HelpCircle, title: 'Academic Help', desc: 'After-school study halls and peer tutoring across all grades.' },
              { Icon: LifeBuoy, title: 'Health Services', desc: 'On-site clinics with certified medical staff and emergency protocols.' },
            ].map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-6 rounded-3xl bg-card border border-border/60">
                <s.Icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-display text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-foreground/70">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}

export function ParentPortalPage() {
  const { data } = useStore()
  const settings = data?.settings || ({} as any)
  return (
    <PageShell
      eyebrow="For Parents"
      title={<>Parent <span className="text-gradient-yellow-green">portal</span></>}
      subtitle="Grades, attendance, fees, and announcements — all in one place."
      crumbs={[{ label: 'Parent Portal' }]}
    >
      <section className="py-16 md:py-24">
        <div className="container-cinematic max-w-2xl text-center">
          <p className="text-foreground/70 mb-6">Access your child's academic progress, attendance records, fee statements, and school communications through our secure parent portal.</p>
          <a href={settings.parentPortalUrl || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:brightness-105 transition">
            Login to Parent Portal <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    </PageShell>
  )
}

export function NotFoundPage() {
  const { navigate } = useStore()
  return (
    <div className="min-h-screen grid place-items-center bg-[#06130B] text-white relative overflow-hidden grain-overlay">
      <div className="aurora-blob" style={{ width: 400, height: 400, top: '10%', left: '10%', background: '#FFD500' }} />
      <div className="aurora-blob" style={{ width: 360, height: 360, bottom: '10%', right: '5%', background: '#1FA64D' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center px-6">
        <div className="font-display text-8xl md:text-[12rem] font-extrabold text-gradient-yellow-lime leading-none">404</div>
        <h1 className="mt-4 font-display text-2xl md:text-4xl font-bold">Lost in the savannah</h1>
        <p className="mt-3 text-white/70 max-w-md mx-auto">The page you're looking for has wandered off the trail. Let's get you back home.</p>
        <button onClick={() => navigate('home')} className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFD500] text-[#06130B] font-bold hover:bg-[#FFE24D] transition">
          Back to Home
        </button>
      </motion.div>
    </div>
  )
}
