'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Newspaper, Calendar, ArrowRight, ChevronLeft, Share2, Clock, Copy, MessageCircle, Send, Facebook, Twitter } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageShell } from '../page-shell'
import { formatDate, formatDateTime, truncate } from '@/lib/utils'
import { toast } from 'sonner'

export function NewsListPage() {
  const { data, navigate } = useStore()
  const news = data?.news || []
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const cats = ['All', ...Array.from(new Set(news.map((n) => n.category).filter(Boolean) as string[]))]
  const filtered = news.filter((n) => (cat === 'All' || n.category === cat) && (!q || n.title.toLowerCase().includes(q.toLowerCase())))
  const featured = news.find((n) => n.featured) || news[0]
  const rest = filtered.filter((n) => n.id !== featured?.id)

  return (
    <PageShell
      eyebrow="News & Stories"
      title={<>The latest from <span className="text-gradient-yellow-green">Safari</span>.</>}
      subtitle="Stories, announcements, and achievements from across our eight campuses."
      crumbs={[{ label: 'News' }]}
    >
      <section className="py-20 md:py-28">
        <div className="container-cinematic">
          {/* Featured */}
          {featured && cat === 'All' && !q && (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => navigate('news-detail', featured.slug)}
              className="group cursor-pointer grid md:grid-cols-2 gap-8 mb-14 overflow-hidden rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition"
            >
              <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.coverImage || ''} alt={featured.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-widest mb-3">
                  <Newspaper className="h-3.5 w-3.5" /> Featured Story
                </div>
                <h2 className="font-display text-2xl md:text-4xl font-extrabold leading-tight group-hover:text-primary transition">{featured.title}</h2>
                <p className="mt-4 text-foreground/70">{featured.excerpt}</p>
                <div className="mt-6 flex items-center gap-3 text-xs text-foreground/60">
                  <span>{featured.author}</span><span>•</span>
                  <span>{formatDate(featured.publishedAt)}</span>
                  {featured.readingTime && <><span>•</span><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featured.readingTime} min</span></>}
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-primary font-semibold text-sm">
                  Read story <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.article>
          )}

          {/* Filter + search */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${cat === c ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:border-primary/40'}`}>{c}</button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9 pr-3 py-2 rounded-full bg-background border border-border focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none text-sm w-56" />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((n, i) => (
              <motion.article
                key={n.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate('news-detail', n.slug)}
                className="group cursor-pointer overflow-hidden rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={n.coverImage || ''} alt={n.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-foreground/60 mb-2">
                    <Newspaper className="h-3.5 w-3.5 text-primary" />{n.category}<span>•</span>{formatDate(n.publishedAt)}
                  </div>
                  <h3 className="font-display text-lg font-bold leading-snug group-hover:text-primary transition line-clamp-2">{n.title}</h3>
                  <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{n.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>
          {!rest.length && <div className="text-center py-20 text-foreground/60">No stories found.</div>}
        </div>
      </section>
    </PageShell>
  )
}

export function NewsDetailPage() {
  const { data, navigate, route } = useStore()
  const slug = route.param
  const news = data?.news || []
  const post = news.find((n) => n.slug === slug)
  const related = news.filter((n) => n.id !== post?.id && n.category === post?.category).slice(0, 3)
  const idx = news.findIndex((n) => n.id === post?.id)
  const prev = idx > 0 ? news[idx - 1] : null
  const nextN = idx >= 0 && idx < news.length - 1 ? news[idx + 1] : null

  if (!post) {
    return (
      <PageShell eyebrow="Not Found" title="Story not found" crumbs={[{ label: 'News' }]}>
        <div className="container-cinematic py-20 text-center">
          <p className="text-foreground/70 mb-6">We couldn't find that story.</p>
          <button onClick={() => navigate('news')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
            <ChevronLeft className="h-4 w-4" /> Back to News
          </button>
        </div>
      </PageShell>
    )
  }

  const copyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <article>
      {/* Reading progress */}
      <ReadingProgress />

      {/* Cover */}
      <section className="relative h-[60vh] min-h-[440px] overflow-hidden bg-[#06130B]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.coverImage || ''} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06130B] via-[#06130B]/50 to-transparent" />
        <div className="relative container-cinematic pt-32 pb-12 h-full flex flex-col justify-end text-white">
          <button onClick={() => navigate('news')} className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-[#FFE24D] mb-4 w-fit">
            <ChevronLeft className="h-3.5 w-3.5" /> Back to News
          </button>
          <div className="flex items-center gap-3 text-xs text-[#FFE24D] uppercase tracking-widest mb-3">
            <Newspaper className="h-3.5 w-3.5" />{post.category}
          </div>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-4xl">{post.title}</h1>
          <div className="mt-5 flex items-center gap-3 text-sm text-white/70">
            <span>{post.author}</span><span>•</span><span>{formatDate(post.publishedAt)}</span>
            {post.readingTime && <><span>•</span><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readingTime} min read</span></>}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 md:py-20">
        <div className="container-cinematic max-w-3xl">
          {post.excerpt && <p className="text-lg md:text-xl text-foreground/80 mb-8 font-medium leading-relaxed">{post.excerpt}</p>}
          <div
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((t) => <span key={t} className="px-3 py-1 rounded-full bg-secondary/60 text-secondary-foreground text-xs">#{t}</span>)}
            </div>
          )}

          {/* Share */}
          <div className="mt-10 p-5 rounded-2xl bg-card border border-border/60 flex items-center gap-3 flex-wrap">
            <Share2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">Share:</span>
            <button onClick={copyLink} className="grid place-items-center h-9 w-9 rounded-full bg-background hover:bg-accent/40 transition" title="Copy link"><Copy className="h-4 w-4" /></button>
            <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`} target="_blank" rel="noopener noreferrer" className="grid place-items-center h-9 w-9 rounded-full bg-background hover:bg-accent/40 transition" title="WhatsApp"><MessageCircle className="h-4 w-4" /></a>
            <a href={`https://t.me/share/url?url=${typeof window !== 'undefined' ? window.location.href : ''}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="grid place-items-center h-9 w-9 rounded-full bg-background hover:bg-accent/40 transition" title="Telegram"><Send className="h-4 w-4" /></a>
            <a href={`https://facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer" className="grid place-items-center h-9 w-9 rounded-full bg-background hover:bg-accent/40 transition" title="Facebook"><Facebook className="h-4 w-4" /></a>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="grid place-items-center h-9 w-9 rounded-full bg-background hover:bg-accent/40 transition" title="X"><Twitter className="h-4 w-4" /></a>
          </div>

          {/* Prev/Next */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            {prev && (
              <button onClick={() => navigate('news-detail', prev.slug)} className="text-left p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition">
                <div className="text-xs text-foreground/60 flex items-center gap-1"><ChevronLeft className="h-3 w-3" /> Previous</div>
                <div className="font-semibold mt-1 line-clamp-1">{prev.title}</div>
              </button>
            )}
            {nextN && (
              <button onClick={() => navigate('news-detail', nextN.slug)} className="text-right p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition col-start-2">
                <div className="text-xs text-foreground/60 flex items-center justify-end gap-1">Next <ArrowRight className="h-3 w-3" /></div>
                <div className="font-semibold mt-1 line-clamp-1">{nextN.title}</div>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 md:py-20 bg-accent/15">
          <div className="container-cinematic">
            <h2 className="font-display text-2xl md:text-4xl font-extrabold mb-8">Related <span className="text-gradient-yellow-green">stories</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((n) => (
                <article key={n.id} onClick={() => navigate('news-detail', n.slug)} className="group cursor-pointer overflow-hidden rounded-3xl bg-card border border-border/60 hover:border-primary/40 transition">
                  <div className="aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={n.coverImage || ''} alt={n.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-foreground/60 mb-1">{formatDate(n.publishedAt)}</div>
                    <h3 className="font-display text-base font-bold leading-snug group-hover:text-primary transition line-clamp-2">{n.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}

function ReadingProgress() {
  return null // Simplified — could add scroll progress bar specific to article
}
