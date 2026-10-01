import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

const SECRET = process.env.JWT_SECRET || 'safari-academy-dev-secret-change-in-production-2026'

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
    .sign(encoder.encode(SECRET))
}

export async function verifyToken<T = Record<string, unknown>>(token: string) {
  const { payload } = await jwtVerify(token, encoder.encode(SECRET))
  return payload as T
}
