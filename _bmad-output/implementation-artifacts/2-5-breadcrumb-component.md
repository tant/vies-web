# Story 2.5: Breadcrumb component

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng,
I want breadcrumb navigation on all pages except homepage,
So that I can understand where I am and navigate back easily.

## Acceptance Criteria

1. **Given** trang bất kỳ trừ homepage **When** trang load **Then** breadcrumb hiện dưới header: Home > [Section] > [Page]
2. **Given** breadcrumb render **When** user nhìn vào **Then** mỗi level là link clickable (trừ level hiện tại — level cuối)
3. **Given** breadcrumb render **When** user nhìn vào **Then** Home link luôn ở đầu
4. **Given** breadcrumb render **When** locale thay đổi **Then** text localized theo locale hiện tại (dùng `nav.breadcrumb.*` i18n keys)
5. **Given** homepage **When** trang load **Then** breadcrumb ẩn (không render)

**FRs:** NV-05

## Tasks / Subtasks

- [x] Task 1: Tạo Breadcrumb component (AC: #1, #2, #3, #4)
  - [x] 1.1: Tạo `src/components/ui/Breadcrumb.tsx` — Server Component
  - [x] 1.2: Props interface: `items: Array<{ label: string; href?: string }>`
  - [x] 1.3: Home link luôn ở đầu (tự thêm, không cần caller truyền)
  - [x] 1.4: Level cuối (current page) render text, không phải link
  - [x] 1.5: Separator: `>` hoặc `/` giữa các items
  - [x] 1.6: Semantic HTML: `<nav aria-label="Breadcrumb">` + `<ol>` + `<li>`
  - [x] 1.7: Container: `mx-auto max-w-[var(--container-max)] px-md`

- [x] Task 2: Thay breadcrumb inline trong existing pages (AC: #1, #5)
  - [x] 2.1: Thay breadcrumb inline trong `news/[slug]/page.tsx` (lines 98-113) bằng `<Breadcrumb items={...} />`
  - [x] 2.2: Thay breadcrumb inline trong `product/[slug]/page.tsx` (lines 58-73) bằng `<Breadcrumb items={...} />`
  - [x] 2.3: Không thêm breadcrumb vào homepage (`page.tsx`)

- [x] Task 3: Mobile responsive (AC: #1)
  - [x] 3.1: Truncate middle items trên mobile nếu quá dài
  - [x] 3.2: Current page text truncate (`truncate max-w-[200px]`) trên mobile

- [x] Task 4: Verify build (AC: tất cả)
  - [x] 4.1: Chạy `pnpm build` — phải thành công
  - [x] 4.2: Verify breadcrumb hiện đúng trên existing pages

## Dev Notes

### Trạng thái hiện tại: inline breadcrumbs

Hiện tại breadcrumb được code inline trực tiếp trong page files:

**`news/[slug]/page.tsx` (lines 98-113):**
```tsx
<div className="bg-white border-b">
  <div className="container mx-auto px-4 py-4">
    <nav className="flex items-center gap-2 text-sm">
      <Link href={`/${locale}`} className="text-gray-500 hover:text-primary">{tCommon('home')}</Link>
      <span className="text-gray-400">/</span>
      <Link href={`/${locale}/news`} className="text-gray-500 hover:text-primary">{t('title')}</Link>
      <span className="text-gray-400">/</span>
      <span className="text-gray-900 font-medium truncate">{article.title}</span>
    </nav>
  </div>
</div>
```

**`product/[slug]/page.tsx` (lines 58-73):** — same pattern with products.

**Vấn đề:**
- Duplicated code across pages
- Dùng `container mx-auto px-4` thay vì design system container
- Không dùng semantic `<ol>/<li>` (chỉ `<nav>` + flat links)
- Không có i18n keys riêng cho breadcrumb (dùng `tCommon('home')`)

### Breadcrumb component design

```tsx
// src/components/ui/Breadcrumb.tsx — Server Component
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'

export interface BreadcrumbItem {
  label: string
  href?: string  // undefined = current page (last item, no link)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export async function Breadcrumb({ items }: BreadcrumbProps) {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'nav' })

  // Prepend Home automatically
  const allItems: BreadcrumbItem[] = [
    { label: t('breadcrumb.home'), href: `/${locale}` },
    ...items,
  ]

  return (
    <nav aria-label="Breadcrumb" className="bg-white border-b border-border">
      <div className="mx-auto max-w-[var(--container-max)] px-md py-sm">
        <ol className="flex items-center gap-sm text-sm">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1

            return (
              <li key={index} className="flex items-center gap-sm">
                {index > 0 && (
                  <ChevronRightIcon className="w-3 h-3 text-text-muted shrink-0" />
                )}
                {isLast || !item.href ? (
                  <span className="text-text font-medium truncate max-w-[200px] sm:max-w-none">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-text-muted hover:text-primary transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}
```

### Usage pattern from pages

Mỗi page truyền `items` array — KHÔNG bao gồm Home (tự thêm):

```tsx
// news/[slug]/page.tsx
import { Breadcrumb } from '@/components/ui/Breadcrumb'

// In render:
<Breadcrumb items={[
  { label: t('title'), href: `/${locale}/news` },       // "Tin tức" — link
  { label: article.title },                               // "Bài viết XYZ" — no link (current)
]} />
```

```tsx
// product/[slug]/page.tsx
<Breadcrumb items={[
  { label: tCommon('products'), href: `/${locale}/products` },  // "Sản phẩm" — link
  { label: product.name },                                       // "SKF 6205-2RS" — no link (current)
]} />
```

```tsx
// services/[slug]/page.tsx (future)
<Breadcrumb items={[
  { label: t('breadcrumb.services'), href: `/${locale}/services` },
  { label: service.title },
]} />
```

```tsx
// products/page.tsx (listing, future)
<Breadcrumb items={[
  { label: t('breadcrumb.products') },  // No href = current page
]} />
```

### Async Server Component

Breadcrumb là **async Server Component** vì cần `getLocale()` và `getTranslations()` (next-intl server functions). Đây là pattern hợp lệ trong Next.js 16 + React 19:

```tsx
export async function Breadcrumb({ items }: BreadcrumbProps) {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'nav' })
  // ...
}
```

**Alternative:** Nếu muốn tránh async component, caller có thể truyền `homeLabel` và `locale` qua props. Nhưng async component đơn giản hơn.

### i18n keys có sẵn

```json
// messages/vi.json → nav.breadcrumb
"breadcrumb": {
  "home": "Trang chủ",
  "products": "Sản phẩm",
  "services": "Dịch vụ",
  "news": "Tin tức",
  "brands": "Thương hiệu",
  "categories": "Danh mục",
  "contact": "Liên hệ",
  "about": "Giới thiệu",
  "search": "Tìm kiếm"
}
```

```json
// messages/en.json → nav.breadcrumb
"breadcrumb": {
  "home": "Home",
  "products": "Products",
  "services": "Services",
  "news": "News",
  "brands": "Brands",
  "categories": "Categories",
  "contact": "Contact",
  "about": "About",
  "search": "Search"
}
```

Breadcrumb component dùng `t('breadcrumb.home')` cho Home label. Pages dùng keys tùy context (VD: `t('breadcrumb.news')` cho section label).

### Separator choice

UX spec nói format "Trang chủ > Danh mục > Sản phẩm" nhưng existing inline code dùng `/`. Đề xuất: dùng `>` (ChevronRight icon) cho consistency với UX spec.

### Semantic HTML & SEO

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Trang chủ</a></li>
    <li><a href="/products">Sản phẩm</a></li>
    <li><span>SKF 6205-2RS</span></li>  <!-- current page, no link -->
  </ol>
</nav>
```

Google hỗ trợ breadcrumb structured data. Có thể thêm JSON-LD schema markup sau — nhưng nằm ngoài scope story này (nằm trong Epic 7: SEO).

### Mobile truncation

UX spec: "truncate middle items trên mobile". Pattern:

```tsx
// Nếu items > 3 trên mobile, collapse middle items
// Home > ... > Current Page
```

Tuy nhiên, với VIES site structure, breadcrumb thường chỉ 2-3 levels (Home > Section > Page). Truncation chỉ cần cho current page label:

```tsx
<span className="truncate max-w-[200px] sm:max-w-none">
  {item.label}
</span>
```

Nếu cần middle truncation cho deep pages (VD: Home > Products > Category > Product), implement sau khi có use case thực tế.

### Pages sẽ dùng Breadcrumb (current + future)

| Page | Breadcrumb path | Status |
|------|----------------|--------|
| `news/[slug]/page.tsx` | Home > Tin tức > [Title] | **Sửa ngay** (thay inline) |
| `product/[slug]/page.tsx` | Home > Sản phẩm > [Name] | **Sửa ngay** (thay inline) |
| `products/page.tsx` | Home > Sản phẩm | Future (Epic 3) |
| `services/page.tsx` | Home > Dịch vụ | Future (Epic 5) |
| `services/[slug]/page.tsx` | Home > Dịch vụ > [Title] | Future (Epic 5) |
| `brands/[slug]/page.tsx` | Home > Thương hiệu > [Name] | Future (Epic 3) |
| `categories/[slug]/page.tsx` | Home > Danh mục > [Name] | Future (Epic 3) |
| `contact/page.tsx` | Home > Liên hệ | Future (Epic 4) |
| `search/page.tsx` | Home > Tìm kiếm | Future (Epic 3) |
| `[...slug]/page.tsx` | Home > [Page Title] | Future (Epic 6) |
| `page.tsx` (homepage) | **KHÔNG hiện** | N/A |

Trong story này chỉ sửa 2 pages có inline breadcrumb. Các pages future sẽ import `<Breadcrumb>` khi implement.

### Điểm cần tránh

- **KHÔNG** render breadcrumb trên homepage — AC #5
- **KHÔNG** dùng `<nav>` flat (div + spans) — dùng semantic `<nav>` + `<ol>` + `<li>`
- **KHÔNG** hardcode "Home" text — dùng `t('breadcrumb.home')` từ i18n
- **KHÔNG** require caller truyền Home item — component tự thêm
- **KHÔNG** dùng `container mx-auto px-4` — dùng `mx-auto max-w-[var(--container-max)] px-md`
- **KHÔNG** làm Client Component — Breadcrumb không có state, dùng Server Component
- **KHÔNG** thêm structured data (JSON-LD) — đó là Epic 7 (SEO)
- **KHÔNG** quên xóa inline breadcrumb code khi thay bằng component

### File location

Architecture spec: `src/components/ui/Breadcrumb.tsx` (Server Component, under `ui/` not `layout/`).

### Container & spacing consistency

Breadcrumb dùng cùng container pattern với ContactBar và Header:
- `mx-auto max-w-[var(--container-max)] px-md`
- Background: `bg-white border-b border-border`
- Padding: `py-sm` (8px vertical — compact)

### Previous Story Intelligence (Stories 2.1-2.4)

**Patterns thiết lập:**
- Container: `mx-auto max-w-[var(--container-max)] px-md`
- Server Component pattern: async function, `getLocale()`, `getTranslations()`
- `formatTelHref()` extracted to `@/lib/utils` (Story 2.3)
- Inline SVG icons — ChevronRightIcon needed (new, simple)
- `cn()` utility available from `@/lib/utils`
- Tailwind design tokens: `text-text-muted`, `text-primary`, `border-border`

### Git Intelligence

```
9ed2f96 Add ContactBar component with language switcher (Story 2.1)
```

Story 2.2 (review), 2.3 (done) — Header has CMS data, mobile slide-in with focus trap.

### Files cần thay đổi

| File | Hành động | Mô tả |
|------|-----------|-------|
| `src/components/ui/Breadcrumb.tsx` | **Tạo mới** | Server Component — reusable breadcrumb |
| `src/app/(frontend)/[locale]/news/[slug]/page.tsx` | **Sửa** | Thay inline breadcrumb bằng `<Breadcrumb>` component |
| `src/app/(frontend)/[locale]/product/[slug]/page.tsx` | **Sửa** | Thay inline breadcrumb bằng `<Breadcrumb>` component |

### Files KHÔNG thay đổi

| File | Lý do |
|------|-------|
| `src/app/(frontend)/layout.tsx` | Breadcrumb ở page level, không layout level |
| `messages/*.json` | i18n keys `nav.breadcrumb.*` đã có sẵn |
| `src/components/layout/Header.tsx` | Không liên quan |
| `src/components/layout/Footer.tsx` | Không liên quan |

### Thứ tự thực hiện khuyến nghị

1. Tạo `src/components/ui/Breadcrumb.tsx` — component + ChevronRightIcon
2. Sửa `news/[slug]/page.tsx` — import + thay inline breadcrumb
3. Sửa `product/[slug]/page.tsx` — import + thay inline breadcrumb
4. Build verification

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.5]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Breadcrumb Pattern]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 7 - Project Structure (Breadcrumb.tsx under ui/)]
- [Source: src/app/(frontend)/[locale]/news/[slug]/page.tsx - Inline breadcrumb (lines 98-113)]
- [Source: src/app/(frontend)/[locale]/product/[slug]/page.tsx - Inline breadcrumb (lines 58-73)]
- [Source: messages/vi.json - nav.breadcrumb.* keys]
- [Source: messages/en.json - nav.breadcrumb.* keys]
- [Source: _bmad-output/implementation-artifacts/2-3-navigationheader-mobile-menu.md - Previous story patterns]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Created async Server Component `Breadcrumb` with auto-prepended Home link, semantic HTML (`nav > ol > li`), ChevronRight separator icon, and mobile truncation (`truncate max-w-[200px] sm:max-w-none`)
- Replaced inline breadcrumb in `news/[slug]/page.tsx` with `<Breadcrumb>` component
- Replaced inline breadcrumb in `product/[slug]/page.tsx` with `<Breadcrumb>` component
- Homepage has no breadcrumb (AC #5 satisfied)
- `pnpm build` passes successfully

### Change Log

- 2026-02-05: Implemented Breadcrumb component and replaced inline breadcrumbs in 2 pages
- 2026-02-05: Code review fixes — removed unused imports (tCommon, tContact), switched to dedicated nav.breadcrumb.* i18n keys, added aria-current="page", used stable list keys

### File List

| File | Action |
|------|--------|
| `src/components/ui/Breadcrumb.tsx` | Created |
| `src/app/(frontend)/[locale]/news/[slug]/page.tsx` | Modified |
| `src/app/(frontend)/[locale]/product/[slug]/page.tsx` | Modified |
