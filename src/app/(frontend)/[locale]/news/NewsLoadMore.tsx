'use client'

import { useState, useTransition } from 'react'
import type { News } from '@/payload-types'
import { NewsCard } from '@/components/ui/NewsCard'
import { LoadingSpinner } from '@/components/layout/icons'

export interface NewsLoadMoreProps {
  initialNews: News[]
  initialHasNextPage: boolean
  locale: string
  loadMoreAction: (page: number, locale: string) => Promise<{ docs: News[]; hasNextPage: boolean }>
  loadMoreText: string
}

export function NewsLoadMore({
  initialNews,
  initialHasNextPage,
  locale,
  loadMoreAction,
  loadMoreText,
}: NewsLoadMoreProps) {
  const [news, setNews] = useState<News[]>(initialNews)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()

  const handleLoadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1
      const { docs, hasNextPage: morePages } = await loadMoreAction(nextPage, locale)
      setNews((prev) => [...prev, ...docs])
      setHasNextPage(morePages)
      setPage(nextPage)
    })
  }

  return (
    <>
      {/* News Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {news.map((item) => (
          <NewsCard key={item.id} news={item} locale={locale} />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="mt-xl text-center">
          <button
            onClick={handleLoadMore}
            disabled={isPending}
            className="px-lg py-md bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isPending ? (
              <>
                <LoadingSpinner className="w-5 h-5" />
                <span>...</span>
              </>
            ) : (
              loadMoreText
            )}
          </button>
        </div>
      )}
    </>
  )
}
