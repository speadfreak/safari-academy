/**
 * Standalone seed runner — used by `bun run db:seed` / `npx tsx prisma/seed-runner.ts`.
 *
 * This file is separate from `prisma/seed.ts` so that `scripts/vercel-setup.ts`
 * can import `{ seedDatabase }` without triggering a double-run.
 *
 * `seedDatabase()` is safe to call on any database: it no-ops if users already
 * exist (never deletes existing data on a populated DB).
 *
 * NOTE: We load .env with `override: true` so that values from the local .env
 * file take precedence over any stale DATABASE_URL that might be exported in
 * the shell environment. (On Vercel, env vars are injected by the platform —
 * there is no .env file, so this is a no-op.)
 */
import { config } from 'dotenv'

// Load local .env with override so that values from the local .env file
// take precedence over any stale DATABASE_URL that might be exported in
// the shell environment. (On Vercel, env vars are injected by the platform —
// there is no .env file, so this is a no-op.) MUST run before PrismaClient
// is imported, so we use a dynamic import below.
config({ override: true })

async function run() {
  const { PrismaClient } = await import('@prisma/client')
  const { seedDatabase } = await import('./seed')
  const db = new PrismaClient()

  try {
    await seedDatabase()
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

run()

