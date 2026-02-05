# Story 3.3: Search Results Page

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng,
I want to see full search results on a dedicated page,
So that I can browse all matching products when autocomplete isn't enough.

## Acceptance Criteria

1. **Given** `/search?q={query}` **When** trang load **Then** hiện grid sản phẩm matching query (name hoặc sku contains)
2. **Given** kết quả tìm thấy **When** render **Then** hiện số lượng kết quả: "Tìm thấy X sản phẩm cho '{query}'" (dùng i18n key `search.resultsCount`)
3. **Given** > 12 kết quả **When** user muốn xem thêm **Then** pagination: Load More button (12 items per page) — KHÔNG dùng numbered pagination
4. **Given** search không tìm thấy **When** render **Then** empty state: "Không tìm thấy sản phẩm" + gợi ý liên hệ kỹ sư (SĐT tư vấn)
5. **Given** search page **When** render product cards **Then** dùng ProductCard component (tạo trong Story 3.4) hoặc inline card tương đương: ảnh + tên + SKU + hãng
6. **Given** search page **When** user truy cập không có query **Then** hiện empty state hướng dẫn nhập từ khóa
7. **Given** search page **When** render **Then** breadcrumb: Home > Tìm kiếm, SearchBar hiện ở đầu trang cho phép search lại

## Tasks / Subtasks

- [x] Task 1: Refactor search page thành Load More pattern (AC: #1, #3)
  - [x] 1.1: Giữ file `src/app/(frontend)/[locale]/search/page.tsx` — KHÔNG tạo file mới
  - [x] 1.2: Tách phần product grid ra Client Component riêng `src/components/search/SearchResults.tsx` (cần state cho Load More)
  - [x] 1.3: Server Component fetch trang đầu (limit 12, page 1) + pass initial data xuống
  - [x] 1.4: Client Component implement "Load More" button: fetch thêm data via API hoặc server action
  - [x] 1.5: Load More fetch: gọi search API mới hoặc dùng `/api/search-page?q={q}&page={n}&limit=12` (khác autocomplete API limit 6)

- [x] Task 2: Tạo search page API cho pagination (AC: #3)
  - [x] 2.1: Tạo file `src/app/(frontend)/api/search-page/route.ts` — GET handler cho full-page search
  - [x] 2.2: Params: `q`, `locale`, `page` (default 1), `limit` (default 12)
  - [x] 2.3: Return JSON `{ results: [...], totalDocs, hasNextPage, nextPage }`
  - [x] 2.4: Reuse same query pattern: `name contains` OR `sku contains`, publishedOnly access

- [x] Task 3: Cập nhật UI theo UX spec (AC: #2, #4, #5, #6, #7)
  - [x] 3.1: Hiện results count dùng i18n key `search.resultsCount` thay vì hardcode string
  - [x] 3.2: Empty state dùng i18n keys: `search.noResults`, `search.noResultsHint` với SĐT tư vấn
  - [x] 3.3: Empty search state: icon + hướng dẫn nhập từ khóa
  - [x] 3.4: Grid layout: 1 col mobile, 2 col tablet, 4 col desktop (giữ nguyên)
  - [x] 3.5: Product card inline: ảnh (thumbnail hoặc placeholder) + tên + SKU badge + brand name
  - [x] 3.6: Thêm Breadcrumb: Home > Tìm kiếm
  - [x] 3.7: Tích hợp SearchBar component (hero hoặc header variant) ở đầu trang

- [x] Task 4: Build + verify
  - [x] 4.1: Chạy `pnpm build` — phải thành công
  - [x] 4.2: Verify search results hiện đúng với seed data
  - [x] 4.3: Verify Load More button hoạt động (nếu > 12 results)
  - [x] 4.4: Verify empty state khi search không tìm thấy
  - [x] 4.5: Verify breadcrumb và SearchBar integration

## Dev Notes

### ⚠️ QUAN TRỌNG: Search Page Đã Tồn Tại

File `src/app/(frontend)/[locale]/search/page.tsx` đã có sẵn từ initial setup. Story này là **refactor và enhance** — KHÔNG tạo lại từ đầu.

**Hiện trạng:**
- Server Component với Payload `find` query ✅
- Grid 4 col desktop / 2 col tablet / 1 col mobile ✅
- Results count display ✅
- Empty state (no results + no query) ✅
- `generateMetadata` cho SEO ✅

**Cần thay đổi:**
- Pagination: numbered pages → **Load More button** (cần Client Component cho state)
- Hardcoded strings → **i18n keys** (`search.resultsCount`, `search.noResults`, `search.noResultsHint`)
- Inline product cards → có thể extract nhưng **Story 3.4 sẽ tạo ProductCard** — ở đây dùng inline tạm
- Thiếu **Breadcrumb** component
- Thiếu **SearchBar** integration trên trang

### Architecture & Patterns

**Load More Pattern:**
- Server Component renders trang đầu (SSR, SEO-friendly)
- Client Component nhận initial data + handles "Load More"
- Load More fetch thêm data, append vào state
- KHÔNG dùng infinite scroll — chỉ Load More button

**Suggested implementation:**
```typescript
// search/page.tsx (Server Component)
export default async function SearchPage({ params, searchParams }) {
  // Fetch initial page
  const initialResults = await payload.find({ ... limit: 12, page: 1 })
  return (
    <>
      <Breadcrumb items={[{ label: t('search'), href: '/search' }]} />
      <SearchBar variant="header" />
      <SearchResults
        initialResults={initialResults.docs}
        totalDocs={initialResults.totalDocs}
        query={q}
        locale={locale}
      />
    </>
  )
}

// components/search/SearchResults.tsx (Client Component)
'use client'
export function SearchResults({ initialResults, totalDocs, query, locale }) {
  const [results, setResults] = useState(initialResults)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const hasMore = results.length < totalDocs

  const loadMore = async () => {
    setLoading(true)
    const res = await fetch(`/api/search-page?q=${query}&page=${page + 1}&locale=${locale}`)
    const data = await res.json()
    setResults(prev => [...prev, ...data.results])
    setPage(prev => prev + 1)
    setLoading(false)
  }

  return (
    <>
      <p>{t('search.resultsCount', { count: totalDocs, query })}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.map(product => <ProductCard ... />)}
      </div>
      {hasMore && (
        <Button onClick={loadMore} loading={loading}>
          {t('common.loadMore')}
        </Button>
      )}
    </>
  )
}
```

**Search page API (khác autocomplete API):**
```typescript
// api/search-page/route.ts
// Limit 12 (vs autocomplete limit 6)
// Returns full product data (vs autocomplete returns lightweight)
// Supports pagination with page param
```

### Codebase Context Hiện Tại

**Đã có sẵn:**
- Search page: `src/app/(frontend)/[locale]/search/page.tsx` — server-side, cần refactor
- SearchBar component: `src/components/ui/SearchBar.tsx` — hero/header variants, autocomplete
- Search autocomplete API: `src/app/(frontend)/api/search/route.ts` — limit 6, lightweight response
- Breadcrumb: `src/components/ui/Breadcrumb.tsx` — reusable component
- Button: `src/components/ui/Button.tsx` — primary/secondary/outline/ghost variants, sm/md/lg sizes
- i18n keys: `search.resultsCount`, `search.noResults`, `search.noResultsHint`, `search.searching`
- `cn()` utility: `src/lib/utils.ts`
- `formatTelHref()`: `src/lib/utils.ts`

**CHƯA có:**
- Search page pagination API (`/api/search-page`) — CẦN TẠO
- SearchResults Client Component — CẦN TẠO
- ProductCard component — sẽ tạo trong Story 3.4, dùng inline card tạm ở đây
- i18n key `common.loadMore` — KIỂM TRA trước, thêm nếu chưa có

### i18n Keys Có Sẵn

```json
// messages/vi.json
"search": {
  "placeholder": "Tìm theo mã sản phẩm, tên hoặc hãng...",
  "resultsCount": "Tìm thấy {count} sản phẩm cho '{query}'",
  "viewAllResults": "Xem tất cả kết quả",
  "noResults": "Không tìm thấy sản phẩm",
  "noResultsHint": "Liên hệ kỹ sư tư vấn: {phone}",
  "searching": "Đang tìm kiếm..."
}
```

### Điểm cần tránh

- **KHÔNG** xóa search page hiện tại và tạo mới — refactor file existing
- **KHÔNG** dùng numbered pagination — UX spec yêu cầu Load More button
- **KHÔNG** dùng infinite scroll — chỉ Load More button
- **KHÔNG** hardcode strings — dùng i18n keys có sẵn
- **KHÔNG** tạo ProductCard component ở story này — Story 3.4 sẽ handle, dùng inline card tương tự hiện tại
- **KHÔNG** thêm sort/filter — Story 3.5 sẽ handle (CategoryFilter + sort)
- **KHÔNG** tạo SearchIcon/GearIcon mới — import từ `src/components/layout/icons.tsx` nếu có, hoặc giữ inline SVG hiện tại
- **KHÔNG** thay đổi autocomplete API (`/api/search`) — tạo API riêng cho pagination

### Previous Story Intelligence

**Từ Story 3.1 (SearchBar component):**
- SearchBar đã hoạt động với 2 variants (hero/header)
- "Xem tất cả kết quả" link trong dropdown navigate đến `/search?q={query}`
- `useRouter` từ `@/i18n/navigation` cho navigation
- SearchBar fetch autocomplete API riêng (limit 6)

**Từ Story 3.2 (Search API route):**
- API route `/api/search` limit 6 — cho autocomplete
- Search page cần API riêng (limit 12 + pagination) hoặc dùng server action

**Từ Epic 2:**
- Breadcrumb component có sẵn: `import { Breadcrumb } from '@/components/ui/Breadcrumb'`
- Button component có sẵn: `import { Button } from '@/components/ui/Button'`
- Layout đã fetch globals, locale available

**Git patterns:**
- Commit messages: "Add [feature] (Story X.Y)" hoặc "Refactor [component] (Story X.Y)"
- Build verification: `pnpm build` sau mỗi story

### Project Structure Notes

- Search page: `src/app/(frontend)/[locale]/search/page.tsx` — giữ nguyên location
- SearchResults component: `src/components/search/SearchResults.tsx` — new Client Component
- Search page API: `src/app/(frontend)/api/search-page/route.ts` — new API route
- Alignment với Architecture doc Section 7

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.3 - Search results page]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.3 - Search Autocomplete Flow]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 7 - Project Structure]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Section 7.2 - Search Results Layout]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Section 8.1 - Empty State Pattern]
- [Source: _bmad-output/implementation-artifacts/3-1-searchbar-component.md - SearchBar integration context]
- [Source: _bmad-output/implementation-artifacts/3-2-search-api-route.md - Search API context]
- [Source: src/app/(frontend)/[locale]/search/page.tsx - Existing search page to refactor]
- [Source: src/components/ui/SearchBar.tsx - SearchBar component for integration]
- [Source: src/components/ui/Breadcrumb.tsx - Breadcrumb component]
- [Source: src/components/ui/Button.tsx - Button component for Load More]
- [Source: messages/vi.json#search - i18n keys]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Fixed TypeScript error: locale type needed casting to `Locale` type for Payload query
- Fixed TypeScript error: Product type has `images` array (not `image`), updated to use `product.images?.[0]?.image`

### Completion Notes List

1. **Task 1 Complete**: Refactored search page from numbered pagination to Load More pattern
   - Kept existing `search/page.tsx` as Server Component
   - Created `SearchResults.tsx` Client Component with useState for results and page state
   - Server Component fetches initial 12 results and passes to client
   - Client Component handles "Load More" with fetch to `/api/search-page`

2. **Task 2 Complete**: Created search-page API for pagination
   - New route at `/api/search-page/route.ts`
   - Params: q, locale (vi/en), page (default 1), limit (default 12, max 50)
   - Returns: { results, totalDocs, hasNextPage, nextPage }
   - Uses same query pattern: name OR sku contains, _status = published

3. **Task 3 Complete**: Updated UI with i18n and components
   - Results count uses `search.resultsCount` i18n key
   - Empty states use `search.noResults`, `search.noResultsHint` with phone
   - No-query state shows search hints
   - Grid layout preserved: 1/2/4 cols responsive
   - Product cards inline: thumbnail image, name, SKU badge, brand
   - Added Breadcrumb component (Home > Tìm kiếm)
   - Integrated SearchBar (hero variant) at page header

4. **Task 4 Complete**: Build and verification
   - `pnpm build` passes successfully
   - 14 new integration tests added for search-page API (all passing)
   - Pre-existing test failure unrelated to this story

### File List

**New Files:**
- src/components/search/SearchResults.tsx
- src/app/(frontend)/api/search-page/route.ts
- tests/int/search-page-api.int.spec.ts

**Modified Files:**
- src/app/(frontend)/[locale]/search/page.tsx
- src/components/layout/icons.tsx (added GearIcon, LoadingSpinner)
- messages/vi.json (added search.enterKeywords)
- messages/en.json (added search.enterKeywords)

## Senior Developer Review

**Review Date:** 2026-02-05

**Issues Found & Fixed:**

| Severity | Issue | Fix Applied |
|----------|-------|-------------|
| HIGH | Hardcoded strings in empty search state | Added i18n key `search.enterKeywords` to vi/en.json, updated page.tsx |
| MEDIUM | Locale type hardcoded in API | Imported `Locale` type from config, added validation |
| MEDIUM | No error feedback to user on load failure | Added error state and error message display |
| MEDIUM | Duplicate icons not using shared icons | Imported from layout/icons.tsx, removed inline definitions |
| MEDIUM | API allows invalid locale values | Added validation against `locales` array from config |
| LOW | Missing aria-label on phone link | Added aria-label for accessibility |
| LOW | GearIcon not in shared icons | Added to layout/icons.tsx |
| LOW | LoadingSpinner not in shared icons | Added to layout/icons.tsx with animate-spin |

**Build Verification:** ✅ Passed

**Reviewer:** Tan (via code review workflow)

## Change Log

- 2026-02-05: Code review fixes - i18n, shared icons, error handling, locale validation (Story 3.3)
- 2026-02-05: Implemented Search Results Page with Load More pattern (Story 3.3)
