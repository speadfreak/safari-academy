import { cookies } from 'next/headers'
import { db } from './db'
import { verifyToken } from './auth'

export const SESSION_COOKIE = 'safari_session'

export async function getCurrentUser() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  try {
    const payload = await verifyToken<{ sub: string; role: string }>(token)
    const user = await db.user.findUnique({ where: { id: payload.sub } })
    if (!user || !user.active) return null
    return user
  } catch {
    return null
  }
}

export function requireRole(user: { role: string } | null, roles: string[]) {
  if (!user || !roles.includes(user.role)) {
    throw new Error('Unauthorized')
  }
}
