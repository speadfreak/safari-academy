import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { apiSuccess, apiError, formatZodError } from '@/lib/api-response'

const Schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional(),
  gradYear: z.string().max(20),
  program: z.string().max(120).optional(),
  message: z.string().max(5000).optional(),
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
  const app = await db.alumniApplication.create({ data })
  return apiSuccess({ id: app.id }, undefined, 201)
}
