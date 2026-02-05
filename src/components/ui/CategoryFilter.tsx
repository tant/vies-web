'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

// Props interface (Task 1.2)
export interface CategoryFilterProps {
  brands: Array<{ id: number; name: string; slug: string }>
  categories: Array<{ id: number; name: string; slug: string; parent?: number | null }>
  activeFilters: {
    brands: string[] // slugs
    categories: string[] // slugs
  }
  locale: string
  totalProducts?: number
}

export function CategoryFilter({
  brands,
  categories,
  activeFilters,
  locale,
  totalProducts = 0,
}: CategoryFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    brands: true,
    categories: true,
  })
  const mobileSheetRef = useRef<HTMLDivElement>(null)
  const triggerButtonRef = useRef<HTMLButtonElement>(null)

  const hasActiveFilters =
    activeFilters.brands.length > 0 || activeFilters.categories.length > 0
  const activeCount = activeFilters.brands.length + activeFilters.categories.length

  // Keyboard handling and focus trap for mobile bottom sheet (Task 1.9 - Accessibility)
  useEffect(() => {
    if (!isMobileOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false)
        triggerButtonRef.current?.focus()
      }

      // Focus trap
      if (e.key === 'Tab' && mobileSheetRef.current) {
        const focusableElements = mobileSheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // Lock body scroll when mobile sheet is open
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    // Focus first focusable element in sheet
    const timer = setTimeout(() => {
      const closeButton = mobileSheetRef.current?.querySelector<HTMLButtonElement>('button')
      closeButton?.focus()
    }, 100)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
    }
  }, [isMobileOpen])

  // URL sync (Task 1.8)
  const handleFilterChange = useCallback(
    (type: 'brand' | 'category', slug: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString())
      const currentValues = params.get(type)?.split(',').filter(Boolean) || []

      if (checked) {
        currentValues.push(slug)
      } else {
        const index = currentValues.indexOf(slug)
        if (index > -1) currentValues.splice(index, 1)
      }

      if (currentValues.length > 0) {
        params.set(type, currentValues.join(','))
      } else {
        params.delete(type)
      }

      // Reset to page 1 when filters change
      params.delete('page')

      // Avoid trailing `?` when no params (M2 fix)
      const queryString = params.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    },
    [searchParams, router, pathname]
  )

  // Clear all filters (Task 1.6)
  const clearAllFilters = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  // Toggle filter group (Task 1.4)
  const toggleGroup = useCallback((group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }))
  }, [])

  // Helper to get display name
  const getBrandName = (slug: string) => brands.find((b) => b.slug === slug)?.name || slug
  const getCategoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name || slug

  // Filter content (shared between desktop and mobile)
  const filterContent = (
    <>
      {/* Active filters chips (Task 1.5) */}
      {hasActiveFilters && (
        <div className="pb-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2 mb-3">
            {activeFilters.brands.map((slug) => (
              <FilterChip
                key={`brand-${slug}`}
                label={getBrandName(slug)}
                onRemove={() => handleFilterChange('brand', slug, false)}
              />
            ))}
            {activeFilters.categories.map((slug) => (
              <FilterChip
                key={`category-${slug}`}
                label={getCategoryName(slug)}
                onRemove={() => handleFilterChange('category', slug, false)}
              />
            ))}
          </div>
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-primary transition-colors"
          >
            {locale === 'vi' ? 'Xóa tất cả' : 'Clear all'}
          </button>
        </div>
      )}

      {/* Brands filter group (Task 1.4) */}
      <FilterGroup
        title={locale === 'vi' ? 'Thương hiệu' : 'Brands'}
        isExpanded={expandedGroups.brands}
        onToggle={() => toggleGroup('brands')}
      >
        {brands.map((brand) => (
          <FilterCheckbox
            key={brand.id}
            id={`brand-${brand.slug}`}
            label={brand.name}
            checked={activeFilters.brands.includes(brand.slug)}
            onChange={(checked) => handleFilterChange('brand', brand.slug, checked)}
          />
        ))}
      </FilterGroup>

      {/* Categories filter group (Task 1.4) */}
      <FilterGroup
        title={locale === 'vi' ? 'Danh mục' : 'Categories'}
        isExpanded={expandedGroups.categories}
        onToggle={() => toggleGroup('categories')}
      >
        {categories.map((category) => (
          <FilterCheckbox
            key={category.id}
            id={`category-${category.slug}`}
            label={category.name}
            checked={activeFilters.categories.includes(category.slug)}
            onChange={(checked) => handleFilterChange('category', category.slug, checked)}
          />
        ))}
      </FilterGroup>
    </>
  )

  return (
    <>
      {/* Desktop sidebar (Task 1.3) */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-4">{filterContent}</div>
      </aside>

      {/* Mobile trigger button (Task 1.7) */}
      <div className="md:hidden mb-4">
        <button
          ref={triggerButtonRef}
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
          aria-expanded={isMobileOpen}
          aria-controls="mobile-filter-sheet"
        >
          <FilterIcon />
          {locale === 'vi' ? 'Bộ lọc' : 'Filters'}
          {activeCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile bottom sheet (Task 1.7) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-sheet-title"
          id="mobile-filter-sheet"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => {
              setIsMobileOpen(false)
              triggerButtonRef.current?.focus()
            }}
            aria-hidden="true"
          />

          {/* Sheet */}
          <div
            ref={mobileSheetRef}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-up"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 id="filter-sheet-title" className="font-semibold text-lg">
                {locale === 'vi' ? 'Bộ lọc' : 'Filters'}
              </h3>
              <button
                onClick={() => {
                  setIsMobileOpen(false)
                  triggerButtonRef.current?.focus()
                }}
                className="p-2 -mr-2 hover:bg-gray-100 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                aria-label={locale === 'vi' ? 'Đóng' : 'Close'}
              >
                <XIcon />
              </button>
            </div>

            {/* Filter content */}
            <div className="p-4 space-y-4">{filterContent}</div>

            {/* Footer with view results button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={() => {
                  setIsMobileOpen(false)
                  triggerButtonRef.current?.focus()
                }}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
              >
                {locale === 'vi'
                  ? `Xem ${totalProducts} sản phẩm`
                  : `View ${totalProducts} products`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Filter Group Component (Task 1.4)
function FilterGroup({
  title,
  isExpanded,
  onToggle,
  children,
}: {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 font-semibold text-gray-900 hover:text-primary focus-visible:outline-none focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded transition-colors"
        aria-expanded={isExpanded}
      >
        {title}
        <ChevronIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      {isExpanded && (
        <div className="mt-2 space-y-2" role="group" aria-label={title}>
          {children}
        </div>
      )}
    </div>
  )
}

// Filter Checkbox Component (Task 1.4)
function FilterCheckbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer py-1 hover:text-primary transition-colors"
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-primary accent-primary focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}

// Filter Chip Component (Task 1.5)
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
      {label}
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-primary/20 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        aria-label={`Remove ${label}`}
      >
        <XIcon className="w-3 h-3" />
      </button>
    </span>
  )
}

// Icons with aria-hidden for accessibility (M3 fix)
function FilterIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  )
}

function XIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}
