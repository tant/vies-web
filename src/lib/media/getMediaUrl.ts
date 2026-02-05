import type { Media } from '@/payload-types'

const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || ''

type MediaSize = 'thumbnail' | 'medium' | 'large'

/**
 * Get the best available URL from a Media object
 * Falls back through size hierarchy: preferred → medium → thumbnail → original
 */
export function getMediaUrl(
  media: Media | null | undefined,
  preferredSize: MediaSize = 'medium'
): string | null {
  if (!media || typeof media !== 'object') return null

  const sizes = media.sizes
  let url: string | null | undefined

  // Try preferred size first, then fallback chain
  if (preferredSize === 'large') {
    url = sizes?.large?.url ?? sizes?.medium?.url ?? media.url
  } else if (preferredSize === 'thumbnail') {
    url = sizes?.thumbnail?.url ?? media.url
  } else {
    // medium (default)
    url = sizes?.medium?.url ?? sizes?.large?.url ?? media.url
  }

  if (!url) return null

  // Convert relative URL to full URL
  const fullUrl = url.startsWith('/') ? `${MEDIA_BASE_URL}${url}` : url

  // Add cache busting using updatedAt timestamp
  const updatedAt = media.updatedAt
  if (updatedAt) {
    const separator = fullUrl.includes('?') ? '&' : '?'
    return `${fullUrl}${separator}v=${new Date(updatedAt).getTime()}`
  }

  return fullUrl
}

/**
 * Check if a resource is a populated Media object
 */
export function isMediaObject(
  resource: Media | number | string | null | undefined
): resource is Media {
  return typeof resource === 'object' && resource !== null && 'url' in resource
}
