'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { cn, formatTelHref } from '@/lib/utils'
import type { Header as HeaderType, SiteSetting, Media } from '@/payload-types'
import { PhoneIcon, MenuIcon, XIcon, ChevronDownIcon, SearchIcon } from './icons'
import { SearchBar } from '@/components/ui/SearchBar'

interface NavigationHeaderProps {
  headerData: HeaderType
  siteSettings: SiteSetting
}

function useFocusTrap(isActive: boolean, onEscape?: () => void) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    previousFocusRef.current = document.activeElement as HTMLElement

    const focusableSelector =
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    const focusableElements =
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelector)
    const firstElement = focusableElements[0]

    firstElement?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onEscape?.()
        return
      }

      if (e.key !== 'Tab') return

      const currentFocusable =
        containerRef.current?.querySelectorAll<HTMLElement>(focusableSelector)
      if (!currentFocusable || currentFocusable.length === 0) return

      const first = currentFocusable[0]
      const last = currentFocusable[currentFocusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [isActive, onEscape])

  return containerRef
}

export function Header({ headerData, siteSettings }: NavigationHeaderProps) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const navItems = headerData.navigation ?? []
  const logo = siteSettings.logo as Media | null
  const phones = siteSettings.contact?.phone ?? []

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
    setExpandedMobileItem(null)
  }, [])

  const menuPanelRef = useFocusTrap(mobileMenuOpen, closeMobileMenu)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [mobileMenuOpen])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-[var(--container-max)] px-md">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
            <div className="relative h-10 lg:h-14 w-10 lg:w-14">
              <Image
                src={logo?.url || '/images/logo/vies-logo.webp'}
                alt={logo?.alt || siteSettings.siteName || 'VIES'}
                fill
                sizes="(min-width: 1024px) 56px, 40px"
                className="object-contain"
                priority
              />
            </div>
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

          {/* Desktop: SearchBar + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <SearchBar variant="header" className="w-56 xl:w-64" consultPhone={phones[1]?.number ?? phones[0]?.number} />
            <Link
              href={`/${locale}/contact`}
              className="bg-accent hover:bg-accent/90 text-text px-5 py-2.5 rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              {t('contact')}
            </Link>
          </div>

          {/* Mobile: search icon + menu button */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={t('search' as any) ?? 'Search'}
            >
              <SearchIcon className="w-6 h-6" />
            </button>
            <button
              ref={hamburgerRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={mobileMenuOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={mobileMenuOpen}
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearchOpen && (
        <div className="lg:hidden border-t border-border px-md py-2 bg-white">
          <SearchBar variant="header" className="w-full" consultPhone={phones[1]?.number ?? phones[0]?.number} />
        </div>
      )}

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-in panel */}
      <div
        ref={menuPanelRef}
        className={cn(
          'fixed top-0 right-0 h-full w-[280px] max-w-[80vw] bg-white shadow-xl z-[60]',
          'flex flex-col',
          'transform transition-transform duration-300 ease-in-out lg:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label={t('navigationMenu')}
      >
        {/* Close button */}
        <div className="flex justify-end p-md">
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label={t('closeMenu')}
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-md">
          <div className="flex flex-col">
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
                      onClick={closeMobileMenu}
                      className={cn(
                        'flex-1 px-4 py-3 font-medium transition-colors',
                        isActive ? 'text-primary' : 'text-text hover:text-primary',
                      )}
                    >
                      {item.label}
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={() =>
                          setExpandedMobileItem(isExpanded ? null : (item.id ?? item.link))
                        }
                        className="p-3 hover:bg-gray-100 rounded-lg"
                        aria-expanded={isExpanded}
                        aria-label={t('expandSubmenu', { label: item.label })}
                      >
                        <ChevronDownIcon
                          className={cn(
                            'w-4 h-4 transition-transform duration-200',
                            isExpanded && 'rotate-180',
                          )}
                        />
                      </button>
                    )}
                  </div>

                  {/* Expandable children */}
                  {hasChildren && isExpanded && (
                    <div className="pl-6 pb-2">
                      {item.children!.map((child) => (
                        <Link
                          key={child.id ?? child.link}
                          href={`/${locale}${child.link}`}
                          onClick={closeMobileMenu}
                          className="block px-4 py-2 text-sm text-text-muted hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* Phone + CTA section */}
        <div className="mt-auto p-md border-t border-border">
          {phones.map((phone, index) => (
            <a
              key={phone.id ?? index}
              href={formatTelHref(phone.number)}
              className="flex items-center gap-sm py-2 text-text hover:text-primary transition-colors"
            >
              <PhoneIcon className="w-5 h-5" />
              <span>
                {phone.label ? `${phone.label}: ` : ''}
                {phone.number}
              </span>
            </a>
          ))}
          <Link
            href={`/${locale}/contact`}
            onClick={closeMobileMenu}
            className="mt-md block text-center bg-accent hover:bg-accent/90 text-text font-semibold py-3 rounded-md"
          >
            {t('contact')}
          </Link>
        </div>
      </div>
    </header>
  )
}
