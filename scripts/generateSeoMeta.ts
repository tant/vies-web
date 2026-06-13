import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Fill-empty SEO meta (title/description) for products, news, services and pages,
// in both locales. Only sets fields that are currently empty — never overwrites
// meta an editor has already customised. Idempotent.

type Payload = Awaited<ReturnType<typeof getPayload>>
type Loc = 'vi' | 'en'

const clamp = (s: string, max: number) => {
  const t = s.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const sp = cut.lastIndexOf(' ')
  return (sp > max * 0.6 ? cut.slice(0, sp) : cut).trim()
}

const specDims = (specs: { key?: string; value?: string }[] | undefined | null, loc: Loc) => {
  const re = loc === 'vi' ? /kích thước/i : /dimensions/i
  const hit = (specs ?? []).find((s) => s.key && re.test(s.key))
  return hit?.value?.replace(/\s*mm\s*$/i, '').trim() || null
}

const productMeta = (doc: Record<string, unknown>, loc: Loc) => {
  const name = (doc.name as string) || ''
  const sku = (doc.sku as string) || ''
  const short = (doc.shortDescription as string) || ''
  const dims = specDims(doc.specifications as { key?: string; value?: string }[], loc)
  const title = clamp(dims ? `${name} ${dims}mm` : name, 60)
  const tail = loc === 'vi' ? 'Phân phối chính hãng tại VIES — báo giá nhanh.' : 'Genuine, distributed by VIES — fast quotation.'
  const lead = short || (loc === 'vi'
    ? `${name} chính hãng${sku ? `, ký hiệu ${sku}` : ''}.`
    : `Genuine ${name}${sku ? `, designation ${sku}` : ''}.`)
  const description = clamp(`${lead} ${tail}`, 160)
  return { title, description }
}

const excerptMeta = (doc: Record<string, unknown>, loc: Loc) => {
  const title = clamp((doc.title as string) || (doc.name as string) || '', 60)
  const excerpt = (doc.excerpt as string) || ''
  const fallback = loc === 'vi'
    ? `${title} - VIES, nhà phân phối vòng bi & linh kiện công nghiệp chính hãng.`
    : `${title} - VIES, genuine industrial bearings & components distributor.`
  return { title, description: clamp(excerpt || fallback, 160) }
}

const pageMeta = (doc: Record<string, unknown>, loc: Loc) => {
  const title = clamp((doc.title as string) || '', 60)
  const fallback = loc === 'vi'
    ? `${title} - VIES, vòng bi & linh kiện công nghiệp chính hãng SKF, FAG, NTN, TIMKEN.`
    : `${title} - VIES, genuine SKF, FAG, NTN, TIMKEN industrial bearings & components.`
  const existing = (doc.meta as { description?: string } | undefined)?.description
  return { title, description: clamp(existing || fallback, 160) }
}

type Gen = (doc: Record<string, unknown>, loc: Loc) => { title: string; description: string }

const COLLECTIONS: { slug: 'products' | 'news' | 'services' | 'pages'; gen: Gen; depth: number }[] = [
  { slug: 'products', gen: productMeta, depth: 1 },
  { slug: 'news', gen: excerptMeta, depth: 0 },
  { slug: 'services', gen: excerptMeta, depth: 0 },
  { slug: 'pages', gen: pageMeta, depth: 0 },
]

export const generateSeoMeta = async (existingPayload?: Payload) => {
  const payload = existingPayload ?? (await getPayload({ config: await config }))

  for (const { slug, gen, depth } of COLLECTIONS) {
    let filled = 0
    let skipped = 0
    for (const loc of ['vi', 'en'] as Loc[]) {
      // fallbackLocale:false so an empty `en` meta reads as empty (not the `vi` fallback),
      // otherwise fill-empty would wrongly skip untranslated locales.
      const { docs } = await payload.find({ collection: slug, limit: 1000, locale: loc, depth, fallbackLocale: false })
      for (const doc of docs as unknown as Record<string, unknown>[]) {
        const meta = (doc.meta as { title?: string; description?: string } | undefined) ?? {}
        const g = gen(doc, loc)
        const title = meta.title && meta.title.trim() ? meta.title : g.title
        const description = meta.description && meta.description.trim() ? meta.description : g.description
        if (meta.title?.trim() && meta.description?.trim()) {
          skipped++
          continue
        }
        try {
          await payload.update({
            collection: slug,
            id: doc.id as number,
            locale: loc,
            data: { meta: { title, description } } as never,
          })
          filled++
        } catch (e) {
          // One invalid doc (e.g. a page whose localized block fails validation) must
          // not abort the whole run.
          console.log(`  ! skip ${slug}#${doc.id} (${loc}): ${(e as Error).message?.slice(0, 70)}`)
          skipped++
        }
      }
    }
    console.log(`  ✓ ${slug}: filled ${filled}, skipped ${skipped} (vi+en)`)
  }

  console.log('\n✅ SEO meta generated.')
  return { ok: true }
}

const invokedPath = process.argv[1] || ''
if (invokedPath.includes('generateSeoMeta')) {
  generateSeoMeta()
    .then(() => process.exit(0))
    .catch((e) => { console.error('generateSeoMeta failed:', e); process.exit(1) })
}
