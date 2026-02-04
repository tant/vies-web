import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
})

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api (API routes)
    // - /admin (Payload admin)
    // - /_next (Next.js internals)
    // - /static (static files)
    // - .*\\..* (files with extensions)
    '/((?!api|admin|_next|static|.*\\..*).*)',
  ],
}
