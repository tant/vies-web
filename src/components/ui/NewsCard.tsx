import Link from 'next/link'
import type { News, Media as MediaType } from '@/payload-types'
import { CalendarIcon } from '@/components/layout/icons'
import { Media } from './Media'

export interface NewsCardProps {
  news: News
  locale: string
}

export function NewsCard({ news, locale }: NewsCardProps) {
  // Extract Media object from relationship
  const featuredImage =
    typeof news.featuredImage === 'object' && news.featuredImage
      ? (news.featuredImage as MediaType)
      : null

  // Date formatting using locale-appropriate format
  const formattedDate = news.publishedAt
    ? new Date(news.publishedAt).toLocaleDateString(
        locale === 'vi' ? 'vi-VN' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : null

  return (
    <article className="bg-white rounded-lg border border-border overflow-hidden group hover:border-primary transition-colors duration-200">
      <Link href={`/${locale}/news/${news.slug}`} className="block">
        {/* Image 16:9 aspect */}
        <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
          {featuredImage ? (
            <Media
              resource={featuredImage}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              preferredSize="medium"
              className="absolute inset-0"
              imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
              alt={news.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CalendarIcon className="w-16 h-16 text-gray-300" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-md">
          {formattedDate && (
            <time className="text-sm text-text-muted flex items-center gap-1 mb-2">
              <CalendarIcon className="w-4 h-4" aria-hidden="true" />
              {formattedDate}
            </time>
          )}
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {news.title}
          </h3>
          {news.excerpt && (
            <p className="text-text-muted line-clamp-3">
              {news.excerpt}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}
