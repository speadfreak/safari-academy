import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return apiError('Unauthorized', 401)
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  // Update basic fields
  const t = await db.feeTable.update({ where: { id }, data: {
    title: body.title, academicYear: body.academicYear, note: body.note, currency: body.currency,
    pdfUrl: body.pdfUrl, published: body.published, order: body.order ?? 0,
  }})
  // If columns/rows arrays provided, replace them
  if (Array.isArray(body.columns)) {
    await db.feeColumn.deleteMany({ where: { tableId: id } })
    for (const [i, c] of body.columns.entries()) {
      await db.feeColumn.create({ data: { tableId: id, label: c.label ?? String(c), order: c.order ?? i } })
    }
  }
  if (Array.isArray(body.rows)) {
    await db.feeRow.deleteMany({ where: { tableId: id } })
    for (const [i, r] of body.rows.entries()) {
      await db.feeRow.create({ data: { tableId: id, label: r.label, cells: JSON.stringify(r.cells || []), highlight: !!r.highlight, order: r.order ?? i } })
    }
  }
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'FeeTable', entityId: id, summary: `Updated fee table: ${t.title}` } })
  return apiSuccess(t)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return apiError('Unauthorized', 401)
  const { id } = await params
  await db.feeTable.delete({ where: { id } })
  await db.auditLog.create({ data: { userId: user.id, action: 'DELETE', entity: 'FeeTable', entityId: id, summary: `Deleted fee table` } })
  return apiSuccess({ id })
}
