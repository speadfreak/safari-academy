import path from 'node:path'
import fs from 'node:fs/promises'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

const ALLOWED = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/pdf', 'video/mp4',
]
const MAX_SIZE = 12 * 1024 * 1024 // 12MB

export interface UploadResult { url: string; filename: string; mime: string; size: number }

/**
 * Upload a file to Vercel Blob if BLOB_READ_WRITE_TOKEN is set,
 * otherwise fall back to writing to /public/uploads (local dev only).
 */
export async function uploadFile(file: File): Promise<UploadResult> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error(`Mime type ${file.type} not allowed`)
  }
  if (file.size > MAX_SIZE) {
    throw new Error('File too large (max 12MB)')
  }

  const ext = path.extname(file.name) || `.${file.type.split('/')[1]}`
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`

  // ---- Vercel Blob (production) ----
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob')
    const blob = await put(safeName, file, {
      access: 'public',
      addRandomSuffix: false,
    })
    return { url: blob.url, filename: file.name, mime: file.type, size: file.size }
  }

  // ---- Local disk fallback (dev only) ----
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  const dest = path.join(UPLOAD_DIR, safeName)
  const buf = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(dest, buf)
  return { url: `/uploads/${safeName}`, filename: file.name, mime: file.type, size: file.size }
}
