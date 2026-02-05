'use client'

import { useState, useCallback } from 'react'
import type { Media } from '@/payload-types'

interface ProductGalleryProps {
  images: Array<{ image: number | Media | null; id?: string | null }>
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Extract valid Media objects from the images array
  const validImages = images
    .map((item) => (typeof item.image === 'object' ? item.image : null))
    .filter((img): img is Media => img !== null)

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (validImages.length <= 1) return

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
      }
    },
    [validImages.length]
  )

  // Show placeholder if no valid images
  if (validImages.length === 0) {
    return <GalleryPlaceholder productName={productName} />
  }

  const selectedImage = validImages[selectedIndex]
  const mainImageUrl = selectedImage?.sizes?.large?.url ?? selectedImage?.url

  return (
    <div className="space-y-md" onKeyDown={handleKeyDown} tabIndex={0} role="region" aria-label="Product image gallery">
      {/* Main Image Display */}
      <div id="main-product-image" className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {mainImageUrl ? (
          <img
            src={mainImageUrl}
            alt={selectedImage?.alt || productName}
            className="w-full h-full object-contain"
          />
        ) : (
          <GalleryPlaceholder productName={productName} />
        )}
      </div>

      {/* Thumbnail Navigation - only show if multiple images */}
      {validImages.length > 1 && (
        <div className="flex gap-sm overflow-x-auto pb-2 scrollbar-thin" role="tablist" aria-label="Image thumbnails">
          {validImages.map((image, index) => {
            const thumbnailUrl = image?.sizes?.thumbnail?.url ?? image?.url
            const isSelected = index === selectedIndex
            // Use image id for stable key, or generate from url hash as fallback
            const stableKey = image?.id ?? `img-${image?.url?.slice(-8) ?? index}`

            return (
              <button
                key={stableKey}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls="main-product-image"
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-colors ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-gray-300'
                }`}
                aria-label={`View image ${index + 1} of ${validImages.length}`}
              >
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <PlaceholderIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Keyboard hint for screen readers */}
      {validImages.length > 1 && (
        <p className="sr-only">Use left and right arrow keys to navigate between images</p>
      )}
    </div>
  )
}

function GalleryPlaceholder({ productName }: { productName: string }) {
  return (
    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center p-md">
        <div className="w-24 h-24 mx-auto mb-md bg-gray-200 rounded-full flex items-center justify-center">
          <PlaceholderIcon className="w-12 h-12 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">{productName}</p>
      </div>
    </div>
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
