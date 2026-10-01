import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/session'
import { apiSuccess } from '@/lib/api-response'

export async function POST() {
  const res = apiSuccess({ ok: true })
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
