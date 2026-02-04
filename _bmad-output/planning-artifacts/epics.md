---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - "prd.md"
  - "architecture.md"
  - "ux-design-specification.md"
workflowType: 'epics'
status: 'complete'
---

# VIES Web - Epic Breakdown

## Overview

Epic và story breakdown cho VIES Web redesign, tổ chức theo user value. Mỗi epic hoàn chỉnh độc lập và enable các epic sau.

## Requirements Inventory

### Functional Requirements (48)

- HP-01→HP-07: Homepage (7)
- SR-01→SR-07: Search & Autocomplete (7)
- PR-01→PR-07: Products (7)
- SV-01→SV-04: Services (4)
- NW-01→NW-03: News (3)
- BR-01→BR-02: Brands (2)
- CT-01→CT-02: Categories (2)
- FM-01→FM-06: Forms (6)
- PG-01→PG-07: Static Pages (7)
- I18N-01→I18N-04: i18n (4)
- SEO-01→SEO-04: SEO (4)
- NV-01→NV-06: Navigation & Layout (6)

### Non-Functional Requirements (15)

- PF-01→PF-05: Performance
- A11Y-01→A11Y-05: Accessibility
- RS-01→RS-04: Responsive
- SC-01→SC-04: Security

### Additional Requirements (Architecture)

- AR-01: Loại bỏ KM locale (payload.config.ts, i18n/config.ts, next.config.mjs, messages/km.json)
- AR-02: Đổi access `read: anyone` → `read: publishedOnly` (Products, News, Services, Pages)
- AR-03: Update design tokens (Nordic Industrial palette)
- AR-04: Dynamic `[...slug]` routing cho Pages collection
- AR-05: Seed data update (globals + Pages entries)

### FR Coverage Map

| FR | Epic |
|----|------|
| HP-01, HP-02, HP-07 | Epic 2 |
| HP-03, HP-05 | Epic 3 |
| HP-04 | Epic 5, 6 |
| HP-06 | Epic 4 |
| SR-01→SR-07 | Epic 3 |
| PR-01→PR-07 | Epic 3 |
| BR-01→BR-02 | Epic 3 |
| CT-01→CT-02 | Epic 3 |
| SV-01→SV-04 | Epic 5 |
| NW-01→NW-03 | Epic 6 |
| FM-01→FM-06 | Epic 4 |
| PG-01→PG-07 | Epic 6 |
| I18N-01→I18N-02 | Epic 1, 2 |
| I18N-03→I18N-04 | Epic 7 |
| SEO-01→SEO-04 | Epic 7 |
| NV-01→NV-06 | Epic 2, 7 |
| AR-01→AR-02 | Epic 1 |
| AR-03 | Epic 1 |
| AR-04 | Epic 6 |
| AR-05 | Epic 7 |

## Epic List

| Epic | Tên | Dependencies |
|------|-----|-------------|
| 1 | Cleanup & Config Foundation | None |
| 2 | Site Layout & Navigation | Epic 1 |
| 3 | Product Catalog & Search | Epic 2 |
| 4 | Quote Request & Contact | Epic 2 |
| 5 | Services Showcase | Epic 2 |
| 6 | News & Content Pages | Epic 2 |
| 7 | SEO, i18n & Polish | Epic 3, 4, 5, 6 |

---

## Epic 1: Cleanup & Config Foundation

**Goal:** Dọn dẹp config cũ (KM locale), cập nhật access control, thiết lập design tokens mới. Nền tảng kỹ thuật cho toàn bộ redesign.

### Story 1.1: Loại bỏ KM locale

As a developer,
I want to remove Khmer locale from all configs,
So that the application only supports VI/EN as required.

**Acceptance Criteria:**

**Given** payload.config.ts có 3 locales (vi, en, km)
**When** tôi cập nhật localization config
**Then** chỉ còn 2 locales: `{ label: 'Tiếng Việt', code: 'vi' }` và `{ label: 'English', code: 'en' }`
**And** i18n/config.ts chỉ export `['vi', 'en']`
**And** next.config.mjs chỉ hỗ trợ vi/en
**And** file `messages/km.json` bị xóa
**And** app build thành công không lỗi

### Story 1.2: Đổi access control sang publishedOnly

As a admin,
I want draft content protected from public API access,
So that unpublished content is not visible to website visitors.

**Acceptance Criteria:**

**Given** Products, News, Services, Pages collections dùng `read: anyone`
**When** tôi đổi sang `read: publishedOnly`
**Then** anonymous API requests chỉ trả về documents có `_status: 'published'`
**And** authenticated admin requests vẫn thấy tất cả documents (kể cả drafts)
**And** app build thành công không lỗi

### Story 1.3: Cập nhật design tokens

As a developer,
I want the design system tokens updated to Nordic Industrial palette,
So that all subsequent components use the correct colors, typography, and spacing.

**Acceptance Criteria:**

**Given** styles.css hiện tại có Industrial Blue palette
**When** tôi cập nhật `@theme` block
**Then** `--color-primary` = `#0F4C75`, `--color-accent` = `#D4A843`
**And** `--color-bg` = `#FAFAFA`, `--color-text` = `#1A1A2E`
**And** `--font-sans` = `'Inter', sans-serif`
**And** spacing scale dùng 8px base (xs=4, sm=8, md=16, lg=24, xl=32, 2xl=48, 3xl=64, 4xl=96)
**And** Inter font được import (Google Fonts hoặc local)

### Story 1.4: Cập nhật i18n message files

As a developer,
I want VI and EN message files updated with all UI strings needed for the redesign,
So that all components can use localized text.

**Acceptance Criteria:**

**Given** messages/vi.json và messages/en.json hiện tại
**When** tôi cập nhật message files
**Then** có đầy đủ keys cho: navigation labels, search placeholder, button text, form labels, error messages, empty states, footer text, breadcrumb labels
**And** cấu trúc keys organized by feature (common, nav, search, products, services, news, forms, footer)
**And** app build thành công

---

## Epic 2: Site Layout & Navigation

**Goal:** User thấy website chuyên nghiệp với topbar, header sticky, footer, breadcrumb, và language switcher hoạt động trên mọi trang. Mobile hamburger menu hoạt động.

### Story 2.1: ContactBar component (Topbar)

As a khách hàng,
I want to see phone numbers and email in the topbar,
So that I can quickly contact VIES for quotes or consultation.

**Acceptance Criteria:**

**Given** trang bất kỳ trên website
**When** trang load
**Then** topbar hiện ở đầu trang với background steel blue (`--color-primary`)
**And** hiện SĐT báo giá, SĐT tư vấn (clickable tel: links), email
**And** language switcher VI/EN hoạt động (chuyển locale khi click)
**And** data lấy từ SiteSettings global + Header global (topBar)
**And** responsive: ẩn email trên mobile, chỉ hiện SĐT chính + language switcher

**FRs:** NV-01, HP-01, I18N-02

### Story 2.2: NavigationHeader component

As a khách hàng,
I want a sticky header with logo, navigation menu, and contact CTA,
So that I can navigate the website and find the contact button easily.

**Acceptance Criteria:**

**Given** trang bất kỳ trên website
**When** user scroll xuống
**Then** header sticky ở top (dưới ContactBar), background white
**And** hiện logo VIES (link về homepage)
**And** navigation items: Dịch vụ, Sản phẩm (có dropdown: Theo hãng, Theo loại), Tin tức, Về chúng tôi
**And** nút "Liên hệ" amber CTA
**And** data lấy từ Header global (navigation) + SiteSettings global (logo)
**And** Client Component (mobile menu state, sticky behavior)

**FRs:** NV-02, HP-02

### Story 2.3: NavigationHeader mobile menu

As a khách hàng trên mobile,
I want a hamburger menu that slides in,
So that I can navigate the website on my phone.

**Acceptance Criteria:**

**Given** viewport < 768px (md breakpoint)
**When** user click hamburger icon
**Then** menu slide in từ phải, overlay background
**And** hiện tất cả navigation items + submenu expandable
**And** hiện SĐT + nút Liên hệ
**And** click outside hoặc X button đóng menu
**And** focus trap trong menu khi mở (accessibility)

**FRs:** NV-03

### Story 2.4: Footer component

As a khách hàng,
I want a comprehensive footer with company info and useful links,
So that I can find additional information and navigate to important pages.

**Acceptance Criteria:**

**Given** trang bất kỳ
**When** user scroll đến cuối trang
**Then** footer hiện với max 4 columns (từ Footer global)
**And** hiện thông tin công ty (từ SiteSettings: address, phone, email)
**And** hiện social links (Zalo, Facebook)
**And** hiện copyright text
**And** responsive: columns stack trên mobile (1 col), 2 col tablet, 4 col desktop

**FRs:** NV-06, HP-07

### Story 2.5: Breadcrumb component

As a khách hàng,
I want breadcrumb navigation on all pages except homepage,
So that I can understand where I am and navigate back easily.

**Acceptance Criteria:**

**Given** trang bất kỳ trừ homepage
**When** trang load
**Then** breadcrumb hiện dưới header: Home > [Section] > [Page]
**And** mỗi level là link clickable (trừ level hiện tại)
**And** Home link luôn ở đầu
**And** text localized theo locale hiện tại
**And** ẩn trên homepage

**FRs:** NV-05

### Story 2.6: Root layout integration

As a developer,
I want layout.tsx to fetch global data and render ContactBar + NavigationHeader + Footer,
So that all pages share the same layout structure.

**Acceptance Criteria:**

**Given** `[locale]/layout.tsx`
**When** bất kỳ trang nào render
**Then** layout fetch: `getGlobal('site-settings')`, `getGlobal('header')`, `getGlobal('footer')` với locale
**And** render: ContactBar → NavigationHeader → {children} → Footer
**And** layout là Server Component, pass data xuống child components via props
**And** NavigationHeader nhận serialized data (Client Component boundary)

---

## Epic 3: Product Catalog & Search

**Goal:** Kỹ sư/Procurement tìm được sản phẩm bằng SKU search (autocomplete) hoặc browse theo danh mục/hãng. Xem chi tiết sản phẩm với specs kỹ thuật.

### Story 3.1: SearchBar component (autocomplete)

As a kỹ sư bảo trì,
I want to search products by SKU or name with autocomplete,
So that I can quickly find the exact bearing I need.

**Acceptance Criteria:**

**Given** SearchBar component (Client Component)
**When** user gõ >= 2 ký tự
**Then** debounce 300ms, fetch `/api/search?q={query}&locale={locale}`
**And** dropdown hiện max 6 kết quả: ảnh thumbnail + tên + mã SKU + hãng
**And** keyboard navigation: Arrow Up/Down, Enter select, Escape close
**And** click kết quả → navigate đến `/product/{slug}`
**And** "Xem tất cả kết quả" link → navigate đến `/search?q={query}`
**And** no-results: hiện gợi ý liên hệ kỹ sư (SĐT)

**FRs:** SR-01, SR-02, SR-03, SR-04, SR-05

### Story 3.2: Search API route

As a developer,
I want a search API endpoint that queries products,
So that the SearchBar can fetch autocomplete results.

**Acceptance Criteria:**

**Given** GET `/api/search?q={query}&locale={locale}`
**When** query length >= 2
**Then** query Products collection: `name contains` OR `sku contains`
**And** publishedOnly access tự filter drafts
**And** limit 6, select: name, sku, slug, brand, images
**And** return JSON `{ results: [...] }`
**And** query length < 2 → return empty array
**And** response < 500ms cho < 100 products

**FRs:** SR-02, SR-03

### Story 3.3: Search results page

As a khách hàng,
I want to see full search results on a dedicated page,
So that I can browse all matching products when autocomplete isn't enough.

**Acceptance Criteria:**

**Given** `/search?q={query}`
**When** trang load
**Then** hiện grid sản phẩm matching query (name hoặc sku contains)
**And** hiện số lượng kết quả: "Tìm thấy X sản phẩm cho '{query}'"
**And** pagination: Load More button (12 items per page)
**And** empty state: "Không tìm thấy sản phẩm" + gợi ý liên hệ kỹ sư

**FRs:** SR-06, SR-05

### Story 3.4: ProductCard component

As a khách hàng,
I want to see product cards with image, name, SKU, and brand,
So that I can quickly identify the product I'm looking for.

**Acceptance Criteria:**

**Given** ProductCard nhận product data via props
**When** render
**Then** hiện: ảnh (thumbnail size), tên sản phẩm, mã SKU, tên hãng
**And** KHÔNG hiện giá
**And** click → navigate đến `/product/{slug}`
**And** image fallback khi không có ảnh
**And** Server Component (nhận data từ parent)

**FRs:** PR-03

### Story 3.5: Product listing page + CategoryFilter

As a khách hàng,
I want to browse products with filters by brand and category,
So that I can narrow down products to find what I need.

**Acceptance Criteria:**

**Given** `/products` page
**When** trang load
**Then** hiện grid ProductCards (12 per page)
**And** sidebar (desktop) / bottom sheet (mobile) filter: chọn brands, chọn categories
**And** filter áp dụng → update URL query params (`?brand=skf&category=bearings`)
**And** multiple filters combinable (AND logic)
**And** clear all filters button
**And** pagination: Load More button
**And** empty state khi không có kết quả

**FRs:** PR-01, PR-02, CT-01

### Story 3.6: Product detail page

As a kỹ sư bảo trì,
I want to see full product details including specs,
So that I can verify it's the correct product before requesting a quote.

**Acceptance Criteria:**

**Given** `/product/{slug}` page
**When** trang load với valid slug
**Then** hiện: ảnh gallery (multiple images), tên, mã SKU, hãng (link), danh mục (links)
**And** bảng thông số kỹ thuật (specifications array: key-value)
**And** mô tả sản phẩm (richText rendered)
**And** nút "Yêu cầu báo giá" nổi bật (amber CTA)
**And** sản phẩm liên quan (cùng danh mục, max 4)
**And** breadcrumb: Home > Sản phẩm > [Tên SP]
**And** 404 page khi slug không tồn tại

**FRs:** PR-04, PR-05, PR-06

### Story 3.7: Brand page

As a khách hàng,
I want to see all products from a specific brand,
So that I can browse the full catalog of brands like SKF or FAG.

**Acceptance Criteria:**

**Given** `/brands/{slug}` page
**When** trang load với valid brand slug
**Then** hiện brand info: logo, tên, mô tả, website link
**And** grid tất cả products của brand đó
**And** pagination: Load More
**And** breadcrumb: Home > Thương hiệu > [Brand Name]
**And** 404 khi brand không tồn tại

**FRs:** BR-01

### Story 3.8: Category page

As a khách hàng,
I want to see all products in a specific category,
So that I can browse products by type (bearings, lubricants, etc.).

**Acceptance Criteria:**

**Given** `/categories/{slug}` page
**When** trang load với valid category slug
**Then** hiện category info: tên, mô tả, ảnh
**And** hiện subcategories nếu có (parent-child 1 cấp)
**And** grid tất cả products thuộc category đó
**And** pagination: Load More
**And** breadcrumb: Home > Danh mục > [Category Name]
**And** 404 khi category không tồn tại

**FRs:** CT-01, CT-02

### Story 3.9: BrandLogoBar component

As a khách hàng,
I want to see partner brand logos on the homepage,
So that I can trust VIES sells authentic products from recognized brands.

**Acceptance Criteria:**

**Given** BrandLogoBar nhận brands data via props
**When** render
**Then** hiện row logos: SKF, FAG, NSK, TIMKEN, NTN, KOYO (và brands khác)
**And** mỗi logo clickable → link đến `/brands/{slug}`
**And** responsive: horizontal scroll trên mobile, grid trên desktop
**And** Server Component

**FRs:** HP-05, BR-02

### Story 3.10: Homepage hero + search + dual section

As a khách hàng,
I want the homepage to have a prominent search bar and showcase both services and products,
So that I can quickly search or discover what VIES offers.

**Acceptance Criteria:**

**Given** homepage `/`
**When** trang load
**Then** hero section: search bar lớn trung tâm + subtitle + quick search hints (VD: "6205", "SKF", "vòng bi")
**And** dual section dưới hero: Dịch vụ kỹ thuật (nền steel blue, link đến services) + Sản phẩm (grid danh mục hoặc featured products)
**And** BrandLogoBar section
**And** CTA section: "Cần tư vấn hoặc báo giá?" + nút gọi + nút Zalo
**And** SearchBar variant: hero size (lớn hơn header variant)

**FRs:** HP-03, HP-04, HP-05, HP-06

---

## Epic 4: Quote Request & Contact

**Goal:** Khách hàng gửi được yêu cầu báo giá từ product page và liên hệ tư vấn qua contact page. Form submissions lưu trong CMS.

### Story 4.1: QuoteRequestForm component

As a kỹ sư bảo trì,
I want to request a quote for a product,
So that I can get pricing from VIES.

**Acceptance Criteria:**

**Given** product detail page
**When** user click "Yêu cầu báo giá"
**Then** form hiện ra (modal hoặc inline) với fields: tên (required), SĐT (required), email, số lượng, ghi chú
**And** sản phẩm (tên + SKU) pre-filled từ context
**And** client validation: required fields, phone format, email format
**And** submit → POST to form-builder plugin endpoint
**And** success: toast "Đã gửi yêu cầu thành công"
**And** error: toast with retry option
**And** không yêu cầu đăng ký tài khoản, không CAPTCHA

**FRs:** FM-01, FM-02, FM-04, FM-05, FM-06

### Story 4.2: Contact page

As a khách hàng,
I want a contact page with form, company info, and map,
So that I can reach VIES through multiple channels.

**Acceptance Criteria:**

**Given** `/contact` page
**When** trang load
**Then** hiện contact form (tên, SĐT, email, message)
**And** hiện thông tin công ty: địa chỉ, SĐT, email (từ SiteSettings)
**And** hiện Google Maps embed (hoặc static map image)
**And** form submit → lưu trong CMS (form-builder plugin)
**And** success/error toast
**And** breadcrumb: Home > Liên hệ

**FRs:** FM-03, FM-04, FM-05

### Story 4.3: CTASection component

As a khách hàng,
I want clear call-to-action sections throughout the site,
So that I always know how to contact VIES.

**Acceptance Criteria:**

**Given** CTASection component nhận contact data via props
**When** render
**Then** hiện heading: "Cần tư vấn hoặc báo giá?"
**And** nút gọi điện (tel: link, primary style)
**And** nút Zalo (link, secondary style)
**And** background accent hoặc gradient
**And** Server Component, dùng trên homepage và service pages

**FRs:** HP-06, SV-03

### Story 4.4: Toast notification component

As a khách hàng,
I want to see confirmation after submitting a form,
So that I know my request was received.

**Acceptance Criteria:**

**Given** form submission (quote request hoặc contact)
**When** submit thành công hoặc thất bại
**Then** toast notification hiện ở góc trên phải
**And** success: green icon + message "Đã gửi yêu cầu thành công"
**And** error: red icon + message + retry button
**And** auto-dismiss sau 5 giây
**And** dismissable bằng click X
**And** Client Component

**FRs:** FM-04

---

## Epic 5: Services Showcase

**Goal:** Khách hàng khám phá dịch vụ kỹ thuật VIES (tư vấn, đo rung động, lắp đặt, bôi trơn) và liên hệ tư vấn.

### Story 5.1: Services listing page

As a kỹ sư bảo trì,
I want to see all technical services VIES offers,
So that I can find the right service for my needs.

**Acceptance Criteria:**

**Given** `/services` page
**When** trang load
**Then** hiện danh sách ServiceCards sorted by order
**And** mỗi card: ảnh + tiêu đề + excerpt + "Xem chi tiết" link
**And** breadcrumb: Home > Dịch vụ
**And** data fetch từ Services collection (publishedOnly)

**FRs:** SV-01

### Story 5.2: ServiceCard component

As a khách hàng,
I want to see service cards with image and description,
So that I can quickly understand what each service offers.

**Acceptance Criteria:**

**Given** ServiceCard nhận service data via props
**When** render
**Then** hiện: featuredImage (medium size), title, excerpt
**And** click → navigate đến `/services/{slug}`
**And** Server Component

**FRs:** SV-01

### Story 5.3: Service detail page

As a kỹ sư bảo trì,
I want to see full details of a service including benefits,
So that I can understand the value and decide to contact VIES.

**Acceptance Criteria:**

**Given** `/services/{slug}` page
**When** trang load với valid slug
**Then** hiện: featuredImage, title, content (richText rendered)
**And** benefits list (checkmark bullets)
**And** CTASection: "Liên hệ tư vấn" + SĐT + Zalo
**And** breadcrumb: Home > Dịch vụ > [Service Name]
**And** 404 khi slug không tồn tại

**FRs:** SV-02, SV-03

---

## Epic 6: News & Content Pages

**Goal:** Khách hàng đọc tin tức công ty và xem các trang thông tin (about, shipping, warranty...) được quản lý từ CMS.

### Story 6.1: News listing page

As a khách hàng,
I want to browse company news articles,
So that I can stay updated with VIES activities.

**Acceptance Criteria:**

**Given** `/news` page
**When** trang load
**Then** hiện danh sách bài viết sorted by publishedAt (mới nhất trước)
**And** mỗi item: featuredImage + title + excerpt + date
**And** pagination: Load More (6 items per page)
**And** breadcrumb: Home > Tin tức

**FRs:** NW-01, NW-03

### Story 6.2: News detail page

As a khách hàng,
I want to read full news articles,
So that I can learn about VIES events and updates.

**Acceptance Criteria:**

**Given** `/news/{slug}` page
**When** trang load với valid slug
**Then** hiện: title, publishedAt date, featuredImage, content (richText rendered)
**And** related news (3 bài mới nhất, trừ bài hiện tại)
**And** breadcrumb: Home > Tin tức > [Title]
**And** 404 khi slug không tồn tại

**FRs:** NW-02

### Story 6.3: Block components for Pages

As a admin,
I want block components that render CMS content blocks,
So that Pages collection content displays correctly on the frontend.

**Acceptance Criteria:**

**Given** Pages collection có layout blocks
**When** block components render
**Then** HeroBlock: heading + subheading + background image
**And** ContentBlock: richText content rendered
**And** CTABlock: heading + description + buttons (max 3, primary/secondary/outline styles)
**And** FAQBlock: heading + accordion items (question/answer)
**And** GalleryBlock: heading + image grid with captions
**And** mỗi block nhận block data via props, Server Components

**FRs:** PG-01→PG-07 (blocks enable content pages)

### Story 6.4: Dynamic pages catch-all route

As a admin,
I want CMS pages to automatically render on the frontend,
So that I can create/edit pages without code changes.

**Acceptance Criteria:**

**Given** `[...slug]/page.tsx` catch-all route
**When** user visits `/{locale}/about` (hoặc shipping, payment, warranty, faq, privacy, terms)
**Then** query Pages collection by slug
**And** render title + content (richText) + layout blocks
**And** breadcrumb: Home > [Page Title]
**And** 404 khi page không tồn tại hoặc chưa published
**And** SEO meta từ plugin-seo

**FRs:** PG-01→PG-07, AR-04

---

## Epic 7: SEO, i18n & Polish

**Goal:** Website SEO-ready, đa ngôn ngữ hoàn chỉnh, mobile optimized, seed data đầy đủ.

### Story 7.1: SEO meta tags

As a marketing,
I want proper SEO meta tags on all pages,
So that the website ranks well in search engines.

**Acceptance Criteria:**

**Given** Products, News, Services, Pages có plugin-seo data
**When** page render
**Then** `<title>` tag: "{Page Title} | VIES"
**And** `<meta name="description">` từ SEO field hoặc excerpt
**And** Open Graph tags: og:title, og:description, og:image
**And** canonical URL
**And** static pages (homepage, products listing, etc.) có hardcoded meta

**FRs:** SEO-01, SEO-02, SEO-04

### Story 7.2: Sitemap.xml

As a marketing,
I want an auto-generated sitemap,
So that search engines can discover all pages.

**Acceptance Criteria:**

**Given** website deployed
**When** crawler requests `/sitemap.xml`
**Then** XML sitemap với all published pages: homepage, products, services, news, brands, categories, static pages
**And** auto-update khi content thay đổi
**And** include lastmod, changefreq, priority

**FRs:** SEO-03

### Story 7.3: Complete i18n message files

As a khách hàng người nước ngoài,
I want the entire UI translated to English,
So that I can use the website in my preferred language.

**Acceptance Criteria:**

**Given** website set to EN locale
**When** user browse website
**Then** tất cả UI strings hiện bằng English (navigation, buttons, form labels, placeholders, error messages, empty states)
**And** CMS content hiện bằng EN nếu có, fallback về VI nếu chưa dịch
**And** không có untranslated text (ngoại trừ CMS content chưa nhập)

**FRs:** I18N-03, I18N-04

### Story 7.4: Mobile sticky bottom bar

As a khách hàng trên mobile,
I want quick access buttons at the bottom of product pages,
So that I can call or Zalo VIES easily while browsing products.

**Acceptance Criteria:**

**Given** product detail page trên mobile viewport (< 768px)
**When** trang load
**Then** sticky bottom bar hiện: nút Gọi (tel: link) + nút Zalo
**And** bar ẩn khi scroll lên, hiện khi scroll xuống
**And** không che content quan trọng
**And** chỉ hiện trên product pages

**FRs:** NV-04

### Story 7.5: Mobile search overlay

As a khách hàng trên mobile,
I want a full-screen search experience,
So that I can easily search on my phone.

**Acceptance Criteria:**

**Given** mobile viewport (< 768px)
**When** user tap search icon trên header
**Then** full-screen search overlay mở ra
**And** auto-focus vào input
**And** autocomplete dropdown full-width
**And** close button hoặc swipe down để đóng
**And** smooth animation (slide up)

**FRs:** SR-07

### Story 7.6: Seed data update

As a developer,
I want seed data updated with globals and Pages entries,
So that the website has content to display after deployment.

**Acceptance Criteria:**

**Given** scripts/seed.ts
**When** seed script chạy
**Then** SiteSettings global: VIES contact info, social links
**And** Header global: navigation items theo UX spec
**And** Footer global: 4 columns với links
**And** Pages: about, shipping, payment, warranty, faq, privacy, terms (với sample content blocks)
**And** seed data dùng `_status: 'published'` cho draft-enabled collections

**FRs:** AR-05

### Story 7.7: Performance & accessibility audit

As a developer,
I want to verify the website meets performance and accessibility targets,
So that the website provides a good experience for all users.

**Acceptance Criteria:**

**Given** website fully implemented
**When** chạy Lighthouse audit
**Then** Performance score > 80
**And** Accessibility score > 90
**And** LCP < 2.5s
**And** color contrast >= 4.5:1 (WCAG AA)
**And** touch targets >= 44x44px
**And** keyboard navigation works trên tất cả interactive elements
**And** fix any critical issues found

**FRs:** PF-01→PF-05, A11Y-01→A11Y-05

---

## Validation

### FR Coverage - 100%

| FR Group | Stories | ✅ |
|----------|---------|---|
| HP-01→HP-07 | 2.1, 2.2, 2.4, 3.9, 3.10, 4.3 | ✅ |
| SR-01→SR-07 | 3.1, 3.2, 3.3, 7.5 | ✅ |
| PR-01→PR-07 | 3.4, 3.5, 3.6 | ✅ |
| SV-01→SV-04 | 5.1, 5.2, 5.3 | ✅ |
| NW-01→NW-03 | 6.1, 6.2 | ✅ |
| BR-01→BR-02 | 3.7, 3.9 | ✅ |
| CT-01→CT-02 | 3.5, 3.8 | ✅ |
| FM-01→FM-06 | 4.1, 4.2, 4.4 | ✅ |
| PG-01→PG-07 | 6.3, 6.4 | ✅ |
| I18N-01→I18N-04 | 1.1, 1.4, 2.1, 7.3 | ✅ |
| SEO-01→SEO-04 | 7.1, 7.2 | ✅ |
| NV-01→NV-06 | 2.1, 2.2, 2.3, 2.4, 2.5, 7.4 | ✅ |
| AR-01→AR-05 | 1.1, 1.2, 1.3, 6.4, 7.6 | ✅ |

### No Forward Dependencies ✅

- Epic 1: No dependencies
- Epic 2: Depends on Epic 1 only
- Epics 3, 4, 5, 6: Depend on Epic 2 only (can be parallel)
- Epic 7: Depends on 3-6 (polish phase)

### Story Independence ✅

- Mỗi story có thể implement bởi 1 developer trong 1 session
- Không story nào trong cùng epic phụ thuộc story phía sau
- Acceptance criteria đều testable independently
