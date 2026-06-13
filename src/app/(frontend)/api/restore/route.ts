import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { seedData } from '../../../../../scripts/seed'
import { addSkfProducts } from '../../../../../scripts/addSkfProducts'
import { generateSeoMeta } from '../../../../../scripts/generateSeoMeta'

export const dynamic = 'force-dynamic'
export const maxDuration = 800

// One-off, SEED_SECRET-guarded full restore. Runs inside the app container so media
// uploads land on the server's /app/media volume. seedData() also applies the taxonomy.
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const payload = await getPayload({ config: await config })
  const result: Record<string, unknown> = {}
  try {
    await seedData(payload)
    result.seed = 'ok'
    await addSkfProducts(payload)
    result.skf = 'ok'
    await generateSeoMeta(payload)
    result.seoMeta = 'ok'
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), done: result },
      { status: 500 },
    )
  }
}
