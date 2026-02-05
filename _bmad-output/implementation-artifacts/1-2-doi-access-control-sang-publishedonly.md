# Story 1.2: Đổi access control sang publishedOnly

Status: done

## Story

As a admin,
I want draft content protected from public API access,
So that unpublished content is not visible to website visitors.

## Acceptance Criteria

1. **Given** Products collection có `read: anyone` **When** cập nhật access control **Then** đổi thành `read: publishedOnly` và import `publishedOnly` thay `anyone`
2. **Given** News collection có `read: anyone` **When** cập nhật access control **Then** đổi thành `read: publishedOnly` và import `publishedOnly` thay `anyone`
3. **Given** Services collection có `read: anyone` **When** cập nhật access control **Then** đổi thành `read: publishedOnly` và import `publishedOnly` thay `anyone`
4. **Given** Pages collection có `read: anyone` **When** cập nhật access control **Then** đổi thành `read: publishedOnly` và import `publishedOnly` thay `anyone`
5. **Given** `publishedOnly` đã được áp dụng cho 4 collections **When** frontend query không có `_status` filter **Then** chỉ trả về published documents cho anonymous users
6. **Given** admin đăng nhập vào Payload Admin **When** query API **Then** vẫn thấy tất cả documents (cả draft lẫn published) — vì `publishedOnly` return `true` cho authenticated users
7. **Given** tất cả frontend pages có manual `_status: { equals: 'published' }` filter **When** cập nhật **Then** loại bỏ tất cả manual `_status` filters vì `publishedOnly` đã xử lý ở access layer
8. **Given** tất cả thay đổi hoàn tất **When** chạy build **Then** app build thành công không lỗi

## Tasks / Subtasks

- [x] Task 1: Cập nhật Products collection (AC: #1)
  - [x] 1.1: `src/collections/Products.ts` line 2 — đổi import từ `{ anyone, isAdmin }` thành `{ publishedOnly, isAdmin }`
  - [x] 1.2: `src/collections/Products.ts` line 13 — đổi `read: anyone` thành `read: publishedOnly`

- [x] Task 2: Cập nhật News collection (AC: #2)
  - [x] 2.1: `src/collections/News.ts` line 2 — đổi import từ `{ anyone, isAdmin }` thành `{ publishedOnly, isAdmin }`
  - [x] 2.2: `src/collections/News.ts` line 13 — đổi `read: anyone` thành `read: publishedOnly`

- [x] Task 3: Cập nhật Services collection (AC: #3)
  - [x] 3.1: `src/collections/Services.ts` line 2 — đổi import từ `{ anyone, isAdmin }` thành `{ publishedOnly, isAdmin }`
  - [x] 3.2: `src/collections/Services.ts` line 13 — đổi `read: anyone` thành `read: publishedOnly`

- [x] Task 4: Cập nhật Pages collection (AC: #4)
  - [x] 4.1: `src/collections/Pages.ts` line 2 — đổi import từ `{ anyone, isAdmin }` thành `{ publishedOnly, isAdmin }`
  - [x] 4.2: `src/collections/Pages.ts` line 14 — đổi `read: anyone` thành `read: publishedOnly`

- [x] Task 5: Loại bỏ manual `_status` filters từ frontend pages (AC: #7)
  - [x] 5.1: `src/app/(frontend)/[locale]/page.tsx` line 33 — xóa `_status: { equals: 'published' }` khỏi where clause
  - [x] 5.2: `src/app/(frontend)/[locale]/products/page.tsx` line 31 — xóa `_status: { equals: 'published' }` khỏi where object initialization
  - [x] 5.3: `src/app/(frontend)/[locale]/product/[slug]/page.tsx` line 51 — xóa `_status: { equals: 'published' }` khỏi where clause
  - [x] 5.4: `src/app/(frontend)/[locale]/news/page.tsx` line 32 — xóa `_status: { equals: 'published' }` khỏi where clause
  - [x] 5.5: `src/app/(frontend)/[locale]/news/[slug]/page.tsx` line 50 — xóa `_status: { equals: 'published' }` khỏi where clause
  - [x] 5.6: `src/app/(frontend)/[locale]/services/page.tsx` line 21 — xóa `_status: { equals: 'published' }` khỏi where clause
  - [x] 5.7: `src/app/(frontend)/[locale]/categories/[slug]/page.tsx` line 28 — xóa `_status: { equals: 'published' }` khỏi where clause
  - [x] 5.8: `src/app/(frontend)/[locale]/brands/[slug]/page.tsx` line 28 — xóa `_status: { equals: 'published' }` khỏi where clause
  - [x] 5.9: `src/app/(frontend)/[locale]/search/page.tsx` line 38 — xóa `_status: { equals: 'published' }` khỏi where clause

- [x] Task 6: Verify build (AC: #8)
  - [x] 6.1: Chạy `pnpm build` — phải thành công không lỗi

## Dev Notes

### Giải thích `publishedOnly` function

```typescript
// src/lib/payload/access.ts
export const publishedOnly: Access = ({ req: { user } }) => {
  if (user) return true          // Admin: thấy tất cả (draft + published)
  return {
    _status: { equals: 'published' }  // Anonymous: chỉ thấy published
  }
}
```

Function này đã tồn tại trong codebase nhưng **chưa được sử dụng** bởi bất kỳ collection nào. Tất cả 4 draft-enabled collections hiện dùng `read: anyone`, nghĩa là anonymous users có thể thấy cả draft content qua API.

### Files cần thay đổi (13 files)

| File | Thay đổi | Lines |
|------|----------|-------|
| `src/collections/Products.ts` | Import + access | Lines 2, 13 |
| `src/collections/News.ts` | Import + access | Lines 2, 13 |
| `src/collections/Services.ts` | Import + access | Lines 2, 13 |
| `src/collections/Pages.ts` | Import + access | Lines 2, 14 |
| `src/app/(frontend)/[locale]/page.tsx` | Xóa `_status` filter | Line 33 |
| `src/app/(frontend)/[locale]/products/page.tsx` | Xóa `_status` filter | Line 31 |
| `src/app/(frontend)/[locale]/product/[slug]/page.tsx` | Xóa `_status` filter | Line 51 |
| `src/app/(frontend)/[locale]/news/page.tsx` | Xóa `_status` filter | Line 32 |
| `src/app/(frontend)/[locale]/news/[slug]/page.tsx` | Xóa `_status` filter | Line 50 |
| `src/app/(frontend)/[locale]/services/page.tsx` | Xóa `_status` filter | Line 21 |
| `src/app/(frontend)/[locale]/categories/[slug]/page.tsx` | Xóa `_status` filter | Line 28 |
| `src/app/(frontend)/[locale]/brands/[slug]/page.tsx` | Xóa `_status` filter | Line 28 |
| `src/app/(frontend)/[locale]/search/page.tsx` | Xóa `_status` filter | Line 38 |

### Files KHÔNG cần thay đổi

| File | Lý do |
|------|-------|
| `src/lib/payload/access.ts` | `publishedOnly` function đã tồn tại, không cần sửa |
| `src/collections/Categories.ts` | Không có drafts — dùng `anyone` là đúng |
| `src/collections/Brands.ts` | Không có drafts — dùng `anyone` là đúng |
| `src/collections/Media.ts` | Không có drafts — dùng `anyone` là đúng |
| `src/collections/Users.ts` | Dùng `isAdmin` — không liên quan |

### Implementation Pattern

**Collection access change:**
```typescript
// TRƯỚC
import { anyone, isAdmin } from '@/lib/payload/access'
// ...
access: {
  read: anyone,  // Lỗ hổng: anonymous thấy draft content

// SAU
import { publishedOnly, isAdmin } from '@/lib/payload/access'
// ...
access: {
  read: publishedOnly,  // An toàn: anonymous chỉ thấy published
```

**Frontend query simplification:**
```typescript
// TRƯỚC — manual filter (redundant sau khi có publishedOnly)
const products = await payload.find({
  collection: 'products',
  where: { featured: { equals: true }, _status: { equals: 'published' } },
})

// SAU — clean query (publishedOnly xử lý ở access layer)
const products = await payload.find({
  collection: 'products',
  where: { featured: { equals: true } },
})
```

### Thứ tự thực hiện

1. Collections trước (Tasks 1-4) — đổi access control
2. Frontend pages sau (Task 5) — loại bỏ manual filters
3. Build verification cuối cùng (Task 6)

### Architecture Constraints

- **PayloadCMS access control**: `read` access function chạy cho MỌI query (API, REST, GraphQL, Local API). Khi dùng `publishedOnly`, tất cả anonymous queries tự động bị filter — không cần manual `_status` filter
- **Admin authenticated queries**: Admin users (đăng nhập) vẫn thấy tất cả documents vì `publishedOnly` return `true` khi `user` tồn tại
- **Local API**: Frontend dùng Local API (server-side) mặc định KHÔNG có user context → `publishedOnly` sẽ tự động filter drafts
- **Không cần migration database** — chỉ thay đổi runtime behavior

### Cảnh báo

- **KHÔNG** thay đổi `access.ts` — function `publishedOnly` đã đúng
- **KHÔNG** thay đổi access cho Categories, Brands, Media — chúng không có drafts
- **KHÔNG** thêm `_status` filter mới vào bất kỳ query nào — `publishedOnly` đã xử lý
- **Dependency**: Story 1.1 (loại bỏ KM locale) nên được hoàn thành trước story này, nhưng không bắt buộc — hai story có thể thực hiện độc lập
- Khi xóa `_status` filter khỏi where clause, cần kiểm tra xem where object có còn property nào khác không. Nếu where chỉ còn `{}` thì xóa luôn `where` param

### Project Structure Notes

- Collections nằm trong `src/collections/` — đúng convention
- Access utilities nằm trong `src/lib/payload/access.ts` — đã có sẵn `publishedOnly`
- Frontend pages nằm trong `src/app/(frontend)/[locale]/` — đúng Next.js App Router convention
- Không có conflict với project structure

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 9.5]
- [Source: src/lib/payload/access.ts#L11-19 - publishedOnly function]
- [Source: src/collections/Products.ts#L13 - Current read: anyone]
- [Source: src/collections/News.ts#L13 - Current read: anyone]
- [Source: src/collections/Services.ts#L13 - Current read: anyone]
- [Source: src/collections/Pages.ts#L14 - Current read: anyone]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

Không có lỗi nào trong quá trình thực hiện.

### Completion Notes List

- Đã đổi import và access control từ `anyone` sang `publishedOnly` cho 4 collections: Products, News, Services, Pages
- Đã xóa tất cả manual `_status: { equals: 'published' }` filters khỏi 9 frontend pages
- `publishedOnly` function đã tồn tại sẵn trong `src/lib/payload/access.ts` — không cần tạo mới
- Build thành công, không có lỗi TypeScript hay runtime errors
- Tất cả 8 Acceptance Criteria đã được đáp ứng

### Change Log

- 2026-02-05: Đổi access control sang publishedOnly cho 4 draft-enabled collections và loại bỏ 9 manual _status filters từ frontend pages
- 2026-02-05: Code review — thêm integration test cho publishedOnly, sửa stale e2e test

### File List

- `src/collections/Products.ts` (modified) — import + access control
- `src/collections/News.ts` (modified) — import + access control
- `src/collections/Services.ts` (modified) — import + access control
- `src/collections/Pages.ts` (modified) — import + access control
- `src/app/(frontend)/[locale]/page.tsx` (modified) — xóa _status filter
- `src/app/(frontend)/[locale]/products/page.tsx` (modified) — xóa _status filter
- `src/app/(frontend)/[locale]/product/[slug]/page.tsx` (modified) — xóa _status filter
- `src/app/(frontend)/[locale]/news/page.tsx` (modified) — xóa _status filter
- `src/app/(frontend)/[locale]/news/[slug]/page.tsx` (modified) — xóa _status filter
- `src/app/(frontend)/[locale]/services/page.tsx` (modified) — xóa _status filter
- `src/app/(frontend)/[locale]/categories/[slug]/page.tsx` (modified) — xóa _status filter
- `src/app/(frontend)/[locale]/brands/[slug]/page.tsx` (modified) — xóa _status filter
- `src/app/(frontend)/[locale]/search/page.tsx` (modified) — xóa _status filter
- `tests/int/access-control.int.spec.ts` (new) — integration test cho publishedOnly
- `tests/e2e/frontend.e2e.spec.ts` (modified) — cập nhật stale assertions

## Senior Developer Review (AI)

**Review Date:** 2026-02-05
**Review Outcome:** Approve (with fixes applied)

### Findings Summary

- **0 HIGH** | **3 MEDIUM** | **2 LOW**

### Action Items

- [x] [M1] Thêm integration test cho publishedOnly access control
- [x] [M2] Sửa stale e2e frontend test (expect "Payload Blank Template" → "VIES")
- [x] [M3] AC #5, #6 giờ có thể verify qua integration test thay vì chỉ code inspection
- L1, L2: Pre-existing issues, không thuộc scope story này
