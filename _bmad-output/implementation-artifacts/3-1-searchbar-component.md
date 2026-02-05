# Story 3.1: SearchBar component (autocomplete)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a kỹ sư bảo trì,
I want to search products by SKU or name with autocomplete,
So that I can quickly find the exact bearing I need.

## Acceptance Criteria

1. **Given** SearchBar component (Client Component) **When** user gõ >= 2 ký tự **Then** debounce 300ms, fetch `/api/search?q={query}&locale={locale}`
2. **Given** API trả kết quả **When** render dropdown **Then** hiện max 6 kết quả: ảnh thumbnail + tên + mã SKU + hãng
3. **Given** dropdown đang mở **When** user dùng keyboard **Then** Arrow Up/Down di chuyển highlight, Enter chọn item, Escape đóng dropdown
4. **Given** user click kết quả **When** navigate **Then** chuyển đến `/product/{slug}`
5. **Given** dropdown có kết quả **When** user muốn xem thêm **Then** hiện link "Xem tất cả kết quả" → navigate đến `/search?q={query}`
6. **Given** search không tìm thấy **When** render no-results **Then** hiện gợi ý liên hệ kỹ sư (SĐT tư vấn)
7. **Given** SearchBar **When** render trên homepage hero **Then** variant hero (lớn, centered) khác với header variant (compact, inline)

## Tasks / Subtasks

- [x] Task 1: Tạo Search API route (AC: #1)
  - [x] 1.1: Tạo file `src/app/(frontend)/api/search/route.ts`
  - [x] 1.2: Implement GET handler: parse `q` và `locale` từ searchParams
  - [x] 1.3: Query Products collection: `name contains` OR `sku contains`, limit 6, select name/sku/slug/brand/images
  - [x] 1.4: Return JSON `{ results: [...] }`, empty array khi query < 2 ký tự

- [x] Task 2: Tạo SearchBar component (AC: #1, #2, #6, #7)
  - [x] 2.1: Tạo file `src/components/ui/SearchBar.tsx` — Client Component (`'use client'`)
  - [x] 2.2: Implement state: `query`, `results`, `isOpen`, `isLoading`, `highlightedIndex`
  - [x] 2.3: Implement debounce 300ms fetch đến `/api/search`
  - [x] 2.4: Render input với placeholder từ i18n (`search.placeholder` hoặc `search.placeholderHero`)
  - [x] 2.5: Render dropdown với kết quả: thumbnail + tên + SKU + brand name
  - [x] 2.6: Implement no-results state với gợi ý liên hệ kỹ sư
  - [x] 2.7: Implement 2 variants: `hero` (lớn, centered) và `header` (compact)

- [x] Task 3: Implement keyboard navigation + accessibility (AC: #3, #4)
  - [x] 3.1: Arrow Up/Down thay đổi `highlightedIndex`
  - [x] 3.2: Enter trên highlighted item → navigate đến product page
  - [x] 3.3: Escape đóng dropdown, blur input
  - [x] 3.4: ARIA attributes: `role="combobox"`, `aria-expanded`, `aria-activedescendant`, `aria-controls`
  - [x] 3.5: Dropdown items: `role="option"`, `aria-selected`

- [x] Task 4: Implement "Xem tất cả kết quả" link (AC: #5)
  - [x] 4.1: Hiện link cuối dropdown khi có kết quả
  - [x] 4.2: Click hoặc Enter trên link → navigate đến `/search?q={query}`

- [x] Task 5: Integrate SearchBar vào Header (AC: #7)
  - [x] 5.1: Import SearchBar vào Header component
  - [x] 5.2: Desktop: hiện SearchBar compact bên cạnh navigation
  - [x] 5.3: Mobile: hiện search icon, tap → mở SearchBar (placeholder cho Story 7.5 full overlay)

- [x] Task 6: Build + verify
  - [x] 6.1: Chạy `pnpm build` — phải thành công
  - [x] 6.2: Verify autocomplete hoạt động với seed data (6 products)
  - [x] 6.3: Verify keyboard navigation
  - [x] 6.4: Verify no-results state

## Dev Notes

### Architecture & Patterns

**Search Strategy (từ Architecture doc Section 2.3):**
- Dùng Payload Local API `find` với `where` clause — KHÔNG dùng custom full-text search
- `publishedOnly` access control tự filter drafts — KHÔNG cần filter `_status` thủ công
- < 100 SKU hiện tại → Payload API đủ nhanh, response < 500ms

**API Route location (từ Architecture doc Section 7):**
```
src/app/(frontend)/api/search/route.ts
```

**Component location (từ Architecture doc Section 7):**
```
src/components/ui/SearchBar.tsx
```

**Data fetching pattern (từ Architecture doc Section 5.3):**
```typescript
// API Route — Server-side
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config: await config })
const results = await payload.find({
  collection: 'products',
  where: {
    or: [
      { name: { contains: query } },
      { sku: { contains: query } },
    ],
  },
  limit: 6,
  locale,
  select: {
    name: true,
    sku: true,
    slug: true,
    brand: true,
    images: true,
  },
})
```

**Client-side fetch pattern:**
```typescript
// SearchBar Client Component
const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`)
const data = await response.json()
```

### Codebase Context Hiện Tại

**Đã có sẵn:**
- Search page tại `src/app/(frontend)/[locale]/search/page.tsx` — server-side search, pagination 12 items
- i18n keys đầy đủ trong `messages/vi.json` và `messages/en.json`:
  - `search.placeholder`: "Tìm theo mã sản phẩm, tên hoặc hãng..."
  - `search.placeholderHero`: "Nhập mã vòng bi hoặc tên sản phẩm..."
  - `search.hints`: "VD: 6205, SKF, vòng bi"
  - `search.resultsCount`: "Tìm thấy {count} sản phẩm cho '{query}'"
  - `search.viewAllResults`: "Xem tất cả kết quả"
  - `search.noResults`: "Không tìm thấy sản phẩm"
  - `search.searching`: "Đang tìm kiếm..."
- Button component tại `src/components/ui/Button.tsx` (primary/secondary/outline/ghost variants)
- Breadcrumb component tại `src/components/ui/Breadcrumb.tsx`
- Header (Client Component) tại `src/components/layout/Header.tsx` — có desktop nav, mobile slide-in, dropdown menus
- Icons shared tại `src/components/layout/icons.tsx`
- `cn()` utility (clsx + tailwind-merge) tại `src/lib/utils.ts`
- `formatTelHref()` utility tại `src/lib/utils.ts`
- Products collection tại `src/collections/Products.ts` — fields: name, sku, slug, brand, categories, images, specifications, featured
- Brands collection: name, slug, logo (no drafts, publicly readable)
- 6 products seeded, 8 brands seeded

**CHƯA có:**
- API route `/api/search` — CẦN TẠO
- SearchBar component — CẦN TẠO
- SearchBar chưa integrated vào Header hoặc Homepage

### Design Specs (từ UX Specification)

**SearchBar component specifications:**
- States: empty, typing, loading, results, no-results
- Variants: Hero (lớn, centered) + Header (compact, inline)
- Autocomplete: debounce 300ms, dropdown hiện ảnh + tên + mã + hãng, max 6 items
- No-results: gợi ý liên hệ kỹ sư, KHÔNG trang trống
- A11y: `role="combobox"`, `aria-expanded`, keyboard nav (Arrow, Enter, Escape)

**Visual specs:**
- Input: border 1px `--border`, border-radius `--radius-md` (8px), padding `--spacing-sm` (8px) → `--spacing-md` (16px)
- Hero variant: larger font, more padding, centered
- Dropdown: border 1px `--border`, background white, max-height scroll, shadow-lg
- Result item: ảnh thumbnail (40x40 hoặc 48x48), tên bold, SKU text-muted, brand text-muted
- Hover/highlight: background `--color-primary-light` (#E8F0F7)
- Focus ring: 2px outline `--color-primary`

**Color system:**
- Primary: `#0F4C75` (steel blue)
- Primary Light: `#E8F0F7`
- Accent: `#D4A843` (amber)
- Text: `#1A1A2E`
- Text Muted: `#6B7280`
- Border: `#E5E7EB`
- Background: `#FAFAFA`

### Routing & Navigation

**Locale-aware routing:**
- Dùng `next-intl/navigation` — `useRouter`, `usePathname` từ `@/i18n/navigation`
- Locale prefix: `as-needed` (default locale `vi` không có prefix, `en` có `/en/...`)
- Navigate đến product: `router.push(\`/product/\${slug}\`)`
- Navigate đến search results: `router.push(\`/search?q=\${query}\`)`

**Lấy locale trong Client Component:**
- `import { useLocale } from 'next-intl'`

### Điểm cần tránh

- **KHÔNG** tạo custom search engine — dùng Payload `find` với `where: { or: [{ name: { contains } }, { sku: { contains } }] }`
- **KHÔNG** filter `_status` thủ công — `publishedOnly` access control xử lý rồi
- **KHÔNG** dùng `useEffect` với cleanup phức tạp cho debounce — dùng simple timeout pattern
- **KHÔNG** fetch trong Server Component — SearchBar là Client Component, fetch qua API route
- **KHÔNG** hard-code strings — dùng i18n keys từ `messages/*.json`
- **KHÔNG** tạo search icon mới — import từ `src/components/layout/icons.tsx` nếu có, hoặc dùng inline SVG đơn giản
- **KHÔNG** thay đổi search page hiện có (`/search/page.tsx`) — story này chỉ tạo SearchBar autocomplete component + API route

### Previous Story Intelligence

**Từ Epic 2 (Stories 2.1-2.6):**
- Header component đã có: desktop nav, mobile slide-in menu, dropdown menus
- Layout đã fetch 3 globals (site-settings, header, footer) qua `Promise.all`
- Client Component boundary: Header nhận serialized data từ layout
- `formatTelHref` đã extract ra `@/lib/utils`
- Icons shared ở `icons.tsx` — PhoneIcon, MailIcon, etc.
- LanguageSwitcher dùng `<a>` tags với explicit locale prefix (đã fix từ `router.replace`)
- Bugfix lesson: `localePrefix: 'as-needed'` phải match giữa middleware và `createNavigation`

**Git patterns:**
- Commit messages: "Add [component] with [feature] (Story X.Y)"
- Build verification: `pnpm build` chạy sau mỗi story
- Code review catches: extract shared code, fix slice limits, pass locale prop

### Project Structure Notes

- SearchBar component đặt tại `src/components/ui/SearchBar.tsx` — theo architecture convention
- API route đặt tại `src/app/(frontend)/api/search/route.ts` — trong frontend route group
- Alignment hoàn toàn với project structure trong Architecture doc Section 7
- Không có conflicts hoặc variances

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2 - Search API context]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 2.3 - Search Strategy]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.3 - Search Autocomplete Flow]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 7 - Project Structure]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 6.2 - Data Fetching Pattern]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Specifications - SearchBar]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Search Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX Consistency Patterns]
- [Source: _bmad-output/implementation-artifacts/2-6-root-layout-integration.md - Previous story learnings]
- [Source: src/app/(frontend)/[locale]/search/page.tsx - Existing search page]
- [Source: src/components/layout/Header.tsx - Header component for integration]
- [Source: messages/vi.json#search - i18n keys]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

### Completion Notes List

- Search API route created at `src/app/(frontend)/api/search/route.ts` — GET handler parses `q` and `locale` query params, queries Products with `name contains` OR `sku contains`, limit 6, returns flattened JSON with brand name and thumbnail URL
- SearchBar Client Component created at `src/components/ui/SearchBar.tsx` — supports `hero` and `header` variants, debounce 300ms, dropdown with thumbnail + name + SKU + brand, no-results state with engineer contact hint
- Full keyboard navigation: Arrow Up/Down cycles through results + "view all" link, Enter selects/navigates, Escape closes + blurs
- ARIA combobox pattern: `role="combobox"`, `aria-expanded`, `aria-activedescendant`, `aria-controls`, `role="option"`, `aria-selected`
- "View all results" link at bottom of dropdown navigates to `/search?q={query}`
- Header integration: desktop shows SearchBar compact inline between nav and CTA; mobile shows search icon that toggles a search bar below header
- Mobile search is a simple toggle bar (Story 7.5 will implement full-screen overlay)
- Integration test added at `tests/int/search-api.int.spec.ts` — 5 tests all pass
- Pre-existing test failures in `access-control.int.spec.ts` (2 failures) not related to this story
- `pnpm build` passes with `/api/search` route registered

### Change Log

- 2026-02-05: Implemented Story 3.1 — SearchBar component with autocomplete, search API route, Header integration
- 2026-02-05: Code review fixes — Fixed locale routing (useRouter from @/i18n/navigation), added AbortController for race condition, added error handling to API route, passed consultPhone from CMS, shared SearchIcon via icons.tsx, improved test assertions

### File List

| File | Action |
|------|--------|
| `src/app/(frontend)/api/search/route.ts` | Created — Search autocomplete API endpoint |
| `src/components/ui/SearchBar.tsx` | Created — SearchBar Client Component with hero/header variants |
| `src/components/layout/Header.tsx` | Modified — added SearchBar to desktop nav and mobile search icon toggle |
| `src/components/layout/icons.tsx` | Modified — added shared SearchIcon |
| `tests/int/search-api.int.spec.ts` | Created — Integration tests for search query logic |
