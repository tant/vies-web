import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { seedData } from '../../../../../scripts/seed'

// Long-running, server-side only. Never statically evaluated.
export const dynamic = 'force-dynamic'
export const maxDuration = 800

// One-off, guarded seed endpoint. Runs inside the app container so uploaded media
// files land on the server's /app/media volume (unlike a local `pnpm seed`).
// Protected by the SEED_SECRET env var. Optional ?truncate=1 wipes existing data
// (except migrations) for a clean re-seed.
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config: await config })

  try {
    if (req.nextUrl.searchParams.get('truncate') === '1') {
      const pool = (payload.db as unknown as { pool?: { query: (sql: string) => Promise<unknown> } }).pool
      if (!pool) {
        return NextResponse.json({ error: 'no db pool available for truncate' }, { status: 500 })
      }
      await pool.query(`
        DO $$
        DECLARE stmt text;
        BEGIN
          SELECT string_agg(format('%I.%I', schemaname, tablename), ', ') INTO stmt
          FROM pg_tables
          WHERE schemaname = 'public' AND tablename <> 'payload_migrations';
          IF stmt IS NOT NULL THEN
            EXECUTE 'TRUNCATE TABLE ' || stmt || ' RESTART IDENTITY CASCADE';
          END IF;
        END $$;
      `)
    }

    await seedData(payload)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
