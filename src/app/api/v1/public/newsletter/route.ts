import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { apiSuccess, apiError, formatZodError } from '@/lib/api-response'

const Schema = z.object({
  email: z.string().email().max(160),
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
  const sub = await db.subscriber.upsert({
    where: { email: parsed.data.email },
    update: {},
    create: { email: parsed.data.email },
  })
  return apiSuccess({ id: sub.id }, undefined, 201)
}
