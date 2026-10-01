'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Users, ArrowRight, Play, ChevronLeft } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '../page-shell'

export function BranchesListPage() {
  const { data, navigate } = useStore()
  const branches = data?.branches || []
  const [q, setQ] = useState('')
  const filtered = branches.filter((b) => !q || b.name.toLowerCase().includes(q.toLowerCase()) || (b.tagline || '').toLowerCase().includes(q.toLowerCase()))

  return (
    <PageShell
      eyebrow="Our Campuses"
      title={<>Eight campuses across <span className="text-gradient-yellow-green">Addis Ababa</span>.</>}
      subtitle="Find the Safari campus near you. Each one with its own character, all sharing the same spirit."
      crumbs={[{ label: 'Branches' }]}
    >
      <section className="py-20 md:py-28">
        <div className="container-cinematic">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search campuses…" className="w-full max-w-md mx-auto block mb-10 px-4 py-2.5 rounded-full bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none text-sm text-center" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate('branch-detail', b.slug)}
                className="group cursor-pointer overflow-hidden rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.coverImage || ''} alt={b.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  {b.videoTourUrl && (
                    <div className="absolute top-3 right-3 grid place-items-center h-10 w-10 rounded-full bg-[#FFD500] text-[#06130B]">
                      <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs text-primary uppercase tracking-widest mb-1">{b.tagline}</div>
                  <h3 className="font-display text-xl font-bold">{b.name} Campus</h3>
                  <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{b.description}</p>
                  <div className="mt-3 space-y-1 text-xs text-foreground/60">
                    {b.address && <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{b.address}</div>}
                    {b.principal && <div className="flex items-center gap-1.5"><Users className="h-3 w-3" />Principal: {b.principal}</div>}
                    {b.grades && <div className="flex items-center gap-1.5"><Users className="h-3 w-3" />{b.grades}</div>}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                    View campus <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {!filtered.length && <div className="text-center py-20 text-foreground/60">No campuses found.</div>}
        </div>
      </section>
    </PageShell>
  )
}

export function BranchDetailPage() {
  const { data, navigate, route } = useStore()
  const branches = data?.branches || []
  const b = branches.find((x) => x.slug === route.param)

  if (!b) {
    return (
      <PageShell eyebrow="Not Found" title="Campus not found" crumbs={[{ label: 'Branches' }]}>
        <div className="container-cinematic py-20 text-center">
          <button onClick={() => navigate('branches')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
            <ChevronLeft className="h-4 w-4" /> Back to Campuses
          </button>
        </div>
      </PageShell>
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[440px] overflow-hidden bg-[#06130B]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={b.coverImage || ''} alt={b.name} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06130B] via-[#06130B]/40 to-transparent" />
        <div className="relative container-cinematic pt-32 pb-10 h-full flex flex-col justify-end text-white">
          <button onClick={() => navigate('branches')} className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-[#FFE24D] mb-4 w-fit">
            <ChevronLeft className="h-3.5 w-3.5" /> Back to Campuses
          </button>
          <div className="text-xs text-[#FFE24D] uppercase tracking-widest mb-3">{b.tagline}</div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">{b.name} Campus</h1>
          <p className="mt-4 text-white/80 max-w-2xl">{b.description}</p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 md:py-20">
        <div className="container-cinematic grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            {Object.keys(b.stats).length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(b.stats).map(([k, v]) => (
                  <div key={k} className="p-4 rounded-2xl bg-accent/30 text-center">
                    <div className="font-display text-2xl md:text-3xl font-extrabold text-primary tabular-nums">{v}</div>
                    <div className="text-xs text-foreground/70 capitalize">{k}</div>
                  </div>
                ))}
              </div>
            )}

            {/* About */}
            <div>
              <h2 className="font-display text-2xl font-bold mb-3">About {b.name}</h2>
              <p className="text-foreground/75 leading-relaxed">{b.description}</p>
            </div>

            {/* Facilities */}
            {b.facilities.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold mb-3">Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {b.facilities.map((f) => (
                    <span key={f} className="px-3 py-1.5 rounded-full bg-secondary/60 text-secondary-foreground text-sm">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {b.images.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold mb-3">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {b.images.map((img) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={img.id} src={img.url} alt={img.alt || b.name} className="aspect-[4/3] object-cover rounded-xl" />
                  ))}
                </div>
              </div>
            )}

            {/* Video tour */}
            {b.videoTourUrl && (
              <div>
                <h3 className="font-display text-lg font-bold mb-3">Video Tour</h3>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40">
                  <iframe
                    src={`${b.videoTourUrl}?modestbranding=1&rel=0`}
                    title={`${b.name} video tour`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="p-5 rounded-2xl bg-card border border-border/60 sticky top-24">
              <h3 className="font-display text-base font-bold mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                {b.principal && <div className="flex items-start gap-3"><Users className="h-4 w-4 text-primary mt-0.5" /><div><div className="text-foreground/60 text-xs">Principal</div><div className="font-medium">{b.principal}</div></div></div>}
                {b.address && <div className="flex items-start gap-3"><MapPin className="h-4 w-4 text-primary mt-0.5" /><div><div className="text-foreground/60 text-xs">Address</div><div className="font-medium">{b.address}</div></div></div>}
                {b.phone && <div className="flex items-start gap-3"><Phone className="h-4 w-4 text-primary mt-0.5" /><div><div className="text-foreground/60 text-xs">Phone</div><a href={`tel:${b.phone}`} className="font-medium hover:text-primary">{b.phone}</a></div></div>}
                {b.email && <div className="flex items-start gap-3"><Mail className="h-4 w-4 text-primary mt-0.5" /><div><div className="text-foreground/60 text-xs">Email</div><a href={`mailto:${b.email}`} className="font-medium hover:text-primary">{b.email}</a></div></div>}
              </div>
              <button onClick={() => navigate('contact')} className="mt-5 w-full px-4 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:brightness-105 transition">Contact this campus</button>
            </div>
          </aside>
        </div>
      </section>

      {/* Map */}
      {b.mapEmbedUrl && (
        <section className="pb-16">
          <div className="container-cinematic">
            <div className="rounded-2xl overflow-hidden border border-border/60 h-72">
              <iframe
                src={b.mapEmbedUrl}
                title={`${b.name} map`}
                loading="lazy"
                className="h-full w-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
