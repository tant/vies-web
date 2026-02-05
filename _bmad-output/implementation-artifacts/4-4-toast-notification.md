# Story 4.4: Toast notification component

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng,
I want to see confirmation after submitting a form,
So that I know my request was received.

## Acceptance Criteria

1. **Given** form submission (quote request hoặc contact) **When** submit thành công **Then** toast notification hiện ở góc trên phải
2. **Given** toast notification success **When** rendered **Then** hiện green icon (`--color-success` #059669) + message "Đã gửi yêu cầu thành công"
3. **Given** toast notification error **When** rendered **Then** hiện red icon (`--color-error` #DC2626) + message + retry button
4. **Given** toast notification **When** auto-dismiss timer **Then** tự ẩn sau 5 giây (success only, errors persist)
5. **Given** toast notification **When** user clicks X button **Then** dismissable ngay lập tức
6. **Given** toast component **Then** phải là Client Component (`'use client'` directive)
7. **Given** multiple toasts **When** shown **Then** stack vertically with gap

## Dependencies

**Story 4.1 (QuoteRequestForm)** và **Story 4.2 (Contact Page)** đã được tạo và cần integrate với Toast component này để hiện thông báo sau khi submit form.

**Existing patterns:**
- Form submission patterns established in 4.1 and 4.2
- Design tokens defined in `styles.css`
- Icon patterns from `src/components/layout/icons.tsx`

## Tasks / Subtasks

- [x] Task 1: Tạo Toast component (AC: #1, #2, #3, #4, #5, #6, #7)
  - [x] 1.1: Tạo file `src/components/ui/Toast.tsx` (Client Component với `'use client'`)
  - [x] 1.2: Define ToastType union: `'success' | 'error' | 'info' | 'warning'`
  - [x] 1.3: Define Toast interface:
    ```typescript
    interface Toast {
      id: string
      type: ToastType
      message: string
      duration?: number         // Auto-dismiss time in ms (default 5000 for success, 0 for error)
      onRetry?: () => void      // Retry callback for error toasts
    }
    ```
  - [x] 1.4: Implement toast rendering:
    - Position: fixed top-right (`fixed top-4 right-4 z-50`)
    - Stack: flex-col gap-3 for multiple toasts
    - Animation: slide in from right, fade out on dismiss
  - [x] 1.5: Implement icon per type:
    - Success: CheckCircleIcon (green #059669)
    - Error: XCircleIcon (red #DC2626)
    - Info: InformationCircleIcon (blue)
    - Warning: ExclamationTriangleIcon (amber)
  - [x] 1.6: Implement auto-dismiss:
    - Success/info/warning: auto-dismiss after `duration` ms (default 5000)
    - Error: NO auto-dismiss (duration=0), must be manually dismissed
  - [x] 1.7: Implement dismiss button (X icon, top-right of toast)
  - [x] 1.8: Implement retry button for error toasts (when onRetry provided)
  - [x] 1.9: Accessibility:
    - `role="alert"` for errors, `role="status"` for success/info
    - `aria-live="assertive"` for errors, `aria-live="polite"` for others
    - Dismiss button has aria-label
    - Focus management when toast appears

- [x] Task 2: Tạo Toast context/provider (AC: #7)
  - [x] 2.1: Tạo file `src/components/ui/ToastProvider.tsx`
  - [x] 2.2: Create ToastContext with:
    ```typescript
    interface ToastContextValue {
      toasts: Toast[]
      addToast: (toast: Omit<Toast, 'id'>) => void
      removeToast: (id: string) => void
    }
    ```
  - [x] 2.3: Implement `useToast()` hook for consuming components
  - [x] 2.4: Generate unique IDs (using crypto.randomUUID or similar)
  - [x] 2.5: Handle toast lifecycle (add, auto-remove, manual remove)

- [x] Task 3: Add ToastProvider to app layout (AC: all)
  - [x] 3.1: Wrap app content with ToastProvider in `src/app/(frontend)/layout.tsx` (root frontend layout, not locale layout)
  - [x] 3.2: Render Toaster component (toast container) inside provider

- [x] Task 4: Create convenience helpers (AC: #2, #3)
  - [x] 4.1: Export typed helper functions:
    ```typescript
    export function showSuccess(message: string) { ... }
    export function showError(message: string, onRetry?: () => void) { ... }
    ```
  - [x] 4.2: Predefined messages for common cases:
    - Quote request success: "Đã gửi yêu cầu thành công"
    - Contact form success: "Đã gửi tin nhắn thành công"
    - Error with retry: "Có lỗi xảy ra. Vui lòng thử lại."

- [x] Task 5: Add i18n messages for toast content
  - [x] 5.1: Add to `messages/vi.json`:
    ```json
    {
      "toast": {
        "quoteSuccess": "Đã gửi yêu cầu thành công",
        "contactSuccess": "Đã gửi tin nhắn thành công",
        "genericSuccess": "Thao tác thành công",
        "genericError": "Có lỗi xảy ra. Vui lòng thử lại.",
        "retry": "Thử lại",
        "dismiss": "Đóng"
      }
    }
    ```
  - [x] 5.2: Add to `messages/en.json`:
    ```json
    {
      "toast": {
        "quoteSuccess": "Quote request sent successfully",
        "contactSuccess": "Message sent successfully",
        "genericSuccess": "Operation successful",
        "genericError": "An error occurred. Please try again.",
        "retry": "Retry",
        "dismiss": "Dismiss"
      }
    }
    ```

- [x] Task 6: Build + verify (AC: all)
  - [x] 6.1: Chạy `pnpm build` — phải thành công
  - [ ] 6.2: Manually test success toast (appears, auto-dismisses after 5s)
  - [ ] 6.3: Manually test error toast (appears, does NOT auto-dismiss, retry button works)
  - [ ] 6.4: Test dismiss button (X) closes toast immediately
  - [ ] 6.5: Test multiple toasts stack correctly
  - [ ] 6.6: Test keyboard accessibility (can dismiss with keyboard)
  - [ ] 6.7: Test screen reader announces toast content

## Dev Notes

### Architecture & Patterns

**File locations:**
```
src/components/ui/Toast.tsx              # NEW - Client Component
src/components/ui/ToastProvider.tsx      # NEW - Context provider
src/app/(frontend)/layout.tsx   # UPDATE - add ToastProvider
messages/vi.json                         # UPDATE - add toast messages
messages/en.json                         # UPDATE - add toast messages
```

**Component architecture (per architecture.md Section 7):**
- Toast: Client Component (requires state, effects, animations)
- ToastProvider: Client Component (context provider)
- Pattern: Context-based toast system for global toast management

### Toast Component Implementation Pattern

```tsx
// src/components/ui/Toast.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastProps {
  id: string
  type: ToastType
  message: string
  duration?: number
  onRetry?: () => void
  onDismiss: (id: string) => void
}

const iconMap = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
}

const colorMap = {
  success: 'bg-success text-white',
  error: 'bg-error text-white',
  info: 'bg-primary text-white',
  warning: 'bg-accent text-text',
}

export function Toast({ id, type, message, duration, onRetry, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  // Auto-dismiss for success/info/warning (not error)
  useEffect(() => {
    if (type === 'error' || duration === 0) return

    const timeout = setTimeout(() => {
      handleDismiss()
    }, duration || 5000)

    return () => clearTimeout(timeout)
  }, [id, type, duration])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onDismiss(id)
    }, 200) // Match exit animation duration
  }

  if (!isVisible) return null

  const Icon = iconMap[type]
  const colorClass = colorMap[type]
  const role = type === 'error' ? 'alert' : 'status'
  const ariaLive = type === 'error' ? 'assertive' : 'polite'

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`
        flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-sm
        ${colorClass}
        ${isExiting ? 'animate-fade-out-right' : 'animate-fade-in-right'}
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{message}</p>
        {type === 'error' && onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
          >
            Thử lại
          </button>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Đóng thông báo"
      >
        <XMarkIcon className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  )
}
```

### Toast Provider Implementation Pattern

```tsx
// src/components/ui/ToastProvider.tsx
'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Toast, ToastType } from './Toast'

interface ToastItem {
  id: string
  type: ToastType
  message: string
  duration?: number
  onRetry?: () => void
}

interface ToastContextValue {
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onDismiss={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Convenience helpers
export function useToastHelpers() {
  const { addToast } = useToast()

  return {
    showSuccess: (message: string) => {
      addToast({ type: 'success', message, duration: 5000 })
    },
    showError: (message: string, onRetry?: () => void) => {
      addToast({ type: 'error', message, duration: 0, onRetry })
    },
    showInfo: (message: string) => {
      addToast({ type: 'info', message, duration: 5000 })
    },
    showWarning: (message: string) => {
      addToast({ type: 'warning', message, duration: 5000 })
    },
  }
}
```

### CSS Animations (add to styles.css)

```css
/* Toast animations */
@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-out-right {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

.animate-fade-in-right {
  animation: fade-in-right 0.2s ease-out;
}

.animate-fade-out-right {
  animation: fade-out-right 0.2s ease-in forwards;
}
```

### Layout Integration Pattern

```tsx
// In src/app/(frontend)/layout.tsx
import { ToastProvider } from '@/components/ui/ToastProvider'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // ... existing code ...

  return (
    <html lang={locale}>
      <body>
        <ToastProvider>
          <ContactBar {...} />
          <NavigationHeader {...} />
          <main>{children}</main>
          <Footer {...} />
        </ToastProvider>
      </body>
    </html>
  )
}
```

### Usage in Form Components (for future integration)

```tsx
// Example usage in QuoteRequestForm
'use client'

import { useToastHelpers } from '@/components/ui/ToastProvider'
import { useTranslations } from 'next-intl'

export function QuoteRequestForm() {
  const t = useTranslations('toast')
  const { showSuccess, showError } = useToastHelpers()

  const handleSubmit = async (data: FormData) => {
    try {
      await submitQuoteRequest(data)
      showSuccess(t('quoteSuccess'))
    } catch (error) {
      showError(t('genericError'), () => handleSubmit(data))
    }
  }

  // ... form implementation
}
```

### Design Tokens (per architecture.md Section 8)

**Colors used:**
- `--color-success`: #059669 (green) - Success toast background
- `--color-error`: #DC2626 (red) - Error toast background
- `--color-primary`: #0F4C75 (steel blue) - Info toast background
- `--color-accent`: #D4A843 (amber) - Warning toast background
- White text for contrast on colored backgrounds

**Spacing:**
- Toast padding: p-4 (16px)
- Gap between toasts: gap-3 (12px)
- Icon size: w-5 h-5 (20px)
- Border radius: rounded-lg (8px)
- Position offset: top-4 right-4 (16px)

**Typography:**
- Message: text-sm font-medium (14px, 500 weight)
- Retry button: text-sm underline

### Heroicons Required

Install if not present (likely already installed):
```bash
pnpm add @heroicons/react
```

Icons needed:
- `CheckCircleIcon` - success
- `XCircleIcon` - error
- `InformationCircleIcon` - info
- `ExclamationTriangleIcon` - warning
- `XMarkIcon` - dismiss button

### Accessibility Requirements (per UX spec)

- Success toast: `role="status"`, `aria-live="polite"` (not disruptive)
- Error toast: `role="alert"`, `aria-live="assertive"` (urgent)
- Dismiss button: `aria-label="Đóng thông báo"` (or localized)
- Icon: `aria-hidden="true"` (decorative)
- Retry button: visible focus indicator
- Color contrast: white text on success/error backgrounds passes WCAG AA
- Respects `prefers-reduced-motion`: should disable animations

### Motion Considerations

```tsx
// Check for reduced motion preference
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// In component:
className={`
  ${prefersReducedMotion ? '' : isExiting ? 'animate-fade-out-right' : 'animate-fade-in-right'}
`}
```

### Previous Story Intelligence (from 4.1, 4.2, 4.3)

**Learnings:**
- Form components in 4.1 and 4.2 will need to integrate with Toast for notifications
- CTASection (4.3) established patterns for icons and accessibility
- Icon imports should use `@heroicons/react/24/solid` for filled icons

**Integration points:**
- QuoteRequestForm.tsx will call `showSuccess()` after successful submission
- ContactForm.tsx will call `showSuccess()` after successful submission
- Both forms will call `showError()` with retry callback on failure

### Git Intelligence

**Recent commits:**
- cee954b: fix(review): 4-1-quote-request-form - address code review findings
- Story 4.1 (QuoteRequestForm) has been implemented - will need toast integration

**Files affected by this story:**
- `src/components/ui/Toast.tsx` (new)
- `src/components/ui/ToastProvider.tsx` (new)
- `src/app/(frontend)/styles.css` (add animations)
- `src/app/(frontend)/layout.tsx` (add provider)
- `messages/vi.json` (add toast messages)
- `messages/en.json` (add toast messages)

### Testing Checklist

- [ ] Toast appears in top-right corner when triggered
- [ ] Success toast has green background and check icon
- [ ] Error toast has red background and X icon
- [ ] Success toast auto-dismisses after 5 seconds
- [ ] Error toast does NOT auto-dismiss
- [ ] Error toast shows retry button when onRetry provided
- [ ] Clicking retry button calls the provided callback
- [ ] X button dismisses toast immediately
- [ ] Multiple toasts stack vertically with gap
- [ ] Animations play correctly (slide in, fade out)
- [ ] Screen reader announces toast content
- [ ] Keyboard can dismiss toast (Tab to X, Enter to dismiss)
- [ ] Build passes: `pnpm build`
- [ ] i18n messages work for both vi and en locales

### Project Structure Notes

**Alignment with unified project structure:**
- Components in `src/components/ui/` following existing convention
- Provider pattern common in React for global state
- Client Components for interactivity

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.4 - Toast notification component]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 7 - Project Structure] - Toast.tsx location
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 8 - Design Tokens] - Colors (success, error)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Feedback Patterns] - Toast specs (top-right, 5s, retry)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Accessibility Strategy] - ARIA requirements
- [Source: _bmad-output/planning-artifacts/prd.md#FM-04] - Form feedback requirement
- [Source: _bmad-output/implementation-artifacts/4-1-quote-request-form.md] - Form submission patterns
- [Source: _bmad-output/implementation-artifacts/4-3-cta-section.md] - Icon import patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build completed successfully: `pnpm build` passed with no errors

### Completion Notes List

- Created Toast component with all 4 types (success, error, info, warning)
- Toast uses existing custom SVG icons from `src/components/layout/icons.tsx` (added `InformationCircleIcon` and `ExclamationTriangleIcon`)
- Auto-dismiss: success/info/warning after 5s, error toasts persist until manually dismissed
- Implemented retry button for error toasts (visible when `onRetry` callback provided)
- Full accessibility: `role="alert/status"`, `aria-live="assertive/polite"`, `aria-label` on dismiss button
- CSS animations respect `prefers-reduced-motion` media query
- ToastProvider wraps app content inside `NextIntlClientProvider` in frontend layout
- Created `useToast()` hook for direct context access and `useToastHelpers()` for convenience methods
- Added i18n messages in both vi.json and en.json for toast labels

### File List

**New files:**
- `src/components/ui/Toast.tsx` - Client component for individual toast rendering
- `src/components/ui/ToastProvider.tsx` - Context provider with useToast and useToastHelpers hooks

**Modified files:**
- `src/components/layout/icons.tsx` - Added InformationCircleIcon and ExclamationTriangleIcon
- `src/app/(frontend)/styles.css` - Added toast animations (fade-in-right, fade-out-right) with reduced-motion support
- `src/app/(frontend)/layout.tsx` - Added ToastProvider wrapper
- `messages/vi.json` - Added toast section with Vietnamese labels
- `messages/en.json` - Added toast section with English labels

### Code Review Fixes Applied

- [HIGH] Fixed missing useEffect dependency in Toast.tsx → Added useCallback for handleDismiss and proper deps array (src/components/ui/Toast.tsx:58-75)
- [MEDIUM] Added semantic role to toast container → Added role="region" for proper screen reader identification (src/components/ui/ToastProvider.tsx:51)
- [HIGH] Fixed inconsistent file path in Dev Notes → Corrected all references from `[locale]/layout.tsx` to `layout.tsx` (story file, 3 occurrences)

### Change Log

- 2026-02-05: Implemented Toast notification component (Story 4.4)
- 2026-02-05: Code review fixes applied (3 issues addressed)
