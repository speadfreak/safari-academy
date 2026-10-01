import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { apiSuccess, apiError } from '@/lib/api-response'
import { setSetting } from '@/lib/settings'
import { extractMapSrc } from '@/lib/utils'

/** GET /api/v1/admin/settings — All settings grouped. */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const rows = await db.setting.findMany({ orderBy: { group: 'asc' } })
  const grouped: Record<string, Record<string, string>> = {}
  for (const r of rows) {
    grouped[r.group] ??= {}
    grouped[r.group][r.key] = r.value
  }
  return apiSuccess(grouped)
}

/** PUT /api/v1/admin/settings — Bulk update settings { [key]: value }. */
export async function PUT(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return apiError('Unauthorized', 401)
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return apiError('Invalid JSON', 400)
  }
  for (const [key, value] of Object.entries(body)) {
    // Validate the map embed URL if present.
    if (key === 'mapEmbedUrl') {
      const src = extractMapSrc(value)
      await setSetting(key, src ?? '', 'contact')
      continue
    }
    await setSetting(key, String(value), 'general')
  }
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'Setting', summary: `Updated ${Object.keys(body).length} settings` } })
  return apiSuccess({ updated: Object.keys(body).length })
}
