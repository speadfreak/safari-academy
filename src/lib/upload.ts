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
 * Upload a file.
 *
 * - In PRODUCTION: uses Vercel Blob (requires BLOB_READ_WRITE_TOKEN env var).
 *   Vercel's serverless filesystem is READ-ONLY, so local disk is NOT an option.
 * - In DEVELOPMENT: falls back to writing to /public/uploads on local disk
 *   when BLOB_READ_WRITE_TOKEN is not set.
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
  const isProduction = process.env.NODE_ENV === 'production'

  // ---- Vercel Blob (production + optional dev) ----
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob')
    const blob = await put(safeName, file, {
      access: 'public',
      addRandomSuffix: false,
    })
    return { url: blob.url, filename: file.name, mime: file.type, size: file.size }
  }

  // ---- No Blob token ----
  if (isProduction) {
    // Vercel serverless filesystem is READ-ONLY — local disk is impossible.
    // Return a clear, actionable error instead of crashing with ENOENT.
    throw new Error(
      'Image uploads require Vercel Blob. Go to Vercel → your project → Storage → Create a Blob store, ' +
      'then add BLOB_READ_WRITE_TOKEN to your environment variables and redeploy.'
    )
  }

  // ---- Local disk fallback (dev only) ----
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  const dest = path.join(UPLOAD_DIR, safeName)
  const buf = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(dest, buf)
  return { url: `/uploads/${safeName}`, filename: file.name, mime: file.type, size: file.size }
}
