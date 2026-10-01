import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export const apiSuccess = <T>(data: T, meta?: Record<string, unknown>, status = 200) =>
  NextResponse.json({ success: true, data, meta }, { status })

export const apiError = (error: string, status = 400, meta?: Record<string, unknown>) =>
  NextResponse.json({ success: false, error, meta }, { status })

export function formatZodError(e: ZodError) {
  return e.issues.map((i) => `${i.path.join('.') || 'value'}: ${i.message}`).join('; ')
}
