import { getCurrentUser } from '@/lib/session'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return apiError('Unauthorized', 401)
  return apiSuccess({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    lastLoginAt: user.lastLoginAt,
  })
}
