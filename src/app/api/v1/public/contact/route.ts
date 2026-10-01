import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { apiSuccess, apiError, formatZodError } from '@/lib/api-response'

const Schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional(),
  subject: z.string().max(160).optional(),
  campus: z.string().max(120).optional(),
  message: z.string().min(5).max(5000),
  /** honeypot — must be empty */
  website: z.string().max(0).optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return apiError('Invalid JSON body', 400)
  }
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return apiError(formatZodError(parsed.error), 422)
  }
  const { website, ...data } = parsed.data
  const msg = await db.contactMessage.create({ data })
  return apiSuccess({ id: msg.id }, undefined, 201)
}
