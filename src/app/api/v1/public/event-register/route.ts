import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { apiSuccess, apiError, formatZodError } from '@/lib/api-response'

const Schema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional(),
  count: z.number().int().min(1).max(20).default(1),
  note: z.string().max(2000).optional(),
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
  if (!parsed.success) return apiError(formatZodError(parsed.error), 422)
  const { website, ...data } = parsed.data
  const reg = await db.eventRegistration.create({ data })
  return apiSuccess({ id: reg.id }, undefined, 201)
}
