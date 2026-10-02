'use client'

import { motion } from 'framer-motion'
import { Trophy, Shield, Cpu, Globe, Users, Building2, Heart, GraduationCap, ArrowRight, Quote, Sparkles, TrendingUp } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '../page-shell'
import { useReveal, useCountUp } from '@/lib/hooks'
import { MagneticButton } from '@/components/global/magnetic-button'

const VALUE_ICONS: Record<string, any> = { Trophy, Shield, Cpu, Globe, Heart, Users, Building2, GraduationCap }

export function AboutPage() {
  const { data, navigate } = useStore()
  const timeline = data?.timeline || []
  const leadership = data?.teamLeadership || []
  const values = (data?.features || []).filter((f) => f.section === 'values')
  const partners = data?.partners || []
  const { ref: storyRef, visible: storyVisible } = useReveal()
  const { ref: growthRef, visible: growthVisible } = useReveal()

  return (
    <PageShell
      eyebrow="About Us"
      title={<>Educating Minds, <span className="text-gradient-yellow-green">Inspiring Hearts</span></>}
      subtitle="Founded in Addis Ababa in 2005 with the motto “Your Kids, Our Kids” — from 8 staff and 107 students to 6,000+ learners across eight campuses."
      image={data?.branches?.[0]?.coverImage}
      crumbs={[{ label: 'About' }]}
    >
      {/* ============================================================
          THE MOTTO — cinematic centerpiece
          ============================================================ */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-[#06130B] text-white grain-overlay">
        <div className="aurora-blob" style={{ width: 480, height: 480, top: '5%', left: '5%', background: '#FFD500' }} />
        <div className="aurora-blob" style={{ width: 420, height: 420, bottom: '5%', right: '5%', background: '#1FA64D' }} />
        <div className="container-cinematic relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Quote className="h-10 w-10 text-[#FFD500] mx-auto mb-6 opacity-60" />
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-none">
              <span className="text-gradient-yellow-lime">Your Kids,</span>
              <br />
              <span className="text-white">Our Kids.</span>
            </h2>
            <p className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Four words that have guided every decision, every classroom, and every child at Safari Academy for two decades. This is not just a motto — it is a promise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          OUR STORY — founding narrative
          ============================================================ */}
      <section ref={storyRef as any} className="py-20 md:py-32">
        <div className="container-cinematic grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={storyVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl glow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data?.branches?.[0]?.coverImage || 'https://picsum.photos/seed/safari-story/900/1100'}
                alt="Safari Academy"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06130B]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs uppercase tracking-widest text-[#FFE24D] mb-1">Est. 2005 G.C</div>
                <div className="font-display text-2xl font-bold">Addis Ababa, Ethiopia</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={storyVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/40 text-secondary-foreground text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" /> Our Story
            </span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-extrabold tracking-tight">
              From <span className="text-gradient-yellow-green">107 students</span> to <span className="text-gradient-yellow-green">6,000+</span>.
            </h2>
            <div className="mt-6 space-y-4 text-foreground/75 leading-relaxed">
              <p>
                Safari Academy was established in Addis Ababa, Ethiopia in 2005 G.C with the guiding motto <strong>“Your Kids, Our Kids.”</strong> The academy began its journey with only <strong>8 dedicated staff members</strong> and <strong>107 students</strong> enrolled from Kindergarten to Grade 2.
              </p>
              <p>
                Through strong leadership, committed teachers, and continuous support from parents, Safari Academy has grown into one of Ethiopia's most respected private educational institutions. Today, the academy operates <strong>3 Kindergarten campuses, 4 Primary Schools, and 1 Secondary &amp; College Preparatory campus</strong>, serving nearly <strong>6,000 students</strong> with the support of more than <strong>560 teachers and administrative staff</strong>.
              </p>
              <p>
                Founded with a clear mission to provide quality education, strong discipline, and moral values, the school has always emphasized academic excellence, ethical behavior, and student-centered learning — producing outstanding results in national examinations and university entrance placements.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton as="button" onClick={() => navigate('admissions')} className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm hover:brightness-105 transition">
                Apply Now <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton as="button" onClick={() => navigate('branches')} className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-accent/40 transition">
                Visit a Campus
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          GROWTH COUNTERS — the journey in numbers
          ============================================================ */}
      <section ref={growthRef as any} className="py-16 md:py-20 bg-gradient-to-r from-[#FFD500] via-[#FFE24D] to-[#B6F2A0] text-[#06130B] grain-overlay">
        <div className="container-cinematic">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#06130B]/70">Our Growth</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">20 years of <span className="text-[#0B5D2A]">exponential growth</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <GrowthCounter label="Students (2005)" value={107} suffix="" start={growthVisible} />
            <GrowthCounter label="Students (Today)" value={6000} suffix="+" start={growthVisible} />
            <GrowthCounter label="Staff & Teachers" value={560} suffix="+" start={growthVisible} />
            <GrowthCounter label="Campuses" value={8} suffix="" start={growthVisible} />
          </div>
          <div className="mt-8 text-center">
            <TrendingUp className="h-6 w-6 text-[#0B5D2A] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#06130B]/80">From 8 staff and 107 students to 560+ staff and 6,000+ students — a 55× growth in two decades.</p>
          </div>
        </div>
      </section>

      {/* ============================================================
          TIMELINE — real milestones
          ============================================================ */}
      <section className="py-20 md:py-28">
        <div className="container-cinematic">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our Journey</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Two decades of <span className="text-gradient-yellow-green">milestones</span></h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
            {timeline.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative mb-8 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:ml-auto md:pl-12'}`}
              >
                <div className={`absolute top-1.5 ${i % 2 === 0 ? '-left-0.5 md:left-auto md:-right-1.5' : '-left-0.5 md:-left-1.5'} h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20`} />
                <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
                  <div className="text-xs font-mono text-primary mb-1">{m.year}</div>
                  <h3 className="font-display text-lg font-bold">{m.title}</h3>
                  <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{m.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          MISSION & VISION
          ============================================================ */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-accent/20">
        <div className="container-cinematic">
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-10 rounded-3xl glass border border-border/60 relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#FFD500]/10 blur-2xl" />
              <div className="relative">
                <div className="grid place-items-center h-12 w-12 rounded-2xl bg-primary/15 text-primary mb-5">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">Our Mission</h3>
                <p className="text-foreground/75 leading-relaxed text-lg">
                  To provide high-quality education that nurtures academic excellence, strong character, creativity, and lifelong learning through a safe, disciplined, and supportive school environment.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-10 rounded-3xl glass border border-border/60 relative overflow-hidden"
            >
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#1FA64D]/10 blur-2xl" />
              <div className="relative">
                <div className="grid place-items-center h-12 w-12 rounded-2xl bg-secondary/40 text-secondary-foreground mb-5">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">Our Vision</h3>
                <p className="text-foreground/75 leading-relaxed text-lg">
                  To become a leading educational institution in Ethiopia that prepares responsible, confident, and globally competitive students for higher education and future leadership.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CORE VALUES
          ============================================================ */}
      <section className="py-20 md:py-28">
        <div className="container-cinematic">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Core Values</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">The pillars of a <span className="text-gradient-yellow-green">Safari education</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = VALUE_ICONS[v.icon || 'Trophy'] || Trophy
              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group p-6 rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition"
                >
                  <div className="grid place-items-center h-12 w-12 rounded-2xl bg-primary/15 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-display text-lg font-bold mb-2">{v.title}</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">{v.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          CAMPUS STRUCTURE — visual breakdown
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#06130B] text-white relative overflow-hidden">
        <div className="aurora-blob" style={{ width: 380, height: 380, top: '10%', right: '-5%', background: '#1FA64D' }} />
        <div className="container-cinematic relative">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#FFE24D] text-xs font-semibold uppercase tracking-widest">Our Campuses</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Eight campuses, <span className="text-gradient-yellow-lime">one family</span></h2>
            <p className="mt-4 text-white/70">Each campus is purpose-built for its age group — yet all share the same Safari heart.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <CampusCard number="3" label="Kindergarten Campuses" desc="Raey, Figa & Gerji — purpose-built early-years environments" icon="Heart" />
            <CampusCard number="4" label="Primary Campuses" desc="Summit, Fird Bet, Bole & CMC — Grades 1–8" icon="Building2" featured />
            <CampusCard number="1" label="Secondary Campus" desc="Umar Sibhatu — College Preparatory, Grades 9–12" icon="GraduationCap" />
          </div>
        </div>
      </section>

      {/* ============================================================
          LEADERSHIP — with the new intro copy
          ============================================================ */}
      <section className="py-20 md:py-28">
        <div className="container-cinematic">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Administration & Leadership</span>
            <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">
              Inspiring Leaders Shaping <span className="text-gradient-yellow-green">Tomorrow's Generation</span>
            </h2>
            <p className="mt-4 text-foreground/70">
              Safari Academy is guided by a team of experienced and passionate educators committed to providing high-quality education, fostering academic excellence, and nurturing character development in every student.
            </p>
          </div>

          {/* Leadership highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: Users, title: 'Expert Faculty', desc: 'Our leadership team ensures that only highly qualified and dedicated staff guide our students.' },
              { icon: Trophy, title: 'Academic Excellence', desc: 'Leadership promotes innovative curricula and continuous improvement in learning outcomes.' },
              { icon: Heart, title: 'Your Kids, Our Kids', desc: 'Every leader treats each child as their own — the motto is lived, not just spoken.' },
            ].map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-accent/30 border border-border/60 text-center"
              >
                <h.icon className="h-7 w-7 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-sm mb-1">{h.title}</h3>
                <p className="text-xs text-foreground/70">{h.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mb-8">
            <h3 className="font-display text-2xl md:text-3xl font-bold">
              Meet Our Distinguished <span className="text-gradient-yellow-green">Leadership</span>
            </h3>
            <p className="mt-2 text-sm text-foreground/70 max-w-xl mx-auto">
              Our leadership team combines expertise, experience, and vision to guide Safari Academy's students toward success.
            </p>
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
                <p className="mt-4 text-sm text-foreground/70 leading-relaxed line-clamp-4">{t.bio}</p>
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

      {/* ============================================================
          20+ YEARS BANNER
          ============================================================ */}
      <section className="py-16 md:py-20 bg-accent/15">
        <div className="container-cinematic text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex flex-col items-center"
          >
            <div className="font-display text-6xl md:text-8xl font-extrabold text-gradient-yellow-green leading-none">
              20<span className="text-primary">+</span>
            </div>
            <div className="mt-2 text-sm md:text-base font-semibold text-foreground/80 uppercase tracking-widest">Years of Educational Excellence</div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          PARTNERS
          ============================================================ */}
      <section className="py-16 md:py-20">
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

      {/* ============================================================
          CTA
          ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="container-cinematic text-center">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold">Become part of the <span className="text-gradient-yellow-green">Safari family</span>.</h2>
          <p className="mt-4 text-foreground/70 max-w-xl mx-auto">Visit a campus, meet our team, and discover what makes Safari Academy Ethiopia's preferred school.</p>
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

// Growth counter component
function GrowthCounter({ label, value, suffix, start }: { label: string; value: number; suffix: string; start: boolean }) {
  const n = useCountUp(value, 1800, start)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={start ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="font-display text-4xl md:text-6xl font-extrabold text-[#06130B] tabular-nums leading-none">
        {n.toLocaleString()}{suffix}
      </div>
      <div className="text-xs md:text-sm font-semibold text-[#06130B]/70 mt-2">{label}</div>
    </motion.div>
  )
}

// Campus structure card
function CampusCard({ number, label, desc, icon, featured }: { number: string; label: string; desc: string; icon: string; featured?: boolean }) {
  const Icon = VALUE_ICONS[icon] || Building2
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-3xl text-center ${featured ? 'bg-[#FFD500] text-[#06130B]' : 'glass border border-white/10 text-white'}`}
    >
      <Icon className={`h-8 w-8 mx-auto mb-3 ${featured ? 'text-[#06130B]' : 'text-[#FFE24D]'}`} />
      <div className={`font-display text-5xl font-extrabold mb-1 ${featured ? 'text-[#06130B]' : 'text-white'}`}>{number}</div>
      <div className={`font-bold text-sm mb-2 ${featured ? 'text-[#06130B]' : 'text-white'}`}>{label}</div>
      <div className={`text-xs ${featured ? 'text-[#06130B]/70' : 'text-white/60'}`}>{desc}</div>
    </motion.div>
  )
}
