/**
 * Standalone seed runner — used by `bun run db:seed` / `npx tsx prisma/seed-runner.ts`.
 *
 * This file is separate from `prisma/seed.ts` so that `scripts/vercel-setup.ts`
 * can import `{ seedDatabase }` without triggering a double-run.
 *
 * `seedDatabase()` is safe to call on any database: it no-ops if users already
 * exist (never deletes existing data on a populated DB).
 */
import { PrismaClient } from '@prisma/client'
import { seedDatabase } from './seed'

const db = new PrismaClient()

seedDatabase()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
