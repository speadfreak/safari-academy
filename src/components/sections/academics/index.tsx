'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, FlaskConical, Music, Bus, Laptop, Library, HeartPulse, Trophy, Users, ArrowRight, Globe, Languages, Calculator } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '../page-shell'
import { MagneticButton } from '@/components/global/magnetic-button'

const FACILITY_ICONS: Record<string, any> = { FlaskConical, BookOpen, Library, Music, Bus, Laptop, HeartPulse, Trophy }

export function AcademicsPage() {
  const { data, navigate } = useStore()
  const programs = data?.programs || []
  const staff = data?.teamStaff || []
  const facilities = data?.facilities || []
  const [active, setActive] = useState(programs[0]?.level || 'KG')
  const activeProgram = programs.find((p) => p.level === active)

  return (
    <PageShell
      eyebrow="Academics"
      title={<>Where <span className="text-gradient-yellow-green">curiosity</span> meets mastery.</>}
      subtitle="A future-ready curriculum across four levels — designed to grow curious, confident, and capable learners."
      image={data?.branches?.[1]?.coverImage}
      crumbs={[{ label: 'Academics' }]}
    >
      {/* Overview */}
      <section id="overview" className="py-20 md:py-28">
        <div className="container-cinematic">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">School Overview</span>
              <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">A learning journey designed to <span className="text-gradient-yellow-green">spark joy</span>.</h2>
              <p className="mt-5 text-foreground/70 leading-relaxed">At Safari Academy, we believe every child deserves an education that's both rigorous and joyful. Our curriculum blends the best of Ethiopian values with international standards, taught by passionate educators who know each learner by name.</p>
              <p className="mt-4 text-foreground/70 leading-relaxed">From play-based Kindergarten to university-track High School, every level is intentionally designed to nurture character, build confidence, and ignite a lifelong love of learning.</p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[{ label: 'Class sizes', value: '12–22' }, { label: 'Languages', value: '3+' }, { label: 'Clubs', value: '60+' }].map((s) => (
                  <div key={s.label} className="p-4 rounded-2xl bg-accent/30 text-center">
                    <div className="font-display text-2xl font-extrabold text-primary">{s.value}</div>
                    <div className="text-xs text-foreground/70">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid grid-cols-2 gap-4">
              {programs.map((p) => (
                <div key={p.id} className="p-5 rounded-2xl bg-card border border-border/60">
                  <div className="text-xs font-mono text-primary">{p.agesRange}</div>
                  <div className="font-display text-lg font-bold mt-1">{p.title}</div>
                  <div className="text-xs text-foreground/60 mt-2 line-clamp-2">{p.description}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs tabs */}
      <section id="programs" className="py-20 md:py-28 bg-gradient-to-b from-background to-accent/15">
        <div className="container-cinematic">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Programs / Levels</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Find the right <span className="text-gradient-yellow-green">level</span></h2>
          </div>
          <div className="flex justify-center gap-2 flex-wrap mb-8">
            {programs.map((p) => (
              <button key={p.id} onClick={() => setActive(p.level)} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${active === p.level ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:border-primary/40'}`}>
                {p.title}
              </button>
            ))}
          </div>
          {activeProgram && (
            <motion.div
              key={activeProgram.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              <div className="p-6 rounded-3xl bg-card border border-border/60">
                <h3 className="font-display text-lg font-bold mb-3">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {(activeProgram.subjects || []).map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-secondary/60 text-secondary-foreground text-xs">{s}</span>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-card border border-border/60">
                <h3 className="font-display text-lg font-bold mb-3">Learning Goals</h3>
                <ul className="space-y-2">
                  {(activeProgram.goals || []).map((g) => (
                    <li key={g} className="flex items-center gap-2 text-sm text-foreground/80">
                      <ArrowRight className="h-3 w-3 text-primary" /> {g}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-3xl bg-card border border-border/60">
                <h3 className="font-display text-lg font-bold mb-3">At a Glance</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-foreground/60">Ages</span><span className="font-semibold">{activeProgram.agesRange}</span></div>
                  <div className="flex justify-between"><span className="text-foreground/60">Class size</span><span className="font-semibold">{activeProgram.classSize}</span></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="py-20 md:py-28">
        <div className="container-cinematic">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Curriculum</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">A balanced, <span className="text-gradient-yellow-green">bilingual</span> foundation</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { Icon: Globe, title: 'Languages', desc: 'English (primary instruction), Amharic (core), with French and Arabic offered from Middle School.' },
              { Icon: Calculator, title: 'STEM & Innovation', desc: 'Mathematics, Sciences, Computing, and Robotics woven into every grade with hands-on labs.' },
              { Icon: BookOpen, title: 'Humanities & Arts', desc: 'History, Geography, Literature, Music, Drama, and Visual Arts for whole-child development.' },
              { Icon: Languages, title: 'Digital Learning', desc: 'Tablets, smart boards, and high-speed internet at every campus — technology as a tool, not a substitute for thinking.' },
              { Icon: Library, title: 'Library & Research', desc: '25,000+ volumes plus digital resources, and a research-skills program starting in Grade 4.' },
              { Icon: HeartPulse, title: 'Wellbeing', desc: 'PE, Health, and a counseling team that supports every learner\'s social-emotional growth.' },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition"
              >
                <c.Icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-display text-lg font-bold mb-2">{c.title}</h3>
                <p className="text-sm text-foreground/70">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trips & Extracurricular */}
      <section id="trips" className="py-20 md:py-28 bg-accent/15">
        <div className="container-cinematic">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Beyond the Classroom</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">School trips & <span className="text-gradient-yellow-green">extracurricular</span></h2>
          </div>
          <div id="extracurricular" className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-3xl bg-card border border-border/60">
              <h3 className="font-display text-lg font-bold mb-3">School Trips</h3>
              <p className="text-sm text-foreground/70 mb-4">Learning extends beyond our walls. From Lalibela's rock churches to Awash National Park, students experience Ethiopia's rich heritage and natural beauty.</p>
              <div className="grid grid-cols-3 gap-2">
                {['Lalibela', 'Gondar', 'Awash', 'Axum', 'Bale', 'Lakes'].map((s) => (
                  <span key={s} className="px-2 py-1 rounded-full bg-secondary/60 text-secondary-foreground text-xs text-center">{s}</span>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-card border border-border/60">
              <h3 className="font-display text-lg font-bold mb-3">Extracurricular Clubs</h3>
              <p className="text-sm text-foreground/70 mb-4">60+ clubs including robotics, debate, drama, orchestra, football, basketball, swimming, art, and coding.</p>
              <div className="grid grid-cols-3 gap-2">
                {['Robotics', 'Debate', 'Drama', 'Orchestra', 'Football', 'Coding', 'Art', 'Basketball', 'Swimming'].map((s) => (
                  <span key={s} className="px-2 py-1 rounded-full bg-secondary/60 text-secondary-foreground text-xs text-center">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities grid */}
      <section className="py-20 md:py-28">
        <div className="container-cinematic">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our Facilities</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Spaces that <span className="text-gradient-yellow-green">inspire</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.map((f, i) => {
              const Icon = FACILITY_ICONS[f.icon || 'BookOpen'] || BookOpen
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="group overflow-hidden rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition"
                >
                  {(f.images?.[0]) && (
                    <div className="aspect-[16/10] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.images[0]} alt={f.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="grid place-items-center h-10 w-10 rounded-xl bg-primary/15 text-primary mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-bold mb-1">{f.title}</h3>
                    <p className="text-sm text-foreground/70">{f.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ADMINISTRATIVE & SUPPORT TEAM */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-accent/15">
        <div className="container-cinematic">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our Team</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Administrative & <span className="text-gradient-yellow-green">support team</span></h2>
            <p className="mt-4 text-foreground/70">Behind every successful student is a committed team working tirelessly to provide a safe, organized, and supportive school environment for all.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {staff.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="text-center p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.photo || ''} alt={s.name} className="h-20 w-20 rounded-full object-cover mx-auto mb-3 ring-2 ring-primary/20" />
                <div className="font-semibold text-sm">{s.name}</div>
                <div className="text-xs text-primary">{s.role}</div>
                <div className="text-[10px] text-foreground/60 mt-0.5">{s.department}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container-cinematic text-center">
          <MagneticButton as="button" onClick={() => navigate('admissions')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:brightness-105 transition">
            Apply Now <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </section>
    </PageShell>
  )
}
