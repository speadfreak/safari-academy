'use client'

import { motion } from 'framer-motion'
import { Compass, Shield, HandHeart, Flame, Quote, ArrowRight, Award, Users, Building2 } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '../page-shell'
import { useReveal } from '@/lib/hooks'
import { MagneticButton } from '@/components/global/magnetic-button'

const VALUE_ICONS: Record<string, any> = { Compass, Shield, HandHeart, Flame }

export function AboutPage() {
  const { data, navigate } = useStore()
  const timeline = data?.timeline || []
  const leadership = data?.teamLeadership || []
  const values = (data?.features || []).filter((f) => f.section === 'values')
  const partners = data?.partners || []
  const { ref, visible } = useReveal()

  return (
    <PageShell
      eyebrow="About Us"
      title={<>A school with a <span className="text-gradient-yellow-green">story</span> worth telling.</>}
      subtitle="Since 2005, Safari Academy has grown from 80 students at one campus to 5,000+ students across eight thriving campuses in Addis Ababa."
      image={data?.branches?.[0]?.coverImage}
      crumbs={[{ label: 'About' }]}
    >
      {/* STORY TIMELINE */}
      <section ref={ref as any} className="py-20 md:py-28">
        <div className="container-cinematic">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our Story</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Two decades of <span className="text-gradient-yellow-green">growth</span></h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
            {timeline.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`relative mb-8 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:ml-auto md:pl-12'}`}
              >
                <div className={`absolute top-1.5 ${i % 2 === 0 ? '-left-0.5 md:left-auto md:-right-1.5' : '-left-0.5 md:-left-1.5'} h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20`} />
                <div className="p-5 rounded-2xl bg-card border border-border/60">
                  <div className="text-xs font-mono text-primary mb-1">{m.year}</div>
                  <h3 className="font-display text-lg font-bold">{m.title}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{m.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION VISION VALUES */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-accent/20">
        <div className="container-cinematic">
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="p-8 rounded-3xl glass border border-border/60">
              <Compass className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-2xl font-bold mb-3">Our Mission</h3>
              <p className="text-foreground/70 leading-relaxed">To nurture curious, courageous, and compassionate young leaders through a future-ready education rooted in Ethiopian values and global citizenship.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="p-8 rounded-3xl glass border border-border/60">
              <Flame className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-display text-2xl font-bold mb-3">Our Vision</h3>
              <p className="text-foreground/70 leading-relaxed">To be Africa's most loved school network — where every child discovers their spark and is empowered to build a better Ethiopia and a better world.</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = VALUE_ICONS[v.icon || 'Compass'] || Compass
              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="p-6 rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition"
                >
                  <div className="grid place-items-center h-12 w-12 rounded-2xl bg-primary/15 text-primary mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-display text-lg font-bold mb-2">{v.title}</h4>
                  <p className="text-sm text-foreground/70">{v.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="py-20 md:py-28">
        <div className="container-cinematic">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our Leadership</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Meet our <span className="text-gradient-yellow-green">distinguished leadership</span></h2>
            <p className="mt-4 text-foreground/70">Our leadership team combines expertise, experience, and vision to guide Safari Academy's students toward success.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadership.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className={`group p-6 rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition ${t.featured ? 'lg:col-span-1 ring-2 ring-primary/20' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.photo || ''} alt={t.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/30" />
                  <div>
                    <div className="font-display text-lg font-bold">{t.name}</div>
                    <div className="text-xs text-primary">{t.role}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-foreground/70 leading-relaxed line-clamp-3">{t.bio}</p>
                {t.fullBio && (
                  <button onClick={() => navigate('about')} className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                    Read full bio <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-16 md:py-20 bg-accent/15">
        <div className="container-cinematic">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Accreditations & Partnerships</span>
            <h2 className="mt-2 font-display text-2xl md:text-4xl font-extrabold">Trusted by the <span className="text-gradient-yellow-green">best</span></h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {partners.map((p) => (
              <div key={p.id} className="flex items-center gap-3 text-foreground/70">
                {p.logo && <img src={p.logo} alt={p.name} className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition" />}
                <span className="font-semibold">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container-cinematic text-center">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold">Become part of the <span className="text-gradient-yellow-green">Safari family</span>.</h2>
          <p className="mt-4 text-foreground/70 max-w-xl mx-auto">Visit a campus, meet our team, and discover what makes Safari Academy unlike any other.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <MagneticButton as="button" onClick={() => navigate('admissions')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:brightness-105 transition">
              Apply Now <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton as="button" onClick={() => navigate('contact')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border font-semibold text-sm hover:bg-accent/40 transition">
              Book a Visit
            </MagneticButton>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
