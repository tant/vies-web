import Link from 'next/link'
import type { Service } from '@/payload-types'
import { ArrowRightIcon, GearIcon } from '@/components/layout/icons'

export interface ServiceCardProps {
  service: Service
  locale: string
  viewDetailsText: string
}

export function ServiceCard({ service, locale, viewDetailsText }: ServiceCardProps) {
  // Extract image URL from Media relationship (same pattern as ProductCard/BrandPage)
  const imageUrl =
    typeof service.featuredImage === 'object' && service.featuredImage
      ? service.featuredImage.sizes?.medium?.url ?? service.featuredImage.url
      : null
  const imageAlt =
    typeof service.featuredImage === 'object' && service.featuredImage
      ? service.featuredImage.alt || service.title
      : service.title

  return (
    <article className="bg-white rounded-lg border border-border overflow-hidden group hover:border-primary transition-colors duration-200">
      <Link href={`/${locale}/services/${service.slug}`} className="block">
        {/* Image */}
        <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              width={640}
              height={360}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GearIcon className="w-16 h-16 text-gray-300" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-md">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {service.title}
          </h3>
          {service.excerpt && (
            <p className="text-text-muted line-clamp-3 mb-md">
              {service.excerpt}
            </p>
          )}
          <span className="inline-flex items-center gap-2 text-primary font-medium">
            {viewDetailsText}
            <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  )
}
