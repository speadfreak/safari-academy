import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const tables = await db.feeTable.findMany({ orderBy: { order: 'asc' }, include: { columns: { orderBy: { order: 'asc' } }, rows: { orderBy: { order: 'asc' } } } })
  return apiSuccess(tables.map((t) => ({ ...t, rows: t.rows.map((r) => ({ ...r, cells: JSON.parse(r.cells || '[]') })) })))
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return apiError('Unauthorized', 401)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const t = await db.feeTable.create({ data: {
    title: body.title, academicYear: body.academicYear, note: body.note ?? null,
    currency: body.currency ?? 'ETB', pdfUrl: body.pdfUrl ?? null, published: body.published ?? true, order: body.order ?? 0,
  }})
  // Create columns and rows if provided
  if (Array.isArray(body.columns)) {
    for (const [i, c] of body.columns.entries()) {
      await db.feeColumn.create({ data: { tableId: t.id, label: c.label ?? c, order: c.order ?? i } })
    }
  }
  if (Array.isArray(body.rows)) {
    for (const [i, r] of body.rows.entries()) {
      await db.feeRow.create({ data: { tableId: t.id, label: r.label, cells: JSON.stringify(r.cells || []), highlight: !!r.highlight, order: r.order ?? i } })
    }
  }
  await db.auditLog.create({ data: { userId: user.id, action: 'CREATE', entity: 'FeeTable', entityId: t.id, summary: `Created fee table: ${t.title}` } })
  return apiSuccess(t, undefined, 201)
}
