/**
 * scripts/vercel-setup.ts
 *
 * Runs automatically as the first step of every Vercel build
 * (see package.json `build` script):
 *
 *   "build": "tsx scripts/vercel-setup.ts && prisma generate && next build"
 *
 * What it does:
 *   1. Runs `prisma db push` (WITHOUT --accept-data-loss) to create / sync
 *      the database schema against DIRECT_URL.
 *   2. Connects with PrismaClient and counts existing users.
 *   3. If the user count is 0 (empty database), runs the seed.
 *      Otherwise logs "DB already seeded, skipping" and does NOT touch any data.
 *
 * Safety guarantees:
 *   - NEVER deletes existing data on a populated database. The seed's own
 *     cleanup phase is internally guarded to only run when zero users exist,
 *     and this script only invokes the seed when that condition is met.
 *   - If the database is unreachable (e.g. a dummy/placeholder DATABASE_URL
 *     during a local build, or a transient outage), the script logs a warning
 *     and exits 0 so the build can continue. On a real Vercel deploy the DB
 *     is reachable and everything runs normally.
 */
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'

async function main() {
  // --------------------------------------------------------------
  // 1. prisma db push (create / sync schema)
  // --------------------------------------------------------------
  console.log('🔧 [vercel-setup] Running `prisma db push`...')
  try {
    execSync('npx prisma db push', { stdio: 'inherit' })
  } catch {
    console.warn(
      '⚠️  [vercel-setup] `prisma db push` failed — the database may be unreachable.\n' +
        '   This is expected during local builds without a real DATABASE_URL.\n' +
        '   Skipping DB setup; the build will continue.'
    )
    return
  }

  // --------------------------------------------------------------
  // 2. Count users to decide whether to seed
  // --------------------------------------------------------------
  let db: PrismaClient | null = null
  try {
    db = new PrismaClient()
    const userCount = await db.user.count()

    if (userCount > 0) {
      console.log(
        `✅ [vercel-setup] DB already seeded (has ${userCount} user(s)). Skipping seed.`
      )
      return
    }

    // --------------------------------------------------------------
    // 3. Empty database — run the seed
    // --------------------------------------------------------------
    console.log('🌱 [vercel-setup] Database is empty. Running seed...')
    const { seedDatabase } = await import('../prisma/seed')
    await seedDatabase()
    console.log('✅ [vercel-setup] Seed complete.')
  } catch (e: any) {
    console.warn(
      '⚠️  [vercel-setup] DB setup error (database may be unreachable): ' +
        (e?.message || String(e))
    )
    console.warn('   Continuing build without DB setup.')
  } finally {
    if (db) {
      await db.$disconnect().catch(() => {})
    }
  }
}

main().catch(() => {
  // Final safety net: never fail the build because of DB setup.
  console.warn('⚠️  [vercel-setup] Unexpected error. Continuing build.')
  process.exit(0)
})
