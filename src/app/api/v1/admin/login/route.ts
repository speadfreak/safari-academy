import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'
import { signToken } from '@/lib/auth'
import { SESSION_COOKIE } from '@/lib/session'
import { apiSuccess, apiError, formatZodError } from '@/lib/api-response'

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return apiError('Invalid JSON body', 400)
  }
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return apiError(formatZodError(parsed.error), 422)

  const user = await db.user.findUnique({ where: { email: parsed.data.email } })
  if (!user || !user.active) {
    return apiError('Invalid credentials', 401)
  }
  const ok = await verifyPassword(parsed.data.password, user.passwordHash)
  if (!ok) {
    return apiError('Invalid credentials', 401)
  }

  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
  await db.auditLog.create({ data: { userId: user.id, action: 'LOGIN', entity: 'User', entityId: user.id, summary: `${user.email} logged in` } })

  const token = await signToken({ sub: user.id, role: user.role, email: user.email })

  const res = apiSuccess({ id: user.id, email: user.email, name: user.name, role: user.role, mustChangePw: user.mustChangePw })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
