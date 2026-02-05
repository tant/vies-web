'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SearchIcon, XIcon, GearIcon } from '@/components/layout/icons'

interface SearchResult {
  id: number
  name: string
  sku: string | null
  slug: string
  brand: string | null
  thumbnail: string | null
}

interface MobileSearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  consultPhone?: string
}

export function MobileSearchOverlay({
  isOpen,
  onClose,
  consultPhone = '0908748304',
}: MobileSearchOverlayProps) {
  const t = useTranslations('search')
  const locale = useLocale()
  const router = useRouter()

  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [isClosing, setIsClosing] = useState(false)
  const [hasError, setHasError] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const listboxId = 'mobile-search-listbox'

  // Total items: results + "view all" link (if results exist)
  const totalItems = results.length > 0 ? results.length + 1 : 0

  const closeOverlay = useCallback(() => {
    setIsClosing(true)
    // Wait for slide-down animation to finish
    setTimeout(() => {
      setIsClosing(false)
      setQuery('')
      setResults([])
      setHighlightedIndex(-1)
      onClose()
    }, 250)
  }, [onClose])

  const navigateToProduct = useCallback(
    (slug: string) => {
      closeOverlay()
      router.push(`/product/${slug}`)
    },
    [router, closeOverlay],
  )

  const navigateToSearch = useCallback(() => {
    if (!query.trim()) return
    closeOverlay()
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }, [router, query, closeOverlay])

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen && !isClosing) {
      // Store previous focus element
      previousFocusRef.current = document.activeElement as HTMLElement
      // Small delay for animation to start
      const timeout = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timeout)
    }
  }, [isOpen, isClosing])

  // Restore focus when closed
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [isOpen])

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeOverlay()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeOverlay])

  // Focus trap within overlay
  useEffect(() => {
    if (!isOpen || !overlayRef.current) return

    const focusableSelector =
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      const focusableElements =
        overlayRef.current?.querySelectorAll<HTMLElement>(focusableSelector)
      if (!focusableElements || focusableElements.length === 0) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]

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
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Fetch search results with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    if (abortRef.current) {
      abortRef.current.abort()
    }

    if (query.trim().length < 2) {
      setResults([])
      setIsLoading(false)
      setHasError(false)
      return
    }

    setIsLoading(true)

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}&locale=${locale}`,
          { signal: controller.signal },
        )
        if (!res.ok) {
          throw new Error(`Search failed: ${res.status}`)
        }
        const data = await res.json()
        setResults(data.results ?? [])
        setHighlightedIndex(-1)
        setHasError(false)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setResults([])
        setHasError(true)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      if (abortRef.current) {
        abortRef.current.abort()
      }
    }
  }, [query, locale])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (totalItems === 0) {
      if (e.key === 'Enter') {
        e.preventDefault()
        navigateToSearch()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % totalItems)
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev - 1 + totalItems) % totalItems)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          navigateToProduct(results[highlightedIndex].slug)
        } else if (highlightedIndex === results.length) {
          navigateToSearch()
        } else {
          navigateToSearch()
        }
        break
    }
  }

  if (!isOpen && !isClosing) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('mobileOverlay.title')}
      className={cn(
        'fixed inset-0 z-[60] bg-white flex flex-col',
        isClosing ? 'animate-slide-down' : 'animate-slide-up',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-md py-3 border-b border-border">
        <h2 className="font-medium text-text">{t('mobileOverlay.title')}</h2>
        <button
          onClick={closeOverlay}
          className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={t('mobileOverlay.close')}
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Search input */}
      <div className="px-md py-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listboxId}
            aria-activedescendant={
              highlightedIndex >= 0 ? `mobile-search-option-${highlightedIndex}` : undefined
            }
            aria-autocomplete="list"
            aria-label={t('placeholder')}
            placeholder={t('placeholderHero')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              'w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-white text-text',
              'placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
              'transition-colors',
            )}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5">
              <div className="w-full h-full border-2 border-border border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {!isLoading && query.trim().length >= 2 && results.length > 0 && (
          <span>{t('resultsCount', { count: results.length, query: query.trim() })}</span>
        )}
        {!isLoading && query.trim().length >= 2 && results.length === 0 && !hasError && (
          <span>{t('noResults')}</span>
        )}
        {hasError && <span>{t('searching')}</span>}
      </div>

      {/* Results - full width */}
      <div
        id={listboxId}
        role="listbox"
        aria-label={t('placeholder')}
        className="flex-1 overflow-y-auto"
      >
        {query.trim().length >= 2 && results.length > 0 && (
          <>
            {results.map((result, index) => (
              <button
                key={result.id}
                id={`mobile-search-option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                onClick={() => navigateToProduct(result.slug)}
                className={cn(
                  'w-full flex items-center gap-3 px-md py-3 text-left transition-colors border-b border-border/50',
                  highlightedIndex === index ? 'bg-primary-light' : 'active:bg-primary-light',
                )}
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded bg-bg-alt flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {result.thumbnail ? (
                    <Image
                      src={result.thumbnail}
                      alt={result.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GearIcon className="w-6 h-6 text-text-muted" />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-text truncate">{result.name}</div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    {result.sku && <span>{result.sku}</span>}
                    {result.sku && result.brand && <span>·</span>}
                    {result.brand && <span>{result.brand}</span>}
                  </div>
                </div>
              </button>
            ))}

            {/* View all results link */}
            <button
              id={`mobile-search-option-${results.length}`}
              role="option"
              aria-selected={highlightedIndex === results.length}
              onClick={navigateToSearch}
              className={cn(
                'w-full px-md py-4 text-base font-medium text-primary text-center transition-colors',
                highlightedIndex === results.length ? 'bg-primary-light' : 'active:bg-primary-light',
              )}
            >
              {t('viewAllResults')} →
            </button>
          </>
        )}

        {/* Error state */}
        {hasError && query.trim().length >= 2 && !isLoading && (
          <div className="px-md py-8 text-center">
            <p className="text-error">{t('error')}</p>
            <p className="text-text-muted text-sm mt-2">
              {t('noResultsHint', { phone: consultPhone })}
            </p>
          </div>
        )}

        {/* No results */}
        {query.trim().length >= 2 && !isLoading && results.length === 0 && !hasError && (
          <div className="px-md py-8 text-center">
            <p className="text-text-muted">{t('noResults')}</p>
            <p className="text-text-muted text-sm mt-2">
              {t('noResultsHint', { phone: consultPhone })}
            </p>
          </div>
        )}

        {/* Initial state */}
        {query.trim().length < 2 && (
          <div className="px-md py-8 text-center">
            <p className="text-text-muted">{t('enterKeywords')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
