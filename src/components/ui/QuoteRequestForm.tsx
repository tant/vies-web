'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import { XIcon, CheckCircleIcon, XCircleIcon, LoadingSpinner } from '@/components/layout/icons'

interface QuoteRequestFormProps {
  productName: string
  productSku?: string
  locale: string
  onClose?: () => void
}

interface FormData {
  name: string
  phone: string
  email: string
  quantity: string
  note: string
}

interface FormErrors {
  name?: string
  phone?: string
  email?: string
}

interface ToastState {
  type: 'success' | 'error' | null
  message: string
  detail?: string
}

// Vietnamese mobile phone regex: 10 digits starting with 03x, 05x, 07x, 08x, 09x
const vnPhoneRegex = /^(0[35789])(\d{8})$/

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s-]/g, '')
  return vnPhoneRegex.test(cleaned)
}

const validateEmail = (email: string): boolean => {
  if (!email) return true // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function QuoteRequestForm({ productName, productSku, locale, onClose }: QuoteRequestFormProps) {
  const t = useTranslations('forms')

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    quantity: '',
    note: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<ToastState>({ type: null, message: '' })
  const [lastSubmittedData, setLastSubmittedData] = useState<FormData | null>(null)

  // Auto-dismiss success toast after 5 seconds
  useEffect(() => {
    if (toast.type === 'success') {
      const timer = setTimeout(() => {
        setToast({ type: null, message: '' })
        onClose?.()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [toast.type, onClose])

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = t('validation.required')
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('validation.required')
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = t('validation.invalidPhone')
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = t('validation.invalidEmail')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setLastSubmittedData(formData)

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: 'quote-request',
          submissionData: [
            { field: 'name', value: formData.name },
            { field: 'phone', value: formData.phone },
            { field: 'email', value: formData.email || '' },
            { field: 'quantity', value: formData.quantity || '' },
            { field: 'note', value: formData.note || '' },
            { field: 'productName', value: productName },
            { field: 'productSku', value: productSku || '' },
          ],
        }),
      })

      if (response.ok) {
        setToast({
          type: 'success',
          message: t('toast.success'),
          detail: t('toast.successDetail'),
        })
        // Reset form
        setFormData({ name: '', phone: '', email: '', quantity: '', note: '' })
      } else {
        const errorData = await response.json().catch(() => null)
        const errorMessage = errorData?.message || errorData?.errors?.[0]?.message
        throw new Error(errorMessage || 'Submission failed')
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: t('toast.error'),
        detail: error instanceof Error && error.message !== 'Submission failed'
          ? error.message
          : t('toast.errorDetail'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    if (lastSubmittedData) {
      setFormData(lastSubmittedData)
    }
    setToast({ type: null, message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const isFormValid = formData.name.trim() && formData.phone.trim()

  return (
    <div className="p-6">
      {/* Toast Notification */}
      {toast.type && (
        <div
          className={`fixed top-4 right-4 z-[60] p-4 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-success' : 'bg-error'
          } text-white max-w-sm`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            {toast.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <XCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="flex-1">
              <p className="font-medium">{toast.message}</p>
              {toast.detail && <p className="text-sm opacity-90 mt-1">{toast.detail}</p>}
              {toast.type === 'error' && (
                <button
                  onClick={handleRetry}
                  className="text-sm underline mt-2 hover:no-underline"
                >
                  {t('toast.retry')}
                </button>
              )}
            </div>
            <button
              onClick={() => setToast({ type: null, message: '' })}
              className="flex-shrink-0 hover:opacity-80"
              aria-label="Dismiss"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Form Header */}
      <h2 id="modal-title" className="text-xl font-bold text-text mb-4">
        {t('quoteRequest.title')}
      </h2>

      {/* Product Info (read-only) */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-text-muted mb-1">{t('quoteRequest.product')}</p>
        <p className="font-medium text-text">{productName}</p>
        {productSku && <p className="text-sm text-primary mt-1">{productSku}</p>}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
            {t('quoteRequest.name')} <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('quoteRequest.namePlaceholder')}
            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
              errors.name ? 'border-error' : 'border-border'
            }`}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-error text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text mb-1">
            {t('quoteRequest.phone')} <span className="text-error">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t('quoteRequest.phonePlaceholder')}
            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
              errors.phone ? 'border-error' : 'border-border'
            }`}
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="text-error text-sm mt-1">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Email Field (optional) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
            {t('quoteRequest.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('quoteRequest.emailPlaceholder')}
            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
              errors.email ? 'border-error' : 'border-border'
            }`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-error text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Quantity Field (optional) */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-text mb-1">
            {t('quoteRequest.quantity')}
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder={t('quoteRequest.quantityPlaceholder')}
            min="1"
            className="w-full px-4 py-3 border border-border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        {/* Notes Field (optional) */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-text mb-1">
            {t('quoteRequest.notes')}
          </label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder={t('quoteRequest.notesPlaceholder')}
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full px-6 py-3 bg-accent text-gray-900 font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          aria-disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner className="w-5 h-5" />
              {t('quoteRequest.submitting')}
            </>
          ) : (
            t('quoteRequest.submit')
          )}
        </button>
      </form>
    </div>
  )
}

// Modal wrapper component
interface QuoteRequestModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productSku?: string
  locale: string
}

export function QuoteRequestModal({
  isOpen,
  onClose,
  productName,
  productSku,
  locale,
}: QuoteRequestModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Handle client-side mounting for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }

      document.addEventListener('keydown', handleTab)
      firstElement?.focus()

      return () => {
        document.removeEventListener('keydown', handleTab)
      }
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          aria-label="Close"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <QuoteRequestForm
          productName={productName}
          productSku={productSku}
          locale={locale}
          onClose={onClose}
        />
      </div>
    </div>,
    document.body
  )
}

// Button component that triggers the modal
interface QuoteRequestButtonProps {
  productName: string
  productSku?: string
  locale: string
  label: string
  className?: string
}

export function QuoteRequestButton({
  productName,
  productSku,
  locale,
  label,
  className,
}: QuoteRequestButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClose = useCallback(() => {
    setIsModalOpen(false)
    // Return focus to trigger button for accessibility (WCAG 2.4.3)
    requestAnimationFrame(() => {
      buttonRef.current?.focus()
    })
  }, [])

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsModalOpen(true)}
        className={
          className ||
          'inline-flex items-center justify-center px-6 py-3 bg-accent text-gray-900 font-semibold rounded-lg hover:bg-accent/90 transition-colors'
        }
      >
        {label}
      </button>

      <QuoteRequestModal
        isOpen={isModalOpen}
        onClose={handleClose}
        productName={productName}
        productSku={productSku}
        locale={locale}
      />
    </>
  )
}
