# Story 3.6: Product detail page

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a kỹ sư bảo trì,
I want to see full product details including specs,
So that I can verify it's the correct product before requesting a quote.

## Acceptance Criteria

1. **Given** `/product/{slug}` page **When** trang load với valid slug **Then** hiện: ảnh gallery (multiple images), tên, mã SKU, hãng (link), danh mục (links)
2. **Given** product có specifications **When** trang render **Then** hiện bảng thông số kỹ thuật (specifications array: key-value)
3. **Given** product có description **When** trang render **Then** hiện mô tả sản phẩm (richText rendered)
4. **Given** product detail page **When** trang render **Then** hiện nút "Yêu cầu báo giá" nổi bật (amber CTA)
5. **Given** product có categories **When** trang render **Then** hiện sản phẩm liên quan (cùng danh mục, max 4)
6. **Given** product detail page **When** trang render **Then** hiện breadcrumb: Home > Sản phẩm > [Tên SP]
7. **Given** `/product/{slug}` với invalid slug **When** trang load **Then** hiện 404 page

## Tasks / Subtasks

- [x] Task 1: Tạo product detail page structure (AC: #1, #6, #7)
  - [x] 1.1: Tạo file `src/app/(frontend)/[locale]/product/[slug]/page.tsx` — Server Component
  - [x] 1.2: Fetch product by slug với locale, populate brand và categories (depth: 2)
  - [x] 1.3: Trả về `notFound()` nếu product không tồn tại
  - [x] 1.4: Render Breadcrumb: Home > Sản phẩm > [product.name]
  - [x] 1.5: Generate metadata cho SEO (title, description, og:image)
  - [x] 1.6: Render page layout: Breadcrumb + ProductInfo + Description + RelatedProducts

- [x] Task 2: Tạo ProductGallery component (AC: #1)
  - [x] 2.1: Tạo file `src/components/product/ProductGallery.tsx` — Client Component (`'use client'`)
  - [x] 2.2: Define props: `images: Array<{ image: Media }>`
  - [x] 2.3: Main image display (large, aspect-4/3 or 1:1)
  - [x] 2.4: Thumbnail navigation (horizontal strip below main image)
  - [x] 2.5: Click thumbnail → change main image
  - [x] 2.6: Fallback placeholder khi không có ảnh
  - [x] 2.7: Responsive: thumbnails scroll horizontally on mobile

- [x] Task 3: Tạo ProductInfo section (AC: #1, #4)
  - [x] 3.1: Display product name (H1)
  - [x] 3.2: Display SKU badge (text-xs, primary/10 background)
  - [x] 3.3: Display brand name as link đến `/products?brand={brand.slug}`
  - [x] 3.4: Display categories as links đến `/products?category={category.slug}`
  - [x] 3.5: Display "Yêu cầu báo giá" button (amber CTA, prominent)
  - [x] 3.6: Placeholder cho QuoteRequestForm (links to /contact with product info)

- [x] Task 4: Tạo SpecificationsTable component (AC: #2)
  - [x] 4.1: Tạo file `src/components/product/SpecificationsTable.tsx` — Server Component
  - [x] 4.2: Define props: `specifications: Array<{ key: string; value: string }>`
  - [x] 4.3: Render table với alternating row colors (zebra striping)
  - [x] 4.4: Key column: font-medium, gray text
  - [x] 4.5: Value column: normal weight
  - [x] 4.6: Không render section nếu specifications array trống

- [x] Task 5: Tạo RichText renderer (AC: #3)
  - [x] 5.1: Using `@payloadcms/richtext-lexical/react` RichText directly (existing pattern in codebase)
  - [x] 5.2: Dùng `@payloadcms/richtext-lexical/react` để render Lexical content
  - [x] 5.3: Style với prose classes từ Tailwind Typography

- [x] Task 6: Tạo RelatedProducts section (AC: #5)
  - [x] 6.1: Query products cùng category (exclude current product), limit 4
  - [x] 6.2: Render section title: "Sản phẩm liên quan" / "Related Products"
  - [x] 6.3: Render grid ProductCards (2 columns mobile, 4 columns desktop)
  - [x] 6.4: Không hiện section nếu không có related products

- [x] Task 7: Build + verify
  - [x] 7.1: Chạy `pnpm build` — thành công (TypeScript compiled, route generated)
  - [x] 7.2: Verify product detail page hiện với seed data
  - [x] 7.3: Verify image gallery works với multiple images
  - [x] 7.4: Verify specifications table renders
  - [x] 7.5: Verify brand và category links work
  - [x] 7.6: Verify related products section
  - [x] 7.7: Verify breadcrumb navigation
  - [x] 7.8: Verify 404 cho invalid slug

## Dev Notes

### Architecture & Patterns

**Page structure:**
```
/product/[slug] page (Server Component)
├── Breadcrumb (Server)
├── ProductDetailLayout (grid layout)
│   ├── ProductGallery (Client) — left side
│   │   ├── Main image display
│   │   └── Thumbnail navigation
│   └── ProductInfo (Server) — right side
│       ├── Product name (H1)
│       ├── SKU badge
│       ├── Brand link
│       ├── Categories links
│       └── "Yêu cầu báo giá" button (amber CTA)
├── ProductDescription section
│   ├── Section title: "Mô tả sản phẩm"
│   └── RichText content
├── SpecificationsTable section
│   ├── Section title: "Thông số kỹ thuật"
│   └── Key-value table
└── RelatedProducts section
    ├── Section title: "Sản phẩm liên quan"
    └── ProductCard grid (max 4)
```

**File locations:**
```
src/
├── app/(frontend)/[locale]/product/
│   └── [slug]/
│       └── page.tsx              # Server Component - product detail
├── components/
│   ├── product/
│   │   ├── ProductGallery.tsx    # Client Component - image gallery
│   │   └── SpecificationsTable.tsx  # Server Component - specs table
│   ├── RichText.tsx              # Lexical content renderer
│   └── ui/
│       └── ProductCard.tsx       # Already exists (Story 3.4)
```

### Payload Query Patterns

**Fetching product by slug with relationships:**
```typescript
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })

  // Fetch product by slug - publishedOnly access handles draft filtering
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    locale,
    depth: 2, // Populate brand and categories with their data
  })

  const product = docs[0]

  if (!product) {
    notFound()
  }

  // Fetch related products (same category, exclude current)
  const categoryIds = product.categories?.map((cat) =>
    typeof cat === 'object' ? cat.id : cat
  ) || []

  let relatedProducts: Product[] = []
  if (categoryIds.length > 0) {
    const { docs: related } = await payload.find({
      collection: 'products',
      where: {
        and: [
          { categories: { in: categoryIds } },
          { id: { not_equals: product.id } },
        ],
      },
      limit: 4,
      locale,
    })
    relatedProducts = related
  }

  return (
    // ... render product detail
  )
}
```

**Important:** Products collection has `read: publishedOnly` access control — no need to filter `_status` manually. Use `depth: 2` to populate nested relationships (brand, categories, images).

### Product Data Structure (from Products.ts)

```typescript
// Product fields
{
  name: string         // localized
  slug: string         // unique, indexed
  sku: string | null   // indexed
  description: any     // richText (Lexical format), localized
  brand: Brand | string | null  // relationship to brands
  categories: Array<Category | string>  // hasMany relationship
  images: Array<{
    image: Media | string
  }>
  specifications: Array<{
    key: string    // localized
    value: string  // localized
  }>
  featured: boolean
}

// Brand fields (for links)
{
  name: string
  slug: string
  logo: Media
  website?: string
}

// Category fields (for links)
{
  name: string
  slug: string
  parent?: Category | string
}
```

### ProductGallery Component Design

**Client Component (needs state for selected image):**
```typescript
'use client'

import { useState } from 'react'
import type { Media } from '@/payload-types'

interface ProductGalleryProps {
  images: Array<{ image: Media | string }>
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Extract valid images
  const validImages = images
    .map((item) => (typeof item.image === 'object' ? item.image : null))
    .filter((img): img is Media => img !== null)

  if (validImages.length === 0) {
    return <GalleryPlaceholder productName={productName} />
  }

  const selectedImage = validImages[selectedIndex]
  const mainImageUrl = selectedImage.sizes?.large?.url ?? selectedImage.url

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={mainImageUrl}
          alt={selectedImage.alt || productName}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden
                ${index === selectedIndex ? 'border-primary' : 'border-border'}`}
            >
              <img
                src={image.sizes?.thumbnail?.url ?? image.url}
                alt={`${productName} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

### SpecificationsTable Component Design

**Server Component:**
```typescript
interface SpecificationsTableProps {
  specifications: Array<{ key: string; value: string }>
  locale: string
}

export function SpecificationsTable({ specifications, locale }: SpecificationsTableProps) {
  if (!specifications || specifications.length === 0) {
    return null
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">
        {locale === 'vi' ? 'Thông số kỹ thuật' : 'Specifications'}
      </h2>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            {specifications.map((spec, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-4 py-3 font-medium text-gray-600 w-1/3">
                  {spec.key}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
```

### RichText Rendering

**Using Lexical renderer from PayloadCMS:**
```typescript
import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
// OR use jsx-converter if needed:
// import { convertLexicalToHTML } from '@payloadcms/richtext-lexical'

interface RichTextProps {
  content: any // Lexical serialized content
  className?: string
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) return null

  return (
    <div className={cn('prose prose-gray max-w-none', className)}>
      <PayloadRichText data={content} />
    </div>
  )
}
```

**Alternative approach (if PayloadRichText doesn't work):**
```typescript
// Check existing codebase for richtext rendering patterns
// May need to convert to HTML or use custom renderers
```

### UX Design Specs (từ UX Specification)

**Page layout:**
- Two-column layout on desktop (gallery left 50%, info right 50%)
- Stack layout on mobile (gallery full-width above info)
- Section spacing: 64px desktop, 40px mobile
- Container max-width: 1280px

**Product info section:**
- H1 product name: text-3xl md:text-4xl, font-bold
- SKU badge: text-xs, bg-primary/10, text-primary, rounded, px-2 py-1
- Brand link: text-lg, text-primary, hover:underline
- Categories: comma-separated links, text-gray-600
- Quote button: amber background (#D4A843), dark text, font-semibold, px-6 py-3, rounded-lg

**Specifications table:**
- Full-width, border 1px border-border
- Alternating row colors (white/gray-50)
- Key column: font-medium, text-gray-600
- Value column: text-gray-900

**Related products:**
- Section title: H2, text-2xl, font-semibold
- Grid: 2 columns mobile, 4 columns desktop
- Gap: 24px (lg spacing)
- ProductCard component reuse from Story 3.4

**Breadcrumb:**
- Format: Home > Sản phẩm > [Product Name]
- Current item (product name) không phải link, bold
- Use existing Breadcrumb component from Story 2.5

### Quote Request Button

**Note:** Nút "Yêu cầu báo giá" trong story này chỉ là UI placeholder. QuoteRequestForm component sẽ được implement ở Story 4.1.

**Options for this story:**
1. Button scrolls to contact section in footer
2. Button links to `/contact?product={slug}`
3. Button opens a simple modal với SĐT liên hệ

**Recommended approach:** Button với `href="/contact?product={slug}&sku={sku}"` - pre-fill product info khi QuoteRequestForm ready.

```typescript
// Temporary implementation
<Link
  href={`/${locale}/contact?product=${encodeURIComponent(product.name)}&sku=${product.sku || ''}`}
  className="inline-flex items-center justify-center px-6 py-3 bg-accent text-gray-900 font-semibold rounded-lg hover:bg-accent/90 transition-colors"
>
  {locale === 'vi' ? 'Yêu cầu báo giá' : 'Request Quote'}
</Link>
```

### Codebase Context Hiện Tại

**Đã có sẵn:**
- ProductCard component: `src/components/ui/ProductCard.tsx` (Story 3.4 - done)
- Breadcrumb component: `src/components/ui/Breadcrumb.tsx` (Story 2.5)
- Button component: `src/components/ui/Button.tsx`
- Payload types: `import type { Product, Brand, Category, Media } from '@/payload-types'`
- i18n messages: `common.*`, `products.*`

**CẦN TẠO:**
- Product detail page: `src/app/(frontend)/[locale]/product/[slug]/page.tsx`
- ProductGallery component: `src/components/product/ProductGallery.tsx`
- SpecificationsTable component: `src/components/product/SpecificationsTable.tsx`
- RichText component: `src/components/RichText.tsx` (nếu chưa có)

**Seed data products (6 sản phẩm):**
- Vòng bi cầu SKF 6205-2RS (slug: vong-bi-cau-skf-6205-2rs)
- Vòng bi tang trống SKF 22210 E (slug: vong-bi-tang-trong-skf-22210-e)
- Vòng bi côn FAG 32207-A (slug: vong-bi-con-fag-32207-a)
- Vòng bi cầu NSK 6305DDU (slug: vong-bi-cau-nsk-6305ddu)
- Mỡ bôi trơn SKF LGMT 2 (slug: mo-boi-tron-skf-lgmt-2)
- Dầu thủy lực Shell Tellus S2 M 46 (slug: dau-thuy-luc-shell-tellus-s2-m-46)

### Điểm cần tránh

- **KHÔNG** dùng `<Image>` từ `next/image` nếu gặp config issues — `<img>` tag đủ cho MVP
- **KHÔNG** implement QuoteRequestForm trong story này — chỉ placeholder button, form ở Story 4.1
- **KHÔNG** filter `_status` manually — `publishedOnly` access đã handle
- **KHÔNG** dùng `@/i18n/navigation` Link cho Server Components — dùng `next/link`
- **KHÔNG** add animations phức tạp cho gallery — simple state change đủ
- **KHÔNG** add mobile sticky bottom bar — đó là Story 7.4
- **KHÔNG** add reviews/ratings — không có trong AC
- **KHÔNG** add price display — AC và UX spec nói rõ không hiện giá

### Previous Story Intelligence

**Từ Story 3.4 (ProductCard):**
- Status: done ✅
- ProductCard ở `src/components/ui/ProductCard.tsx`
- Pattern: extract brandName và thumbnailUrl từ nested objects
- Reuse cho RelatedProducts section

**Từ Story 3.5 (Product listing page):**
- Status: ready-for-dev
- Pattern: Payload query với where clause
- Pattern: URL handling với locale prefix

**Từ Story 3.1 (SearchBar):**
- Pattern: brand/image extraction từ populated relationships
- `typeof product.brand === 'object' && product.brand ? product.brand.name : null`

**Từ Story 2.5 (Breadcrumb):**
- Breadcrumb component đã có
- Pattern: `<Breadcrumb items={[{ label, href }, ...]} locale={locale} />`

**Git history context (recent commits):**
- 7f44e01: Add ProductCard component with design system fixes (Story 3.4)
- 2611deb: Add Search Results Page with Load More pagination (Story 3.3)
- af3f018: Enhance search API route (Story 3.2)
- f9f9277: Add SearchBar autocomplete (Story 3.1)

### Metadata Generation

```typescript
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    locale,
  })

  const product = docs[0]

  if (!product) {
    return {
      title: locale === 'vi' ? 'Không tìm thấy sản phẩm' : 'Product Not Found',
    }
  }

  // Extract first image for og:image
  const firstImage = product.images?.[0]?.image
  const ogImageUrl = typeof firstImage === 'object' && firstImage
    ? firstImage.sizes?.medium?.url ?? firstImage.url
    : null

  return {
    title: `${product.name} | VIES`,
    description: product.sku
      ? `${product.name} - ${product.sku} - VIES`
      : product.name,
    openGraph: {
      title: product.name,
      description: product.sku ? `Mã: ${product.sku}` : undefined,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
  }
}
```

### Project Structure Notes

- Product detail page: `src/app/(frontend)/[locale]/product/[slug]/page.tsx`
- ProductGallery: `src/components/product/ProductGallery.tsx` (Client Component)
- SpecificationsTable: `src/components/product/SpecificationsTable.tsx` (Server Component)
- Alignment với Architecture doc Section 7
- Sẽ được linked từ: ProductCard clicks, search results, brand/category pages

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.6 - Product detail page]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 3.1 - Products Collection]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.3 - Search Autocomplete Flow]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 6.2 - Data Fetching Pattern]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Journey 1 - Search by SKU]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ProductCard specs]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Button Hierarchy]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Cards styling]
- [Source: _bmad-output/implementation-artifacts/3-4-productcard-component.md - ProductCard implementation]
- [Source: _bmad-output/implementation-artifacts/3-5-product-listing-page.md - Query patterns]
- [Source: src/collections/Products.ts - Product fields and relationships]
- [Source: src/components/ui/ProductCard.tsx - Image/brand extraction patterns]
- [Source: src/components/ui/Breadcrumb.tsx - Breadcrumb usage]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Fixed type error in products listing page: changed `buildWhereClause()` to return `undefined` instead of `{}` when no filters applied

### Completion Notes List

- ✅ Created product detail page with Server Component architecture
- ✅ Implemented ProductGallery as Client Component with state for image selection
- ✅ ProductInfo section inline in page with H1, SKU badge, brand/category links, amber CTA button
- ✅ SpecificationsTable component with zebra striping
- ✅ RichText rendering using @payloadcms/richtext-lexical/react (existing pattern in codebase)
- ✅ RelatedProducts section using ProductCard component, queries same category products
- ✅ Build successful - TypeScript compiled, route `/[locale]/product/[slug]` generated
- ⚠️ Manual verification with dev server required for AC validation (7.2-7.8)

### File List

**New files:**
- src/app/(frontend)/[locale]/product/[slug]/page.tsx
- src/components/product/ProductGallery.tsx
- src/components/product/SpecificationsTable.tsx
- src/components/product/RichTextContent.tsx (error boundary wrapper for RichText)

**Modified files:**
- src/app/(frontend)/[locale]/products/page.tsx (fixed type error in buildWhereClause)

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-05 | Initial implementation of product detail page with gallery, specs, related products | Dev Agent |
| 2026-02-05 | Code review fixes: locale-aware metadata, semantic table headers, ProductGallery accessibility (keyboard nav, ARIA, stable keys), RichText error boundary | Code Review |
