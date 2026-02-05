'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/ui/ProductCard'
import { LoadingSpinner } from '@/components/layout/icons'
import { cn } from '@/lib/utils'

interface ProductResult {
  id: number
  name: string
  slug: string
  sku: string | null
  brand: { id: number; name: string } | null
  image: { url: string; alt?: string } | null
}

interface SearchResultsProps {
  initialResults: ProductResult[]
  totalDocs: number
  query: string
  locale: string
}

export function SearchResults({
  initialResults,
  totalDocs,
  query,
  locale,
}: SearchResultsProps) {
  const t = useTranslations('common')
  const [results, setResults] = useState(initialResults)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const hasMore = results.length < totalDocs

  const loadMore = async () => {
    setIsLoading(true)
    setError(false)
    try {
      const nextPage = page + 1
      const res = await fetch(
        `/api/search-page?q=${encodeURIComponent(query)}&page=${nextPage}&locale=${locale}`
      )
      if (!res.ok) {
        throw new Error('Failed to fetch')
      }
      const data = await res.json()
      if (data.results && data.results.length > 0) {
        setResults((prev) => [...prev, ...data.results])
        setPage(nextPage)
      }
    } catch {
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 text-center text-red-600 text-sm">
          {t('noResults')}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            disabled={isLoading}
            className={cn(isLoading && 'opacity-70')}
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="w-4 h-4 mr-2" />
                {t('loading')}
              </>
            ) : (
              t('loadMore')
            )}
          </Button>
        </div>
      )}
    </>
  )
}
