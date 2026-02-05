'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Header as HeaderType, SiteSetting, Media } from '@/payload-types'

interface NavigationHeaderProps {
  headerData: HeaderType
  siteSettings: SiteSetting
}

export function Header({ headerData, siteSettings }: NavigationHeaderProps) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null)

  const navItems = headerData.navigation ?? []
  const logo = siteSettings.logo as Media | null
  const phones = siteSettings.contact?.phone ?? []

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-[var(--container-max)] px-md">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            {logo?.url ? (
              <Image
                src={logo.url}
                alt={logo.alt || siteSettings.siteName || 'VIES'}
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-xl text-primary">VIES</span>
                  <span className="block text-xs text-gray-500 -mt-1">TRUST PARTNER</span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const href = `/${locale}${item.link}`
              const isActive = pathname === href || pathname.startsWith(`${href}/`)
              const hasChildren = item.children && item.children.length > 0

              return (
                <div key={item.id ?? item.link} className="relative group">
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    aria-haspopup={hasChildren ? 'true' : undefined}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-100',
                    )}
                  >
                    {item.label}
                    {hasChildren && <ChevronDownIcon className="w-4 h-4" />}
                  </Link>

                  {/* Dropdown */}
                  {hasChildren && (
                    <div className="invisible group-hover:visible group-focus-within:visible opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 absolute top-full left-0 pt-1 py-2 bg-white rounded-md shadow-lg border border-border min-w-[160px] transition-opacity duration-150">
                      {item.children!.map((child) => {
                        const childHref = `/${locale}${child.link}`
                        const isChildActive = pathname === childHref || pathname.startsWith(`${childHref}/`)

                        return (
                          <Link
                            key={child.id ?? child.link}
                            href={childHref}
                            aria-current={isChildActive ? 'page' : undefined}
                            className={cn(
                              'block px-4 py-2 text-sm transition-colors',
                              isChildActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-text hover:bg-primary-light',
                            )}
                          >
                            {child.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={`/${locale}/contact`}
              className="bg-accent hover:bg-accent/90 text-text px-5 py-2.5 rounded-lg font-semibold transition-colors"
            >
              {t('contact')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={mobileMenuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={mobileMenuOpen}
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
              {navItems.map((item) => {
                const href = `/${locale}${item.link}`
                const isActive = pathname === href || pathname.startsWith(`${href}/`)
                const hasChildren = item.children && item.children.length > 0
                const isExpanded = expandedMobileItem === (item.id ?? item.link)

                return (
                  <div key={item.id ?? item.link}>
                    <div className="flex items-center">
                      <Link
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex-1 px-4 py-3 rounded-lg font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-700 hover:bg-gray-100',
                        )}
                      >
                        {item.label}
                      </Link>
                      {hasChildren && (
                        <button
                          onClick={() => setExpandedMobileItem(isExpanded ? null : (item.id ?? item.link))}
                          className="p-3 text-gray-500 hover:text-gray-700"
                          aria-label={t('expandSubmenu', { label: item.label })}
                          aria-expanded={isExpanded}
                        >
                          <ChevronDownIcon className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')} />
                        </button>
                      )}
                    </div>

                    {/* Expandable children */}
                    {hasChildren && isExpanded && (
                      <div className="ml-4">
                        {item.children!.map((child) => (
                          <Link
                            key={child.id ?? child.link}
                            href={`/${locale}${child.link}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Phone + CTA in mobile menu */}
            <div className="mt-4 pt-4 border-t flex flex-col gap-2">
              {phones.map((phone) => (
                <a
                  key={phone.id}
                  href={`tel:${phone.number.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  <PhoneIcon className="w-4 h-4" />
                  {phone.label ? <span>{phone.label}:</span> : null} {phone.number}
                </a>
              ))}
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-accent text-text text-center py-3 rounded-md font-semibold mx-4"
              >
                {t('contact')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}
