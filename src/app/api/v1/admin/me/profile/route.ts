import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'
import { apiSuccess, apiError } from '@/lib/api-response'
import { hashPassword } from '@/lib/auth'

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid body', 400)
  const data: any = {}
  if (body.name) data.name = body.name
  if (body.email) {
    const existing = await db.user.findFirst({ where: { email: body.email, NOT: { id: user.id } } })
    if (existing) return apiError('Email already in use', 409)
    data.email = body.email
  }
  if (body.password && body.password.length >= 8) {
    data.passwordHash = await hashPassword(body.password)
    data.mustChangePw = false
  }
  const u = await db.user.update({ where: { id: user.id }, data })
  await db.auditLog.create({ data: { userId: user.id, action: 'UPDATE', entity: 'User', entityId: user.id, summary: 'Updated own profile' } })
  return apiSuccess({ id: u.id, email: u.email, name: u.name })
}
