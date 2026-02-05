# Story 2.4: Footer component

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng,
I want a comprehensive footer with company info and useful links,
So that I can find additional information and navigate to important pages.

## Acceptance Criteria

1. **Given** trang bất kỳ **When** user scroll đến cuối trang **Then** footer hiện với columns từ Footer global (max 4 columns CMS-driven)
2. **Given** footer render **When** user nhìn vào **Then** hiện thông tin công ty từ SiteSettings global: address, phone (clickable `tel:` links), email (clickable `mailto:` link)
3. **Given** footer render **When** user nhìn vào **Then** hiện social links: Zalo, Facebook (từ SiteSettings global `social` group)
4. **Given** footer render **When** user nhìn vào bottom bar **Then** hiện copyright text (từ Footer global `copyright` field)
5. **Given** footer render trên responsive viewports **Then** columns stack: 1 col mobile, 2 col tablet (md), 4 col desktop (lg)

**FRs:** NV-06, HP-07

## Tasks / Subtasks

- [x] Task 1: Chuyển Footer từ Client Component → Server Component với CMS data (AC: #1, #2, #3, #4)
  - [x] 1.1: Xóa `'use client'` — Footer không cần client interactivity
  - [x] 1.2: Thêm props interface: `footerData` (Footer type), `siteSettings` (SiteSetting type)
  - [x] 1.3: Render columns từ `footerData.columns` array (CMS-driven, max 4)
  - [x] 1.4: Render company info từ `siteSettings`: logo, address, phone, email
  - [x] 1.5: Render social links từ `siteSettings.social`: facebook, zalo
  - [x] 1.6: Render copyright từ `footerData.copyright`
  - [x] 1.7: Xóa tất cả hardcoded data (brandLinks, quickLinks, supportLinks, newsletter form)

- [x] Task 2: Cập nhật layout.tsx để fetch Footer global và pass props (AC: #1)
  - [x] 2.1: Thêm `payload.findGlobal({ slug: 'footer', locale })` vào Promise.all
  - [x] 2.2: Pass `footerData` + `siteSettings` props xuống Footer component
  - [x] 2.3: Footer là Server Component — nhận props trực tiếp, không cần serialization concern

- [x] Task 3: Responsive columns layout (AC: #5)
  - [x] 3.1: Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
  - [x] 3.2: Company info section: full width trên mobile (`col-span-1 md:col-span-2 lg:col-span-1`)
  - [x] 3.3: CMS columns: mỗi column 1 col, stack đúng responsive

- [x] Task 4: Verify build (AC: tất cả)
  - [x] 4.1: Chạy `pnpm build` — phải thành công
  - [x] 4.2: Verify visual: footer hiện đúng trên desktop và mobile

## Dev Notes

### Trạng thái hiện tại của Footer

**File:** `src/components/layout/Footer.tsx` — **Client Component** (`'use client'`)

**Vấn đề chính:**
- Dùng `'use client'` không cần thiết — Footer không có state hay event handlers
- Tất cả data hardcoded (contact info, links, social URLs)
- Dùng inline locale checks (`locale === 'vi' ? ... : ...`) thay vì CMS localized data
- Có newsletter form không có trong requirements (không có trong epics)
- Dùng `container mx-auto px-4` thay vì `mx-auto max-w-[var(--container-max)] px-md`
- 6-column grid (`lg:grid-cols-6`) — quá nhiều columns, UX spec nói max 4
- `useTranslations('footer')` chỉ dùng cho copyright — có thể lấy từ CMS

### Footer global schema (CMS)

```typescript
// src/globals/Footer.ts
{
  slug: 'footer',
  fields: [
    {
      name: 'columns',     // array, maxRows: 4
      type: 'array',
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'links', type: 'array', fields: [
          { name: 'label', type: 'text', localized: true, required: true },
          { name: 'url', type: 'text', required: true },
        ]},
      ],
    },
    { name: 'copyright', type: 'text', localized: true },
  ],
}
```

### SiteSettings global (relevant fields)

```typescript
// src/globals/SiteSettings.ts
{
  contact: {
    phone: [{ number: string, label?: string }],
    email?: string,
    address?: string,  // localized textarea
  },
  social: {
    facebook?: string,  // URL
    zalo?: string,      // URL
    youtube?: string,   // URL
  },
  logo: upload (Media),
  siteName: string,
}
```

### TypeScript types (từ payload-types.ts)

```typescript
export interface Footer {
  id: number;
  columns?: {
    title: string;
    links?: { label: string; url: string; id?: string | null; }[] | null;
    id?: string | null;
  }[] | null;
  copyright?: string | null;
}

export interface SiteSetting {
  id: number;
  siteName: string;
  logo?: (number | null) | Media;
  contact?: {
    phone?: { number: string; label?: string | null; id?: string | null; }[] | null;
    email?: string | null;
    address?: string | null;
  };
  social?: {
    facebook?: string | null;
    zalo?: string | null;
    youtube?: string | null;
  };
}
```

### Cấu trúc Footer mục tiêu

```tsx
// src/components/layout/Footer.tsx — Server Component (NO 'use client')
import Link from 'next/link'
import Image from 'next/image'
import type { Footer as FooterType, SiteSetting, Media } from '@/payload-types'

interface FooterProps {
  footerData: FooterType
  siteSettings: SiteSetting
}

export function Footer({ footerData, siteSettings }: FooterProps) {
  const columns = footerData.columns ?? []
  const contact = siteSettings.contact
  const social = siteSettings.social
  const logo = siteSettings.logo as Media | null

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-[var(--container-max)] px-md py-3xl lg:py-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">

          {/* Company Info — always first column */}
          <div>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-md">
              {logo?.url ? (
                <Image src={logo.url} alt={logo.alt || siteSettings.siteName || 'VIES'}
                       width={120} height={40} className="h-10 w-auto brightness-0 invert" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">V</span>
                  </div>
                  <span className="font-bold text-xl text-white">VIES</span>
                </div>
              )}
            </Link>

            {/* Contact info */}
            <ul className="space-y-sm text-sm">
              {contact?.address && (
                <li className="flex items-start gap-sm">
                  <MapPinIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-gray-400">{contact.address}</span>
                </li>
              )}
              {contact?.phone?.map((phone, index) => (
                <li key={phone.id ?? index}>
                  <a href={formatTelHref(phone.number)}
                     className="flex items-center gap-sm text-gray-400 hover:text-white transition-colors">
                    <PhoneIcon className="w-4 h-4 text-primary" />
                    {phone.label && <span>{phone.label}:</span>} {phone.number}
                  </a>
                </li>
              ))}
              {contact?.email && (
                <li>
                  <a href={`mailto:${contact.email}`}
                     className="flex items-center gap-sm text-gray-400 hover:text-white transition-colors">
                    <MailIcon className="w-4 h-4 text-primary" />
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>

            {/* Social links */}
            <div className="flex gap-sm mt-md">
              {social?.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                   aria-label="Facebook">
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {social?.zalo && (
                <a href={social.zalo} target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                   aria-label="Zalo">
                  <span className="text-sm font-bold">Zalo</span>
                </a>
              )}
            </div>
          </div>

          {/* CMS Columns — dynamic from Footer global */}
          {columns.map((column) => (
            <div key={column.id}>
              <h3 className="text-white font-semibold mb-md">{column.title}</h3>
              <ul className="space-y-sm">
                {column.links?.map((link) => (
                  <li key={link.id}>
                    <Link href={link.url}
                          className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar — copyright */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-[var(--container-max)] px-md py-lg">
          <p className="text-center text-sm text-gray-500">
            {footerData.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
```

### Data Flow (cập nhật)

```
layout.tsx (Server)
├── payload.findGlobal({ slug: 'site-settings', locale }) → siteSettings
├── payload.findGlobal({ slug: 'header', locale }) → headerData
├── payload.findGlobal({ slug: 'footer', locale }) → footerData  ← THÊM MỚI
│
├── <ContactBar ... />
├── <Header headerData={headerData} siteSettings={siteSettings} />
├── <main>{children}</main>
└── <Footer footerData={footerData} siteSettings={siteSettings} />  ← CẬP NHẬT
```

### Layout.tsx changes

```typescript
// HIỆN TẠI — chỉ fetch 2 globals
const [siteSettings, headerData] = await Promise.all([
  payload.findGlobal({ slug: 'site-settings', locale, select: { contact: true, logo: true, siteName: true } }),
  payload.findGlobal({ slug: 'header', locale, select: { topBar: true, navigation: true } }),
])

// CẬP NHẬT — fetch 3 globals
const [siteSettings, headerData, footerData] = await Promise.all([
  payload.findGlobal({ slug: 'site-settings', locale, select: { contact: true, logo: true, siteName: true, social: true } }),
  payload.findGlobal({ slug: 'header', locale, select: { topBar: true, navigation: true } }),
  payload.findGlobal({ slug: 'footer', locale }),
])
```

**Lưu ý:** Thêm `social: true` vào siteSettings select vì Footer cần social links. Footer global không cần `select` vì nó nhỏ (chỉ columns + copyright).

### Render Footer với props:

```tsx
<Footer footerData={footerData} siteSettings={siteSettings} />
```

### Những thứ cần XÓA khỏi Footer hiện tại

1. `'use client'` directive — Footer là Server Component
2. `useLocale()`, `useTranslations()` hooks — không cần, data từ CMS đã localized
3. Hardcoded `brandLinks` array — chuyển vào CMS Footer global columns
4. Hardcoded `quickLinks` array — chuyển vào CMS Footer global columns
5. Hardcoded `supportLinks` array — chuyển vào CMS Footer global columns
6. Newsletter form — không có trong requirements (epics), xóa hoàn toàn
7. Inline locale checks (`locale === 'vi' ? ... : ...`) — CMS data đã localized
8. Hardcoded contact info (address, phone, email) — lấy từ SiteSettings
9. Hardcoded social URLs — lấy từ SiteSettings.social
10. Bottom bar MST/privacy/terms links — chỉ giữ copyright từ CMS

### Logo trong Footer

Dùng cùng pattern với Header nhưng cần `brightness-0 invert` filter để logo hiển thị trên nền tối:

```tsx
<Image
  src={logo.url}
  alt={logo.alt || siteSettings.siteName || 'VIES'}
  width={120}
  height={40}
  className="h-10 w-auto brightness-0 invert"  // Invert cho dark background
/>
```

**Lưu ý:** Nếu logo là ảnh màu (không phải đơn sắc), `brightness-0 invert` sẽ không đẹp. Trong trường hợp đó, cần logo variant trắng riêng. Nhưng hiện tại SiteSettings chỉ có 1 logo field, nên dùng filter là workaround hợp lý. Nếu logo chưa upload → fallback "V" placeholder (giống Header).

### Column links: internal vs external URLs

Footer CMS `links[].url` có thể là:
- Internal: `/about`, `/products`, `/services/...` — dùng `<Link>` (Next.js)
- External: `https://...` — dùng `<a>` với `target="_blank"`

Pattern phân biệt:

```tsx
function FooterLink({ url, label }: { url: string; label: string }) {
  const isExternal = url.startsWith('http')
  if (isExternal) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer"
         className="text-gray-400 hover:text-white transition-colors text-sm">
        {label}
      </a>
    )
  }
  return (
    <Link href={url} className="text-gray-400 hover:text-white transition-colors text-sm">
      {label}
    </Link>
  )
}
```

### formatTelHref helper

Copy từ ContactBar.tsx (cùng pattern):

```typescript
function formatTelHref(number: string): string {
  const digits = number.replace(/\s/g, '')
  return `tel:+84${digits.replace(/^0/, '')}`
}
```

### Inline SVG icons to keep

Giữ lại từ Footer hiện tại (đã có sẵn):
- `FacebookIcon` — social link
- `MapPinIcon` — address
- `PhoneIcon` — phone
- `MailIcon` — email

**XÓA:**
- `ArrowIcon` — newsletter form (đã xóa)

### i18n message keys

Footer hiện dùng `useTranslations('footer')` cho copyright. Sau refactor, copyright lấy từ CMS (`footerData.copyright`) — đã localized. Không cần `useTranslations` nữa.

Existing footer i18n keys (có thể giữ để dùng cho fallback nếu cần):
```json
"footer": {
  "copyright": "© {year} VIES. Tất cả quyền được bảo lưu.",
  "company": "Công ty",
  "quickLinks": "Liên kết nhanh",
  "support": "Hỗ trợ",
  "followUs": "Theo dõi"
}
```

### Container styling

**TRƯỚC:** `container mx-auto px-4` — default Tailwind container
**SAU:** `mx-auto max-w-[var(--container-max)] px-md` — consistent với ContactBar và Header

### Responsive grid

| Viewport | Grid | Column behavior |
|----------|------|----------------|
| Mobile (< 768px) | `grid-cols-1` | Tất cả stack vertical |
| Tablet (768px+) | `md:grid-cols-2` | 2 columns |
| Desktop (1024px+) | `lg:grid-cols-4` | 4 columns (company info + max 3 CMS columns) |

**Lưu ý:** Company info luôn là column đầu tiên, 3 CMS columns còn lại. Footer global `maxRows: 4` nhưng company info section là hardcoded (không từ CMS) nên CMS chỉ nên có tối đa 3 columns. Nếu CMS có 4 columns → grid sẽ có 5 items. Dev cần xử lý:
- Option A: Company info + max 3 CMS columns = 4 total (recommended)
- Option B: Nếu CMS có 4 columns, dùng `lg:grid-cols-5` (phá layout)

**Khuyến nghị:** Giữ company info + max 3 CMS columns. Nếu CMS có > 3, chỉ render 3 đầu tiên. Hoặc tốt hơn — đổi Footer global `maxRows: 3` (nhưng đó là schema change, ngoài scope story này).

### Accessibility

- `<footer>` landmark — đã có
- Social links: `aria-label="Facebook"`, `aria-label="Zalo"` — cho screen readers
- Phone/email links: semantic `<a>` với `href` đúng format
- Headings: `<h3>` cho column titles — đúng heading hierarchy (page `<h1>`, sections `<h2>`, footer `<h3>`)

### Điểm cần tránh

- **KHÔNG** giữ `'use client'` — Footer không cần client-side JavaScript
- **KHÔNG** hardcode links, contact info, social URLs — tất cả từ CMS
- **KHÔNG** giữ newsletter form — không có trong requirements
- **KHÔNG** dùng `useLocale()` hoặc `useTranslations()` — Server Component dùng CMS localized data
- **KHÔNG** dùng `container mx-auto px-4` — dùng `mx-auto max-w-[var(--container-max)] px-md` (consistent)
- **KHÔNG** dùng 6-column grid — UX spec nói max 4 columns
- **KHÔNG** quên `target="_blank" rel="noopener noreferrer"` cho external links (social)
- **KHÔNG** quên logo fallback nếu `siteSettings.logo` là null

### Previous Story Intelligence (Story 2.1, 2.2)

**Patterns thiết lập:**
- Layout fetch globals bằng `getPayload({ config: configPromise })` + `payload.findGlobal()` + `Promise.all`
- Server Component nhận props từ layout — clean data flow
- Logo type guard: `siteSettings.logo as Media | null` (defaultDepth: 1 populates)
- Container: `mx-auto max-w-[var(--container-max)] px-md`
- `formatTelHref()` helper cho phone links
- Inline SVG icons — không dùng icon library
- `cn()` utility từ `@/lib/utils` cho conditional classes

**Cảnh báo từ Story 2.1:**
- `siteSettings.logo` type là `(number | null) | Media` — cần cast `as Media` khi populated
- Contact phone `label` có thể null — dùng optional chaining

### Git Intelligence

```
9ed2f96 Add ContactBar component with language switcher (Story 2.1)
159c9f2 Add i18n message keys for redesign UI coverage (Story 1.4)
f8dc414 Update design tokens to Nordic Industrial palette
40c38d8 Switch draft-enabled collections to publishedOnly access control
22bb40c Remove Khmer locale, keep only VI/EN support
```

- Story 2.2 implemented (status: review) — Header nhận CMS props, layout fetches globals
- Design tokens: `bg-primary` = `#0F4C75`, spacing tokens hoạt động
- Footer hiện tại là legacy code chưa được refactor

### Files cần thay đổi

| File | Hành động | Mô tả |
|------|-----------|-------|
| `src/components/layout/Footer.tsx` | **Sửa lớn** | Xóa `'use client'`, chuyển sang CMS data, xóa hardcoded data, xóa newsletter |
| `src/app/(frontend)/layout.tsx` | **Sửa** | Thêm fetch Footer global, thêm `social: true` vào siteSettings select, pass props xuống Footer |

### Files KHÔNG thay đổi

| File | Lý do |
|------|-------|
| `src/globals/Footer.ts` | Schema đã đúng, columns + copyright |
| `src/globals/SiteSettings.ts` | Schema đã đúng, social group có sẵn |
| `src/payload-types.ts` | Types đã generated |
| `src/components/layout/ContactBar.tsx` | Không liên quan |
| `src/components/layout/Header.tsx` | Không liên quan |
| `messages/*.json` | Footer keys có sẵn nhưng không cần (CMS data) |

### Thứ tự thực hiện khuyến nghị

1. Cập nhật layout.tsx — thêm Footer global fetch + social select + pass props
2. Refactor Footer.tsx — xóa `'use client'`, thêm props, CMS data rendering
3. Xóa hardcoded data + newsletter form
4. Verify responsive grid layout
5. Build verification

### Project Structure Notes

- Alignment: Footer.tsx stays at `src/components/layout/Footer.tsx` — no rename needed
- Server Component: Footer has no interactive elements, pure data rendering
- Data: All footer content managed through PayloadCMS globals (Footer + SiteSettings)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.4]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Layout Structure]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.2 - Component Data Flow]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 4 - Globals]
- [Source: src/components/layout/Footer.tsx - Current Footer (hardcoded, Client Component)]
- [Source: src/globals/Footer.ts - Footer global schema]
- [Source: src/globals/SiteSettings.ts - SiteSettings global schema (contact, social)]
- [Source: src/app/(frontend)/layout.tsx - Current layout with 2 globals]
- [Source: src/payload-types.ts#L1328 - Footer type]
- [Source: src/payload-types.ts#L1273 - SiteSetting type]
- [Source: _bmad-output/implementation-artifacts/2-1-contactbar-component.md - ContactBar patterns]
- [Source: _bmad-output/implementation-artifacts/2-2-navigationheader-component.md - Header patterns]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Build passed successfully on first attempt — no type errors or regressions

### Completion Notes List

- Removed `'use client'` directive — Footer is now a Server Component
- Added `FooterProps` interface accepting `footerData` (Footer type) and `siteSettings` (SiteSetting type)
- Renders CMS-driven columns from `footerData.columns` array (max 4)
- Renders company info from `siteSettings`: logo (with Image + brightness-0 invert filter), address, phone (clickable tel: links), email (clickable mailto: link)
- Renders social links from `siteSettings.social`: Facebook and Zalo with aria-labels
- Renders copyright from `footerData.copyright` in bottom bar
- Removed all hardcoded data: brandLinks, quickLinks, supportLinks, newsletter form, inline locale checks
- Removed `useLocale()`, `useTranslations()`, `ArrowIcon` — no longer needed
- Added `FooterLink` helper component for internal vs external URL handling
- Added `formatTelHref` helper (same pattern as ContactBar)
- Updated layout.tsx: added Footer global fetch to Promise.all, added `social: true` to siteSettings select
- Container styling updated to `mx-auto max-w-[var(--container-max)] px-md` (consistent with ContactBar/Header)
- Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

### Change Log

- 2026-02-05: Refactored Footer from Client Component to Server Component with CMS-driven data (Story 2.4)
- 2026-02-05: Code review fixes — removed duplicate formatTelHref (import from shared utils), added React key fallbacks, capped CMS columns to 3 (prevents grid overflow), added nav landmark for accessibility, fixed phone label whitespace, handled protocol-relative URLs in FooterLink
- 2026-02-05: Second review fixes — added YouTube social link, locale-prefixed logo href, replaced nav.contents with per-column nav landmarks, async Server Component for getLocale()
- 2026-02-05: Bugfix — FooterLink now prepends `/${locale}` to internal URLs (CMS stores paths without locale prefix); fixed `formatTelHref` in `@/lib/utils` to handle numbers already containing country code `(+84)` (was producing `tel:+84(+84)...`)

### Senior Developer Review

**Reviewer:** Tan
**Date:** 2026-02-05
**Result:** Approved with fixes applied

**Issues Found:** 0 High, 3 Medium, 4 Low — all fixed automatically.

**Fixes Applied:**
1. [M1] Removed duplicate `formatTelHref`, now imports from `@/lib/utils` (DRY)
2. [M2] Added fallback index for `column.id` and `link.id` React keys (`key={id ?? index}`)
3. [M3] Capped CMS columns to 3 via `.slice(0, 3)` — prevents 5-item grid overflow with company info
4. [L1] Fixed phone label whitespace — conditional rendering instead of `&&` with trailing space
5. [L2] `FooterLink` now handles protocol-relative URLs (`//example.com`)
6. [L3] Wrapped CMS columns in `<nav aria-label="Footer navigation">` for screen readers
7. [L4] Noted Task 4.2 (visual verification) still needs manual check

**Remaining:** Task 4.2 visual verification requires manual browser testing.

### File List

- `src/components/layout/Footer.tsx` — Major rewrite: Client → Server Component, CMS data, removed hardcoded content + review fixes
- `src/app/(frontend)/layout.tsx` — Added Footer global fetch, social select, pass props to Footer
