import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === 'production') {
      // In production we MUST have a real secret — never fall back to a hardcoded one.
      throw new Error('JWT_SECRET environment variable is required in production (use a long random string).')
    }
    // Dev-only fallback so local development works without configuration.
    console.warn('⚠️  JWT_SECRET not set — using insecure dev fallback. Do NOT use in production.')
    return 'safari-academy-dev-secret-change-in-production-2026'
  }
  return secret
}

const encoder = new TextEncoder()

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10)
}

export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash)
}

export async function signToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encoder.encode(getSecret()))
}

export async function verifyToken<T = Record<string, unknown>>(token: string) {
  const { payload } = await jwtVerify(token, encoder.encode(getSecret()))
  return payload as T
}
