import { LanguageSwitcher } from './LanguageSwitcher'

interface ContactBarProps {
  phones: Array<{ number: string; label?: string | null; id?: string | null }>
  email?: string | null
  topBarEnabled?: boolean | null
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

function formatTelHref(number: string): string {
  const digits = number.replace(/\s/g, '')
  return `tel:+84${digits.replace(/^0/, '')}`
}

export function ContactBar({ phones, email, topBarEnabled }: ContactBarProps) {
  if (topBarEnabled === false) return null

  return (
    <div className="bg-primary text-white text-sm">
      <div className="mx-auto max-w-[var(--container-max)] px-md py-xs flex justify-between items-center">
        <div className="flex items-center gap-md">
          {phones.map((phone, index) => (
            <a
              key={phone.id ?? index}
              href={formatTelHref(phone.number)}
              className="flex items-center gap-xs hover:text-primary-light transition-colors"
              aria-label={phone.label ?? phone.number}
            >
              <PhoneIcon className="w-4 h-4" />
              <span className="hidden sm:inline">
                {phone.label}: {phone.number}
              </span>
            </a>
          ))}
          {email && (
            <a
              href={`mailto:${email}`}
              className="hidden md:flex items-center gap-xs hover:text-primary-light transition-colors"
            >
              <MailIcon className="w-4 h-4" />
              <span>{email}</span>
            </a>
          )}
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  )
}
