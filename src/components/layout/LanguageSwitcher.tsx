'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { locales, localeDisplay, type Locale } from '@/i18n/config'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('aria')

  const getLocalizedHref = (targetLocale: Locale) => {
    const search = searchParams.toString()
    return `/${targetLocale}${pathname}${search ? `?${search}` : ''}`
  }

  return (
    <div className="flex items-center gap-1">
      {locales.map((loc) => {
        const display = localeDisplay[loc]
        const isActive = locale === loc
        return (
          <a
            key={loc}
            href={getLocalizedHref(loc)}
            className={`px-2 py-1 text-sm rounded transition-colors ${
              isActive
                ? 'bg-white/20 font-semibold'
                : 'hover:bg-white/10'
            }`}
            aria-label={t('switchTo', { language: display.label })}
            aria-current={isActive ? 'true' : undefined}
          >
            <span>{display.flag}</span>
            <span className="ml-1">{display.label}</span>
          </a>
        )
      })}
    </div>
  )
}
