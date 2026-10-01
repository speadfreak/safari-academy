import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { apiSuccess, apiError } from '@/lib/api-response'
import { db } from '@/lib/db'
import path from 'node:path'
import fs from 'node:fs/promises'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf', 'video/mp4']

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return apiError('No file uploaded', 400)
  if (file.size > 12 * 1024 * 1024) return apiError('File too large (max 12MB)', 413)
  if (!ALLOWED.includes(file.type)) return apiError(`Mime type ${file.type} not allowed`, 415)

  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  const ext = path.extname(file.name) || `.${file.type.split('/')[1]}`
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
  const dest = path.join(UPLOAD_DIR, safeName)
  const buf = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(dest, buf)
  const url = `/uploads/${safeName}`

  const asset = await db.mediaAsset.create({ data: {
    url, filename: file.name, mime: file.type, size: file.size,
  }})
  return apiSuccess(asset, undefined, 201)
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const items = await db.mediaAsset.findMany({ take: 100, orderBy: { createdAt: 'desc' } })
  return apiSuccess(items)
}
