import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { apiSuccess, apiError } from '@/lib/api-response'

/** GET /api/v1/admin/dashboard — Aggregate stats for the admin dashboard. */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)

  const [
    newsCount,
    eventsCount,
    galleryCount,
    inboxCount,
    subscribersCount,
    inquiriesCount,
    alumniApplicationsCount,
    registrationsCount,
    branchesCount,
    teamCount,
    recentMessages,
    recentInquiries,
  ] = await Promise.all([
    db.newsPost.count(),
    db.event.count(),
    db.galleryItem.count(),
    db.contactMessage.count({ where: { status: 'new' } }),
    db.subscriber.count(),
    db.admissionInquiry.count({ where: { status: 'new' } }),
    db.alumniApplication.count({ where: { status: 'new' } }),
    db.eventRegistration.count({ where: { status: 'new' } }),
    db.branch.count(),
    db.teamMember.count(),
    db.contactMessage.findMany({ take: 6, orderBy: { createdAt: 'desc' } }),
    db.admissionInquiry.findMany({ take: 6, orderBy: { createdAt: 'desc' } }),
  ])

  // Build a 7-day inquiries trend.
  const days: { date: string; count: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    const next = new Date(d)
    next.setDate(d.getDate() + 1)
    const count = await db.admissionInquiry.count({ where: { createdAt: { gte: d, lt: next } } })
    days.push({ date: d.toISOString().slice(5, 10), count })
  }

  return apiSuccess({
    stats: {
      news: newsCount,
      events: eventsCount,
      gallery: galleryCount,
      inbox: inboxCount,
      subscribers: subscribersCount,
      inquiries: inquiriesCount,
      alumniApplications: alumniApplicationsCount,
      registrations: registrationsCount,
      branches: branchesCount,
      team: teamCount,
    },
    trend: days,
    recent: {
      messages: recentMessages,
      inquiries: recentInquiries,
    },
  })
}
