# Story 1.1: Loại bỏ KM locale

Status: done

## Story

As a developer,
I want to remove Khmer locale from all configs,
So that the application only supports VI/EN as required.

## Acceptance Criteria

1. **Given** payload.config.ts có 3 locales (vi, en, km) **When** cập nhật localization config **Then** chỉ còn 2 locales: `{ label: 'Tiếng Việt', code: 'vi' }` và `{ label: 'English', code: 'en' }`
2. **Given** i18n/config.ts export locales array **When** cập nhật config **Then** chỉ export `['vi', 'en']` và localeNames chỉ có vi/en
3. **Given** next.config.mjs cấu hình next-intl **When** cập nhật **Then** chỉ hỗ trợ vi/en (tự động qua i18n/config.ts import)
4. **Given** file `messages/km.json` tồn tại **When** hoàn thành **Then** file bị xóa
5. **Given** components Header.tsx và Footer.tsx có KM references **When** cập nhật **Then** loại bỏ tất cả KM ternary conditions và locale entries
6. **Given** scripts/seed.ts có KM translations **When** cập nhật **Then** loại bỏ tất cả `km:` keys từ locale objects
7. **Given** tất cả thay đổi hoàn tất **When** chạy build **Then** app build thành công không lỗi

## Tasks / Subtasks

- [x] Task 1: Cập nhật PayloadCMS localization config (AC: #1)
  - [x] 1.1: `src/payload.config.ts` — xóa `{ label: 'ភាសាខ្មែរ', code: 'km' }` khỏi locales array
- [x] Task 2: Cập nhật i18n config (AC: #2)
  - [x] 2.1: `src/i18n/config.ts` — xóa `'km'` khỏi locales array → `['vi', 'en']`
  - [x] 2.2: `src/i18n/config.ts` — xóa `km: 'ភាសាខ្មែរ'` khỏi localeNames object
- [x] Task 3: Xóa messages/km.json (AC: #4)
  - [x] 3.1: Đã xóa `messages/km.json`
- [x] Task 4: Cập nhật Header component (AC: #5)
  - [x] 4.1: Xóa KM locale entry từ Header locales array
  - [x] 4.2: Đơn giản hóa ternary cho services nav item
- [x] Task 5: Cập nhật Footer component (AC: #5)
  - [x] 5.1: Xóa tất cả KM ternary branches (7 instances)
  - [x] 5.2: Đơn giản hóa tất cả ternary thành pattern `locale === 'vi' ? '...' : '...'`
- [x] Task 6: Cập nhật seed data (AC: #6)
  - [x] 6.1: Xóa tất cả `km:` keys từ brands, categories, products
- [x] Task 7: Verify build (AC: #7)
  - [x] 7.1: `pnpm build` — thành công, không lỗi
  - [x] 7.2: Route `/km/` tự động trả về 404 (next-intl middleware chỉ accept vi/en)
- [x] Task 8 (phát hiện trong quá trình implement): Xóa KM references từ tất cả page files
  - [x] 8.1: about/page.tsx — ~15 KM ternary branches
  - [x] 8.2: page.tsx (homepage) — ~14 KM ternary branches
  - [x] 8.3: faq/page.tsx — ~14 KM ternary branches
  - [x] 8.4: services/page.tsx — 6 KM references + type cast
  - [x] 8.5: warranty, shipping, privacy, terms, payment — KM ternaries + content objects
  - [x] 8.6: products, contact, news, news/[slug], product/[slug] — KM ternaries
  - [x] 8.7: search, brands/[slug], categories/[slug] — đã không có KM references

## Dev Notes

### Files cần thay đổi (7 files)

| File | Thay đổi | Lines |
|------|----------|-------|
| `src/payload.config.ts` | Xóa KM locale entry | Line 82 |
| `src/i18n/config.ts` | Xóa KM từ array + localeNames | Lines 1, 9 |
| `messages/km.json` | XÓA FILE | Toàn bộ (69 lines) |
| `src/components/layout/Header.tsx` | Xóa KM locale + ternary | Lines 12, 26 |
| `src/components/layout/Footer.tsx` | Xóa tất cả KM ternaries | Lines 24, 31-35, 57-58 |
| `scripts/seed.ts` | Xóa TẤT CẢ `km:` keys từ locale objects | Toàn bộ file |

### Files KHÔNG cần thay đổi

| File | Lý do |
|------|-------|
| `src/i18n/request.ts` | Dynamic — tự động dùng locales từ config.ts |
| `next.config.mjs` | Dùng plugin từ i18n/request.ts, tự cập nhật |
| `src/app/(frontend)/[locale]/layout.tsx` | Dynamic — `generateStaticParams()` và validation dùng locales từ config.ts |
| `messages/vi.json` | Không thay đổi |
| `messages/en.json` | Không thay đổi |

### Implementation Pattern

Khi đơn giản hóa ternary expressions, dùng pattern:
```typescript
// TRƯỚC (3 locales)
locale === 'vi' ? 'Dịch vụ' : locale === 'km' ? 'សេវាកម្ម' : 'Services'

// SAU (2 locales)
locale === 'vi' ? 'Dịch vụ' : 'Services'
```

### Thứ tự thực hiện

1. Config files trước (payload.config.ts, i18n/config.ts)
2. Components (Header.tsx, Footer.tsx)
3. Seed data (seed.ts)
4. Xóa messages/km.json
5. Build verification

### Architecture Constraints

- **PayloadCMS 3.74**: Localization config trong `payload.config.ts` quyết định locales cho tất cả collections
- **next-intl 4.1**: Config chain: `i18n/config.ts` → `i18n/request.ts` → `next.config.mjs`
- **Localized fields**: Tất cả fields có `localized: true` sẽ tự động chỉ accept vi/en sau khi đổi config
- **Database**: KM data trong DB không cần xóa — PayloadCMS sẽ ignore locales không còn trong config

### Cảnh báo

- **KHÔNG** cần migration database — PayloadCMS tự ignore unused locale data
- **KHÔNG** cần cập nhật Payload types — chạy `pnpm generate:types` sau khi đổi config nếu cần
- **KHÔNG** thay đổi access control trong story này — đó là Story 1.2

### Project Structure Notes

- Config files nằm đúng vị trí theo architecture document
- Component files trong `src/components/layout/` — đúng convention
- i18n config trong `src/i18n/` — đúng convention
- Không có conflict với project structure

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 9.1-9.4]
- [Source: _bmad-output/planning-artifacts/prd.md#Section 4.10 - I18N-01]
- [Source: src/payload.config.ts#L78-86 - Current localization config]
- [Source: src/i18n/config.ts#L1-10 - Current i18n config]
- [Source: src/components/layout/Header.tsx#L9-12 - Current locale array]
- [Source: src/components/layout/Footer.tsx#L24-58 - Current KM references]

## Dev Agent Record

### Agent Model Used
claude-opus-4-5-20251101

### Completion Notes List
- Tất cả 7 AC đều pass
- Phát hiện thêm ~18 page files có KM references ngoài scope story ban đầu (chỉ list 7 files) — đã xử lý hết
- `payload-types.ts` (auto-generated) tự cập nhật khi build
- Build thành công, không lỗi TypeScript hay runtime

### Change Log
1. `src/payload.config.ts` — Xóa KM locale từ localization config
2. `src/i18n/config.ts` — Xóa KM từ locales array và localeNames
3. `messages/km.json` — XÓA FILE
4. `src/components/layout/Header.tsx` — Xóa KM locale entry và ternary
5. `src/components/layout/Footer.tsx` — Xóa 7 KM ternary branches
6. `scripts/seed.ts` — Xóa tất cả `km:` keys (brands, categories, products)
7. `src/app/(frontend)/[locale]/about/page.tsx` — Xóa ~15 KM ternaries
8. `src/app/(frontend)/[locale]/page.tsx` — Xóa ~14 KM ternaries
9. `src/app/(frontend)/[locale]/faq/page.tsx` — Xóa ~14 KM ternaries
10. `src/app/(frontend)/[locale]/services/page.tsx` — Xóa 6 KM refs + type cast
11. `src/app/(frontend)/[locale]/warranty/page.tsx` — Xóa KM ternaries + content
12. `src/app/(frontend)/[locale]/shipping/page.tsx` — Xóa KM ternaries + type cast
13. `src/app/(frontend)/[locale]/privacy/page.tsx` — Xóa KM content object + ternary
14. `src/app/(frontend)/[locale]/terms/page.tsx` — Xóa KM content object + ternary
15. `src/app/(frontend)/[locale]/payment/page.tsx` — Xóa KM content object + ternary
16. `src/app/(frontend)/[locale]/products/page.tsx` — Xóa KM ternaries
17. `src/app/(frontend)/[locale]/contact/page.tsx` — Xóa KM ternaries
18. `src/app/(frontend)/[locale]/news/page.tsx` — Xóa KM ternaries
19. `src/app/(frontend)/[locale]/news/[slug]/page.tsx` — Xóa KM ternaries
20. `src/app/(frontend)/[locale]/product/[slug]/page.tsx` — Xóa KM ternaries

### File List
- MODIFIED: src/payload.config.ts
- MODIFIED: src/i18n/config.ts
- MODIFIED: src/payload-types.ts (regenerated)
- DELETED: messages/km.json
- MODIFIED: src/components/layout/Header.tsx
- MODIFIED: src/components/layout/Footer.tsx
- MODIFIED: scripts/seed.ts
- MODIFIED: src/app/(frontend)/[locale]/about/page.tsx
- MODIFIED: src/app/(frontend)/[locale]/page.tsx
- MODIFIED: src/app/(frontend)/[locale]/faq/page.tsx
- MODIFIED: src/app/(frontend)/[locale]/services/page.tsx
- MODIFIED: src/app/(frontend)/[locale]/warranty/page.tsx
- MODIFIED: src/app/(frontend)/[locale]/shipping/page.tsx
- MODIFIED: src/app/(frontend)/[locale]/privacy/page.tsx
- MODIFIED: src/app/(frontend)/[locale]/terms/page.tsx
- MODIFIED: src/app/(frontend)/[locale]/payment/page.tsx
- MODIFIED: src/app/(frontend)/[locale]/products/page.tsx
- MODIFIED: src/app/(frontend)/[locale]/contact/page.tsx
- MODIFIED: src/app/(frontend)/[locale]/news/page.tsx
- MODIFIED: src/app/(frontend)/[locale]/news/[slug]/page.tsx
- MODIFIED: src/app/(frontend)/[locale]/product/[slug]/page.tsx

## Code Review Record

### Review Date
2026-02-05

### Issues Found: 1 High, 4 Medium, 1 Low

#### Fixed Issues
1. **[HIGH] payload-types.ts stale KM types** — `pnpm generate:types` was not run; locale type still included 'km'. Fixed by regenerating types.
2. **[MEDIUM] Header.tsx duplicated locale array** — Local `locales` array duplicated config. Fixed by importing `locales` and new `localeDisplay` from `@/i18n/config`.
3. **[MEDIUM] Hardcoded 'Dịch vụ' ternaries** — Header and Footer used `locale === 'vi' ? 'Dịch vụ' : 'Services'` instead of `t('services')`. Fixed to use translation keys.
4. **[MEDIUM] seed.ts only seeded Vietnamese data** — English translations defined in data objects were never passed to Payload. Fixed by adding `payload.update()` with `locale: 'en'` after each create.

#### Deferred Issues (out of scope for Story 1.1)
5. **[MEDIUM] Contact form has no submission handler** — `<form>` tag has no action/onSubmit. Form builder plugin installed but not wired up.
6. **[LOW] Policy pages have fully hardcoded content** — privacy, terms, warranty, faq pages don't fetch from CMS unlike shipping page.

### Review Change Log
21. `src/payload-types.ts` — Regenerated types (removed stale 'km' from locale union)
22. `src/i18n/config.ts` — Added `localeDisplay` export for UI (flags, short labels)
23. `src/components/layout/Header.tsx` — Import locales from config, use t('services')
24. `src/components/layout/Footer.tsx` — Use tCommon('services') instead of hardcoded ternary
25. `scripts/seed.ts` — Added English locale seeding for brands, categories, products
