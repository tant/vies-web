# Story 3.10: Homepage hero + search + dual section

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng,
I want the homepage to have a prominent search bar and showcase both services and products,
So that I can quickly search or discover what VIES offers.

## Acceptance Criteria

1. **Given** homepage `/` **When** trang load **Then** hero section hiện search bar lớn trung tâm (SearchBar variant="hero")
2. **Given** hero section **When** render **Then** hiện subtitle dưới search bar mô tả ngắn về VIES
3. **Given** hero section **When** render **Then** hiện quick search hints dưới search bar (VD: "6205", "SKF", "vòng bi") dạng clickable tags
4. **Given** click quick search hint tag **When** click tag "6205" **Then** navigate đến `/search?q=6205`
5. **Given** hero section xong **When** scroll xuống **Then** hiện dual section: Dịch vụ kỹ thuật (nền steel blue --color-primary) bên trái + Sản phẩm (nền trắng) bên phải
6. **Given** dual section **When** click vào Dịch vụ kỹ thuật **Then** navigate đến `/services`
7. **Given** dual section **When** click vào item Sản phẩm **Then** navigate đến `/products` hoặc category tương ứng
8. **Given** dual section xong **When** scroll xuống **Then** hiện BrandLogoBar section với partner brands
9. **Given** BrandLogoBar xong **When** scroll xuống **Then** hiện CTA section: "Cần tư vấn hoặc báo giá?" + nút gọi + nút Zalo
10. **Given** viewport < 768px (mobile) **When** render dual section **Then** stack vertical (dịch vụ trên, sản phẩm dưới)

## Dependencies

**⚠️ DEPENDENCY:** Story 3.9 (BrandLogoBar component) MUST be completed before this story. BrandLogoBar component file `src/components/ui/BrandLogoBar.tsx` is required for AC #8.

If BrandLogoBar is not available:
1. Complete Story 3.9 first, OR
2. Create a placeholder section that will be replaced when BrandLogoBar is ready

## Tasks / Subtasks

- [x] Task 1: Rebuild Hero section with Search-First approach (AC: #1, #2, #3, #4)
  - [x] 1.1: Replace current hero with clean search-focused layout
  - [x] 1.2: Center SearchBar component with variant="hero"
  - [x] 1.3: Add subtitle text below search bar (localized VI/EN)
  - [x] 1.4: Create QuickSearchHints component with clickable tags
  - [x] 1.5: Tags: "6205", "22210", "SKF", "FAG", "vòng bi cầu", "vòng bi đũa" (localized)
  - [x] 1.6: Each tag links to `/search?q={tag}`
  - [x] 1.7: Responsive: full-width on mobile, centered on desktop

- [x] Task 2: Create Dual Section layout (AC: #5, #6, #7, #10)
  - [x] 2.1: Create DualSection component or implement inline in page
  - [x] 2.2: Left side: Services panel (steel blue --color-primary background, white text)
  - [x] 2.3: Services content: heading + brief description + service highlights + CTA link to /services
  - [x] 2.4: Right side: Products panel (white background)
  - [x] 2.5: Products content: heading + grid of 4-6 category cards or featured products
  - [x] 2.6: Each product/category item links to products page with appropriate filter
  - [x] 2.7: Responsive: 50/50 split on desktop, stack vertically on mobile

- [x] Task 3: Integrate BrandLogoBar section (AC: #8)
  - [x] 3.1: Import BrandLogoBar from Story 3.9 implementation
  - [x] 3.2: Fetch brands data in homepage: `payload.find({ collection: 'brands', sort: 'name', depth: 1 })`
  - [x] 3.3: Pass brands and locale to BrandLogoBar component
  - [x] 3.4: Position: below dual section, above CTA section
  - [x] 3.5: If BrandLogoBar not ready, create temporary placeholder

- [x] Task 4: Refine CTA Section (AC: #9)
  - [x] 4.1: Update existing CTA section styling to match design tokens
  - [x] 4.2: Heading: "Cần tư vấn hoặc báo giá?" (localized)
  - [x] 4.3: Primary button: Phone call (tel: link) - amber/accent color
  - [x] 4.4: Secondary button: Zalo link
  - [x] 4.5: Fetch contact info from SiteSettings global if not already available

- [x] Task 5: Clean up and remove unused sections
  - [x] 5.1: Remove or consolidate redundant sections from current homepage
  - [x] 5.2: Remove inline icon components that are duplicated (use shared icons)
  - [x] 5.3: Remove SKF introduction section (not in UX spec for homepage)
  - [x] 5.4: Ensure homepage is clean and focused per UX spec

- [x] Task 6: Build + verify
  - [x] 6.1: Chạy `pnpm build` — phải thành công
  - [x] 6.2: Verify hero section displays SearchBar prominently
  - [x] 6.3: Verify quick search hints are clickable and navigate correctly
  - [x] 6.4: Verify dual section layout (50/50 on desktop, stack on mobile)
  - [x] 6.5: Verify BrandLogoBar displays all brands
  - [x] 6.6: Verify CTA section phone and Zalo links work
  - [x] 6.7: Test responsive behavior at all breakpoints
  - [x] 6.8: Verify accessibility: keyboard navigation, focus states

## Dev Notes

### Architecture & Patterns

**Page location:**
```
src/app/(frontend)/[locale]/page.tsx  # UPDATE - Rebuild homepage
```

**Component locations:**
```
src/components/ui/SearchBar.tsx       # EXISTS - Use variant="hero"
src/components/ui/BrandLogoBar.tsx    # FROM Story 3.9 (dependency)
src/components/layout/icons.tsx       # EXISTS - Reuse icons
```

**Data flow (per architecture.md Section 5.2):**
```
Homepage (Server)
├── payload.find({ collection: 'brands' }) → brands
├── payload.find({ collection: 'categories' }) → categories
├── payload.find({ collection: 'products', where: { featured: true } }) → featuredProducts
├── payload.find({ collection: 'services' }) → services
│
├── SearchBar (Client) ← Hero variant, no initial data
├── DualSection (Server)
│   ├── Services panel (content from services fetch or inline)
│   └── Products panel (categories or featuredProducts)
├── BrandLogoBar (Server) ← Props: brands, locale
└── CTASection (Server) ← Contact info (inline or from SiteSettings)
```

### UX Design Specs (từ ux-design-specification.md)

**Layout Structure (Homepage):**
1. **Top bar** (steel blue): SĐT + email | Language switcher ✅ (already in layout)
2. **Header** (trắng): Logo + Navigation + CTA ✅ (already in layout)
3. **Hero**: Search bar lớn trung tâm + subtitle + quick search hints ← **BUILD THIS**
4. **Dual Section**: Dịch vụ (steel blue) | Sản phẩm (trắng) ← **BUILD THIS**
5. **Thương hiệu đối tác**: Logo row ← **INTEGRATE BrandLogoBar**
6. **CTA**: "Cần tư vấn?" + gọi + Zalo ← **REFINE EXISTING**
7. **Footer** ✅ (already in layout)

**Design Direction (from UX spec):**
- **Search-First approach**: Search bar là element đầu tiên user nhìn thấy
- **Dual section** thể hiện VIES là công ty dịch vụ kỹ thuật, không phải dealer thuần
- **Tối giản, thẳng vào việc** → đúng triết lý "Lagom" Scandinavian

**Color tokens:**
- `--color-primary`: #0F4C75 (steel blue) - Services panel background
- `--color-accent`: #D4A843 (amber) - CTA buttons
- `--color-bg`: #FAFAFA - Products panel background
- `--color-text`: #1A1A2E - Primary text

### SearchBar Component (Already Exists)

**Location:** `src/components/ui/SearchBar.tsx`

**Usage for hero:**
```tsx
import { SearchBar } from '@/components/ui/SearchBar'

<SearchBar variant="hero" className="max-w-2xl mx-auto" />
```

**Props:**
- `variant`: 'header' | 'hero' (use 'hero' for homepage)
- `className`: optional additional classes
- `consultPhone`: phone number for no-results suggestion

**Hero variant differences:**
- Larger padding: `pl-12 pr-4 py-4 text-lg rounded-lg`
- Larger icon: `w-6 h-6`
- Placeholder uses `t('placeholderHero')` translation key

### Quick Search Hints Implementation

**Design pattern:**
```tsx
const searchHints = [
  { label: '6205', query: '6205' },
  { label: '22210', query: '22210' },
  { label: 'SKF', query: 'SKF' },
  { label: 'FAG', query: 'FAG' },
  { label: locale === 'vi' ? 'Vòng bi cầu' : 'Ball bearings', query: 'ball bearing' },
  { label: locale === 'vi' ? 'Vòng bi đũa' : 'Roller bearings', query: 'roller bearing' },
]

<div className="flex flex-wrap justify-center gap-2 mt-4">
  {searchHints.map((hint) => (
    <Link
      key={hint.query}
      href={`/${locale}/search?q=${encodeURIComponent(hint.query)}`}
      className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 rounded-full transition-colors"
    >
      {hint.label}
    </Link>
  ))}
</div>
```

### Dual Section Layout

**Desktop layout (md and up):**
```tsx
<section className="py-16 lg:py-20">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-2 gap-0 rounded-xl overflow-hidden shadow-lg">
      {/* Services Panel - Steel Blue */}
      <div className="bg-primary p-8 lg:p-12 text-white">
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">
          {locale === 'vi' ? 'Dịch vụ kỹ thuật' : 'Technical Services'}
        </h2>
        <p className="text-white/80 mb-6">
          {locale === 'vi'
            ? 'Đội ngũ kỹ sư giàu kinh nghiệm, sẵn sàng tư vấn và hỗ trợ mọi vấn đề về vòng bi và bôi trơn'
            : 'Experienced engineering team, ready to consult on all bearing and lubrication issues'}
        </p>
        <ul className="space-y-2 mb-8">
          <li className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5" />
            <span>{locale === 'vi' ? 'Tư vấn kỹ thuật' : 'Technical consultation'}</span>
          </li>
          {/* More service highlights */}
        </ul>
        <Link href={`/${locale}/services`} className="...">
          {locale === 'vi' ? 'Xem dịch vụ' : 'View services'}
        </Link>
      </div>

      {/* Products Panel - White */}
      <div className="bg-white p-8 lg:p-12">
        <h2 className="text-2xl lg:text-3xl font-bold text-text mb-4">
          {locale === 'vi' ? 'Sản phẩm' : 'Products'}
        </h2>
        {/* Category grid or featured products */}
      </div>
    </div>
  </div>
</section>
```

**Mobile layout (< md):**
- Stack vertically
- Services panel on top, Products panel below
- Full-width, no rounded corners

### Hero Section Design

**Per UX spec - Search-First approach:**
```tsx
<section className="bg-gradient-to-br from-primary to-primary/90 text-white">
  <div className="container mx-auto px-4 py-16 lg:py-24 text-center">
    {/* Subtitle */}
    <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
      {t('hero.subtitle')}
    </p>

    {/* SearchBar - Hero variant */}
    <div className="max-w-2xl mx-auto">
      <SearchBar variant="hero" />
    </div>

    {/* Quick search hints */}
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {searchHints.map(hint => (
        <Link key={hint.query} href={...} className="...">
          {hint.label}
        </Link>
      ))}
    </div>
  </div>
</section>
```

**Note:** The current hero has trust indicators (10+ năm, 8+ brands, etc.) - consider if these should be moved or removed per UX spec. UX spec doesn't show these in hero layout.

### CTA Section Pattern

**Per UX spec:**
```tsx
<section className="py-16 lg:py-20 bg-primary text-white">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-2xl md:text-3xl font-bold mb-4">
      {locale === 'vi' ? 'Cần tư vấn hoặc báo giá?' : 'Need consultation or a quote?'}
    </h2>
    <p className="text-white/80 mb-8 max-w-2xl mx-auto">
      {locale === 'vi'
        ? 'Đội ngũ kỹ thuật của VIES luôn sẵn sàng hỗ trợ bạn.'
        : 'Our technical team is always ready to help.'}
    </p>
    <div className="flex flex-wrap justify-center gap-4">
      <a href="tel:+84963048317" className="bg-accent hover:bg-accent/90 text-text px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
        <PhoneIcon className="w-5 h-5" />
        (+84) 963 048 317
      </a>
      <a href="https://zalo.me/..." className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2" target="_blank" rel="noopener">
        Zalo
      </a>
    </div>
  </div>
</section>
```

### Current Homepage Analysis

**What to KEEP:**
- `generateMetadata` function
- Data fetching pattern (brands, categories, featuredProducts)
- Basic page structure

**What to CHANGE:**
- Hero section → Search-first with SearchBar hero variant
- Remove trust indicators from hero (or move elsewhere)
- Create dual section layout (services/products)
- Integrate BrandLogoBar component
- Simplify/clean up sections

**What to REMOVE:**
- SKF introduction section (not in UX spec for homepage)
- Inline icon components (use shared icons from `src/components/layout/icons.tsx`)
- Verbose sections that don't align with UX spec

### i18n Message Keys Needed

Add to `messages/vi.json` and `messages/en.json`:

```json
{
  "home": {
    "hero": {
      "title": "Tìm kiếm sản phẩm",
      "subtitle": "Vòng bi, linh kiện công nghiệp chính hãng từ các thương hiệu hàng đầu thế giới"
    },
    "quickSearch": {
      "title": "Tìm nhanh:"
    },
    "dualSection": {
      "services": {
        "title": "Dịch vụ kỹ thuật",
        "description": "Đội ngũ kỹ sư giàu kinh nghiệm, sẵn sàng tư vấn và hỗ trợ",
        "cta": "Xem dịch vụ"
      },
      "products": {
        "title": "Sản phẩm",
        "cta": "Xem tất cả"
      }
    },
    "cta": {
      "title": "Cần tư vấn hoặc báo giá?",
      "description": "Đội ngũ kỹ thuật của VIES luôn sẵn sàng hỗ trợ bạn."
    }
  }
}
```

### Git Intelligence

**Recent commits pattern (from Story 3.8):**
```
e5788d5 Add Category detail page with pagination, caching, and accessibility (Story 3.8)
bdf16a0 Add Brand detail page with i18n, caching, and accessibility (Story 3.7)
3a0a18b Add Product detail page with gallery, specs, related products (Story 3.6)
```

**Commit message pattern:**
- Start with action verb: "Add", "Update", "Fix"
- Include story reference in parentheses
- Mention key features implemented

**Expected commit for this story:**
```
Add Homepage hero with search-first layout and dual section (Story 3.10)

- Implement search-first hero with SearchBar hero variant
- Add quick search hint tags with popular search terms
- Create dual section: Services (steel blue) + Products (white)
- Integrate BrandLogoBar component
- Refine CTA section with call and Zalo buttons
- Clean up redundant sections per UX specification
```

### Điểm cần tránh

- **KHÔNG** add complex animations - keep it minimal per Swedish design principles
- **KHÔNG** keep trust indicators in hero if they clutter the search-first design
- **KHÔNG** use hardcoded phone numbers - use SiteSettings global or i18n
- **KHÔNG** forget to add i18n translations for all new text
- **KHÔNG** break mobile responsiveness - test at all breakpoints
- **KHÔNG** use inline icons - import from shared icons module
- **KHÔNG** implement without BrandLogoBar ready - complete Story 3.9 first or create placeholder

### Accessibility Requirements

- SearchBar already has full ARIA support (combobox, listbox)
- Quick search hints: use Link component (keyboard accessible)
- Dual section: semantic HTML with proper headings (H2)
- CTA buttons: large touch targets (min 44x44px)
- Color contrast: white on --color-primary passes WCAG AA
- Focus states visible on all interactive elements

### Testing Checklist

- [ ] SearchBar hero variant renders correctly
- [ ] Quick search hints navigate to correct search URLs
- [ ] Dual section displays 50/50 on desktop
- [ ] Dual section stacks on mobile
- [ ] BrandLogoBar displays all brands with logos
- [ ] CTA phone link triggers call on mobile
- [ ] CTA Zalo link opens in new tab
- [ ] All text is localized (switch to EN, verify translations)
- [ ] Keyboard navigation works through all sections
- [ ] Lighthouse accessibility score > 90

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.10 - Homepage hero + search + dual section]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Design Direction - Layout Structure]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#User Journey Flows - Journey 1: Search by SKU]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.2 - Component Data Flow]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 7 - Project Structure]
- [Source: _bmad-output/planning-artifacts/prd.md#HP-03 - Hero section with search]
- [Source: _bmad-output/planning-artifacts/prd.md#HP-04 - Dual section services/products]
- [Source: _bmad-output/planning-artifacts/prd.md#HP-05 - BrandLogoBar]
- [Source: _bmad-output/planning-artifacts/prd.md#HP-06 - CTA section]
- [Source: src/components/ui/SearchBar.tsx - Existing SearchBar with hero variant]
- [Source: src/app/(frontend)/[locale]/page.tsx - Current homepage implementation]
- [Source: _bmad-output/implementation-artifacts/3-9-brandlogobar-component.md - BrandLogoBar story (dependency)]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build successful: Next.js 16.1.6 compiled in 11.4s, 33 pages generated

### Completion Notes List

1. **Hero Section (Task 1):** Rebuilt hero with search-first approach - SearchBar hero variant centered, subtitle above, quick search hint tags below. Tags localized (VI/EN) and link to `/search?q={query}`.

2. **Dual Section (Task 2):** Implemented 50/50 grid layout - Services panel (steel blue bg, white text) with service highlights and CTA, Products panel (white bg) with 4 category cards grid and CTA. Responsive: stacks vertically on mobile via `md:grid-cols-2`.

3. **BrandLogoBar (Task 3):** Already integrated from Story 3.9. Fetches brands with locale support and displays below dual section.

4. **CTA Section (Task 4):** Refined with amber accent phone button and Zalo link button. Uses localized text from i18n.

5. **Cleanup (Task 5):** Removed: SKF introduction section, Categories section, Featured Products section, Services section, trust indicators, inline icon components. Homepage now follows UX spec layout exactly.

6. **i18n Updates:** Added new keys to messages/vi.json and messages/en.json for quickSearch, dualSection, and updated CTA subtitle.

7. **Icons Added:** CheckCircleIcon, ArrowRightIcon, WrenchIcon, ChartIcon, CogIcon added to shared icons file.

8. **Accessibility:** All interactive elements have focus-visible states, proper semantic HTML with H2 headings, keyboard-accessible links.

### File List

- src/app/(frontend)/[locale]/page.tsx (modified - complete rebuild + review fixes)
- src/components/layout/icons.tsx (modified - added icons, removed unused during review)
- src/components/ui/SearchBar.tsx (modified - removed duplicate GearIcon)
- src/components/ui/BrandLogoBar.tsx (modified - standardized spacing)
- messages/vi.json (modified - added home.quickSearch, home.dualSection keys)
- messages/en.json (modified - added home.quickSearch, home.dualSection keys)

## Senior Developer Review

### Review Date: 2026-02-05

**Issues Found:** 2 High, 4 Medium, 3 Low → **All Fixed**

#### Fixed Issues:
1. **[HIGH]** Hardcoded contact info → Now fetches from SiteSettings global
2. **[HIGH]** Inconsistent phone numbers → SearchBar now receives consultPhone prop from SiteSettings
3. **[MEDIUM]** English-only search queries → Localized queries by locale (vi/en)
4. **[MEDIUM]** Duplicate GearIcon in SearchBar → Removed, imports from shared icons
5. **[MEDIUM]** Dead code (WrenchIcon, ChartIcon, CogIcon) → Removed unused icons
6. **[MEDIUM]** Missing aria-hidden on decorative icons → Added to all decorative icons
7. **[LOW]** CogIcon duplicate of GearIcon → Removed CogIcon
8. **[LOW]** Inconsistent spacing in BrandLogoBar → Standardized to Tailwind pattern
9. **[LOW]** Fixed 4 categories → Changed to allow up to 6 categories

**Verdict:** ✅ APPROVED - All issues resolved

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-05 | Code review: Fix 9 issues (SiteSettings, i18n queries, dead code, accessibility, spacing) | Senior Dev Review |
| 2026-02-05 | Implement search-first hero, dual section, integrate BrandLogoBar, refine CTA, cleanup per UX spec (Story 3.10) | Dev Agent |
