# Story 2.2: NavigationHeader component

Status: done

## Story

As a khách hàng,
I want a sticky header with logo, navigation menu, and contact CTA,
So that I can navigate the website and find the contact button easily.

## Acceptance Criteria

1. **Given** trang bất kỳ trên website **When** user scroll xuống **Then** header sticky ở top (dưới ContactBar khi chưa scroll, sticky top-0 khi ContactBar cuộn đi), background white, shadow nhẹ
2. **Given** header render **When** user nhìn vào **Then** hiện logo VIES (link về homepage `/{locale}`)
3. **Given** header render trên desktop (>= 1024px lg) **When** user nhìn vào **Then** hiện navigation items từ Header global: Dịch vụ, Sản phẩm (có dropdown: Theo hãng, Theo loại), Tin tức, Về chúng tôi
4. **Given** navigation item "Sản phẩm" có children **When** user hover (desktop) **Then** dropdown hiện submenu items (children array từ Header global)
5. **Given** header render trên desktop **When** user nhìn vào **Then** nút "Liên hệ" amber CTA (`bg-accent text-text`) hiện bên phải
6. **Given** header render **When** data lấy từ CMS **Then** navigation items lấy từ Header global (`navigation` array), logo từ SiteSettings global (`logo`), contact phone từ SiteSettings global (`contact.phone`)
7. **Given** Header component nhận props từ layout **When** render **Then** dùng serialized data (Client Component boundary — cần `'use client'` cho mobile menu state, sticky behavior)

## Tasks / Subtasks

- [x] Task 1: Refactor Header thành NavigationHeader với CMS data (AC: #1, #2, #3, #5, #6, #7)
  - [x] 1.1: Giữ tên `Header.tsx`, update nội dung với CMS data
  - [x] 1.2: Thêm props interface: `headerData` (Header type), `siteSettings` (SiteSetting type)
  - [x] 1.3: Thay navigation hardcoded bằng `headerData.navigation` array
  - [x] 1.4: Render logo từ `siteSettings.logo` (Media type) — dùng `next/image` nếu có, fallback "V" placeholder nếu chưa có logo
  - [x] 1.5: Thay CTA button `bg-secondary` → `bg-accent` (amber) theo UX spec
  - [x] 1.6: Container max-width: `mx-auto max-w-[var(--container-max)]`

- [x] Task 2: Desktop dropdown cho navigation items có children (AC: #4)
  - [x] 2.1: Check `item.children` array — nếu có, render dropdown on hover
  - [x] 2.2: Dropdown style: `absolute top-full`, background white, border, shadow nhẹ
  - [x] 2.3: Mỗi child item là Link đến `/{locale}{child.link}`
  - [x] 2.4: Hover delay nhẹ qua CSS transition (invisible/visible + opacity transition 150ms)

- [x] Task 3: Cập nhật layout.tsx để pass data xuống Header (AC: #6, #7)
  - [x] 3.1: Layout select thêm `navigation`, `logo`, `siteName` từ globals
  - [x] 3.2: Pass `headerData` và `siteSettings` props xuống Header
  - [x] 3.3: Data đã JSON serializable nhờ `defaultDepth: 1` (Media populated)

- [x] Task 4: Mobile menu cập nhật với CMS navigation (AC: #3)
  - [x] 4.1: Mobile menu items từ `headerData.navigation` thay vì hardcoded
  - [x] 4.2: Nếu item có children → hiện expandable submenu trong mobile menu (useState toggle)
  - [x] 4.3: Hiện SĐT + nút Liên hệ trong mobile menu (từ `siteSettings.contact.phone`)

- [x] Task 5: Verify build (AC: tất cả)
  - [x] 5.1: Chạy `pnpm build` — thành công, no errors
  - [ ] 5.2: Verify visual: header hiện đúng trên desktop và mobile (cần manual check)

## Dev Notes

### Trạng thái hiện tại của Header (sau Story 2.1)

**File:** `src/components/layout/Header.tsx` — Client Component (`'use client'`)

**Đã có:**
- Logo placeholder (hardcoded "V" block + "VIES" text)
- Desktop navigation (hardcoded array từ `useTranslations`)
- Mobile hamburger menu (useState toggle)
- CTA button "Liên hệ" (dùng `bg-secondary` — cần đổi sang `bg-accent`)
- `sticky top-0 z-50 bg-white shadow-sm`

**Cần thay đổi:**
- Navigation: hardcoded → từ `headerData.navigation` (CMS)
- Logo: hardcoded → từ `siteSettings.logo` (CMS Media)
- CTA: `bg-secondary` → `bg-accent` (amber #D4A843)
- Dropdown: thêm cho items có `children`
- Mobile menu: CMS data + expandable submenu + phone/contact info
- Props: thêm `headerData` và `siteSettings`

### Data Flow (cập nhật)

```
layout.tsx (Server) — ĐÃ CÓ từ Story 2.1
├── payload.findGlobal({ slug: 'site-settings', locale }) → siteSettings
├── payload.findGlobal({ slug: 'header', locale }) → headerData
│
├── <ContactBar siteSettings={siteSettings} topBarEnabled={headerData.topBar?.enabled} />
│
├── <Header                          ← CẬP NHẬT: thêm props
│     headerData={headerData}
│     siteSettings={siteSettings}
│   />
│
├── <main>{children}</main>
└── <Footer />
```

### Header global navigation data (từ CMS)

```json
{
  "navigation": [
    { "label": "Dịch vụ", "link": "/services" },
    { "label": "Sản phẩm", "link": "/products", "children": [
      { "label": "Theo hãng", "link": "/products?view=brands" },
      { "label": "Theo loại", "link": "/products?view=categories" }
    ]},
    { "label": "Tin tức", "link": "/news" },
    { "label": "Về chúng tôi", "link": "/about" }
  ]
}
```

**Lưu ý:** Labels đã localized trong PayloadCMS (vi/en). Layout fetch với `locale` param → data trả về đúng ngôn ngữ. Không cần dùng `useTranslations` cho navigation labels nữa.

### TypeScript types (từ payload-types.ts)

```typescript
// Header global
export interface Header {
  id: number;
  topBar?: {
    enabled?: boolean | null;
    content?: string | null;
  };
  navigation?:
    | {
        label: string;
        link: string;
        children?:
          | {
              label: string;
              link: string;
              id?: string | null;
            }[]
          | null;
        id?: string | null;
      }[]
    | null;
}

// SiteSetting global
export interface SiteSetting {
  id: number;
  siteName: string;
  logo?: (number | null) | Media;
  // ...contact, social
}
```

### NavigationHeader component structure

```tsx
// src/components/layout/Header.tsx (hoặc NavigationHeader.tsx)
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Header as HeaderType, SiteSetting, Media } from '@/payload-types'

interface NavigationHeaderProps {
  headerData: HeaderType
  siteSettings: SiteSetting
}

export function Header({ headerData, siteSettings }: NavigationHeaderProps) {
  const locale = useLocale()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = headerData.navigation ?? []
  const logo = siteSettings.logo as Media | null  // populated via defaultDepth: 1

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-[var(--container-max)] px-md">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={`/${locale}`}>
            {logo?.url ? (
              <Image src={logo.url} alt={logo.alt || 'VIES'} width={120} height={40} />
            ) : (
              /* Fallback placeholder — giữ nguyên hiện tại */
            )}
          </Link>

          {/* Desktop Nav — từ CMS */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <Link href={`/${locale}${item.link}`} className="...">
                  {item.label}
                  {item.children?.length && <ChevronDownIcon />}
                </Link>
                {/* Dropdown */}
                {item.children?.length && (
                  <div className="hidden group-hover:block absolute top-full left-0 ...">
                    {item.children.map((child) => (
                      <Link key={child.id} href={`/${locale}${child.link}`}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA — amber */}
          <Link href={`/${locale}/contact`} className="bg-accent hover:bg-accent/90 text-text ...">
            Liên hệ  {/* hoặc từ i18n */}
          </Link>
        </div>
      </div>
    </header>
  )
}
```

### Logo rendering

Logo field trong SiteSettings là `upload` relationTo `media`. Với `defaultDepth: 1`, khi fetch global, logo sẽ được populated thành Media object:

```typescript
// Khi logo populated (defaultDepth: 1)
siteSettings.logo = {
  id: 1,
  url: '/media/vies-logo.png',
  alt: 'VIES Logo',
  width: 200,
  height: 60,
  // ...sizes, filename, etc.
}

// Khi chưa có logo (null)
siteSettings.logo = null
```

**Fallback pattern:** Nếu `logo` là null hoặc không có `url`, hiện placeholder text "VIES" (giống hiện tại).

**`next/image` usage:**
```tsx
<Image
  src={logo.url}
  alt={logo.alt || siteSettings.siteName || 'VIES'}
  width={120}
  height={40}
  className="h-10 w-auto"
  priority  // Above-the-fold image
/>
```

### Dropdown hover pattern

Dùng CSS `group-hover` cho đơn giản, không cần useState:

```tsx
<div className="relative group">
  <Link href={`/${locale}${item.link}`} className="px-4 py-2 flex items-center gap-1">
    {item.label}
    {item.children?.length ? <ChevronDownIcon className="w-4 h-4" /> : null}
  </Link>

  {item.children?.length ? (
    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100
                    absolute top-full left-0 mt-0 py-2 bg-white rounded-md shadow-lg
                    border border-border min-w-[160px] transition-all duration-150">
      {item.children.map((child) => (
        <Link
          key={child.id}
          href={`/${locale}${child.link}`}
          className="block px-4 py-2 text-sm text-text hover:bg-primary-light transition-colors"
        >
          {child.label}
        </Link>
      ))}
    </div>
  ) : null}
</div>
```

### Mobile menu với CMS data

```tsx
{/* Mobile menu — update with CMS data + expandable children */}
{mobileMenuOpen && (
  <div className="lg:hidden py-4 border-t">
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <div key={item.id}>
          <Link href={`/${locale}${item.link}`} onClick={() => setMobileMenuOpen(false)} className="...">
            {item.label}
          </Link>
          {/* Expandable children — có thể dùng useState hoặc <details> */}
          {item.children?.map((child) => (
            <Link key={child.id} href={`/${locale}${child.link}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="pl-8 py-2 text-sm ...">
              {child.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>

    {/* Phone + CTA trong mobile menu */}
    <div className="mt-4 pt-4 border-t flex flex-col gap-2">
      {siteSettings.contact?.phone?.map((phone) => (
        <a key={phone.id} href={`tel:${phone.number.replace(/\s/g, '')}`} className="...">
          {phone.label}: {phone.number}
        </a>
      ))}
      <Link href={`/${locale}/contact`} className="bg-accent text-text text-center py-3 rounded-md font-semibold">
        Liên hệ
      </Link>
    </div>
  </div>
)}
```

### Active state cho navigation

Hiện tại dùng `pathname === item.href`. Với CMS data, link format từ Header global là `/services`, `/products`, etc. (không có locale prefix). Cần prepend `/${locale}`:

```typescript
// Check active: so sánh pathname (bao gồm locale) với link (không có locale)
const isActive = pathname === `/${locale}${item.link}` || pathname.startsWith(`/${locale}${item.link}/`)
```

### CTA button style update

**TRƯỚC:** `bg-secondary hover:bg-secondary-dark text-white` — dùng `--color-secondary` (teal, đã bị xóa từ Story 1.3)
**SAU:** `bg-accent hover:bg-accent/90 text-text` — dùng `--color-accent: #D4A843` (amber)

Theo UX spec button hierarchy:
- Primary (amber): CTA chính — "Yêu cầu báo giá", "Liên hệ"
- Secondary (steel blue): Action phụ — "Xem chi tiết"

### Responsive behavior

| Viewport | Header behavior |
|----------|----------------|
| Mobile (< 1024px) | Logo + hamburger, full menu slide, phone + CTA trong menu |
| Desktop (>= 1024px lg) | Logo + horizontal nav + dropdown + CTA "Liên hệ" |

### Sticky behavior detail

ContactBar (Story 2.1) cuộn đi bình thường. Header `sticky top-0` dính lại khi scroll. Kết quả:
- Khi chưa scroll: ContactBar + Header cả hai visible
- Khi scroll: ContactBar cuộn đi, Header dính ở top-0

Không cần JavaScript cho behavior này — CSS `sticky top-0` trên Header đủ.

### Điểm cần tránh

- **KHÔNG** dùng `useTranslations` cho navigation labels — labels đến từ CMS (đã localized)
- **KHÔNG** hardcode navigation items — lấy từ `headerData.navigation`
- **KHÔNG** thêm search bar vào Header trong story này — đó là Story 3.1 (SearchBar component)
- **KHÔNG** dùng `bg-secondary` cho CTA — token đã bị xóa, dùng `bg-accent`
- **KHÔNG** tạo component mới cho dropdown — dùng CSS `group-hover` đơn giản
- **KHÔNG** quên xử lý logo fallback — logo có thể null nếu chưa upload trong CMS
- **KHÔNG** dùng `useRouter` — không cần trong Header (đã move sang LanguageSwitcher)
- **KHÔNG** import `useTranslations('common')` nếu không cần — CTA text "Liên hệ" có thể lấy từ i18n hoặc hardcode (vì nó từ nav item cuối)

### Xử lý CTA text

Có 2 options cho nút "Liên hệ" CTA:
1. **Từ i18n:** `useTranslations('nav')` → `t('contact')` — cần giữ Client Component i18n
2. **Từ CMS:** Có thể thêm 1 nav item cuối là "Liên hệ" với link "/contact" — nhưng UX spec tách riêng CTA style

**Khuyến nghị:** Giữ `useTranslations('nav')` cho CTA text (`t('contact')`). Header vẫn là Client Component nên import next-intl hooks vẫn hoạt động.

### Files cần thay đổi

| File | Hành động | Mô tả |
|------|-----------|-------|
| `src/components/layout/Header.tsx` | **Sửa** | Thêm props, CMS navigation, dropdown, amber CTA, mobile menu update |
| `src/app/(frontend)/layout.tsx` | **Sửa** | Pass `headerData` và `siteSettings` props xuống Header |

### Files KHÔNG thay đổi

| File | Lý do |
|------|-------|
| `src/components/layout/ContactBar.tsx` | Đã hoàn thành trong Story 2.1, không liên quan |
| `src/components/layout/LanguageSwitcher.tsx` | Đã hoàn thành trong Story 2.1 |
| `src/globals/Header.ts` | Schema đã đúng, navigation array có children |
| `src/globals/SiteSettings.ts` | Schema đã đúng, logo field đã có |
| `src/payload-types.ts` | Types đã generated, không cần thay đổi |
| `messages/*.json` | nav.contact key đã có |

### Previous Story Intelligence (Story 2.1)

**Patterns thiết lập:**
- Layout fetch globals bằng `getPayload({ config: configPromise })` + `payload.findGlobal()`
- `Promise.all` cho parallel fetch (siteSettings + headerData)
- Server Component (ContactBar) nhận props từ layout — clean data flow
- Client Component (LanguageSwitcher) tách riêng cho interactivity
- Inline SVG icons (PhoneIcon, MailIcon) — không dùng icon library
- `cn()` utility từ `@/lib/utils` cho conditional classes
- Container: `mx-auto max-w-[var(--container-max)] px-md`
- PayloadCMS type: `SiteSetting` (không phải `SiteSettings`) — singular form

**Cảnh báo từ Story 2.1:**
- `siteSettings.logo` type là `(number | null) | Media` — cần type guard hoặc cast `as Media` khi populated
- Contact phone label có thể null — cần optional chaining: `phone.label && ...`

### Git Intelligence

```
159c9f2 Add i18n message keys for redesign UI coverage (Story 1.4)
f8dc414 Update design tokens to Nordic Industrial palette
40c38d8 Switch draft-enabled collections to publishedOnly access control
22bb40c Remove Khmer locale, keep only VI/EN support
```

- Story 2.1 đã implement nhưng chưa commit (status: review)
- `--color-secondary` đã bị xóa trong Story 1.3 — CTA button hiện dùng `bg-secondary` sẽ **KHÔNG HOẠT ĐỘNG** → phải đổi sang `bg-accent`
- Header.tsx đã được simplified (topbar removed, language switcher removed)

### Architecture Constraints

- **Client Component**: Header cần `'use client'` cho `useState` (mobile menu) và `useLocale()`, `usePathname()`
- **Serialized props**: Data từ Server Component (layout) → Client Component (Header) phải JSON serializable. Media objects populated bởi PayloadCMS đã serializable.
- **`defaultDepth: 1`**: Logo relationship sẽ populated 1 level — đủ để có `url`, `alt`, `width`, `height`
- **next/image**: Dùng cho logo image — `priority` prop vì above-the-fold
- **Accessibility**: `<nav>` landmark, `aria-current="page"` cho active item, focus visible states

### Thứ tự thực hiện khuyến nghị

1. Cập nhật layout.tsx — pass thêm props xuống Header (nhỏ, nhanh)
2. Refactor Header — thêm props interface, CMS navigation, logo
3. Thêm desktop dropdown cho items có children
4. Cập nhật mobile menu với CMS data + phone/CTA
5. Đổi CTA style bg-secondary → bg-accent
6. Build verification

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.1 - Component Data Mapping]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.2 - Component Data Flow]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 4.2 - Header Global]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#NavigationHeader Component Spec]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Button Hierarchy]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Navigation Patterns]
- [Source: src/components/layout/Header.tsx - Current Header (post Story 2.1)]
- [Source: src/app/(frontend)/layout.tsx - Current layout with globals fetching]
- [Source: src/payload-types.ts#L1301 - Header type]
- [Source: src/payload-types.ts#L1273 - SiteSetting type]
- [Source: _bmad-output/implementation-artifacts/2-1-contactbar-component.md - Previous story]

## Change Log

- 2026-02-05: Implemented Story 2.2 — NavigationHeader with CMS data, dropdown, mobile menu, amber CTA
- 2026-02-05: Code review — fixed 10 issues (3 HIGH, 4 MEDIUM, 3 LOW): keyboard-accessible dropdown, aria-expanded/aria-haspopup, i18n aria-labels, body scroll lock, null key fallback, child active state, transition-opacity, phone label spacing, dropdown hover gap

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Build passed successfully with no TypeScript errors

### Completion Notes List

- Kept filename `Header.tsx` (no rename needed — export name unchanged, backwards compatible)
- Navigation items now driven by `headerData.navigation` from CMS (PayloadCMS Header global)
- Logo renders from `siteSettings.logo` (Media type) via `next/image` with `priority` — falls back to "V" placeholder when no logo uploaded
- CTA button changed from `bg-secondary` (removed token) to `bg-accent` (amber #D4A843) per UX spec
- Desktop dropdown uses CSS `group-hover` with `invisible/visible` + `opacity` transition for smooth hover experience
- Mobile menu uses `expandedMobileItem` state for toggling children submenu per nav item
- Mobile menu includes phone numbers from `siteSettings.contact.phone` + amber CTA button
- Active navigation state uses `pathname` comparison with locale-prefixed links
- Added `aria-current="page"` for active nav items, `aria-label` for menu toggle button
- Layout `select` updated to fetch `navigation`, `logo`, `siteName` in addition to existing `contact` and `topBar`
- Used `useTranslations('nav')` for CTA "Liên hệ"/"Contact" text (i18n driven)

### File List

- `src/components/layout/Header.tsx` — Modified: added CMS props, navigation from headerData, logo rendering, dropdown, mobile expandable menu, amber CTA, phone numbers
- `src/app/(frontend)/layout.tsx` — Modified: expanded select fields for globals, pass headerData + siteSettings to Header
- `messages/vi.json` — Modified: added nav.openMenu, nav.closeMenu, nav.expandSubmenu i18n keys
- `messages/en.json` — Modified: added nav.openMenu, nav.closeMenu, nav.expandSubmenu i18n keys
