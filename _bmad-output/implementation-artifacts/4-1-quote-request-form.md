# Story 4.1: QuoteRequestForm component

Status: done

## Story

As a kỹ sư bảo trì,
I want to request a quote for a product,
So that I can get pricing from VIES.

## Acceptance Criteria

1. **Given** product detail page **When** user click "Yêu cầu báo giá" **Then** form hiện ra (modal hoặc inline) với fields: tên (required), SĐT (required), email, số lượng, ghi chú
2. **Given** form render **When** form mở từ product context **Then** sản phẩm (tên + SKU) pre-filled từ context và hiển thị cho user xem (không editable)
3. **Given** user nhập form **When** submit **Then** client validation: required fields (tên, SĐT), phone format (VN mobile 10 digits), email format (if provided)
4. **Given** validation pass **When** submit **Then** POST to form-builder plugin endpoint `/api/form-submissions`
5. **Given** submit thành công **When** API trả về 201 **Then** toast "Đã gửi yêu cầu thành công" + đóng form
6. **Given** submit thất bại **When** API error **Then** toast error với retry button
7. **Given** form **When** render **Then** không yêu cầu đăng ký tài khoản, không CAPTCHA

## Tasks / Subtasks

- [x] Task 1: Tạo QuoteRequestForm component (AC: #1, #2, #3)
  - [x] 1.1: Tạo file `src/components/ui/QuoteRequestForm.tsx` (Client Component)
  - [x] 1.2: Props interface: `{ productName: string; productSku?: string; locale: string; onClose?: () => void }`
  - [x] 1.3: Form fields: tên (text, required), SĐT (tel, required), email (email, optional), số lượng (number, optional), ghi chú (textarea, optional)
  - [x] 1.4: Hiển thị product info (name + SKU) ở đầu form (read-only, không editable)
  - [x] 1.5: Client validation với native validation
  - [x] 1.6: Phone validation regex cho VN: `/^(0[3|5|7|8|9])([0-9]{8})$/`
  - [x] 1.7: Email validation chỉ khi user nhập (optional field)
  - [x] 1.8: Submit button disabled khi form invalid hoặc submitting
  - [x] 1.9: Loading state khi submitting

- [x] Task 2: Tích hợp form-builder plugin submission (AC: #4, #5, #6)
  - [x] 2.1: Submit handler: POST to `/api/form-submissions` với format form-builder
  - [x] 2.2: Handle success (201) → show success toast + close form
  - [x] 2.3: Handle error → show error toast with retry option

- [x] Task 3: Tạo Toast notification cơ bản (AC: #5, #6)
  - [x] 3.1: Inline toast state trong QuoteRequestForm component
  - [x] 3.2: Success toast: green bg, checkmark icon, auto-dismiss 5s
  - [x] 3.3: Error toast: red bg, error icon, retry button, không auto-dismiss
  - [x] 3.4: Position: fixed top-right
  - [x] 3.5: Dismissable bằng X button

- [x] Task 4: Tích hợp vào Product Detail Page (AC: #1)
  - [x] 4.1: Update `src/app/(frontend)/[locale]/product/[slug]/page.tsx`
  - [x] 4.2: Thay Link "Yêu cầu báo giá" bằng button mở modal
  - [x] 4.3: Tạo QuoteRequestButton và QuoteRequestModal components
  - [x] 4.4: Pass product name + SKU vào QuoteRequestForm
  - [x] 4.5: Modal với focus trap, backdrop click to close, escape key handling

- [x] Task 5: i18n translations (AC: all)
  - [x] 5.1: Verified existing translations in messages/vi.json và messages/en.json under `forms.quoteRequest`, `forms.validation`, `forms.toast`

- [x] Task 6: Build + verify (AC: all)
  - [x] 6.1: Chạy `pnpm build` — thành công

## Dev Notes

### Architecture & Patterns

**File locations:**
```
src/components/ui/QuoteRequestForm.tsx    # NEW - Client Component with modal
src/app/(frontend)/[locale]/product/[slug]/page.tsx  # UPDATE - integrate form
messages/vi.json                          # EXISTING - has quoteRequest translations
messages/en.json                          # EXISTING - has quoteRequest translations
```

**Component exports:**
- `QuoteRequestForm` - Main form component
- `QuoteRequestModal` - Modal wrapper with portal
- `QuoteRequestButton` - Button that triggers modal

### Phone Validation

Vietnamese mobile phone: 10 digits starting with 03x, 05x, 07x, 08x, 09x
```typescript
const vnPhoneRegex = /^(0[35789])(\d{8})$/
```

### Form Builder Integration

POST to `/api/form-submissions` with:
```json
{
  "form": "quote-request",
  "submissionData": [
    { "field": "name", "value": "..." },
    { "field": "phone", "value": "..." },
    { "field": "email", "value": "..." },
    { "field": "quantity", "value": "..." },
    { "field": "note", "value": "..." },
    { "field": "productName", "value": "..." },
    { "field": "productSku", "value": "..." }
  ]
}
```

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build successful: Next.js 16.1.6 compiled in 10.2s, 35 pages generated

### Completion Notes List

1. **Task 1 (QuoteRequestForm component):** Created comprehensive Client Component with form state management, validation, and submission handling. Includes QuoteRequestForm (main form), QuoteRequestModal (modal wrapper with portal), and QuoteRequestButton (trigger component).

2. **Task 2 (Form-builder integration):** Implemented POST to `/api/form-submissions` with proper format. Handles success (201) and error responses with appropriate toast notifications.

3. **Task 3 (Toast notification):** Implemented inline toast in QuoteRequestForm with success (green, auto-dismiss 5s) and error (red, retry button) variants. Position fixed top-right, dismissable via X button.

4. **Task 4 (Product Detail Page integration):** Replaced Link component with QuoteRequestButton. Product name and SKU passed as props. Modal includes focus trap, backdrop click to close, and Escape key handling.

5. **Task 5 (i18n translations):** Utilized existing translations in `forms.quoteRequest`, `forms.validation`, and `forms.toast` namespaces.

6. **Task 6 (Build + verify):** Build successful.

### Code Review Fixes Applied

1. **HIGH - Phone regex bug**: Fixed character class `[3|5|7|8|9]` → `[35789]` (QuoteRequestForm.tsx:36)
2. **MEDIUM - Response check**: Removed redundant `|| response.status === 201` (QuoteRequestForm.tsx:123)
3. **MEDIUM - Error parsing**: Added API error response parsing for better user feedback (QuoteRequestForm.tsx:131-139)
4. **MEDIUM - Focus management**: Added focus return to trigger button after modal close (QuoteRequestButton)
5. **LOW - productSku prop**: Changed `|| ''` to `?? undefined` for proper optional handling (page.tsx:184)
6. **LOW - Accessibility**: Added `aria-live="polite"` to toast for screen reader announcements (QuoteRequestForm.tsx:175)

**Note**: Form "quote-request" must be created in PayloadCMS Admin → Forms for AC #4 to work.

### File List

- src/components/ui/QuoteRequestForm.tsx (new, review fixes applied)
- src/components/layout/icons.tsx (modified - added XCircleIcon)
- src/app/(frontend)/[locale]/product/[slug]/page.tsx (modified - integrated QuoteRequestButton, review fixes applied)

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-05 | Implement QuoteRequestForm component with modal, toast, and product page integration (Story 4.1) | Dev Agent |
| 2026-02-05 | Code review: Fixed 6 issues (phone regex, response check, error parsing, focus management, productSku prop, aria-live) | Reviewer |
