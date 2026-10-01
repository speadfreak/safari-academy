import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { apiSuccess, apiError } from '@/lib/api-response'
import { slugify } from '@/lib/utils'

// ============================================================
// NEWS
// ============================================================
export async function newsList() {
  const items = await db.newsPost.findMany({ orderBy: { createdAt: 'desc' } })
  return apiSuccess(items)
}
export async function newsCreate(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const slug = body.slug?.trim() || slugify(body.title)
  const post = await db.newsPost.create({
    data: {
      title: body.title,
      slug,
      excerpt: body.excerpt ?? null,
      body: body.body ?? '',
      coverImage: body.coverImage ?? null,
      gallery: body.gallery ? JSON.stringify(body.gallery) : null,
      category: body.category ?? null,
      tags: body.tags ? JSON.stringify(body.tags) : null,
      author: body.author ?? user.name,
      status: body.status ?? 'draft',
      featured: !!body.featured,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      readingTime: body.readingTime ?? null,
    },
  })
  await db.auditLog.create({ data: { userId: user.id, action: 'CREATE', entity: 'NewsPost', entityId: post.id, summary: `Created news: ${post.title}` } })
  return apiSuccess(post, undefined, 201)
}
export async function newsUpdate(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const data: any = { ...body }
  if (body.gallery) data.gallery = JSON.stringify(body.gallery)
  if (body.tags) data.tags = JSON.stringify(body.tags)
  if (body.publishedAt) data.publishedAt = new Date(body.publishedAt)
  if (body.slug === '') delete data.slug
  const post = await db.newsPost.update({ where: { id }, data })
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'NewsPost', entityId: id, summary: `Updated news: ${post.title}` } })
  return apiSuccess(post)
}
export async function newsDelete(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  await db.newsPost.delete({ where: { id } })
  await db.auditLog.create({ data: { userId: user.id, action: 'DELETE', entity: 'NewsPost', entityId: id, summary: `Deleted news ${id}` } })
  return apiSuccess({ id })
}

// ============================================================
// EVENTS
// ============================================================
export async function eventsList() {
  const items = await db.event.findMany({ orderBy: { startDateTime: 'desc' } })
  return apiSuccess(items)
}
export async function eventsCreate(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const slug = body.slug?.trim() || slugify(body.title)
  const ev = await db.event.create({
    data: {
      title: body.title,
      slug,
      excerpt: body.excerpt ?? null,
      body: body.body ?? '',
      coverImage: body.coverImage ?? null,
      gallery: body.gallery ? JSON.stringify(body.gallery) : null,
      startDateTime: new Date(body.startDateTime),
      endDateTime: body.endDateTime ? new Date(body.endDateTime) : null,
      venue: body.venue ?? null,
      branchId: body.branchId ?? null,
      category: body.category ?? null,
      status: body.status ?? 'upcoming',
      featured: !!body.featured,
      registrationOpen: !!body.registrationOpen,
      mapEmbedUrl: body.mapEmbedUrl ?? null,
    },
  })
  await db.auditLog.create({ data: { userId: user.id, action: 'CREATE', entity: 'Event', entityId: ev.id, summary: `Created event: ${ev.title}` } })
  return apiSuccess(ev, undefined, 201)
}
export async function eventsUpdate(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const data: any = { ...body }
  if (body.gallery) data.gallery = JSON.stringify(body.gallery)
  if (body.startDateTime) data.startDateTime = new Date(body.startDateTime)
  if (body.endDateTime) data.endDateTime = new Date(body.endDateTime)
  const ev = await db.event.update({ where: { id }, data })
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'Event', entityId: id, summary: `Updated event: ${ev.title}` } })
  return apiSuccess(ev)
}
export async function eventsDelete(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  await db.event.delete({ where: { id } })
  await db.auditLog.create({ data: { userId: user.id, action: 'DELETE', entity: 'Event', entityId: id, summary: `Deleted event ${id}` } })
  return apiSuccess({ id })
}

// ============================================================
// BRANCHES
// ============================================================
export async function branchesList() {
  const items = await db.branch.findMany({ orderBy: { order: 'asc' }, include: { images: { orderBy: { order: 'asc' } } } })
  return apiSuccess(items)
}
export async function branchesCreate(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return apiError('Unauthorized', 401)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const slug = body.slug?.trim() || slugify(body.name)
  const b = await db.branch.create({
    data: {
      name: body.name,
      slug,
      tagline: body.tagline ?? null,
      description: body.description ?? '',
      address: body.address ?? null,
      phone: body.phone ?? null,
      email: body.email ?? null,
      principal: body.principal ?? null,
      grades: body.grades ?? null,
      facilities: body.facilities ? JSON.stringify(body.facilities) : null,
      stats: body.stats ? JSON.stringify(body.stats) : null,
      mapEmbedUrl: body.mapEmbedUrl ?? null,
      videoTourUrl: body.videoTourUrl ?? null,
      videoPoster: body.videoPoster ?? null,
      panorama360: body.panorama360 ?? null,
      coverImage: body.coverImage ?? null,
      order: body.order ?? 0,
      visible: body.visible ?? true,
      featured: body.featured ?? false,
    },
  })
  await db.auditLog.create({ data: { userId: user.id, action: 'CREATE', entity: 'Branch', entityId: b.id, summary: `Created branch: ${b.name}` } })
  return apiSuccess(b, undefined, 201)
}
export async function branchesUpdate(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return apiError('Unauthorized', 401)
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const data: any = { ...body }
  if (body.facilities) data.facilities = JSON.stringify(body.facilities)
  if (body.stats) data.stats = JSON.stringify(body.stats)
  if (body.slug === '') delete data.slug
  const b = await db.branch.update({ where: { id }, data })
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'Branch', entityId: id, summary: `Updated branch: ${b.name}` } })
  return apiSuccess(b)
}
export async function branchesDelete(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return apiError('Unauthorized', 401)
  const { id } = await params
  await db.branch.delete({ where: { id } })
  await db.auditLog.create({ data: { userId: user.id, action: 'DELETE', entity: 'Branch', entityId: id, summary: `Deleted branch ${id}` } })
  return apiSuccess({ id })
}

// ============================================================
// HERO SLIDES
// ============================================================
export async function heroList() {
  const items = await db.heroSlide.findMany({ orderBy: { order: 'asc' } })
  return apiSuccess(items)
}
export async function heroCreate(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return apiError('Unauthorized', 401)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const h = await db.heroSlide.create({ data: {
    title: body.title, subtitle: body.subtitle ?? '', mediaType: body.mediaType ?? 'image',
    mediaUrl: body.mediaUrl ?? '', posterUrl: body.posterUrl ?? null, ctaLabel: body.ctaLabel ?? null,
    ctaLink: body.ctaLink ?? null, cta2Label: body.cta2Label ?? null, cta2Link: body.cta2Link ?? null,
    overlay: body.overlay ?? 40, order: body.order ?? 0, visible: body.visible ?? true,
  }})
  await db.auditLog.create({ data: { userId: user.id, action: 'CREATE', entity: 'HeroSlide', entityId: h.id, summary: `Created hero slide: ${h.title}` } })
  return apiSuccess(h, undefined, 201)
}
export async function heroUpdate(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return apiError('Unauthorized', 401)
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const h = await db.heroSlide.update({ where: { id }, data: body })
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'HeroSlide', entityId: id, summary: `Updated hero slide: ${h.title}` } })
  return apiSuccess(h)
}
export async function heroDelete(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return apiError('Unauthorized', 401)
  const { id } = await params
  await db.heroSlide.delete({ where: { id } })
  await db.auditLog.create({ data: { userId: user.id, action: 'DELETE', entity: 'HeroSlide', entityId: id, summary: `Deleted hero slide ${id}` } })
  return apiSuccess({ id })
}

// ============================================================
// GALLERY
// ============================================================
export async function galleryList() {
  const items = await db.galleryItem.findMany({ orderBy: { order: 'asc' } })
  return apiSuccess(items)
}
export async function galleryCreate(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const g = await db.galleryItem.create({ data: {
    title: body.title ?? null, caption: body.caption ?? null, type: body.type ?? 'image',
    url: body.url ?? '', poster: body.poster ?? null, category: body.category ?? 'Campus',
    branchId: body.branchId ?? null, featured: !!body.featured, order: body.order ?? 0, visible: body.visible ?? true,
  }})
  await db.auditLog.create({ data: { userId: user.id, action: 'CREATE', entity: 'GalleryItem', entityId: g.id, summary: `Created gallery item` } })
  return apiSuccess(g, undefined, 201)
}
export async function galleryUpdate(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const g = await db.galleryItem.update({ where: { id }, data: body })
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'GalleryItem', entityId: id, summary: `Updated gallery item` } })
  return apiSuccess(g)
}
export async function galleryDelete(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  await db.galleryItem.delete({ where: { id } })
  await db.auditLog.create({ data: { userId: user.id, action: 'DELETE', entity: 'GalleryItem', entityId: id, summary: `Deleted gallery item` } })
  return apiSuccess({ id })
}

// ============================================================
// TEAM (Leadership + Staff)
// ============================================================
export async function teamList() {
  const items = await db.teamMember.findMany({ orderBy: { order: 'asc' } })
  return apiSuccess(items)
}
export async function teamCreate(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const t = await db.teamMember.create({ data: {
    type: body.type ?? 'LEADERSHIP', name: body.name, role: body.role, department: body.department ?? null,
    bio: body.bio ?? null, fullBio: body.fullBio ?? null, education: body.education ?? null,
    yearsOfService: body.yearsOfService ?? null, quote: body.quote ?? null, photo: body.photo ?? null,
    email: body.email ?? null, phone: body.phone ?? null, linkedin: body.linkedin ?? null, twitter: body.twitter ?? null,
    featured: !!body.featured, order: body.order ?? 0, visible: body.visible ?? true,
  }})
  await db.auditLog.create({ data: { userId: user.id, action: 'CREATE', entity: 'TeamMember', entityId: t.id, summary: `Created team member: ${t.name}` } })
  return apiSuccess(t, undefined, 201)
}
export async function teamUpdate(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const t = await db.teamMember.update({ where: { id }, data: body })
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'TeamMember', entityId: id, summary: `Updated team member: ${t.name}` } })
  return apiSuccess(t)
}
export async function teamDelete(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  await db.teamMember.delete({ where: { id } })
  await db.auditLog.create({ data: { userId: user.id, action: 'DELETE', entity: 'TeamMember', entityId: id, summary: `Deleted team member` } })
  return apiSuccess({ id })
}

// ============================================================
// ALUMNI
// ============================================================
export async function alumniList() {
  const items = await db.alumniProfile.findMany({ orderBy: { order: 'asc' } })
  return apiSuccess(items)
}
export async function alumniCreate(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const a = await db.alumniProfile.create({ data: {
    name: body.name, graduationYear: body.graduationYear, currentRole: body.currentRole ?? null,
    company: body.company ?? null, quote: body.quote ?? null, bio: body.bio ?? null, photo: body.photo ?? null,
    sector: body.sector ?? null, linkedin: body.linkedin ?? null, twitter: body.twitter ?? null,
    featured: !!body.featured, order: body.order ?? 0, visible: body.visible ?? true,
  }})
  await db.auditLog.create({ data: { userId: user.id, action: 'CREATE', entity: 'AlumniProfile', entityId: a.id, summary: `Created alumni: ${a.name}` } })
  return apiSuccess(a, undefined, 201)
}
export async function alumniUpdate(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const a = await db.alumniProfile.update({ where: { id }, data: body })
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'AlumniProfile', entityId: id, summary: `Updated alumni: ${a.name}` } })
  return apiSuccess(a)
}
export async function alumniDelete(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  await db.alumniProfile.delete({ where: { id } })
  await db.auditLog.create({ data: { userId: user.id, action: 'DELETE', entity: 'AlumniProfile', entityId: id, summary: `Deleted alumni` } })
  return apiSuccess({ id })
}

// ============================================================
// TESTIMONIALS
// ============================================================
export async function testimonialsList() {
  const items = await db.testimonial.findMany({ orderBy: { order: 'asc' } })
  return apiSuccess(items)
}
export async function testimonialsCreate(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const t = await db.testimonial.create({ data: {
    name: body.name, role: body.role ?? null, quote: body.quote ?? '', rating: body.rating ?? 5,
    avatar: body.avatar ?? null, order: body.order ?? 0, visible: body.visible ?? true,
  }})
  await db.auditLog.create({ data: { userId: user.id, action: 'CREATE', entity: 'Testimonial', entityId: t.id, summary: `Created testimonial: ${t.name}` } })
  return apiSuccess(t, undefined, 201)
}
export async function testimonialsUpdate(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const t = await db.testimonial.update({ where: { id }, data: body })
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'Testimonial', entityId: id, summary: `Updated testimonial: ${t.name}` } })
  return apiSuccess(t)
}
export async function testimonialsDelete(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  await db.testimonial.delete({ where: { id } })
  await db.auditLog.create({ data: { userId: user.id, action: 'DELETE', entity: 'Testimonial', entityId: id, summary: `Deleted testimonial` } })
  return apiSuccess({ id })
}

// ============================================================
// FAQS
// ============================================================
export async function faqsList() {
  const items = await db.faq.findMany({ orderBy: { order: 'asc' } })
  return apiSuccess(items)
}
export async function faqsCreate(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const f = await db.faq.create({ data: {
    question: body.question, answer: body.answer, category: body.category ?? 'General',
    order: body.order ?? 0, visible: body.visible ?? true,
  }})
  await db.auditLog.create({ data: { userId: user.id, action: 'CREATE', entity: 'Faq', entityId: f.id, summary: `Created FAQ` } })
  return apiSuccess(f, undefined, 201)
}
export async function faqsUpdate(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const f = await db.faq.update({ where: { id }, data: body })
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'Faq', entityId: id, summary: `Updated FAQ` } })
  return apiSuccess(f)
}
export async function faqsDelete(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  await db.faq.delete({ where: { id } })
  await db.auditLog.create({ data: { userId: user.id, action: 'DELETE', entity: 'Faq', entityId: id, summary: `Deleted FAQ` } })
  return apiSuccess({ id })
}

// ============================================================
// LEGAL
// ============================================================
export async function legalList() {
  const items = await db.legalPage.findMany()
  return apiSuccess(items)
}
export async function legalUpsert(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return apiError('Unauthorized', 401)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const page = await db.legalPage.upsert({
    where: { slug: body.slug },
    update: { title: body.title, body: body.body, updatedAt: body.updatedAt ?? new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) },
    create: { slug: body.slug, title: body.title, body: body.body, updatedAt: body.updatedAt ?? new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) },
  })
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'LegalPage', entityId: page.id, summary: `Updated legal: ${page.title}` } })
  return apiSuccess(page)
}

// ============================================================
// INBOX
// ============================================================
export async function inboxList() {
  const [messages, inquiries, subscribers, applications, registrations] = await Promise.all([
    db.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }),
    db.admissionInquiry.findMany({ orderBy: { createdAt: 'desc' } }),
    db.subscriber.findMany({ orderBy: { createdAt: 'desc' } }),
    db.alumniApplication.findMany({ orderBy: { createdAt: 'desc' } }),
    db.eventRegistration.findMany({ orderBy: { createdAt: 'desc' } }),
  ])
  return apiSuccess({ messages, inquiries, subscribers, applications, registrations })
}
export async function messageUpdate(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const m = await db.contactMessage.update({ where: { id }, data: { status: body.status, reply: body.reply ?? undefined } })
  return apiSuccess(m)
}
export async function messageDelete(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const { id } = await params
  await db.contactMessage.delete({ where: { id } })
  return apiSuccess({ id })
}

// ============================================================
// USERS (SUPER_ADMIN only)
// ============================================================
export async function usersList() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'SUPER_ADMIN') return apiError('Unauthorized', 401)
  const users = await db.user.findMany({ orderBy: { createdAt: 'asc' } })
  return apiSuccess(users.map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role, active: u.active, lastLoginAt: u.lastLoginAt, createdAt: u.createdAt, avatar: u.avatar })))
}
export async function userCreate(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'SUPER_ADMIN') return apiError('Unauthorized', 401)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const { hashPassword } = await import('@/lib/auth')
  const existing = await db.user.findUnique({ where: { email: body.email } })
  if (existing) return apiError('Email already in use', 409)
  const u = await db.user.create({ data: {
    email: body.email, name: body.name, role: body.role ?? 'EDITOR',
    passwordHash: await hashPassword(body.password), active: !!body.active, mustChangePw: true,
  }})
  await db.auditLog.create({ data: { userId: user.id, action: 'CREATE', entity: 'User', entityId: u.id, summary: `Created user: ${u.email}` } })
  return apiSuccess({ id: u.id, email: u.email, name: u.name, role: u.role, active: u.active }, undefined, 201)
}
export async function userUpdate(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'SUPER_ADMIN') return apiError('Unauthorized', 401)
  const { id } = await params
  if (id === user.id) return apiError('Cannot edit your own role/active this way', 400)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const data: any = {}
  if (body.name) data.name = body.name
  if (body.role) data.role = body.role
  if (typeof body.active === 'boolean') data.active = body.active
  if (body.password) {
    const { hashPassword } = await import('@/lib/auth')
    data.passwordHash = await hashPassword(body.password)
    data.mustChangePw = true
  }
  const u = await db.user.update({ where: { id }, data })
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'User', entityId: id, summary: `Updated user: ${u.email}` } })
  return apiSuccess({ id: u.id, email: u.email, name: u.name, role: u.role, active: u.active })
}
export async function userDelete(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'SUPER_ADMIN') return apiError('Unauthorized', 401)
  const { id } = await params
  if (id === user.id) return apiError('Cannot delete yourself', 400)
  const superAdmins = await db.user.count({ where: { role: 'SUPER_ADMIN', active: true } })
  const target = await db.user.findUnique({ where: { id } })
  if (target?.role === 'SUPER_ADMIN' && superAdmins <= 1) return apiError('Cannot delete the last super admin', 400)
  await db.user.delete({ where: { id } })
  await db.auditLog.create({ data: { userId: user.id, action: 'DELETE', entity: 'User', entityId: id, summary: `Deleted user ${id}` } })
  return apiSuccess({ id })
}

// ============================================================
// AUDIT LOG
// ============================================================
export async function auditList() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'SUPER_ADMIN') return apiError('Unauthorized', 401)
  const logs = await db.auditLog.findMany({ take: 200, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true, email: true } } } })
  return apiSuccess(logs)
}
