# Story 3.4: ProductCard Component

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng,
I want to see product cards with image, name, SKU, and brand,
So that I can quickly identify the product I'm looking for.

## Acceptance Criteria

1. **Given** ProductCard nhận product data via props **When** render **Then** hiện: ảnh (thumbnail size 400x300), tên sản phẩm, mã SKU, tên hãng
2. **Given** ProductCard **When** render **Then** KHÔNG hiện giá
3. **Given** user click card **When** navigate **Then** chuyển đến `/{locale}/product/{slug}`
4. **Given** product không có ảnh **When** render **Then** hiện image fallback (placeholder icon)
5. **Given** ProductCard **When** render **Then** là Server Component (nhận data từ parent)
6. **Given** ProductCard tạo xong **When** search page dùng **Then** replace inline product cards trong `search/page.tsx` bằng ProductCard component

## Tasks / Subtasks

- [x] Task 1: Tạo ProductCard component (AC: #1, #2, #3, #4, #5)
  - [x] 1.1: Tạo file `src/components/ui/ProductCard.tsx` — Server Component (KHÔNG `'use client'`)
  - [x] 1.2: Define props interface dùng Product type từ `@/payload-types`
  - [x] 1.3: Render ảnh thumbnail (400x300, aspect-4/3) dùng `next/image` hoặc `<img>`
  - [x] 1.4: Render SKU badge (text-xs, primary/10 background)
  - [x] 1.5: Render product name (H3, font-semibold, line-clamp-2)
  - [x] 1.6: Render brand name (text-sm, text-gray-500)
  - [x] 1.7: Image fallback khi không có ảnh: placeholder icon trên gray background
  - [x] 1.8: Wrap trong `<article>` với alt text cho ảnh (accessibility)
  - [x] 1.9: Link toàn bộ card đến `/{locale}/product/{slug}`

- [x] Task 2: Integrate vào search results page (AC: #6)
  - [x] 2.1: Import ProductCard vào `src/components/search/SearchResults.tsx` (actual location of inline cards)
  - [x] 2.2: Replace inline product card markup bằng `<ProductCard product={product} locale={locale} />`
  - [x] 2.3: Xóa inline GearIcon (không dùng nơi khác trong SearchResults)

- [x] Task 3: Build + verify
  - [x] 3.1: Chạy `pnpm build` — thành công (TypeScript pass, no errors)
  - [x] 3.2: Verify ProductCard hiện đúng trên search page với seed data
  - [x] 3.3: Verify image fallback khi product không có ảnh
  - [x] 3.4: Verify click navigates đến product detail page

## Dev Notes

### Architecture & Patterns

**Component type:** Server Component — KHÔNG cần client state, nhận data từ parent.

**File location:**
```
src/components/ui/ProductCard.tsx
```

**Props interface:**
```typescript
import type { Product, Brand, Media } from '@/payload-types'

interface ProductCardProps {
  product: Product
  locale: string
}
```

**Brand & Image extraction:**
```typescript
// Brand is a relationship — can be number (ID) or populated Brand object
const brandName = typeof product.brand === 'object' && product.brand
  ? product.brand.name
  : null

// Image extraction — images is array, each item has image upload field
const firstImage = product.images?.[0]?.image
const thumbnailUrl = typeof firstImage === 'object' && firstImage
  ? firstImage.sizes?.thumbnail?.url ?? firstImage.url
  : null
const imageAlt = typeof firstImage === 'object' && firstImage
  ? firstImage.alt || product.name
  : product.name
```

**Card link pattern (locale-aware):**
```typescript
// Link to product detail page with locale prefix
<Link href={`/${locale}/product/${product.slug}`}>
```

### UX Design Specs

**Card structure (từ UX Specification):**
- Content: ảnh + tên + mã SKU + hãng
- Hover: border color chuyển `--primary` (subtle, 200ms transition)
- Semantic HTML: `<article>` wrapper
- Image: aspect ratio 4:3, object-fit cover
- Title: H3, max 2 lines, line-clamp

**Card styling (từ UX Specification):**
```
- Border 1px --border (#E5E7EB), border-radius 4px (rounded)
- Hover: border color → --primary (#0F4C75), transition 200ms
- Padding: 16px (md spacing)
- Image: aspect-[4/3], object-cover
- SKU badge: text-xs, bg-primary/10, text-primary, rounded, px-2 py-1
- Title: font-semibold, line-clamp-2, group-hover:text-primary
- Brand: text-sm, text-gray-500
```

**Note:** UX spec mentions "nút báo giá" (quote button) nhưng epics AC cho Story 3.4 nói KHÔNG hiện giá. Nút báo giá là cho product detail page (Story 3.6) — ProductCard chỉ hiện info cơ bản.

### Codebase Context Hiện Tại

**Đã có sẵn:**
- Inline product card pattern trong `src/app/(frontend)/[locale]/search/page.tsx` (lines 91-110) — dùng làm reference
- `Link` component: `import Link from 'next/link'` (dùng `next/link`, KHÔNG dùng `@/i18n/navigation` Link vì Server Component)
- `cn()` utility: `src/lib/utils.ts`
- Button component: `src/components/ui/Button.tsx` (primary/secondary/outline/ghost)
- Media collection: thumbnail 400x300, medium 900w, large 1400w
- Product type: `import type { Product } from '@/payload-types'`

**Inline card pattern hiện tại (trong search page):**
```tsx
<Link href={`/${locale}/product/${product.slug}`} className="bg-white rounded-xl shadow-sm overflow-hidden group">
  <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
    {/* Placeholder GearIcon — thay bằng actual image */}
    <GearIcon className="w-8 h-8 text-gray-400" />
  </div>
  <div className="p-4">
    {product.sku && (
      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">{product.sku}</span>
    )}
    <h3 className="font-semibold text-gray-900 mt-2 group-hover:text-primary transition-colors line-clamp-2">
      {product.name}
    </h3>
    {typeof product.brand === 'object' && product.brand && (
      <p className="text-sm text-gray-500 mt-1">{product.brand.name}</p>
    )}
  </div>
</Link>
```

**CHƯA có:**
- `ProductCard` component — CẦN TẠO
- Product images chưa seed (hiện dùng placeholder) — OK, ProductCard cần handle fallback

### Điểm cần tránh

- **KHÔNG** thêm `'use client'` — ProductCard là Server Component
- **KHÔNG** hiện giá — AC nói rõ KHÔNG hiện giá
- **KHÔNG** thêm "Yêu cầu báo giá" button — đó cho product detail page (Story 3.6)
- **KHÔNG** dùng `useRouter` hoặc `useLocale` — Server Component, nhận locale via props
- **KHÔNG** dùng `@/i18n/navigation` Link — dùng `next/link` Link với explicit locale path
- **KHÔNG** tạo variants (grid/list) ở story này — epics AC chỉ yêu cầu card cơ bản, list variant thêm sau nếu cần
- **KHÔNG** thay đổi grid layout trong search page — chỉ replace inline card bằng ProductCard component
- **KHÔNG** dùng `next/image` nếu gặp config issues — `<img>` tag đủ cho MVP, optimize sau

### Previous Story Intelligence

**Từ Story 3.1 (SearchBar):**
- SearchBar dropdown renders products khác (compact: 40x40 thumbnail inline) — KHÔNG reuse cho card
- Brand extraction pattern: `typeof doc.brand === 'object' && doc.brand ? doc.brand.name : null`
- Image extraction: `doc.images?.[0]?.image.sizes?.thumbnail?.url ?? doc.images[0].image.url`

**Từ Story 3.3 (Search results page):**
- Search page sẽ dùng ProductCard sau khi tạo
- Grid layout: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`

**Từ Epic 2:**
- `next/link` Link dùng cho Server Components (not `@/i18n/navigation`)
- Locale passed via props từ layout

### Project Structure Notes

- ProductCard: `src/components/ui/ProductCard.tsx` — theo architecture convention
- Sẽ được reuse bởi: search results page, products listing page (3.5), brand page (3.7), category page (3.8)
- Alignment với Architecture doc Section 7

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.4 - ProductCard component]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 3 - Component Strategy]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.1 - Data Flow]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ProductCard specs]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Card styling]
- [Source: _bmad-output/implementation-artifacts/3-1-searchbar-component.md - Brand/image extraction patterns]
- [Source: _bmad-output/implementation-artifacts/3-3-search-results-page.md - Search page integration]
- [Source: src/app/(frontend)/[locale]/search/page.tsx - Inline card pattern to replace]
- [Source: src/collections/Products.ts - Product fields]
- [Source: src/collections/Media.ts - Image sizes (thumbnail 400x300)]
- [Source: src/payload-types.ts - Product, Brand, Media TypeScript types]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Debug Log References
None required - clean implementation

### Completion Notes List
- Created `ProductCard.tsx` as Server Component (no 'use client' directive)
- Component accepts both full `Product` type and simplified `ProductCardData` for flexibility
- Implemented type guard `isFullProduct()` to handle both data structures
- Used `<img>` tag instead of `next/image` per Dev Notes recommendation for MVP
- Placeholder icon uses image icon (more appropriate than gear icon)
- Integrated into `SearchResults.tsx` (actual location of inline cards, not search/page.tsx)
- Removed unused GearIcon from SearchResults after integration
- Build passes with no TypeScript errors

### Acceptance Criteria Verification
- AC #1 ✅ Renders: image (thumbnail 400x300), product name, SKU, brand name
- AC #2 ✅ Does NOT show price
- AC #3 ✅ Click navigates to `/{locale}/product/{slug}`
- AC #4 ✅ Image fallback with placeholder icon when no image
- AC #5 ✅ Server Component (no 'use client', receives data via props)
- AC #6 ✅ SearchResults now uses ProductCard component

### File List
**New:**
- src/components/ui/ProductCard.tsx

**Modified:**
- src/components/search/SearchResults.tsx

## Senior Developer Review

**Reviewer:** Tan
**Date:** 2026-02-05
**Outcome:** ✅ APPROVED (with fixes applied)

### Issues Found & Fixed

| # | Severity | Issue | Resolution |
|---|----------|-------|------------|
| 1 | MEDIUM | Hardcoded border color `border-[#E5E7EB]` instead of CSS variable | Fixed: Changed to `border-border` |
| 2 | MEDIUM | Missing image dimensions causing CLS risk | Fixed: Added `width={400} height={300}` to `<img>` |

### Issues Noted (Not Fixed)

| # | Severity | Issue | Reason |
|---|----------|-------|--------|
| 3 | LOW | No unit tests | Out of scope for MVP |
| 4 | LOW | PlaceholderIcon defined inline | Minor, can be refactored later if needed elsewhere |

### AC Verification

- AC #1 ✅ Renders image, name, SKU, brand
- AC #2 ✅ No price shown
- AC #3 ✅ Click navigates to `/{locale}/product/{slug}`
- AC #4 ✅ Image fallback with placeholder icon
- AC #5 ✅ Server Component (no 'use client')
- AC #6 ✅ SearchResults uses ProductCard

### Note

⚠️ **CRITICAL:** File `ProductCard.tsx` is untracked in git. Must be committed to prevent build failures on clone.

## Change Log

| Date | Changes |
|------|---------|
| 2026-02-05 | Code review: Fixed border color (CSS variable), added image dimensions |
| 2026-02-05 | Story 3.4: Created ProductCard component, integrated into SearchResults |
