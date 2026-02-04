export const locales = ['vi', 'en', 'km'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'vi'

export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  km: 'ភាសាខ្មែរ',
}
