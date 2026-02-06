/**
 * Returns the default Open Graph image URL for pages without specific images.
 * Used for listing pages (products, services, news) and static pages.
 */
export function getDefaultOgImage(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'
  return `${siteUrl}/images/logo/vies-logo.jpg`
}
