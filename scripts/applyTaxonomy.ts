import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Two-level product taxonomy for VIES, aligned with SKF's product grouping but kept
// multi-brand (brand stays a separate facet). Parent groups + their sub-categories.
// Idempotent: safe to run repeatedly and on top of the existing flat categories.

type Loc = { vi: string; en: string }
type Sub = { slug: string; name: Loc }
type Parent = { slug: string; name: Loc; order: number; subs: Sub[] }

const TAXONOMY: Parent[] = [
  {
    slug: 'vong-bi',
    name: { vi: 'Vòng bi', en: 'Bearings' },
    order: 1,
    subs: [
      { slug: 'vong-bi-cau', name: { vi: 'Vòng bi cầu', en: 'Ball bearings' } },
      { slug: 'vong-bi-dua', name: { vi: 'Vòng bi đũa', en: 'Roller bearings' } },
      { slug: 'vong-bi-tiep-xuc-goc', name: { vi: 'Vòng bi tiếp xúc góc', en: 'Angular contact bearings' } },
      { slug: 'vong-bi-tang-trong', name: { vi: 'Vòng bi tang trống tự lựa', en: 'Spherical roller bearings' } },
      { slug: 'vong-bi-chan', name: { vi: 'Vòng bi chặn', en: 'Thrust bearings' } },
      { slug: 'vong-bi-dac-biet', name: { vi: 'Vòng bi đặc biệt', en: 'Special bearings' } },
    ],
  },
  {
    slug: 'goi-do',
    name: { vi: 'Gối đỡ & Bạc', en: 'Bearing units & housings' },
    order: 2,
    subs: [
      { slug: 'goi-do-uc', name: { vi: 'Gối đỡ UC/UCP/UCF', en: 'Mounted ball bearing units' } },
      { slug: 'goi-do-sn', name: { vi: 'Gối đỡ SN/SNL', en: 'Plummer block housings' } },
      { slug: 'bac-lot', name: { vi: 'Bạc lót', en: 'Plain bearings & bushings' } },
    ],
  },
  {
    slug: 'truyen-dong',
    name: { vi: 'Truyền động', en: 'Power transmission' },
    order: 3,
    subs: [
      { slug: 'day-dai', name: { vi: 'Dây đai', en: 'Belts' } },
      { slug: 'xich', name: { vi: 'Xích', en: 'Chains' } },
      { slug: 'khop-noi', name: { vi: 'Khớp nối', en: 'Couplings' } },
      { slug: 'nhong-puly', name: { vi: 'Nhông & Puly', en: 'Sprockets & pulleys' } },
    ],
  },
  {
    slug: 'boi-tron',
    name: { vi: 'Bôi trơn', en: 'Lubrication' },
    order: 4,
    subs: [
      { slug: 'mo-dau', name: { vi: 'Mỡ & Dầu', en: 'Greases & oils' } },
      { slug: 'he-thong-boi-tron-tu-dong', name: { vi: 'Hệ thống bôi trơn tự động', en: 'Automatic lubrication systems' } },
      { slug: 'dung-cu-boi-tron', name: { vi: 'Dụng cụ bôi trơn', en: 'Lubrication tools' } },
    ],
  },
  {
    slug: 'dung-cu-bao-tri',
    name: { vi: 'Dụng cụ bảo trì', en: 'Maintenance products' },
    order: 5,
    subs: [
      { slug: 'dung-cu-lap-thao', name: { vi: 'Dụng cụ lắp & tháo', en: 'Mounting & dismounting tools' } },
      { slug: 'may-gia-nhiet', name: { vi: 'Máy gia nhiệt vòng bi', en: 'Bearing heaters' } },
      { slug: 'dung-cu-can-chinh', name: { vi: 'Dụng cụ căn chỉnh', en: 'Alignment tools' } },
    ],
  },
  {
    slug: 'giam-sat-tinh-trang',
    name: { vi: 'Giám sát tình trạng', en: 'Condition monitoring' },
    order: 6,
    subs: [],
  },
  {
    slug: 'phot-gioang',
    name: { vi: 'Phớt & Gioăng', en: 'Seals' },
    order: 7,
    subs: [],
  },
  {
    slug: 'khi-nen',
    name: { vi: 'Khí nén', en: 'Pneumatics' },
    order: 8,
    subs: [],
  },
]

// Existing demo products → their sub-category slug.
const PRODUCT_SUBCATEGORY: Record<string, string> = {
  'dai-dong-bo-optibelt': 'day-dai',
  'dai-thang-bando': 'day-dai',
  'goi-uc-skf': 'goi-do-uc',
  'skf-lgep-2': 'mo-dau',
  'skf-lgmt-2': 'mo-dau',
  'skf-lgmt-3': 'mo-dau',
  'skf-lgnl-2': 'mo-dau',
  'skf-p253-smart': 'he-thong-boi-tron-tu-dong',
  'skf-tih': 'may-gia-nhiet',
  'skf-tmbh-1': 'may-gia-nhiet',
  'skf-tmft-36': 'dung-cu-lap-thao',
  'skf-tmma': 'dung-cu-lap-thao',
  'vong-bi-cau-skf': 'vong-bi-cau',
  'vong-bi-dua-fag': 'vong-bi-dua',
  'vong-bi-dua-skf': 'vong-bi-dua',
  'vong-bi-tang-trong': 'vong-bi-tang-trong',
  'vong-bi-tiep-xuc-goc': 'vong-bi-tiep-xuc-goc',
  'vong-bi-tu-tinh': 'vong-bi-dac-biet',
  'xich-tsubaki': 'xich',
}

type Payload = Awaited<ReturnType<typeof getPayload>>

const upsertCategory = async (
  payload: Payload,
  data: { slug: string; nameVi: string; nameEn: string; order: number; parentId?: number },
): Promise<number> => {
  const found = await payload.find({
    collection: 'categories',
    where: { slug: { equals: data.slug } },
    limit: 1,
  })
  let id: number
  if (found.docs.length > 0) {
    id = found.docs[0].id as number
    await payload.update({
      collection: 'categories',
      id,
      data: { name: data.nameVi, order: data.order, parent: data.parentId ?? null },
    })
  } else {
    const created = await payload.create({
      collection: 'categories',
      data: { name: data.nameVi, slug: data.slug, order: data.order, parent: data.parentId ?? null },
    })
    id = created.id as number
  }
  await payload.update({ collection: 'categories', id, locale: 'en', data: { name: data.nameEn } })
  return id
}

export const applyTaxonomy = async (existingPayload?: Payload) => {
  const payload = existingPayload ?? (await getPayload({ config: await config }))

  console.log('🗂️  Applying product taxonomy...')

  // 1. Parents, then their sub-categories
  const subIdBySlug: Record<string, number> = {}
  const parentIdBySlug: Record<string, number> = {}
  for (const parent of TAXONOMY) {
    const parentId = await upsertCategory(payload, {
      slug: parent.slug,
      nameVi: parent.name.vi,
      nameEn: parent.name.en,
      order: parent.order,
    })
    parentIdBySlug[parent.slug] = parentId
    console.log(`  ✓ Group: ${parent.name.vi}`)
    let subOrder = 1
    for (const sub of parent.subs) {
      const subId = await upsertCategory(payload, {
        slug: sub.slug,
        nameVi: sub.name.vi,
        nameEn: sub.name.en,
        order: subOrder++,
        parentId,
      })
      subIdBySlug[sub.slug] = subId
      console.log(`     • ${sub.name.vi}`)
    }
  }

  // 2. Header navigation: Products dropdown → the parent groups
  console.log('🔝 Updating header navigation...')
  const productChildrenVi = TAXONOMY.map((p) => ({
    label: p.name.vi,
    link: `/products?category=${p.slug}`,
  }))
  const navVi = [
    { label: 'Trang chủ', link: '/' },
    { label: 'Sản phẩm', link: '/products', children: productChildrenVi },
    { label: 'Dịch vụ', link: '/services' },
    { label: 'Tin tức', link: '/news' },
    { label: 'Giới thiệu', link: '/about' },
    { label: 'Liên hệ', link: '/contact' },
  ]
  await payload.updateGlobal({ slug: 'header', data: { navigation: navVi } })

  const headerData = (await payload.findGlobal({ slug: 'header' })) as unknown as Record<string, unknown>
  const navItems = headerData.navigation as Array<Record<string, unknown>>
  const enTop = ['Home', 'Products', 'Services', 'News', 'About', 'Contact']
  await payload.updateGlobal({
    slug: 'header',
    locale: 'en',
    data: {
      navigation: navItems.map((item, i) => ({
        id: item.id as string,
        label: enTop[i],
        link: item.link as string,
        children: (item.children as Array<Record<string, unknown>> | undefined)?.map((child, j) => ({
          id: child.id as string,
          label: TAXONOMY[j]?.name.en ?? (child.label as string),
          link: child.link as string,
        })),
      })),
    },
  })

  // 3. Remap existing products onto [parent, sub]
  console.log('🏭 Remapping products to sub-categories...')
  for (const [productSlug, subSlug] of Object.entries(PRODUCT_SUBCATEGORY)) {
    const subId = subIdBySlug[subSlug]
    if (!subId) continue
    const parentSlug = TAXONOMY.find((p) => p.subs.some((s) => s.slug === subSlug))?.slug
    const parentId = parentSlug ? parentIdBySlug[parentSlug] : undefined
    const found = await payload.find({
      collection: 'products',
      where: { slug: { equals: productSlug } },
      limit: 1,
    })
    if (found.docs.length === 0) continue
    const categories = parentId ? [parentId, subId] : [subId]
    await payload.update({ collection: 'products', id: found.docs[0].id, data: { categories } })
    console.log(`     • ${productSlug} → ${subSlug}`)
  }

  console.log('\n✅ Taxonomy applied!')
  return { ok: true }
}

const invokedPath = process.argv[1] || ''
if (invokedPath.includes('applyTaxonomy')) {
  applyTaxonomy()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('applyTaxonomy failed:', error)
      process.exit(1)
    })
}
