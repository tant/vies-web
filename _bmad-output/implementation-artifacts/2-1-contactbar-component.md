# Story 2.1: ContactBar component (Topbar)

Status: done

## Story

As a khách hàng,
I want to see phone numbers and email in the topbar,
So that I can quickly contact VIES for quotes or consultation.

## Acceptance Criteria

1. **Given** trang bất kỳ trên website **When** trang load **Then** topbar hiện ở đầu trang với background steel blue (`bg-primary` = `#0F4C75`), text trắng, font size `text-sm` (14px)
2. **Given** topbar render **When** user nhìn vào **Then** hiện SĐT báo giá (0903 326 309) và SĐT tư vấn (0908 748 304) dưới dạng clickable `tel:` links với icon điện thoại
3. **Given** topbar render trên desktop **When** viewport >= 768px (md) **Then** hiện email `info@v-ies.com` dưới dạng clickable `mailto:` link
4. **Given** topbar render **When** user click language switcher **Then** chuyển locale giữa VI/EN, URL cập nhật đúng locale mới
5. **Given** topbar render trên mobile (< 768px) **When** viewport nhỏ **Then** ẩn email, chỉ hiện SĐT chính + language switcher
6. **Given** ContactBar là component riêng biệt **When** tách ra khỏi Header hiện tại **Then** data lấy từ SiteSettings global (`contact.phone`, `contact.email`) + Header global (`topBar.enabled`)
7. **Given** `topBar.enabled` = false trong Header global **When** render **Then** ContactBar không hiện (return null)

## Tasks / Subtasks

- [x] Task 1: Tạo ContactBar component (AC: #1, #2, #3, #5)
  - [x] 1.1: Tạo file `src/components/layout/ContactBar.tsx` — Server Component
  - [x] 1.2: Nhận props: `siteSettings` (SiteSettings type), `topBarEnabled` (boolean)
  - [x] 1.3: Render topbar với `bg-primary text-white text-sm`
  - [x] 1.4: Hiện phone links từ `siteSettings.contact.phone` array
  - [x] 1.5: Hiện email link (ẩn trên mobile: `hidden md:flex`)
  - [x] 1.6: Guard: nếu `topBarEnabled === false` thì return null

- [x] Task 2: Tạo LanguageSwitcher client component (AC: #4)
  - [x] 2.1: Tạo file `src/components/layout/LanguageSwitcher.tsx` — Client Component (`'use client'`)
  - [x] 2.2: Import `locales`, `localeDisplay` từ `@/i18n/config`
  - [x] 2.3: Dùng `useLocale()`, `usePathname()`, `useRouter()` từ next-intl
  - [x] 2.4: Render dropdown hoặc toggle VI/EN
  - [x] 2.5: `switchLocale`: replace locale prefix trong pathname, router.push

- [x] Task 3: Cập nhật layout để fetch globals và render ContactBar (AC: #6)
  - [x] 3.1: Trong `src/app/(frontend)/layout.tsx`, fetch `site-settings` và `header` globals bằng `getPayload` + `payload.findGlobal()`
  - [x] 3.2: Render `<ContactBar>` trước `<Header>`
  - [x] 3.3: Pass `siteSettings` và `topBarEnabled` props xuống ContactBar

- [x] Task 4: Cập nhật Header component (AC: #1)
  - [x] 4.1: Xóa top bar section khỏi Header (lines 38-87 hiện tại) — logic này chuyển sang ContactBar
  - [x] 4.2: Xóa language switcher logic khỏi Header — chuyển sang LanguageSwitcher
  - [x] 4.3: Header `sticky top-0` cần điều chỉnh: không còn render topbar bên trong
  - [x] 4.4: Giữ nguyên phần main header (logo, navigation, mobile menu)

- [x] Task 5: Verify build (AC: tất cả)
  - [x] 5.1: Chạy `pnpm build` — phải thành công
  - [ ] 5.2: Verify visual: topbar hiện đúng trên desktop và mobile

## Dev Notes

### Kiến trúc component hiện tại vs mục tiêu

**HIỆN TẠI:** Header.tsx là 1 Client Component chứa cả topbar + main header + mobile menu + language switcher. Contact info hardcoded.

**MỤC TIÊU:** Tách thành:
- `ContactBar.tsx` (Server Component) — topbar riêng, nhận data từ globals
- `LanguageSwitcher.tsx` (Client Component) — logic chuyển locale
- `Header.tsx` (Client Component) — chỉ còn main header + navigation + mobile menu

### Data Flow (sau khi refactor)

```
layout.tsx (Server)
├── getPayload() → payload
├── payload.findGlobal({ slug: 'site-settings', locale }) → siteSettings
├── payload.findGlobal({ slug: 'header', locale }) → headerData
│
├── <ContactBar                    ← Server Component
│     siteSettings={siteSettings}
│     topBarEnabled={headerData.topBar?.enabled}
│   />
│   └── <LanguageSwitcher />       ← Client Component (language toggle)
│
├── <Header />                     ← Client Component (main nav)
├── <main>{children}</main>
└── <Footer />
```

### Cách fetch globals trong layout.tsx

```typescript
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function RootLayout({ children }) {
  const locale = await getLocale()
  const payload = await getPayload({ config: await config })

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    locale,
  })
  const headerData = await payload.findGlobal({
    slug: 'header',
    locale,
  })

  // Pass data to components...
}
```

### ContactBar component structure

```tsx
// src/components/layout/ContactBar.tsx — Server Component
import type { SiteSettings } from '@/payload-types'
import { LanguageSwitcher } from './LanguageSwitcher'

interface ContactBarProps {
  siteSettings: SiteSettings
  topBarEnabled?: boolean | null
}

export function ContactBar({ siteSettings, topBarEnabled }: ContactBarProps) {
  if (topBarEnabled === false) return null

  const phones = siteSettings.contact?.phone ?? []
  const email = siteSettings.contact?.email

  return (
    <div className="bg-primary text-white text-sm">
      <div className="mx-auto max-w-[var(--container-max)] px-md py-xs flex justify-between items-center">
        <div className="flex items-center gap-md">
          {phones.map((phone) => (
            <a key={phone.id} href={`tel:+84${phone.number.replace(/\s/g, '').replace(/^0/, '')}`}
               className="flex items-center gap-xs hover:text-primary-light transition-colors">
              {/* PhoneIcon */}
              <span className="hidden sm:inline">{phone.label}: {phone.number}</span>
            </a>
          ))}
          {email && (
            <a href={`mailto:${email}`}
               className="hidden md:flex items-center gap-xs hover:text-primary-light transition-colors">
              {/* MailIcon */}
              <span>{email}</span>
            </a>
          )}
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  )
}
```

### LanguageSwitcher component structure

```tsx
// src/components/layout/LanguageSwitcher.tsx — Client Component
'use client'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { locales, localeDisplay, type Locale } from '@/i18n/config'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  // Render: toggle buttons hoặc dropdown cho VI/EN
}
```

### i18n keys có sẵn (từ messages files)

```json
// vi.json
"common.phone": "Điện thoại",
"common.callNow": "Gọi ngay",
"common.email": "Email",
"nav.quote": "Báo giá",
"nav.consultation": "Tư vấn"

// en.json
"common.phone": "Phone",
"common.callNow": "Call now",
"common.email": "Email",
"nav.quote": "Quote",
"nav.consultation": "Consultation"
```

**Lưu ý:** Labels cho phone numbers (Báo giá / Tư vấn) đến từ CMS (`siteSettings.contact.phone[].label`) — đã localized trong PayloadCMS. Không cần dùng next-intl cho labels này.

### Phone icons

Có 2 options:
1. **Reuse SVG icons từ Header hiện tại** — PhoneIcon, MailIcon đã có inline SVG (lines 173-188)
2. Tạo thư mục `src/components/icons/` hoặc giữ inline

**Khuyến nghị:** Copy PhoneIcon, MailIcon từ Header.tsx sang ContactBar.tsx hoặc tạo shared icon file. Giữ inline SVG đơn giản, không thêm icon library.

### Responsive behavior

| Viewport | Hiển thị |
|----------|----------|
| Mobile (< 640px) | SĐT chính (số only, không label) + LanguageSwitcher |
| Small (640px+) | SĐT + labels + LanguageSwitcher |
| Medium (768px+) | SĐT + labels + Email + LanguageSwitcher |

### Sticky behavior

- ContactBar **KHÔNG** sticky — nó ở đầu trang, cuộn đi khi scroll
- Header (NavigationHeader — Story 2.2) sẽ sticky ở top khi scroll
- Khi tách ContactBar khỏi Header, cần đảm bảo Header `sticky top-0` vẫn hoạt động đúng (ContactBar cuộn đi, Header dính lại)

### Điểm cần tránh (anti-patterns)

- **KHÔNG** hardcode contact info — lấy từ SiteSettings global
- **KHÔNG** dùng `useState` cho language switcher dropdown nếu chỉ có 2 locales — toggle đơn giản đủ rồi
- **KHÔNG** thêm icon library (lucide, heroicons...) — dùng inline SVG
- **KHÔNG** tạo API route cho globals — dùng `payload.findGlobal()` trực tiếp trong Server Component
- **KHÔNG** wrap ContactBar trong Client Component — nó chỉ render data, không cần interactivity (trừ LanguageSwitcher)

### Tailwind classes cần dùng

- Container: `mx-auto max-w-[var(--container-max)] px-md` (1280px max-width)
- TopBar background: `bg-primary` (auto-generated từ `@theme --color-primary: #0F4C75`)
- Text: `text-white text-sm`
- Phone links: `hover:text-primary-light transition-colors`
- Hide email mobile: `hidden md:flex`
- Spacing: `gap-md` (16px), `py-xs` (4px padding vertical)

### PayloadCMS types (từ payload-types.ts)

```typescript
// SiteSettings.contact
contact?: {
  phone?: Array<{
    number: string          // "0903326309"
    label?: string | null   // "Báo giá" (localized)
    id?: string | null
  }> | null
  email?: string | null     // "info@v-ies.com"
  address?: string | null
}

// Header.topBar
topBar?: {
  enabled?: boolean | null  // true/false
  content?: string | null   // optional text content
}
```

### Files cần thay đổi

| File | Hành động | Mô tả |
|------|-----------|-------|
| `src/components/layout/ContactBar.tsx` | **Tạo mới** | Server Component — topbar với contact info |
| `src/components/layout/LanguageSwitcher.tsx` | **Tạo mới** | Client Component — toggle VI/EN |
| `src/app/(frontend)/layout.tsx` | **Sửa** | Fetch globals, render ContactBar trước Header |
| `src/components/layout/Header.tsx` | **Sửa** | Xóa top bar section + language switcher (chuyển sang components mới) |

### Files KHÔNG thay đổi

| File | Lý do |
|------|-------|
| `src/globals/SiteSettings.ts` | Schema đã đúng, không cần thay đổi |
| `src/globals/Header.ts` | Schema đã có `topBar.enabled`, đúng yêu cầu |
| `messages/vi.json`, `messages/en.json` | Labels phone từ CMS, không cần thêm keys |
| `src/app/(frontend)/styles.css` | Design tokens đã có sẵn từ Story 1.3 |

### Architecture Constraints

- **Server Component first**: ContactBar là Server Component, chỉ LanguageSwitcher là Client
- **Data fetching at layout level**: Layout fetch globals 1 lần, pass xuống components — tránh fetch trùng lặp
- **`defaultDepth: 1`**: Global fetch sẽ populate relationships 1 level — đủ cho SiteSettings (logo là Media relation)
- **Tailwind 4.1 `@theme`**: Dùng utility classes từ design tokens đã định nghĩa (bg-primary, text-sm, gap-md...)
- **next-intl**: Locale handling dùng `useLocale()` (client) hoặc `getLocale()` (server)

### Thứ tự thực hiện khuyến nghị

1. Tạo LanguageSwitcher component (độc lập, không phụ thuộc)
2. Tạo ContactBar component (import LanguageSwitcher)
3. Cập nhật layout.tsx (fetch globals, render ContactBar)
4. Cập nhật Header.tsx (xóa top bar + language switcher)
5. Build verification

### Previous Story Intelligence

Từ Epic 1 stories (đã hoàn thành):
- **Story 1.3**: Design tokens đã cập nhật — `bg-primary` = `#0F4C75`, `text-primary-light` = `#E8F0F7`, spacing tokens hoạt động
- **Story 1.4**: i18n message files đã cập nhật — có keys cho `nav.quote`, `nav.consultation`, `common.phone`, etc.
- **Story 1.1**: KM locale đã xóa, chỉ còn VI/EN — `locales = ['vi', 'en']`
- **Story 1.2**: Access control đã đổi sang `publishedOnly` — globals vẫn dùng `read: anyone` (không ảnh hưởng)

### Git Intelligence

Recent commits (5 most recent):
```
f8dc414 Update design tokens to Nordic Industrial palette
40c38d8 Switch draft-enabled collections to publishedOnly access control
22bb40c Remove Khmer locale, keep only VI/EN support
a0acb77 Add project memory and settings
f96b87c Add BMAD workflow config and UX design mockup
```

Patterns:
- Header.tsx đã có inline SVG icons — reuse pattern
- Layout dùng `getLocale()` + `getMessages()` từ next-intl/server
- Button component dùng `cn()` utility từ `@/lib/utils`
- Inter font loaded via `next/font/google` với `variable: '--font-inter'`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5 - Component Data Mapping]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 4 - Globals]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ContactBar Component Spec]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Navigation Patterns]
- [Source: src/components/layout/Header.tsx - Current Header with embedded topbar]
- [Source: src/app/(frontend)/layout.tsx - Current layout structure]
- [Source: src/globals/SiteSettings.ts - Contact data schema]
- [Source: src/globals/Header.ts - TopBar enabled flag]
- [Source: src/i18n/config.ts - Locale configuration]
- [Source: src/payload-types.ts - TypeScript interfaces]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Build failed initially: `getLocale()` returns `string`, but `payload.findGlobal()` expects `'vi' | 'en'`. Fixed by casting `locale` as `Locale` type.

### Completion Notes List

- Created `ContactBar.tsx` as Server Component with PhoneIcon/MailIcon inline SVGs (reused from old Header)
- Created `LanguageSwitcher.tsx` as Client Component with simple toggle buttons (no dropdown since only 2 locales)
- Updated `layout.tsx` to fetch `site-settings` and `header` globals via `getPayload` + `payload.findGlobal()`, renders ContactBar before Header
- Refactored `Header.tsx`: removed topbar section (lines 38-87), language switcher logic, and unused icon components (PhoneIcon, MailIcon, ChevronDownIcon). Removed unused imports (`useRouter`, `locales`, `localeDisplay`, `Locale`)
- ContactBar is NOT sticky (scrolls away), Header remains `sticky top-0`
- Task 5.2 (visual verification) requires running dev server with database - marked incomplete for manual verification

### Change Log

- 2026-02-05: Implemented Story 2.1 - ContactBar component separated from Header
- 2026-02-05: Code review fixes — PayloadCMS best practices + next-intl navigation + accessibility

### File List

- `src/components/layout/ContactBar.tsx` (NEW) - Server Component for topbar with contact info
- `src/components/layout/LanguageSwitcher.tsx` (NEW) - Client Component for VI/EN locale toggle
- `src/i18n/navigation.ts` (NEW) - next-intl navigation module using createNavigation
- `src/app/(frontend)/layout.tsx` (MODIFIED) - Added global data fetching, renders ContactBar before Header
- `src/components/layout/Header.tsx` (MODIFIED) - Removed topbar section and language switcher logic

### Senior Developer Review

**Date:** 2026-02-05
**Reviewer:** Tan
**Result:** Approved with fixes applied

**Issues Found & Fixed (7 total: 2 High, 4 Medium, 1 Low):**

1. **[HIGH][Fixed]** `findGlobal` without `select` — fetched entire globals including unnecessary Media relations. Added `select: { contact: true }` and `select: { topBar: true }` to minimize DB queries.
2. **[HIGH][Fixed]** LanguageSwitcher used fragile `pathname.replace()` from `next/navigation`. Created `src/i18n/navigation.ts` with `createNavigation()` (next-intl v4 pattern). Now uses locale-aware `useRouter`/`usePathname`.
3. **[MEDIUM][Fixed]** Phone `tel:` href lacked international format. Added `formatTelHref()` helper producing `tel:+84XXXXXXXXX`.
4. **[MEDIUM][Fixed]** Phone links inaccessible on mobile (icon-only, no aria-label). Added `aria-label={phone.label ?? phone.number}`.
5. **[MEDIUM][Fixed]** ContactBar accepted full `SiteSetting` type. Narrowed props to `{ phones, email, topBarEnabled }`.
6. **[MEDIUM][Fixed]** `switchLocale` parameter typed as `string` instead of `Locale`. Fixed to use `Locale` type.
7. **[LOW][Fixed]** `phone.id` React key could be null. Added fallback: `key={phone.id ?? index}`.
