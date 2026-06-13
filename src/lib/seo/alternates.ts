import { locales } from '@/i18n/config'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vies.com.vn'

export function getHreflangAlternates(pagePath: string) {
  const languages: Record<string, string> = {}
  for (const loc of locales) {
    languages[loc] = `${siteUrl}/${loc}${pagePath}`
  }
  languages['x-default'] = `${siteUrl}/vi${pagePath}`
  return { languages }
}
