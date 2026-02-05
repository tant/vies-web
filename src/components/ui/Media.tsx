'use client'

import Image from 'next/image'
import type { Media as MediaType } from '@/payload-types'
import { getMediaUrl, isMediaObject } from '@/lib/media/getMediaUrl'

type MediaSize = 'thumbnail' | 'medium' | 'large'

interface MediaProps {
  /** Media resource - can be populated Media object, ID, or null */
  resource: MediaType | number | string | null | undefined
  /** Use fill mode (requires parent with position: relative) */
  fill?: boolean
  /** Responsive sizes attribute for fill mode */
  sizes?: string
  /** Fixed width (ignored if fill=true) */
  width?: number
  /** Fixed height (ignored if fill=true) */
  height?: number
  /** Mark as priority/LCP image */
  priority?: boolean
  /** Class for the wrapper div (fill mode) or the img element */
  className?: string
  /** Class for the img element (fill mode only) */
  imgClassName?: string
  /** Alt text override */
  alt?: string
  /** Preferred image size from PayloadCMS */
  preferredSize?: MediaSize
  /** Image quality (1-100), defaults to Next.js default (75) */
  quality?: number
}

/**
 * Media component wrapper for Next.js Image with PayloadCMS Media
 * Follows PayloadCMS official template patterns
 */
export function Media({
  resource,
  fill,
  sizes,
  width,
  height,
  priority = false,
  className,
  imgClassName,
  alt: altOverride,
  preferredSize = 'medium',
  quality,
}: MediaProps) {
  // Handle non-populated relations (ID only) or null/undefined
  if (!isMediaObject(resource)) {
    return null
  }

  const media = resource
  const src = getMediaUrl(media, preferredSize)
  const altText = altOverride ?? media.alt ?? ''

  if (!src) return null

  // Blur placeholder support - PayloadCMS doesn't generate blur by default
  // but we support it if present in the media object
  const blurDataURL = (media as MediaType & { blurDataURL?: string }).blurDataURL

  if (fill) {
    return (
      <div className={className}>
        <Image
          src={src}
          alt={altText}
          fill
          sizes={sizes ?? '100vw'}
          priority={priority}
          className={imgClassName}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          quality={quality}
        />
      </div>
    )
  }

  // Fixed dimensions mode
  const imgWidth = width ?? media.width ?? 400
  const imgHeight = height ?? media.height ?? 300

  return (
    <Image
      src={src}
      alt={altText}
      width={imgWidth}
      height={imgHeight}
      priority={priority}
      className={className}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      quality={quality}
    />
  )
}
