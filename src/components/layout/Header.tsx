'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { locales, localeDisplay, type Locale } from '@/i18n/config'

export function Header() {
  const t = useTranslations('common')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const navigation = [
    { name: t('home'), href: `/${locale}` },
    { name: t('products'), href: `/${locale}/products` },
    { name: t('services'), href: `/${locale}/services` },
    { name: t('news'), href: `/${locale}/news` },
    { name: t('about'), href: `/${locale}/about` },
    { name: t('contact'), href: `/${locale}/contact` },
  ]

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
    setLangMenuOpen(false)
  }

  const currentDisplay = localeDisplay[locale as Locale]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:+84903326309" className="flex items-center gap-1 hover:text-primary-light transition-colors">
              <PhoneIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{locale === 'vi' ? 'Báo giá' : 'Quote'}: 0903 326 309</span>
            </a>
            <a href="tel:+84908748304" className="flex items-center gap-1 hover:text-primary-light transition-colors">
              <PhoneIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{locale === 'vi' ? 'Tư vấn' : 'Support'}: 0908 748 304</span>
            </a>
            <a href="mailto:info@v-ies.com" className="hidden md:flex items-center gap-1 hover:text-primary-light transition-colors">
              <MailIcon className="w-4 h-4" />
              <span>info@v-ies.com</span>
            </a>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-colors"
            >
              <span>{currentDisplay?.flag}</span>
              <span>{currentDisplay?.label}</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg py-1 min-w-[120px]">
                {locales.map((loc) => {
                  const display = localeDisplay[loc]
                  return (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className={cn(
                        'w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 transition-colors',
                        locale === loc ? 'bg-primary/10 text-primary' : 'text-gray-700'
                      )}
                    >
                      <span>{display.flag}</span>
                      <span>{display.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-primary">VIES</span>
              <span className="block text-xs text-gray-500 -mt-1">TRUST PARTNER</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={`/${locale}/contact`}
              className="bg-secondary hover:bg-secondary-dark text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
            >
              {t('contact')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-lg font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// Icons
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
