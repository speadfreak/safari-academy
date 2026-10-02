'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '../page-shell'
import { LazyVideo } from '@/components/global/lazy-video'
import { MagneticButton } from '@/components/global/magnetic-button'

export function VirtualTourPage() {
  const { data, navigate } = useStore()
  const branches = data?.branches || []
  const [active, setActive] = useState(0)
  const branch = branches[active]

  return (
    <PageShell
      eyebrow="Virtual Tour"
      title={<>Walk every <span className="text-gradient-yellow-green">campus</span> — from anywhere.</>}
      subtitle="An immersive journey through all eight Safari Academy campuses. Click any video to begin your tour."
      dark
      crumbs={[{ label: 'Virtual Tour' }]}
    >
      {/* Hero video — first campus */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        {branch?.videoTourUrl && (
          <LazyVideo
            src={branch.videoTourUrl}
            poster={branch.videoPoster || branch.coverImage || undefined}
            className="absolute inset-0 h-full w-full"
            title={branch.name}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06130B] via-transparent to-transparent pointer-events-none" />
      </section>

      {/* Campus chapters */}
      <section className="snap-chapter">
        {branches.map((b, i) => (
          <div key={b.id} id={`chapter-${b.slug}`} className="min-h-screen flex flex-col md:flex-row items-center gap-8 md:gap-16 px-5 md:px-12 py-16 md:py-24 border-b border-white/10">
            <div className="w-full md:w-1/2">
              <div className="text-xs font-mono text-[#FFE24D] mb-3">Chapter 0{i + 1} / 0{branches.length}</div>
              <h2 className="font-display text-4xl md:text-6xl font-extrabold text-white">{b.name}</h2>
              <div className="text-sm text-[#B6F2A0] mt-1">{b.tagline}</div>
              <p className="mt-5 text-white/80 leading-relaxed max-w-lg">{b.description}</p>
              {b.facilities.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {b.facilities.slice(0, 5).map((f) => (
                    <span key={f} className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs">{f}</span>
                  ))}
                </div>
              )}
              <button onClick={() => navigate('branch-detail', b.slug)} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFD500] text-[#06130B] font-bold text-sm hover:bg-[#FFE24D] transition">
                View branch details <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="w-full md:w-1/2">
              {b.videoTourUrl ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40">
                  <LazyVideo
                    src={b.videoTourUrl}
                    poster={b.videoPoster || b.coverImage || undefined}
                    className="absolute inset-0 h-full w-full"
                    title={b.name}
                  />
                </div>
              ) : (
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                  {b.coverImage && <img src={b.coverImage} alt={b.name} className="h-full w-full object-cover" />}
                  <div className="absolute inset-0 grid place-items-center">
                    <Play className="h-12 w-12 text-white/80" fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Campus selector rail */}
      <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-2">
        {branches.map((b, i) => (
          <button
            key={b.id}
            onClick={() => {
              setActive(i)
              document.getElementById(`chapter-${b.slug}`)?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group flex items-center gap-2"
            title={b.name}
          >
            <span className={`h-2.5 rounded-full transition-all ${i === active ? 'w-8 bg-[#FFD500]' : 'w-2.5 bg-white/40'}`} />
          </button>
        ))}
      </div>
    </PageShell>
  )
}
