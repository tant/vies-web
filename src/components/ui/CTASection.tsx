import { useId } from 'react'
import { PhoneIcon } from '@/components/layout/icons'
import { formatTelHref } from '@/lib/utils'

interface CTASectionProps {
  title: string
  subtitle?: string
  phone: string
  zaloLink?: string
  callLabel: string
  zaloLabel: string
  className?: string
}

export function CTASection({
  title,
  subtitle,
  phone,
  zaloLink,
  callLabel,
  zaloLabel,
  className = '',
}: CTASectionProps) {
  // Generate unique ID for accessibility (supports multiple instances on same page)
  const headingId = useId()

  // Generate Zalo link from phone if not provided
  // Trim whitespace to handle edge cases
  const trimmedZaloLink = zaloLink?.trim()
  const finalZaloLink = trimmedZaloLink?.startsWith('http')
    ? trimmedZaloLink
    : trimmedZaloLink
      ? `https://zalo.me/${trimmedZaloLink}`
      : `https://zalo.me/${phone.replace(/\D/g, '')}`

  return (
    <section
      className={`py-16 lg:py-20 bg-primary text-white ${className}`}
      role="region"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-4 text-center">
        <h2
          id={headingId}
          className="text-2xl md:text-3xl font-bold mb-4"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {/* Phone CTA - Primary (Amber) */}
          <a
            href={formatTelHref(phone)}
            className="bg-accent hover:bg-accent/90 text-text px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <PhoneIcon className="w-5 h-5" aria-hidden="true" />
            {callLabel}
          </a>

          {/* Zalo CTA - Secondary (Transparent White) */}
          <a
            href={finalZaloLink}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {zaloLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
