import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { apiSuccess, apiError } from '@/lib/api-response'
import { db } from '@/lib/db'
import { uploadFile } from '@/lib/upload'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return apiError('No file uploaded', 400)

  try {
    const result = await uploadFile(file)
    const asset = await db.mediaAsset.create({
      data: {
        url: result.url,
        filename: result.filename,
        mime: result.mime,
        size: result.size,
      },
    })
    return apiSuccess(asset, undefined, 201)
  } catch (e: any) {
    return apiError(e?.message || 'Upload failed', 400)
  }
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  const items = await db.mediaAsset.findMany({ take: 100, orderBy: { createdAt: 'desc' } })
  return apiSuccess(items)
}
