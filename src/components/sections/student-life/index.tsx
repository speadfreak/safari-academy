'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ArrowRight, Play } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '../page-shell'

export function StudentLifePage() {
  const { data, navigate } = useStore()
  const items = data?.galleryItems || []
  const categories = data?.galleryCategories || []
  const [filter, setFilter] = useState('All')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const cats = ['All', ...categories.map((c) => c.name)]
  const filtered = filter === 'All' ? items : items.filter((i) => i.category === filter)

  const next = () => setLightbox((i) => i === null ? i : (i + 1) % filtered.length)
  const prev = () => setLightbox((i) => i === null ? i : (i - 1 + filtered.length) % filtered.length)

  return (
    <PageShell
      eyebrow="Student Life"
      title={<>Life at <span className="text-gradient-yellow-green">Safari</span>.</>}
      subtitle="Clubs, sports, arts, trips, ceremonies — a vibrant mosaic of moments that shape our students."
      image={data?.branches?.[2]?.coverImage}
      crumbs={[{ label: 'Student Life' }]}
    >
      <section className="py-20 md:py-28">
        <div className="container-cinematic">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === c ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:border-primary/40'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                className="break-inside-avoid mb-4 group relative overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => setLightbox(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.url} alt={g.title || ''} className="w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06130B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition">
                  <div className="text-xs text-[#FFE24D] uppercase tracking-widest">{g.category}</div>
                  <div className="font-semibold">{g.title}</div>
                </div>
                {g.type === 'video' && (
                  <div className="absolute inset-0 grid place-items-center">
                    <Play className="h-10 w-10 text-white" fill="currentColor" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#06130B]/95 backdrop-blur-md grid place-items-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={() => setLightbox(null)}><X className="h-7 w-7" /></button>
            <button className="absolute left-4 text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); prev() }}><ChevronLeft className="h-10 w-10" /></button>
            <button className="absolute right-4 text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); next() }}><ChevronRight className="h-10 w-10" /></button>
            <motion.div
              key={filtered[lightbox].id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[85vh] w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={filtered[lightbox].url} alt={filtered[lightbox].title || ''} className="w-full h-auto max-h-[80vh] object-contain rounded-2xl" />
              <div className="mt-4 text-center text-white">
                <div className="text-xs text-[#FFE24D] uppercase tracking-widest">{filtered[lightbox].category}</div>
                <div className="font-semibold">{filtered[lightbox].title}</div>
                {filtered[lightbox].caption && <div className="text-sm text-white/70">{filtered[lightbox].caption}</div>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}

export function CampusFacilitiesPage() {
  const { data, navigate } = useStore()
  const facilities = data?.facilities || []
  const branches = data?.branches || []

  return (
    <PageShell
      eyebrow="Campus & Facilities"
      title={<>World-class <span className="text-gradient-yellow-green">spaces</span> for world-class learning.</>}
      subtitle="From science labs to sports fields, every Safari campus is designed to inspire."
      image={data?.branches?.[3]?.coverImage}
      crumbs={[{ label: 'Campus & Facilities' }]}
    >
      <section className="py-20 md:py-28">
        <div className="container-cinematic">
          {/* Bento gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] md:auto-rows-[220px]">
            {facilities.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`group relative overflow-hidden rounded-2xl border border-border/60 hover:border-primary/40 transition ${i % 5 === 0 ? 'col-span-2 row-span-2' : ''}`}
              >
                {f.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.images[0]} alt={f.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#06130B]/90 via-[#06130B]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-display text-base md:text-lg font-bold">{f.title}</h3>
                  <p className="text-xs text-white/70 line-clamp-2 mt-0.5">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Safety section */}
          <div className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-secondary/40 to-accent/30 border border-border/60">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Safety & Security</span>
                <h2 className="mt-2 font-display text-2xl md:text-4xl font-extrabold">A safe home <span className="text-gradient-yellow-green">away from home</span></h2>
                <p className="mt-4 text-foreground/70">Every campus has 24/7 security, on-site medical staff, fire-safety protocols, GPS-tracked transport, and trained safeguarding officers.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[{ v: '24/7', l: 'Security' }, { v: '8', l: 'On-site clinics' }, { v: '100%', l: 'GPS-tracked buses' }, { v: '0', l: 'Incidents since 2020' }].map((s) => (
                  <div key={s.l} className="p-4 rounded-2xl bg-background/60 text-center">
                    <div className="font-display text-2xl font-extrabold text-primary">{s.v}</div>
                    <div className="text-xs text-foreground/70">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Branches CTA */}
          <div className="mt-16 text-center">
            <h2 className="font-display text-2xl md:text-4xl font-extrabold">Explore our <span className="text-gradient-yellow-green">campuses</span></h2>
            <p className="mt-3 text-foreground/70">Eight locations across Addis Ababa — find one near you.</p>
            <button onClick={() => navigate('branches')} className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:brightness-105 transition">
              View all campuses <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
