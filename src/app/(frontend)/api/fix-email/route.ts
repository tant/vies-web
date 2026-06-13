import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const fix = (s?: string | null) => (s || '').replace(/v-ies\.com/g, 'vies.com.vn')

// One-off, SEED_SECRET-guarded: replace the old v-ies.com email/domain with
// vies.com.vn in the database globals (Site Settings email + Header top bar).
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const payload = await getPayload({ config: await config })
  const changed: Record<string, string> = {}

  // Site Settings — contact.email (shared across locales)
  const ss = (await payload.findGlobal({ slug: 'site-settings' })) as { contact?: Record<string, unknown> }
  const contact = ss.contact ?? {}
  const oldEmail = contact.email as string | undefined
  if (oldEmail && oldEmail.includes('v-ies.com')) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: { contact: { ...contact, email: fix(oldEmail) } } as never,
    })
    changed.email = fix(oldEmail)
  }

  // Header — topBar.content (per locale)
  for (const locale of ['vi', 'en'] as const) {
    const h = (await payload.findGlobal({ slug: 'header', locale, fallbackLocale: false })) as {
      topBar?: Record<string, unknown>
    }
    const tb = h.topBar ?? {}
    const content = tb.content as string | undefined
    if (content && content.includes('v-ies.com')) {
      await payload.updateGlobal({
        slug: 'header',
        locale,
        data: { topBar: { ...tb, content: fix(content) } } as never,
      })
      changed[`header_${locale}`] = fix(content)
    }
  }

  return NextResponse.json({ ok: true, changed })
}
