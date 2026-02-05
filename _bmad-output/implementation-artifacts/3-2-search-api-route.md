# Story 3.2: Search API Route

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want a search API endpoint that queries products,
So that the SearchBar can fetch autocomplete results.

## Acceptance Criteria

1. **Given** GET `/api/search?q={query}&locale={locale}` **When** query length >= 2 **Then** query Products collection: `name contains` OR `sku contains`
2. **Given** Products collection có `publishedOnly` access **When** API trả kết quả **Then** publishedOnly access tự filter drafts — KHÔNG cần filter `_status` thủ công
3. **Given** API query **When** trả kết quả **Then** limit 6, select: name, sku, slug, brand, images; return JSON `{ results: [...] }`
4. **Given** query length < 2 **When** request đến API **Then** return `{ results: [] }` — empty array, không query database
5. **Given** API endpoint **When** nhận request với < 100 products trong database **Then** response < 500ms
6. **Given** API endpoint **When** nhận request không hợp lệ hoặc lỗi server **Then** return proper error response (500) thay vì crash
7. **Given** API endpoint **When** nhận query với ký tự đặc biệt **Then** xử lý an toàn, không SQL injection hoặc query error

## Tasks / Subtasks

- [x] Task 1: Review và enhance API route hiện tại (AC: #1, #2, #3, #4)
  - [x] 1.1: Kiểm tra file `src/app/(frontend)/api/search/route.ts` đã có — xác nhận query logic đúng
  - [x] 1.2: Verify `publishedOnly` access control hoạt động đúng — draft products KHÔNG xuất hiện trong kết quả
  - [x] 1.3: Verify response format: `{ results: [{ id, name, sku, slug, brand, thumbnail }] }`
  - [x] 1.4: Verify empty array khi query < 2 ký tự

- [x] Task 2: Thêm error handling và input validation (AC: #6, #7)
  - [x] 2.1: Wrap payload.find trong try-catch, return `NextResponse.json({ results: [], error: 'Internal server error' }, { status: 500 })`
  - [x] 2.2: Validate locale parameter — chỉ chấp nhận `'vi'` hoặc `'en'`, default `'vi'`
  - [x] 2.3: Sanitize query string — trim whitespace (đã có), limit length 100 ký tự

- [x] Task 3: Performance verification (AC: #5)
  - [x] 3.1: Test response time với seed data (6 products) — xác nhận < 500ms (warm: ~8-10ms, cold: ~451ms)
  - [x] 3.2: Verify `select` chỉ fetch fields cần thiết (giảm payload size)

- [x] Task 4: Build + verify
  - [x] 4.1: Chạy `pnpm build` — thành công
  - [x] 4.2: Test API endpoint: `curl localhost:3000/api/search?q=6205&locale=vi` — trả đúng kết quả
  - [x] 4.3: Test edge cases: query rỗng, query 1 ký tự, query không tìm thấy, locale=en, special chars — tất cả pass

## Dev Notes

### ⚠️ QUAN TRỌNG: API Route Đã Tồn Tại

File `src/app/(frontend)/api/search/route.ts` đã được tạo trong Story 3.1 (Task 1). Story này chủ yếu là **review, enhance, và validate** — KHÔNG tạo lại từ đầu.

**Hiện trạng (từ Story 3.1):**
- Query logic: `name contains` OR `sku contains` ✅
- Limit 6, select fields ✅
- Empty array khi query < 2 ✅
- Brand name extraction từ relationship ✅
- Thumbnail extraction từ images array ✅

**Cần thêm:**
- Error handling (try-catch) ❌
- Locale validation ❌
- Performance verification ❌

### Architecture & Patterns

**Search Strategy (từ Architecture doc Section 2.3):**
- Dùng Payload Local API `find` với `where` clause — KHÔNG dùng custom full-text search
- `publishedOnly` access control tự filter drafts — KHÔNG cần filter `_status` thủ công
- < 100 SKU hiện tại → Payload API đủ nhanh, response < 500ms

**API Route (hiện tại):**
```
src/app/(frontend)/api/search/route.ts
```

**Implementation pattern:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  const query = searchParams.get('q')?.trim() ?? ''
  const locale = searchParams.get('locale') ?? 'vi'

  if (query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      or: [
        { name: { contains: query } },
        { sku: { contains: query } },
      ],
    },
    limit: 6,
    locale: locale as 'vi' | 'en',
    select: { name: true, sku: true, slug: true, brand: true, images: true },
  })

  // Transform docs → lightweight response
  const results = docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    sku: doc.sku,
    slug: doc.slug,
    brand: typeof doc.brand === 'object' && doc.brand ? doc.brand.name : null,
    thumbnail: /* extract from images[0].image.sizes.thumbnail.url */,
  }))

  return NextResponse.json({ results })
}
```

**Response format:**
```json
{
  "results": [
    {
      "id": "uuid",
      "name": "Vòng bi SKF 6205-2RS",
      "sku": "6205-2RS",
      "slug": "vong-bi-skf-6205-2rs",
      "brand": "SKF",
      "thumbnail": "/media/products/6205-thumb.jpg"
    }
  ]
}
```

### Codebase Context Hiện Tại

**Đã có sẵn:**
- API route file: `src/app/(frontend)/api/search/route.ts` — đã implement đầy đủ query logic
- Products collection: `src/collections/Products.ts` — fields: name, sku, slug, brand (relationship), images (array)
- Access control: `publishedOnly` trong `src/lib/payload/access.ts`
- Search page: `src/app/(frontend)/[locale]/search/page.tsx` — server-side full search (limit 12, pagination)
- 6 products seeded, 8 brands seeded

**Products Collection Fields (quan trọng):**
- `brand`: relationship field (`relationTo: 'brands'`) — khi populated là object `{ id, name, slug, ... }`
- `images`: array → mỗi item có `image` (upload to media) → `image.sizes.thumbnail.url` cho thumbnail
- `sku`: text field, indexed — KHÔNG localized
- `name`: text field, localized, required

### Điểm cần tránh

- **KHÔNG** tạo lại file API route — file đã tồn tại, chỉ enhance
- **KHÔNG** filter `_status` thủ công — `publishedOnly` access control xử lý rồi
- **KHÔNG** dùng full-text search phức tạp — `contains` query đủ cho < 100 SKU
- **KHÔNG** thay đổi response format — SearchBar component (Story 3.1) đã consume format hiện tại
- **KHÔNG** thêm pagination cho autocomplete API — limit 6 là cố định
- **KHÔNG** thêm caching — không cần cho < 100 products

### Previous Story Intelligence

**Từ Story 3.1 (SearchBar component):**
- API route đã được tạo với đầy đủ query logic
- SearchBar component consume response format: `{ results: [{ id, name, sku, slug, brand, thumbnail }] }`
- Brand extracted từ relationship: `typeof doc.brand === 'object' && doc.brand ? doc.brand.name : null`
- Thumbnail extracted: `doc.images[0].image.sizes.thumbnail.url ?? doc.images[0].image.url`
- Fetch pattern: `fetch(\`/api/search?q=\${encodeURIComponent(query)}&locale=\${locale}\`)`

**Từ Epic 2 (Stories 2.1-2.6):**
- `localePrefix: 'as-needed'` — default locale vi không có prefix
- `publishedOnly` access control hoạt động đúng cho Products, News, Services, Pages

### Project Structure Notes

- API route tại `src/app/(frontend)/api/search/route.ts` — trong frontend route group, đúng convention
- Alignment hoàn toàn với Architecture doc Section 7
- Không có conflicts hoặc variances

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2 - Search API route]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 2.3 - Search Strategy]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.3 - Search Autocomplete Flow]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 6.2 - Data Fetching Pattern]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 7 - Project Structure]
- [Source: _bmad-output/implementation-artifacts/3-1-searchbar-component.md - Previous story with API route creation]
- [Source: src/app/(frontend)/api/search/route.ts - Existing API route implementation]
- [Source: src/collections/Products.ts - Products collection schema]
- [Source: src/lib/payload/access.ts - publishedOnly access control]
- [Source: src/app/(frontend)/[locale]/search/page.tsx - Existing search page]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Debug Log References
- Build: `pnpm build` — thành công, không lỗi TypeScript
- Tests: 15/15 search API tests pass (8 route handler tests mới + 7 Payload query tests có sẵn)
- Pre-existing failures: 2 tests trong `access-control.int.spec.ts` fail trước khi thay đổi (không liên quan)
- Performance: cold ~451ms, warm ~8-10ms — đều < 500ms threshold

### Completion Notes List
- ✅ Task 1: Reviewed existing API route — query logic, publishedOnly access, response format, empty query guard đều đúng
- ✅ Task 2: Enhanced error handling (error message in 500 response), added locale validation (only vi/en, default vi), added query length limit (max 100 chars)
- ✅ Task 3: Performance verified — response time well within < 500ms, select chỉ fetch 5 fields cần thiết
- ✅ Task 4: Build thành công, tất cả edge cases pass (empty query, short query, not found, locale=en, special chars)

### Change Log
- 2026-02-05: Enhanced search API route with locale validation, error message in 500 response, query length limit. Added 8 route handler integration tests.
- 2026-02-05: Code review fixes - import locales from i18n config (single source of truth), add MAX_QUERY_LENGTH constant, add 3 missing tests (query length limit, boundary 2 chars, improved whitespace trimming), refactor test module-level variable.

### File List
- `src/app/(frontend)/api/search/route.ts` — modified (locale validation, error message, query length limit, i18n config import)
- `tests/int/search-api.int.spec.ts` — modified (added 11 route handler tests total, improved structure)

### Senior Developer Review

**Review Date:** 2026-02-05
**Outcome:** ✅ APPROVED with fixes applied

**Issues Found & Fixed:**
- MEDIUM: Duplicate locale config → Fixed: now imports from `@/i18n/config`
- MEDIUM: Missing test for query length limit → Fixed: added test
- MEDIUM: Missing boundary test for 2 chars → Fixed: added test
- LOW: Magic number 100 → Fixed: added `MAX_QUERY_LENGTH` constant
- LOW: Module-level payload variable → Fixed: moved to describe block scope
- LOW: Whitespace test not explicit → Fixed: improved test to compare results

**All ACs Verified:**
- AC#1: ✅ Query products by name/sku contains
- AC#2: ✅ publishedOnly access configured
- AC#3: ✅ limit 6, select fields, JSON response
- AC#4: ✅ Empty array when query < 2
- AC#5: ✅ Response < 500ms (manual verification)
- AC#6: ✅ Error handling with 500
- AC#7: ✅ Special chars handled safely
