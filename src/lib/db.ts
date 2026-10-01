import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Single shared PrismaClient instance.
 *
 * IMPORTANT for Vercel / serverless:
 * We MUST cache the client on `globalThis` in ALL environments (including
 * production). Without this, every serverless function invocation would create
 * a NEW PrismaClient, quickly exhausting the database connection pool and
 * causing "Too many connections" errors — which manifest as the site hanging
 * on the loading screen.
 *
 * Query logging is disabled in production to keep serverless logs clean and
 * avoid the overhead of serializing every query.
 */
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error'],
  })

if (!globalForPrisma.prisma) globalForPrisma.prisma = db
