import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getSettings } from '@/lib/settings'
import { apiSuccess } from '@/lib/api-response'
import { parseJSON } from '@/lib/utils'

/** GET /api/v1/public/bootstrap — All content needed for initial SPA load. */
export async function GET(_req: NextRequest) {
  const [
    settings,
    heroSlides,
    homeSections,
    branches,
    news,
    events,
    galleryItems,
    galleryCategories,
    alumni,
    testimonials,
    achievements,
    partners,
    faqs,
    policies,
    teamLeadership,
    teamStaff,
    timeline,
    features,
    programs,
    facilities,
    admissionSteps,
    admissionRequirements,
    importantDates,
    scholarships,
    feeTables,
    legalPages,
  ] = await Promise.all([
    getSettings(),
    db.heroSlide.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
    db.homeSection.findMany({ orderBy: { order: 'asc' } }),
    db.branch.findMany({ where: { visible: true }, orderBy: { order: 'asc' }, include: { images: { orderBy: { order: 'asc' } } } }),
    db.newsPost.findMany({ where: { status: 'published' }, orderBy: { publishedAt: 'desc' } }),
    db.event.findMany({ orderBy: { startDateTime: 'asc' }, include: { _count: { select: { registrations: true } } } }),
    db.galleryItem.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
    db.galleryCategory.findMany({ orderBy: { order: 'asc' } }),
    db.alumniProfile.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
    db.testimonial.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
    db.achievement.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
    db.partner.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
    db.faq.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
    db.policyDocument.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
    db.teamMember.findMany({ where: { type: 'LEADERSHIP', visible: true }, orderBy: { order: 'asc' } }),
    db.teamMember.findMany({ where: { type: 'STAFF', visible: true }, orderBy: { order: 'asc' } }),
    db.timelineMilestone.findMany({ orderBy: { order: 'asc' } }),
    db.feature.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
    db.program.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
    db.facilityItem.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
    db.admissionStep.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
    db.admissionRequirement.findMany({ orderBy: { order: 'asc' } }),
    db.importantDate.findMany({ orderBy: { order: 'asc' } }),
    db.scholarship.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
    db.feeTable.findMany({ where: { published: true }, orderBy: { order: 'asc' }, include: { columns: { orderBy: { order: 'asc' } }, rows: { orderBy: { order: 'asc' } } } }),
    db.legalPage.findMany(),
  ])

  const normalize = <T extends Record<string, any>>(rows: T[], keys: string[]) =>
    rows.map((r) => {
      const out: Record<string, unknown> = { ...r }
      for (const k of keys) {
        if (k in r) out[k] = parseJSON(r[k], Array.isArray(r[k]) ? r[k] : null)
      }
      return out as T
    })

  return apiSuccess({
    settings,
    heroSlides,
    homeSections,
    branches: branches.map((b) => ({
      ...b,
      facilities: parseJSON<string[]>(b.facilities, []),
      stats: parseJSON<Record<string, number>>(b.stats, {}),
    })),
    news: normalize(news as any, ['gallery', 'tags']),
    events: normalize(events as any, ['gallery']),
    galleryItems,
    galleryCategories,
    alumni,
    testimonials,
    achievements,
    partners,
    faqs,
    policies,
    teamLeadership,
    teamStaff,
    timeline,
    features,
    programs: normalize(programs as any, ['subjects', 'goals']),
    facilities: normalize(facilities as any, ['images']),
    admissionSteps,
    admissionRequirements: normalize(admissionRequirements as any, ['items']),
    importantDates,
    scholarships,
    feeTables: feeTables.map((t) => ({
      ...t,
      rows: t.rows.map((r) => ({ ...r, cells: parseJSON<string[]>(r.cells, []) })),
    })),
    legalPages,
  })
}
