import Link from 'next/link'
import Image from 'next/image'
import type { Product, Media as MediaType } from '@/payload-types'
import { Media } from './Media'

// Simplified interface for pre-processed product data (used by client components)
export interface ProductCardData {
  name: string
  slug: string
  sku?: string | null
  brand?: { name: string } | null
  image?: { url: string; alt?: string } | null
}

export interface ProductCardProps {
  product: Product | ProductCardData
  locale: string
}

// Type guard to check if product is full Product type
function isFullProduct(product: Product | ProductCardData): product is Product {
  return 'images' in product
}

export function ProductCard({ product, locale }: ProductCardProps) {
  let brandName: string | null = null
  let firstMediaImage: MediaType | null = null
  let preProcessedImageUrl: string | null = null
  let imageAlt: string = product.name

  if (isFullProduct(product)) {
    // Full Product type - extract from nested structures
    brandName =
      typeof product.brand === 'object' && product.brand ? product.brand.name : null

    const firstImage = product.images?.[0]?.image
    if (typeof firstImage === 'object' && firstImage) {
      firstMediaImage = firstImage
      imageAlt = firstImage.alt || product.name
    }
  } else {
    // Pre-processed ProductCardData - use directly
    brandName = product.brand?.name ?? null
    preProcessedImageUrl = product.image?.url ?? null
    imageAlt = product.image?.alt || product.name
  }

  // Determine if we have any image to show
  const hasImage = firstMediaImage || preProcessedImageUrl

  return (
    <article className="bg-white rounded border border-border overflow-hidden group hover:border-primary transition-colors duration-200">
      <Link href={`/${locale}/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center relative overflow-hidden">
          {firstMediaImage ? (
            <Media
              resource={firstMediaImage}
              width={400}
              height={300}
              preferredSize="thumbnail"
              className="w-full h-full object-cover"
              alt={imageAlt}
            />
          ) : preProcessedImageUrl ? (
            <Image
              src={preProcessedImageUrl}
              alt={imageAlt}
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <PlaceholderIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-1.5">
          {product.sku && (
            <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
              {product.sku}
            </span>
          )}
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          {brandName && <p className="text-sm text-gray-500">{brandName}</p>}
        </div>
      </Link>
    </article>
  )
}

function PlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )
}
