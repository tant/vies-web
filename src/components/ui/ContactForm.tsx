'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { XIcon, CheckCircleIcon, XCircleIcon, LoadingSpinner } from '@/components/layout/icons'

interface ContactFormProps {
  locale: string
  onSuccess?: () => void
}

interface FormData {
  name: string
  phone: string
  email: string
  subject: string
  company: string
  message: string
}

interface FormErrors {
  name?: string
  phone?: string
  email?: string
  message?: string
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

const SUBJECT_OPTIONS = [
  { value: 'quote', labelKey: 'subjectQuote' },
  { value: 'info', labelKey: 'subjectInfo' },
  { value: 'support', labelKey: 'subjectSupport' },
  { value: 'partnership', labelKey: 'subjectPartnership' },
  { value: 'other', labelKey: 'subjectOther' },
]

export function ContactForm({ locale, onSuccess }: ContactFormProps) {
  const t = useTranslations('contact')
  const tForms = useTranslations('forms')
  const tAria = useTranslations('aria')

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    subject: '',
    company: '',
    message: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [consent, setConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<ToastState>({ type: null, message: '' })
  const [lastSubmittedData, setLastSubmittedData] = useState<FormData | null>(null)

  // Auto-dismiss success toast after 5 seconds
  useEffect(() => {
    if (toast.type === 'success') {
      const timer = setTimeout(() => {
        setToast({ type: null, message: '' })
        onSuccess?.()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [toast.type, onSuccess])

  const validateField = useCallback(
    (name: string, value: string): string | undefined => {
      switch (name) {
        case 'name':
          if (!value.trim()) return tForms('validation.required')
          return undefined
        case 'phone':
          if (!value.trim()) return tForms('validation.required')
          if (!validatePhone(value)) return tForms('validation.invalidPhone')
          return undefined
        case 'email':
          if (value && !validateEmail(value)) return tForms('validation.invalidEmail')
          return undefined
        case 'message':
          if (!value.trim()) return tForms('validation.required')
          return undefined
        default:
          return undefined
      }
    },
    [tForms],
  )

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    const fields: (keyof FormErrors)[] = ['name', 'phone', 'email', 'message']

    for (const field of fields) {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    }

    setErrors(newErrors)
    setTouched({ name: true, phone: true, email: true, message: true })
    return Object.keys(newErrors).length === 0
  }, [formData, validateField])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setLastSubmittedData(formData)

    try {
      // Look up form ID by title
      const formLookup = await fetch('/api/forms?where[title][equals]=Contact&limit=1')
      const formLookupData = await formLookup.json()
      const formId = formLookupData.docs?.[0]?.id
      if (!formId) throw new Error('Contact form not found')

      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: formId,
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

      if (response.ok || response.status === 201) {
        setToast({
          type: 'success',
          message: tForms('toast.success'),
          detail: tForms('toast.successDetail'),
        })
        setFormData({ name: '', phone: '', email: '', subject: '', company: '', message: '' })
        setTouched({})
        setErrors({})
        setConsent(false)
      } else {
        throw new Error('Submission failed')
      }
    } catch {
      setToast({
        type: 'error',
        message: tForms('toast.error'),
        detail: tForms('toast.errorDetail'),
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const isFormValid =
    formData.name.trim() &&
    formData.phone.trim() &&
    validatePhone(formData.phone) &&
    formData.message.trim() &&
    validateEmail(formData.email) &&
    consent

  return (
    <div>
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
                  {tForms('toast.retry')}
                </button>
              )}
            </div>
            <button
              onClick={() => setToast({ type: null, message: '' })}
              className="flex-shrink-0 hover:opacity-80"
              aria-label={tAria('dismiss')}
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
            {t('name')} <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t('namePlaceholder')}
            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
              errors.name && touched.name ? 'border-error' : 'border-border'
            }`}
            aria-required="true"
            aria-invalid={!!(errors.name && touched.name)}
            aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
          />
          {errors.name && touched.name && (
            <p id="name-error" className="text-error text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text mb-1">
            {tForms('quoteRequest.phone')} <span className="text-error">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t('phonePlaceholder')}
            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
              errors.phone && touched.phone ? 'border-error' : 'border-border'
            }`}
            aria-required="true"
            aria-invalid={!!(errors.phone && touched.phone)}
            aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
          />
          {errors.phone && touched.phone && (
            <p id="phone-error" className="text-error text-sm mt-1">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Email Field (optional) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
            {tForms('quoteRequest.email')}
          </label>
          <input
            type="text"
            inputMode="email"
            autoComplete="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t('emailPlaceholder')}
            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
              errors.email && touched.email ? 'border-error' : 'border-border'
            }`}
            aria-invalid={!!(errors.email && touched.email)}
            aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
          />
          {errors.email && touched.email && (
            <p id="email-error" className="text-error text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Subject Field (optional) */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-text mb-1">
            {t('subject')}
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
          >
            <option value="">{t('selectSubject')}</option>
            {SUBJECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </select>
        </div>

        {/* Company Field (optional) */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-text mb-1">
            {t('company')}
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder={t('companyPlaceholder')}
            className="w-full px-4 py-3 border border-border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text mb-1">
            {t('message')} <span className="text-error">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t('messagePlaceholder')}
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none ${
              errors.message && touched.message ? 'border-error' : 'border-border'
            }`}
            aria-required="true"
            aria-invalid={!!(errors.message && touched.message)}
            aria-describedby={errors.message && touched.message ? 'message-error' : undefined}
          />
          {errors.message && touched.message && (
            <p id="message-error" className="text-error text-sm mt-1">
              {errors.message}
            </p>
          )}
        </div>

        {/* Consent (PDPD - Nghị định 13/2023) */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-primary"
            aria-required="true"
          />
          <label htmlFor="consent" className="text-sm text-text-muted leading-snug">
            {tForms.rich('consent.label', {
              link: (chunks) => (
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-primary underline hover:no-underline"
                >
                  {chunks}
                </Link>
              ),
            })}
          </label>
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
              {tForms('quoteRequest.submitting')}
            </>
          ) : (
            t('submit')
          )}
        </button>
      </form>
    </div>
  )
}
