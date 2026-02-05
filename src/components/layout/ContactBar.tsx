import { formatTelHref } from '@/lib/utils'
import { PhoneIcon, MailIcon } from './icons'
import { LanguageSwitcher } from './LanguageSwitcher'

interface ContactBarProps {
  phones: Array<{ number: string; label?: string | null; id?: string | null }>
  email?: string | null
  topBarEnabled?: boolean | null
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
