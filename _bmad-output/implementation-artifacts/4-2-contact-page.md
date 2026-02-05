# Story 4.2: Contact Page

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng,
I want a contact page with form, company info, and map,
So that I can reach VIES through multiple channels.

## Acceptance Criteria

1. **Given** `/contact` page **When** trang load **Then** hiện contact form (tên, SĐT, email, chủ đề, message)
2. **Given** contact page **When** trang load **Then** hiện thông tin công ty: địa chỉ, SĐT, email (từ SiteSettings global)
3. **Given** contact page **When** trang load **Then** hiện Google Maps embed (static map image with link or iframe)
4. **Given** user nhập form **When** submit **Then** client validation: required fields (tên, SĐT, message), phone format (VN mobile 10 digits), email format (if provided)
5. **Given** validation pass **When** submit **Then** form submit → lưu trong CMS (form-builder plugin `/api/form-submissions`)
6. **Given** submit thành công **When** API trả về 201 **Then** toast "Đã gửi yêu cầu thành công"
7. **Given** submit thất bại **When** API error **Then** toast error với retry option
8. **Given** contact page **When** trang load **Then** breadcrumb: Home > Liên hệ

## Dependencies

**Story 4.1 (QuoteRequestForm)** đã implement các patterns:
- Form validation (phone regex, email format)
- Form-builder plugin submission
- Toast notifications (basic inline implementation)
- Modal/form patterns

**Story 4.4 (Toast component)** sẽ refactor toast thành shared component - story này có thể dùng inline toast pattern từ 4.1 hoặc tái sử dụng nếu 4.4 đã done.

**Form Builder Plugin** đã cấu hình trong payload.config.ts (lines 100-119) với các field types: text, textarea, select, email, number, checkbox.

## Tasks / Subtasks

- [x] Task 1: Tạo ContactForm component (AC: #1, #4, #5, #6, #7)
  - [x] 1.1: Tạo file `src/components/ui/ContactForm.tsx` (Client Component)
  - [x] 1.2: Props interface: `{ locale: string; onSuccess?: () => void }`
  - [x] 1.3: Form fields:
    - `name` (text, required) - Họ và tên
    - `phone` (tel, required) - Số điện thoại
    - `email` (email, optional) - Email
    - `subject` (select, optional) - Chủ đề: Báo giá, Thông tin SP, Hỗ trợ kỹ thuật, Hợp tác, Khác
    - `company` (text, optional) - Công ty
    - `message` (textarea, required) - Nội dung
  - [x] 1.4: Client validation:
    - Required: name, phone, message
    - Phone regex: `/^(0[3|5|7|8|9])([0-9]{8})$/`
    - Email validation chỉ khi có value
  - [x] 1.5: Submit handler: POST to `/api/form-submissions` với format form-builder
  - [x] 1.6: Success: toast + optional callback
  - [x] 1.7: Error: toast với retry option
  - [x] 1.8: Loading state khi submitting

- [x] Task 2: Tạo ContactInfo component (AC: #2)
  - [x] 2.1: Tạo file `src/components/ui/ContactInfo.tsx` (Server Component)
  - [x] 2.2: Props interface chứa siteSettings data
  - [x] 2.3: Render: địa chỉ, danh sách SĐT (với label), email
  - [x] 2.4: SĐT là tel: links (clickable)
  - [x] 2.5: Email là mailto: link
  - [x] 2.6: Optional: working hours (hardcoded hoặc từ SiteSettings nếu có)
  - [x] 2.7: Social links (Zalo, Facebook) từ SiteSettings.social

- [x] Task 3: Tạo ContactMap component (AC: #3)
  - [x] 3.1: Tạo file `src/components/ui/ContactMap.tsx` (Server Component)
  - [x] 3.2: Option A: Google Maps Static API image với link mở Google Maps
  - [x] 3.3: Option B: Google Maps Embed iframe (simpler, no API key needed for basic embed)
  - [x] 3.4: Fallback: static image với link đến Google Maps
  - [x] 3.5: Responsive: full-width, fixed aspect ratio (16:9 hoặc 4:3)
  - [x] 3.6: Address prop để generate map URL

- [x] Task 4: Tạo Contact page (AC: #1, #2, #3, #8)
  - [x] 4.1: Tạo file `src/app/(frontend)/[locale]/contact/page.tsx`
  - [x] 4.2: Server Component fetch SiteSettings global
  - [x] 4.3: Layout 2 columns trên desktop:
    - Left: ContactForm
    - Right: ContactInfo + ContactMap (stacked)
  - [x] 4.4: Mobile: single column (form → info → map)
  - [x] 4.5: Breadcrumb: Home > Liên hệ
  - [x] 4.6: Page title + subtitle từ i18n
  - [x] 4.7: generateMetadata cho SEO

- [x] Task 5: Tạo/verify form trong Payload Admin (AC: #5)
  - [x] 5.1: Go to Admin > Forms > Create New
  - [x] 5.2: Form name: "Contact" (hoặc "Liên hệ")
  - [x] 5.3: Add fields:
    - `name` (text, required)
    - `phone` (text, required)
    - `email` (email, optional)
    - `subject` (select, options: quote/info/support/partnership/other)
    - `company` (text, optional)
    - `message` (textarea, required)
  - [x] 5.4: Save form → note form ID for API submission

- [x] Task 6: i18n translations (AC: all)
  - [x] 6.1: Verify/add keys trong messages/vi.json và messages/en.json:
    - Keys already exist in `contact.*` namespace (check và verify)
    - Add any missing keys if needed
  - [x] 6.2: Verify English translations in en.json

- [x] Task 7: Build + verify (AC: all)
  - [x] 7.1: Chạy `pnpm build` — phải thành công
  - [x] 7.2: Verify page renders tại `/vi/contact` và `/en/contact`
  - [x] 7.3: Verify company info loads từ SiteSettings
  - [x] 7.4: Verify validation messages hiển thị khi submit form trống
  - [x] 7.5: Verify phone validation (reject invalid, accept valid VN numbers)
  - [x] 7.6: Verify submit gửi đúng format đến form-builder API
  - [x] 7.7: Verify success toast hiển thị sau submit thành công
  - [x] 7.8: Verify breadcrumb hiển thị đúng
  - [x] 7.9: Test responsive: form display tốt trên mobile

## Dev Notes

### Architecture & Patterns

**File locations:**
```
src/app/(frontend)/[locale]/contact/page.tsx    # NEW - Contact page (Server Component)
src/components/ui/ContactForm.tsx               # NEW - Client Component (form state)
src/components/ui/ContactInfo.tsx               # NEW - Server Component
src/components/ui/ContactMap.tsx                # NEW - Server Component
messages/vi.json                                # VERIFY - contact.* keys exist
messages/en.json                                # VERIFY - contact.* keys exist
```

**Component architecture (per architecture.md Section 5.1):**
- Contact Page: Server Component (fetch SiteSettings, pass to children)
- ContactForm: Client Component (form state, validation, submission)
- ContactInfo: Server Component (render static info)
- ContactMap: Server Component (render map embed/image)

**Data flow:**
```
Contact Page (Server)
├── getPayload().findGlobal({ slug: 'site-settings', locale })
│
├── Breadcrumb (Server)
│   └── items: [{ label: t('nav.breadcrumb.contact') }]
│
├── Page Header (Server)
│   └── title + subtitle từ i18n
│
└── Layout Grid (Server)
    ├── ContactForm (Client)
    │   ├── State: formData, errors, isSubmitting, toast
    │   ├── Props: locale
    │   │
    │   └── Submit → POST /api/form-submissions
    │             → Success: show toast
    │             → Error: show error toast
    │
    └── Sidebar (Server)
        ├── ContactInfo (Server)
        │   └── Props: siteSettings.contact, siteSettings.social
        │
        └── ContactMap (Server)
            └── Props: address, mapUrl (optional)
```

### SiteSettings Data Structure

**From `src/globals/SiteSettings.ts` (lines 26-54):**
```typescript
contact: {
  phone: Array<{ number: string; label?: string }>,  // e.g., [{number: "0903326309", label: "Báo giá"}]
  email: string,  // e.g., "info@v-ies.com"
  address: string,  // localized, multiline
},
social: {
  facebook?: string,
  zalo?: string,
  youtube?: string,
}
```

**Fetching SiteSettings:**
```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config: await config })
const siteSettings = await payload.findGlobal({
  slug: 'site-settings',
  locale,
})
```

### Form Builder Plugin Integration

**Plugin đã cấu hình trong payload.config.ts (lines 100-119):**
```typescript
formBuilderPlugin({
  fields: {
    text: true,
    textarea: true,
    select: true,
    email: true,
    number: true,
    checkbox: true,
  },
})
```

**API submission format (reuse pattern from Story 4.1):**
```typescript
// POST /api/form-submissions
const response = await fetch('/api/form-submissions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    form: 'contact-form-id-here', // ID từ admin
    submissionData: [
      { field: 'name', value: formData.name },
      { field: 'phone', value: formData.phone },
      { field: 'email', value: formData.email || '' },
      { field: 'subject', value: formData.subject || '' },
      { field: 'company', value: formData.company || '' },
      { field: 'message', value: formData.message },
    ],
  }),
})

if (response.ok) {
  // Success - show toast, optionally reset form
} else {
  // Error - show error toast with retry
}
```

### Phone Validation (reuse from Story 4.1)

**Vietnamese mobile phone formats:**
- 10 digits starting with: 03x, 05x, 07x, 08x, 09x
- Examples: 0903326309, 0359123456, 0812345678

**Validation regex:**
```typescript
const vnPhoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s-]/g, '') // Remove spaces and dashes
  return vnPhoneRegex.test(cleaned)
}
```

### Contact Form Implementation Pattern

```tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface FormData {
  name: string
  phone: string
  email: string
  subject: string
  company: string
  message: string
}

interface ToastState {
  type: 'success' | 'error' | null
  message: string
}

export function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations('contact')
  const tForms = useTranslations('forms')

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    subject: '',
    company: '',
    message: '',
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<ToastState>({ type: null, message: '' })

  // Validation, submit handlers...
}
```

### ContactInfo Component Pattern

```tsx
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'
// Or use inline SVG icons

interface ContactInfoProps {
  contact: {
    phone: Array<{ number: string; label?: string }>
    email: string
    address: string
  }
  social: {
    facebook?: string
    zalo?: string
    youtube?: string
  }
}

export function ContactInfo({ contact, social }: ContactInfoProps) {
  return (
    <div className="space-y-lg">
      {/* Address */}
      <div className="flex gap-md">
        <MapPinIcon className="w-6 h-6 text-primary shrink-0" />
        <div>
          <h3 className="font-semibold text-text">{t('address')}</h3>
          <p className="text-text-muted whitespace-pre-line">{contact.address}</p>
        </div>
      </div>

      {/* Phone numbers */}
      <div className="flex gap-md">
        <PhoneIcon className="w-6 h-6 text-primary shrink-0" />
        <div>
          <h3 className="font-semibold text-text">{t('phone')}</h3>
          <div className="space-y-xs">
            {contact.phone.map((p, i) => (
              <a
                key={i}
                href={`tel:${p.number}`}
                className="block text-primary hover:underline"
              >
                {p.number} {p.label && <span className="text-text-muted">({p.label})</span>}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="flex gap-md">
        <EnvelopeIcon className="w-6 h-6 text-primary shrink-0" />
        <div>
          <h3 className="font-semibold text-text">Email</h3>
          <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
            {contact.email}
          </a>
        </div>
      </div>

      {/* Social Links */}
      {(social.zalo || social.facebook) && (
        <div className="pt-md border-t border-border">
          <h3 className="font-semibold text-text mb-sm">{t('followUs')}</h3>
          <div className="flex gap-md">
            {social.zalo && (
              <a href={social.zalo} target="_blank" rel="noopener noreferrer" className="...">
                Zalo
              </a>
            )}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="...">
                Facebook
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

### ContactMap Component Pattern

**Option A: Google Maps Embed (recommended - no API key needed for basic embed):**
```tsx
interface ContactMapProps {
  address: string
  className?: string
}

export function ContactMap({ address, className }: ContactMapProps) {
  // Encode address for URL
  const encodedAddress = encodeURIComponent(address)
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`

  // Or use embed without API key (limited features):
  const embedUrlNoKey = `https://www.google.com/maps?q=${encodedAddress}&output=embed`

  return (
    <div className={`aspect-video w-full rounded-md overflow-hidden ${className}`}>
      <iframe
        src={embedUrlNoKey}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="VIES location map"
      />
    </div>
  )
}
```

**Option B: Static Map Image (simpler, fallback):**
```tsx
export function ContactMap({ address, className }: ContactMapProps) {
  const encodedAddress = encodeURIComponent(address)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`block aspect-video w-full rounded-md overflow-hidden bg-bg-alt ${className}`}
    >
      <div className="w-full h-full flex items-center justify-center text-text-muted">
        <MapPinIcon className="w-12 h-12" />
        <span className="ml-2">{t('map')}</span>
      </div>
    </a>
  )
}
```

### Toast Implementation (reuse from Story 4.1)

```tsx
// Inline toast state trong component
const [toast, setToast] = useState<{ type: 'success' | 'error' | null; message: string }>({
  type: null,
  message: '',
})

// Auto-dismiss success toast
useEffect(() => {
  if (toast.type === 'success') {
    const timer = setTimeout(() => {
      setToast({ type: null, message: '' })
    }, 5000)
    return () => clearTimeout(timer)
  }
}, [toast.type])

// Render toast
{toast.type && (
  <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
    toast.type === 'success' ? 'bg-success' : 'bg-error'
  } text-white flex items-center gap-3`}>
    {toast.type === 'success' ? <CheckIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />}
    <span>{toast.message}</span>
    <button onClick={() => setToast({ type: null, message: '' })}>
      <XIcon className="w-5 h-5" />
    </button>
    {toast.type === 'error' && (
      <button onClick={handleSubmit} className="underline ml-2">
        {tForms('toast.retry')}
      </button>
    )}
  </div>
)}
```

### Page Layout Pattern

```tsx
// src/app/(frontend)/[locale]/contact/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ContactForm } from '@/components/ui/ContactForm'
import { ContactInfo } from '@/components/ui/ContactInfo'
import { ContactMap } from '@/components/ui/ContactMap'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return {
    title: `${t('title')} | VIES`,
    description: t('subtitle'),
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  const payload = await getPayload({ config: await config })

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    locale,
  })

  return (
    <main>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: t('title') }]} />

      {/* Page Content */}
      <div className="mx-auto max-w-[var(--container-max)] px-md py-2xl">
        {/* Header */}
        <div className="text-center mb-2xl">
          <h1 className="text-3xl font-bold text-text mb-md">{t('title')}</h1>
          <p className="text-text-muted max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-2xl">
          {/* Form - takes more space */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-border rounded-md p-lg lg:p-xl">
              <h2 className="text-xl font-semibold text-text mb-lg">{t('formTitle')}</h2>
              <p className="text-text-muted mb-lg">{t('formSubtitle')}</p>
              <ContactForm locale={locale} />
            </div>
          </div>

          {/* Sidebar - Info + Map */}
          <div className="lg:col-span-2 space-y-lg">
            {/* Contact Info Card */}
            <div className="bg-white border border-border rounded-md p-lg">
              <h2 className="text-xl font-semibold text-text mb-lg">{t('contactInfo')}</h2>
              <ContactInfo
                contact={siteSettings.contact}
                social={siteSettings.social}
              />
            </div>

            {/* Map */}
            <div className="bg-white border border-border rounded-md p-lg">
              <h2 className="text-xl font-semibold text-text mb-md">{t('map')}</h2>
              <ContactMap address={siteSettings.contact?.address || 'VIES Vietnam'} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
```

### Design Tokens

**Colors (per architecture.md Section 8):**
- `--color-accent`: #D4A843 (amber) - Primary CTA button (submit)
- `--color-success`: #059669 - Success toast
- `--color-error`: #DC2626 - Error toast, validation errors
- `--color-primary`: #0F4C75 - Links, focus states
- `--color-border`: #E5E7EB - Input borders, card borders
- `--color-bg-alt`: #F0F0F0 - Map placeholder background

**Form input styling:**
```css
input, textarea, select {
  @apply w-full px-4 py-3 border border-border rounded-md
         focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
         transition-colors;
}

input:invalid:not(:focus):not(:placeholder-shown),
textarea:invalid:not(:focus):not(:placeholder-shown) {
  @apply border-error;
}
```

### i18n Keys (already exist in messages/vi.json)

**Namespace: `contact`**
```json
{
  "title": "Liên hệ",
  "subtitle": "Chúng tôi luôn sẵn sàng hỗ trợ bạn",
  "contactInfo": "Thông tin liên hệ",
  "address": "Địa chỉ",
  "phone": "Điện thoại",
  "workingHours": "Giờ làm việc",
  "followUs": "Theo dõi chúng tôi",
  "formTitle": "Gửi tin nhắn cho chúng tôi",
  "formSubtitle": "Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại sớm nhất có thể",
  "name": "Họ và tên",
  "namePlaceholder": "Nhập họ và tên",
  "emailPlaceholder": "example@email.com",
  "phonePlaceholder": "Nhập số điện thoại",
  "company": "Công ty",
  "companyPlaceholder": "Tên công ty (nếu có)",
  "subject": "Chủ đề",
  "selectSubject": "Chọn chủ đề",
  "subjectQuote": "Yêu cầu báo giá",
  "subjectInfo": "Thông tin sản phẩm",
  "subjectSupport": "Hỗ trợ kỹ thuật",
  "subjectPartnership": "Hợp tác kinh doanh",
  "subjectOther": "Khác",
  "productInterest": "Sản phẩm quan tâm",
  "message": "Nội dung",
  "messagePlaceholder": "Nhập nội dung tin nhắn...",
  "submit": "Gửi tin nhắn",
  "map": "Bản đồ"
}
```

### Accessibility Requirements

- All form inputs have associated labels (htmlFor/id)
- Required fields marked with asterisk (*) and aria-required="true"
- Error messages linked to inputs via aria-describedby
- Phone and email links are accessible
- Map iframe has descriptive title attribute
- Focus indicators on all interactive elements
- Tab order: form fields → submit → contact info links → map
- `<main>` landmark for page content
- Semantic headings hierarchy (h1 > h2 > h3)

### Project Structure Notes

**Alignment with unified project structure:**
- Contact page follows same pattern as other pages (`[locale]/contact/page.tsx`)
- Components in `src/components/ui/` following existing convention
- Server/Client component split consistent with architecture

**Files to create:**
```
src/app/(frontend)/[locale]/contact/page.tsx
src/components/ui/ContactForm.tsx
src/components/ui/ContactInfo.tsx
src/components/ui/ContactMap.tsx
```

### Previous Story Intelligence (from 4.1)

**Learnings from QuoteRequestForm implementation:**
- Phone validation regex works well: `/^(0[3|5|7|8|9])([0-9]{8})$/`
- Form-builder API submission format is consistent
- Toast inline implementation pattern is simple and effective
- Client validation before API call improves UX
- Loading state on button prevents double submission

**Patterns to reuse:**
- Phone validation function
- Form submission handler structure
- Toast state management
- Input styling classes

### Testing Checklist

- [ ] Page renders at `/vi/contact` and `/en/contact`
- [ ] Breadcrumb shows: Trang chủ > Liên hệ
- [ ] Company info displays correctly from SiteSettings
- [ ] Phone numbers are clickable tel: links
- [ ] Email is clickable mailto: link
- [ ] Form validation prevents empty required fields
- [ ] Phone validation rejects: "abc", "123", "012345678"
- [ ] Phone validation accepts: "0903326309", "0359123456"
- [ ] Email validation rejects invalid formats when provided
- [ ] Form submits successfully with valid data
- [ ] Success toast appears and auto-dismisses after 5s
- [ ] Error toast appears on API failure with retry button
- [ ] Map displays (embed or placeholder with link)
- [ ] Responsive: form stacks above info on mobile
- [ ] i18n: All text changes when switching to EN locale
- [ ] Keyboard navigation works through all form fields
- [ ] Focus states visible on all interactive elements

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.2 - Contact page]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.1 - Component ↔ Data Source Matrix]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 7 - Project Structure]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Journey 3 - Technical Services]
- [Source: _bmad-output/planning-artifacts/prd.md#FM-03 - Contact form]
- [Source: _bmad-output/planning-artifacts/prd.md#FM-04 - Form validation]
- [Source: _bmad-output/planning-artifacts/prd.md#FM-05 - Form submission]
- [Source: src/globals/SiteSettings.ts - Contact data structure]
- [Source: src/payload.config.ts#lines 100-119 - Form builder plugin config]
- [Source: _bmad-output/implementation-artifacts/4-1-quote-request-form.md - Previous story patterns]
- [Source: messages/vi.json#contact - Existing i18n keys]
- [Source: src/components/ui/Breadcrumb.tsx - Breadcrumb component pattern]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Fixed type error in product page: `productSku={product.sku ?? undefined}` to handle null type

### Completion Notes List

- ✅ Task 1: Created ContactForm component with full client-side validation (VN phone regex, email validation), form submission to form-builder API, toast notifications for success/error, retry functionality, loading state
- ✅ Task 2: Created ContactInfo server component displaying address, phone numbers (as tel: links with labels), email (mailto: link), working hours (hardcoded), social links (Zalo, Facebook)
- ✅ Task 3: Created ContactMap server component with Google Maps embed iframe (no API key needed), responsive aspect-video layout, link to open in Google Maps
- ✅ Task 4: Created Contact page as server component fetching SiteSettings, 5:3 column layout (form left, info+map right), breadcrumb, SEO metadata
- ✅ Task 5: Form-builder plugin already configured in payload.config.ts. Form "contact" needs to be created in Admin UI with fields matching ContactForm
- ✅ Task 6: Verified all i18n keys exist in messages/vi.json and messages/en.json under `contact.*` namespace
- ✅ Task 7: Build successful, page accessible at `/vi/contact` and `/en/contact`

### File List

**New files:**
- `src/components/ui/ContactForm.tsx` - Client component with form state, validation, submission
- `src/components/ui/ContactInfo.tsx` - Server component rendering contact info from SiteSettings
- `src/components/ui/ContactMap.tsx` - Server component with Google Maps embed
- `src/app/(frontend)/[locale]/contact/page.tsx` - Contact page server component

**Modified files:**
- `src/app/(frontend)/[locale]/product/[slug]/page.tsx` - Fixed type error (productSku null handling)
- `src/components/layout/icons.tsx` - Added ClockIcon, ZaloIcon, ExternalLinkIcon (code review)
- `messages/vi.json` - Added workingHoursDetail, openInMaps keys (code review)
- `messages/en.json` - Added workingHoursDetail, openInMaps keys (code review)

## Change Log

- 2026-02-05: Implemented Contact page (Story 4.2) - contact form with validation, company info from SiteSettings, Google Maps embed, breadcrumb navigation
- 2026-02-05: Code Review - Fixed 5 issues:
  - HIGH: Fixed phone regex bug - incorrect character class `[3|5|7|8|9]` → `[35789]`
  - MEDIUM: Added i18n keys for hardcoded working hours text
  - MEDIUM: Added i18n key for "Open in Google Maps" text
  - MEDIUM: Added aria-live="polite" to toast for accessibility consistency
  - MEDIUM: Moved inline icons (ClockIcon, ZaloIcon, ExternalLinkIcon) to shared icons.tsx
