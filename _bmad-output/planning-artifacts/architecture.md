---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - "prd.md"
  - "ux-design-specification.md"
  - "existing-codebase"
workflowType: 'architecture'
status: 'complete'
---

# Architecture Decision Document - VIES Web

**Author:** Tan
**Date:** 2026-02-04

---

## 1. Project Context Analysis

### 1.1 Tổng quan kỹ thuật

VIES Web là website redesign, **KHÔNG phải greenfield**. Codebase hiện tại đã có:
- Next.js 16.1 + React 19.2 + TypeScript
- PayloadCMS 3.74 với PostgreSQL
- 8 Collections, 3 Globals, 2 Plugins (SEO, Form Builder)
- Tailwind CSS 4.1, next-intl (i18n)
- Seed data với 8 brands, 6 categories, 6 products, 3 services

**Scope:** Redesign frontend theo UX spec mới. Backend (PayloadCMS collections/globals) cần điều chỉnh nhỏ, không phải rebuild.

### 1.2 Thay đổi cần thực hiện

| Layer | Mức độ thay đổi | Chi tiết |
|-------|-----------------|----------|
| PayloadCMS Collections | Điều chỉnh nhỏ | Loại bỏ KM locale, cập nhật fields nếu cần |
| PayloadCMS Globals | Điều chỉnh | Cập nhật Header/Footer theo UX spec |
| Frontend Pages | Rebuild hoàn toàn | Redesign theo Direction A + topbar B |
| Components | Rebuild hoàn toàn | 10 custom components theo UX spec |
| Styling | Rebuild hoàn toàn | Design tokens mới, "Nordic Industrial" palette |
| i18n | Điều chỉnh | Loại bỏ KM, chỉ giữ VI/EN |
| Seed Data | Cập nhật | Thêm services, cập nhật globals |

---

## 2. Core Architectural Decisions

### 2.1 Giữ nguyên (Không thay đổi)

| Decision | Lý do |
|----------|-------|
| PayloadCMS 3.74 + PostgreSQL | Đã setup, hoạt động tốt |
| Lexical rich text editor | PayloadCMS default, đủ dùng |
| `@payloadcms/plugin-seo` | Đã cấu hình cho products, news, services, pages |
| `@payloadcms/plugin-form-builder` | Dùng cho quote request + contact forms |
| `defaultDepth: 1` | Performance optimization, đủ cho frontend queries |
| Draft system (`_status`) | Products, News, Services, Pages đều dùng |
| Live Preview | Đã cấu hình cho products, news, pages, services (mobile/tablet/desktop breakpoints) |
| Sharp image processing | 3 sizes: thumbnail 400x300, medium 900w, large 1400w |

### 2.2 Thay đổi cần thiết

| Decision | Hiện tại | Thay đổi | Lý do |
|----------|----------|----------|-------|
| Locales | vi, en, km | vi, en | User requirement - loại bỏ KM |
| Search | Không có autocomplete | Payload API `find` với `where` clause | UX spec: autocomplete search |
| Frontend components | Header, Footer, Button | 10 components theo UX spec | Redesign hoàn toàn |
| CSS design tokens | Industrial Blue #0f4c81 | Nordic Industrial #0F4C75 + Amber #D4A843 | UX spec palette |
| Homepage layout | Product-first grid | Search-first + dual section | UX spec Direction A |

### 2.3 Search Strategy

**Decision: Payload Local API `find` với `where` clause**

```typescript
// Search autocomplete query (publishedOnly access handles draft filtering)
const results = await payload.find({
  collection: 'products',
  where: {
    or: [
      { name: { contains: searchTerm } },
      { sku: { contains: searchTerm } },
    ],
  },
  limit: 6,
  locale,
  select: {
    name: true,
    sku: true,
    slug: true,
    brand: true,
    images: true,
  },
})
```

**Lý do:** < 100 SKU, Payload API đủ nhanh, không cần custom endpoint hay full-text search phức tạp. Khi scale lên > 500 SKU thì xem xét PostgreSQL full-text search.

---

## 3. PayloadCMS Collections - Chi tiết

### 3.1 Products Collection

**File:** `src/collections/Products.ts`

**Thay đổi cần thiết:** Đổi `read: anyone` → `read: publishedOnly` để bảo vệ draft content qua API. Loại bỏ KM localization khi cập nhật payload.config.ts.

```typescript
{
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'sku', 'brand', '_status', 'featured'],
  },
  versions: { drafts: true, maxPerDoc: 10 },
  fields: [
    { name: 'name', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', unique: true, index: true,
      hooks: { beforeValidate: [formatSlug('name')] }, // field-level hook
    },
    { name: 'sku', type: 'text', index: true },
    { name: 'description', type: 'richText', localized: true },
    { name: 'brand', type: 'relationship', relationTo: 'brands', index: true },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'images', type: 'array', fields: [
      { name: 'image', type: 'upload', relationTo: 'media', required: true },
    ]},
    { name: 'specifications', type: 'array', fields: [
      { name: 'key', type: 'text', localized: true, required: true },
      { name: 'value', type: 'text', localized: true, required: true },
    ]},
    { name: 'featured', type: 'checkbox', defaultValue: false, index: true },
  ],
  access: { read: publishedOnly, create: isAdmin, update: isAdmin, delete: isAdmin },
}
```

**Frontend query pattern:**

> **Note:** Với `read: publishedOnly`, anonymous requests tự động chỉ thấy published docs. Không cần filter `_status` thủ công trong frontend queries.

```typescript
// Product listing
payload.find({
  collection: 'products',
  limit: 12,
  page: pageNumber,
  sort: 'name',
  locale,
})

// Product by slug
payload.find({
  collection: 'products',
  where: { slug: { equals: slug } },
  limit: 1,
  locale,
})

// Products by brand
payload.find({
  collection: 'products',
  where: { brand: { equals: brandId } },
  locale,
})

// Products by category
payload.find({
  collection: 'products',
  where: { categories: { contains: categoryId } },
  locale,
})
```

### 3.2 Services Collection

**File:** `src/collections/Services.ts`

**Thay đổi cần thiết:** Đổi `read: anyone` → `read: publishedOnly`.

```typescript
{
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', '_status', 'order'],
  },
  versions: { drafts: true, maxPerDoc: 10 },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', unique: true, index: true,
      hooks: { beforeValidate: [formatSlug('title')] },
    },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'benefits', type: 'array', fields: [
      { name: 'text', type: 'text', localized: true, required: true },
    ]},
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
  access: { read: publishedOnly, create: isAdmin, update: isAdmin, delete: isAdmin },
}
```

**Frontend query:**
```typescript
// All services, sorted by order (publishedOnly handles draft filtering)
payload.find({
  collection: 'services',
  sort: 'order',
  locale,
})
```

### 3.3 News Collection

**File:** `src/collections/News.ts`

**Thay đổi cần thiết:** Đổi `read: anyone` → `read: publishedOnly`.

```typescript
{
  slug: 'news',
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', unique: true, index: true,
      hooks: { beforeValidate: [formatSlug('title')] },
    },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'publishedAt', type: 'date', index: true },
  ],
  access: { read: publishedOnly, create: isAdmin, update: isAdmin, delete: isAdmin },
}
```

### 3.4 Pages Collection

**File:** `src/collections/Pages.ts`

**Thay đổi cần thiết:** Đổi `read: anyone` → `read: publishedOnly`.

**Routing strategy:** Dynamic catch-all `[...slug]/page.tsx` renders Pages từ CMS. Các trang static (about, shipping, payment, warranty, faq, privacy, terms) được tạo trong admin panel, không cần dedicated page files. Content editors có thể thêm/sửa trang mà không cần deploy code.

```typescript
{
  slug: 'pages',
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', unique: true, index: true,
      hooks: { beforeValidate: [formatSlug('title')] },
    },
    { name: 'content', type: 'richText', localized: true },
    { name: 'layout', type: 'blocks', localized: true, blocks: [
      HeroBlock, ContentBlock, CTABlock, FAQBlock, GalleryBlock,
    ]},
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
  ],
  access: { read: publishedOnly, create: isAdmin, update: isAdmin, delete: isAdmin },
}
```

### 3.5 Categories Collection

**File:** `src/collections/Categories.ts`

**Thay đổi cần thiết:** Không thay đổi.

```typescript
{
  slug: 'categories',
  // No drafts
  fields: [
    { name: 'name', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    { name: 'description', type: 'richText', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'parent', type: 'relationship', relationTo: 'categories' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

### 3.6 Brands Collection

**File:** `src/collections/Brands.ts`

**Thay đổi cần thiết:** Không thay đổi.

```typescript
{
  slug: 'brands',
  // No drafts
  fields: [
    { name: 'name', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'richText', localized: true },
    { name: 'website', type: 'text' },
  ],
}
```

### 3.7 Media Collection

**File:** `src/collections/Media.ts`

**Thay đổi cần thiết:** Không thay đổi.

```typescript
{
  slug: 'media',
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'medium', width: 900 },
      { name: 'large', width: 1400 },
    ],
    focalPoint: true,
    crop: true,
  },
  fields: [
    { name: 'alt', type: 'text', localized: true, required: true },
    { name: 'caption', type: 'text', localized: true },
  ],
  defaultPopulate: { url: true, alt: true, width: true, height: true, filename: true, mimeType: true, sizes: true },
}
```

### 3.8 Users Collection

**File:** `src/collections/Users.ts`

**Thay đổi cần thiết:** Không thay đổi.

```typescript
{
  slug: 'users',
  auth: true,
  admin: { group: 'Admin' },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'role', type: 'select', options: ['admin', 'editor'], defaultValue: 'editor' },
  ],
}
```

---

## 4. PayloadCMS Globals - Chi tiết

### 4.1 SiteSettings Global

**File:** `src/globals/SiteSettings.ts`

**Thay đổi cần thiết:** Không thay đổi schema. Data cập nhật qua admin panel.

```typescript
{
  slug: 'site-settings',
  access: { read: anyone },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'VIES' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'phone', type: 'array', fields: [
          { name: 'number', type: 'text', required: true },
          { name: 'label', type: 'text', localized: true },
        ]},
        { name: 'email', type: 'email' },
        { name: 'address', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'zalo', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
  ],
}
```

**Data mẫu (theo UX spec):**
```json
{
  "siteName": "VIES",
  "contact": {
    "phone": [
      { "number": "0903326309", "label": { "vi": "Báo giá", "en": "Quote" } },
      { "number": "0908748304", "label": { "vi": "Tư vấn", "en": "Consultation" } }
    ],
    "email": "info@v-ies.com",
    "address": { "vi": "...", "en": "..." }
  },
  "social": { "zalo": "...", "facebook": "..." }
}
```

**Frontend usage:** ContactBar, Footer lấy data từ đây.

### 4.2 Header Global

**File:** `src/globals/Header.ts`

**Thay đổi cần thiết:** Không thay đổi schema. Data cập nhật theo UX spec navigation.

```typescript
{
  slug: 'header',
  access: { read: anyone },
  fields: [
    {
      name: 'topBar',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'content', type: 'text', localized: true },
      ],
    },
    {
      name: 'navigation',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'link', type: 'text', required: true },
        {
          name: 'children',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', localized: true, required: true },
            { name: 'link', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
```

**Data mẫu (theo UX spec):**
```json
{
  "topBar": { "enabled": true },
  "navigation": [
    { "label": { "vi": "Dịch vụ", "en": "Services" }, "link": "/services" },
    { "label": { "vi": "Sản phẩm", "en": "Products" }, "link": "/products", "children": [
      { "label": { "vi": "Theo hãng", "en": "By Brand" }, "link": "/products?view=brands" },
      { "label": { "vi": "Theo loại", "en": "By Category" }, "link": "/products?view=categories" }
    ]},
    { "label": { "vi": "Tin tức", "en": "News" }, "link": "/news" },
    { "label": { "vi": "Về chúng tôi", "en": "About" }, "link": "/about" }
  ]
}
```

**Frontend usage:** NavigationHeader component.

### 4.3 Footer Global

**File:** `src/globals/Footer.ts`

**Thay đổi cần thiết:** Không thay đổi schema.

```typescript
{
  slug: 'footer',
  access: { read: anyone },
  fields: [
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
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

---

## 5. Frontend Components → CMS Data Mapping

### 5.1 Component ↔ Data Source Matrix

| Component | CMS Data Source | Query | Client/Server |
|-----------|----------------|-------|---------------|
| **ContactBar** | `SiteSettings.contact` + `Header.topBar` | `getGlobal('site-settings')` + `getGlobal('header')` | Server |
| **NavigationHeader** | `Header.navigation` + `SiteSettings.logo` | `getGlobal('header')` + `getGlobal('site-settings')` | Client (mobile menu, sticky) |
| **SearchBar** | `Products` (autocomplete) | `payload.find({ collection: 'products', where: ... })` | Client (input, dropdown) |
| **ProductCard** | `Products` (populated brand, images) | Passed as props from parent | Server |
| **QuoteRequestForm** | `FormSubmissions` (plugin-form-builder) | `payload.create({ collection: 'form-submissions' })` | Client (form state) |
| **ServiceCard** | `Services` | Passed as props from parent | Server |
| **BrandLogoBar** | `Brands` (logo, name, slug) | `payload.find({ collection: 'brands' })` | Server |
| **CategoryFilter** | `Categories` + `Brands` | `payload.find({ collection: 'categories' })` | Client (filter state) |
| **EmptyState** | `SiteSettings.contact.phone` | Passed as props | Server |
| **CTASection** | `SiteSettings.contact` + `SiteSettings.social.zalo` | Passed as props from parent | Server |
| **Footer** | `Footer` global + `SiteSettings` | `getGlobal('footer')` + `getGlobal('site-settings')` | Server |

### 5.2 Component Data Flow

```
Layout (Server)
├── getGlobal('site-settings') → siteSettings
├── getGlobal('header') → headerData
├── getGlobal('footer') → footerData
│
├── ContactBar (Server)
│   └── Props: siteSettings.contact, headerData.topBar
│
├── NavigationHeader (Client)
│   └── Props: headerData.navigation, siteSettings.logo, siteSettings.contact
│
├── {children} ← Page content
│
└── Footer (Server)
    └── Props: footerData, siteSettings

Homepage (Server)
├── payload.find({ collection: 'brands' }) → brands
├── payload.find({ collection: 'categories' }) → categories
├── payload.find({ collection: 'products', where: { featured: true } }) → featuredProducts
├── payload.find({ collection: 'services' }) → services
│
├── SearchBar (Client) ← Hero variant, no initial data
├── ServiceCard[] (Server) ← Props: services
├── ProductCard[] (Server) ← Props: featuredProducts (or categories grid)
├── BrandLogoBar (Server) ← Props: brands
└── CTASection (Server) ← Props: siteSettings.contact

Products Page (Server)
├── payload.find({ collection: 'products', where, limit, page, sort }) → products
├── payload.find({ collection: 'categories' }) → categories
├── payload.find({ collection: 'brands' }) → brands
│
├── CategoryFilter (Client) ← Props: categories, brands, activeFilters
├── ProductCard[] (Server) ← Props: products
└── EmptyState (Server) ← Shown when products.totalDocs === 0
```

### 5.3 Search Autocomplete Flow

```
User types in SearchBar (Client Component)
    ↓ debounce 300ms
    ↓ fetch('/api/search?q=6205')
    ↓
API Route: src/app/(frontend)/api/search/route.ts (Server)
    ↓ payload.find({
    ↓   collection: 'products',  // publishedOnly handles draft filtering
    ↓   where: {
    ↓     or: [
    ↓       { name: { contains: query } },
    ↓       { sku: { contains: query } },
    ↓     ],
    ↓   },
    ↓   limit: 6,
    ↓   locale,
    ↓   select: { name: true, sku: true, slug: true, brand: true, images: true },
    ↓ })
    ↓
    ↓ Return JSON
    ↓
SearchBar renders dropdown with results
    ↓ User selects
    ↓ router.push(`/product/${slug}`)
```

### 5.4 Quote Request Form Flow

```
User on Product Page → clicks "Yêu cầu báo giá"
    ↓
QuoteRequestForm (Client Component)
    ↓ Pre-filled: product name, SKU
    ↓ User fills: tên, SĐT, email, số lượng, ghi chú
    ↓ Client validation (required fields)
    ↓
    ↓ POST /api/form-submissions (Payload plugin-form-builder)
    ↓ OR payload.create({ collection: 'form-submissions', data: { form: formId, submissionData: [...] } })
    ↓
    ↓ Success → Toast "Đã gửi yêu cầu thành công"
    ↓ Error → Toast with retry button
```

---

## 6. Implementation Patterns

### 6.1 Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| Collection files | PascalCase.ts | `Products.ts`, `SiteSettings.ts` |
| Component files | PascalCase.tsx | `SearchBar.tsx`, `ProductCard.tsx` |
| Component folders | kebab-case or flat | `src/components/SearchBar.tsx` |
| Page files | page.tsx (Next.js convention) | `[locale]/products/page.tsx` |
| API routes | route.ts | `api/search/route.ts` |
| Utility files | camelCase.ts | `slugHook.ts`, `access.ts` |
| CSS class | Tailwind utilities | `className="bg-primary text-white"` |
| Design tokens | kebab-case CSS vars | `--color-primary`, `--spacing-md` |

### 6.2 Data Fetching Pattern

```typescript
// Pattern cho mọi page: Server Component + getPayload
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: await config })

  // publishedOnly access tự filter draft content cho anonymous requests
  const { docs } = await payload.find({
    collection: 'products',
    locale,
    limit: 12,
  })

  return <ProductGrid products={docs} />
}
```

### 6.3 Error Handling Pattern

```typescript
// Empty state - KHÔNG BAO GIỜ hiện trang trống
if (docs.length === 0) {
  return <EmptyState
    message={t('products.noResults')}
    contactPhone="0908748304"
  />
}
```

### 6.4 Locale Pattern

```typescript
// Layout fetches locale from params, passes to components
// All Payload queries include locale parameter
const { locale } = await params
payload.find({ collection: 'products', locale })
payload.findGlobal({ slug: 'header', locale })
```

---

## 7. Project Structure

```
src/
├── app/
│   ├── (frontend)/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx              # Root layout: ContactBar + NavigationHeader + Footer
│   │   │   ├── page.tsx                # Homepage
│   │   │   ├── products/
│   │   │   │   └── page.tsx            # Product listing + filter
│   │   │   ├── product/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx        # Product detail + quote form
│   │   │   ├── services/
│   │   │   │   ├── page.tsx            # Services listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx        # Service detail
│   │   │   ├── news/
│   │   │   │   ├── page.tsx            # News listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx        # News detail
│   │   │   ├── brands/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx        # Brand + products
│   │   │   ├── categories/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx        # Category + products
│   │   │   ├── contact/
│   │   │   │   └── page.tsx            # Contact form + info + map (dedicated - custom logic)
│   │   │   ├── search/
│   │   │   │   └── page.tsx            # Search results (dedicated - custom logic)
│   │   │   └── [...slug]/
│   │   │       └── page.tsx            # Dynamic pages from Pages collection (about, shipping, payment, warranty, faq, privacy, terms)
│   │   ├── api/
│   │   │   └── search/
│   │   │       └── route.ts            # Search autocomplete API
│   │   ├── layout.tsx                  # Root HTML layout
│   │   └── styles.css                  # Tailwind + design tokens
│   └── (payload)/                      # Payload admin (không thay đổi)
│
├── components/
│   ├── layout/
│   │   ├── ContactBar.tsx              # Server - Topbar SĐT/email/language
│   │   ├── NavigationHeader.tsx        # Client - Logo + menu + search + CTA
│   │   └── Footer.tsx                  # Server - Footer columns + copyright
│   ├── ui/
│   │   ├── Button.tsx                  # Reusable button (primary/secondary/tertiary/ghost)
│   │   ├── SearchBar.tsx               # Client - Autocomplete search
│   │   ├── ProductCard.tsx             # Server - Product card (grid/list variants)
│   │   ├── ServiceCard.tsx             # Server - Service card
│   │   ├── BrandLogoBar.tsx            # Server - Brand logos row
│   │   ├── CategoryFilter.tsx          # Client - Filter sidebar/bottom sheet
│   │   ├── EmptyState.tsx              # Server - No results + contact CTA
│   │   ├── CTASection.tsx              # Server - Call-to-action section
│   │   ├── QuoteRequestForm.tsx        # Client - Quote request form
│   │   ├── Breadcrumb.tsx              # Server - Breadcrumb navigation
│   │   ├── Pagination.tsx              # Server - Load more button
│   │   └── Toast.tsx                   # Client - Toast notifications
│   └── blocks/                         # Rich content blocks (for Pages)
│       ├── HeroBlock.tsx
│       ├── ContentBlock.tsx
│       ├── CTABlock.tsx
│       ├── FAQBlock.tsx
│       └── GalleryBlock.tsx
│
├── collections/                        # PayloadCMS collections (giữ nguyên)
│   ├── Products.ts
│   ├── Services.ts
│   ├── News.ts
│   ├── Pages.ts
│   ├── Categories.ts
│   ├── Brands.ts
│   ├── Media.ts
│   └── Users.ts
│
├── globals/                            # PayloadCMS globals (giữ nguyên)
│   ├── SiteSettings.ts
│   ├── Header.ts
│   └── Footer.ts
│
├── lib/
│   └── payload/
│       ├── access.ts                   # Access control utilities
│       ├── slugHook.ts                 # Vietnamese slug hook
│       └── blocks.ts                   # Block definitions
│
├── i18n/
│   ├── config.ts                       # Locales: ['vi', 'en'] (loại bỏ 'km')
│   └── request.ts                      # next-intl request config
│
├── payload.config.ts                   # Main config (cập nhật locales)
└── payload-types.ts                    # Generated types
```

---

## 8. Design Tokens (Tailwind CSS)

**File:** `src/app/(frontend)/styles.css`

```css
@import "tailwindcss";

@theme {
  /* Colors - Nordic Industrial */
  --color-primary: #0F4C75;
  --color-primary-light: #E8F0F7;
  --color-accent: #D4A843;
  --color-bg: #FAFAFA;
  --color-bg-alt: #F0F0F0;
  --color-text: #1A1A2E;
  --color-text-muted: #6B7280;
  --color-border: #E5E7EB;
  --color-success: #059669;
  --color-error: #DC2626;

  /* Typography */
  --font-sans: 'Inter', sans-serif;

  /* Spacing (8px base) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 96px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;

  /* Container */
  --container-max: 1280px;
}
```

---

## 9. Config Changes Required

### 9.1 payload.config.ts - Loại bỏ KM

```typescript
// TRƯỚC
localization: {
  locales: ['vi', 'en', 'km'],
  defaultLocale: 'vi',
  fallback: true,
}

// SAU
localization: {
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  fallback: true,
}
```

### 9.2 i18n/config.ts - Loại bỏ KM

```typescript
// TRƯỚC
export const locales = ['vi', 'en', 'km'] as const

// SAU
export const locales = ['vi', 'en'] as const
```

### 9.3 next.config.mjs - Loại bỏ KM

Cập nhật next-intl config để chỉ hỗ trợ vi/en.

### 9.4 messages/ - Loại bỏ km.json

Xóa file `messages/km.json`.

### 9.5 Collections - Đổi access `read: anyone` → `read: publishedOnly`

Áp dụng cho 4 draft-enabled collections: Products, News, Services, Pages.

```typescript
// TRƯỚC
access: { read: anyone, ... }

// SAU
access: { read: publishedOnly, ... }
```

**Lợi ích:** Draft content không bị expose qua REST/GraphQL API. Frontend queries không cần filter `_status` thủ công.

---

## 10. Implementation Sequence

| Order | Task | Files |
|-------|------|-------|
| 1 | Loại bỏ KM locale + đổi access sang publishedOnly | `payload.config.ts`, `i18n/config.ts`, `next.config.mjs`, xóa `messages/km.json`, cập nhật 4 collections |
| 2 | Cập nhật design tokens | `styles.css` |
| 3 | Build layout components | `ContactBar`, `NavigationHeader`, `Footer` |
| 4 | Build UI components | `Button`, `SearchBar`, `ProductCard`, `ServiceCard`, `BrandLogoBar`, `EmptyState`, `CTASection`, `Breadcrumb` |
| 5 | Build homepage | `[locale]/page.tsx` |
| 6 | Build search API + page | `api/search/route.ts`, `search/page.tsx` |
| 7 | Build product pages | `products/page.tsx`, `product/[slug]/page.tsx`, `CategoryFilter`, `QuoteRequestForm` |
| 8 | Build service pages | `services/page.tsx`, `services/[slug]/page.tsx` |
| 9 | Build news pages | `news/page.tsx`, `news/[slug]/page.tsx` |
| 10 | Build brand/category pages | `brands/[slug]/page.tsx`, `categories/[slug]/page.tsx` |
| 11 | Build contact page | `contact/page.tsx` |
| 12 | Block components + dynamic pages | `[...slug]/page.tsx`, `HeroBlock`, `ContentBlock`, `CTABlock`, `FAQBlock`, `GalleryBlock` |
| 13 | Cập nhật seed data | `scripts/seed.ts` - globals data + Pages entries (about, shipping, payment, warranty, faq, privacy, terms) |
| 14 | Mobile optimization | Hamburger menu, sticky bottom bar, search overlay |

---

## 11. Architecture Validation

### Requirements Coverage

| PRD ID | Covered by | Status |
|--------|-----------|--------|
| HP-01 → HP-07 | Homepage page.tsx + layout components | ✅ |
| SR-01 → SR-07 | SearchBar component + API route | ✅ |
| PR-01 → PR-07 | Products page + ProductCard + CategoryFilter | ✅ |
| SV-01 → SV-04 | Services pages + ServiceCard | ✅ |
| NW-01 → NW-03 | News pages | ✅ |
| BR-01 → BR-02 | Brands page + BrandLogoBar | ✅ |
| CT-01 → CT-02 | Categories page | ✅ |
| FM-01 → FM-06 | QuoteRequestForm + plugin-form-builder | ✅ |
| PG-01 → PG-07 | Dynamic `[...slug]` route + Pages collection + Block components | ✅ |
| I18N-01 → I18N-04 | next-intl + PayloadCMS localization | ✅ |
| SEO-01 → SEO-04 | plugin-seo | ✅ |
| NV-01 → NV-06 | ContactBar + NavigationHeader + Footer + Breadcrumb | ✅ |

### Architecture Readiness: READY FOR IMPLEMENTATION
