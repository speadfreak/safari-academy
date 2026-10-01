'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { useStore } from '@/lib/store'

interface Crumb { label: string }
interface Props {
  eyebrow?: string
  title: ReactNode
  subtitle?: string
  image?: string | null
  crumbs?: Crumb[]
  children: ReactNode
  dark?: boolean
}

export function PageHero({ eyebrow, title, subtitle, image, crumbs, dark }: Omit<Props, 'children'>) {
  const { navigate } = useStore()
  return (
    <section className={`relative overflow-hidden ${dark ? 'bg-[#06130B] text-white' : 'bg-gradient-to-b from-accent/30 to-background'}`}>
      <div className="absolute inset-0 -z-10">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-full w-full object-cover opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
      </div>
      <div className="aurora-blob" style={{ width: 320, height: 320, top: '-5%', right: '5%', background: '#FFD500' }} />
      <div className="container-cinematic pt-32 md:pt-40 pb-14 md:pb-20">
        {crumbs && (
          <nav className="flex items-center gap-1.5 text-xs text-foreground/60 mb-5">
            <button onClick={() => navigate('home')} className="hover:text-primary">Home</button>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground/80">{c.label}</span>
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-block text-xs font-semibold uppercase tracking-widest ${dark ? 'text-[#FFE24D]' : 'text-primary'} mb-3`}
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter max-w-4xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className={`mt-5 text-base md:text-xl max-w-2xl ${dark ? 'text-white/80' : 'text-foreground/70'}`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}

export function PageShell({ children, ...heroProps }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PageHero {...heroProps} />
      <div>{children}</div>
    </motion.div>
  )
}
