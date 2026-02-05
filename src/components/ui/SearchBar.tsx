'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SearchIcon } from '@/components/layout/icons'

interface SearchResult {
  id: number
  name: string
  sku: string | null
  slug: string
  brand: string | null
  thumbnail: string | null
}

interface SearchBarProps {
  variant?: 'header' | 'hero'
  className?: string
  consultPhone?: string
}

export function SearchBar({ variant = 'header', className, consultPhone = '0908748304' }: SearchBarProps) {
  const t = useTranslations('search')
  const locale = useLocale()
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const listboxId = 'search-listbox'

  // Total items: results + "view all" link (if results exist)
  const totalItems = results.length > 0 ? results.length + 1 : 0

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setHighlightedIndex(-1)
  }, [])

  const navigateToProduct = useCallback(
    (slug: string) => {
      closeDropdown()
      setQuery('')
      router.push(`/product/${slug}`)
    },
    [router, closeDropdown],
  )

  const navigateToSearch = useCallback(() => {
    if (!query.trim()) return
    closeDropdown()
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }, [router, query, closeDropdown])

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
      setIsOpen(false)
      setIsLoading(false)
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
        const data = await res.json()
        setResults(data.results ?? [])
        setIsOpen(true)
        setHighlightedIndex(-1)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setResults([])
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

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeDropdown])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || totalItems === 0) {
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
      case 'Escape':
        e.preventDefault()
        closeDropdown()
        inputRef.current?.blur()
        break
    }
  }

  const isHero = variant === 'hero'
  const placeholder = isHero ? t('placeholderHero') : t('placeholder')

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <SearchIcon
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none',
            isHero ? 'w-6 h-6' : 'w-5 h-5',
          )}
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            highlightedIndex >= 0 ? `search-option-${highlightedIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-label={t('placeholder')}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0 && query.trim().length >= 2) {
              setIsOpen(true)
            }
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full border border-border rounded-md bg-white text-text',
            'placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
            'transition-colors',
            isHero
              ? 'pl-12 pr-4 py-4 text-lg rounded-lg'
              : 'pl-10 pr-4 py-2 text-sm',
          )}
        />
        {isLoading && (
          <div
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              isHero ? 'w-5 h-5' : 'w-4 h-4',
            )}
          >
            <div className="w-full h-full border-2 border-border border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          id={listboxId}
          role="listbox"
          aria-label={t('placeholder')}
          className={cn(
            'absolute z-50 left-0 right-0 mt-1',
            'bg-white border border-border rounded-md shadow-lg',
            'max-h-[400px] overflow-y-auto',
          )}
        >
          {results.length > 0 ? (
            <>
              {results.map((result, index) => (
                <button
                  key={result.id}
                  id={`search-option-${index}`}
                  role="option"
                  aria-selected={highlightedIndex === index}
                  onClick={() => navigateToProduct(result.slug)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
                    highlightedIndex === index
                      ? 'bg-primary-light'
                      : 'hover:bg-primary-light',
                  )}
                >
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded bg-bg-alt flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {result.thumbnail ? (
                      <Image
                        src={result.thumbnail}
                        alt={result.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <GearIcon className="w-5 h-5 text-text-muted" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-text text-sm truncate">{result.name}</div>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      {result.sku && <span>{result.sku}</span>}
                      {result.sku && result.brand && <span>·</span>}
                      {result.brand && <span>{result.brand}</span>}
                    </div>
                  </div>
                </button>
              ))}

              {/* View all results link */}
              <button
                id={`search-option-${results.length}`}
                role="option"
                aria-selected={highlightedIndex === results.length}
                onClick={navigateToSearch}
                onMouseEnter={() => setHighlightedIndex(results.length)}
                className={cn(
                  'w-full px-3 py-2.5 text-sm font-medium text-primary text-center',
                  'border-t border-border transition-colors',
                  highlightedIndex === results.length
                    ? 'bg-primary-light'
                    : 'hover:bg-primary-light',
                )}
              >
                {t('viewAllResults')} →
              </button>
            </>
          ) : (
            /* No results */
            <div className="px-4 py-6 text-center">
              <p className="text-text-muted text-sm">{t('noResults')}</p>
              <p className="text-text-muted text-xs mt-1">
                {t('noResultsHint', { phone: consultPhone })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}
