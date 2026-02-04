export const locales = ['vi', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'vi'

export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
}

export const localeDisplay: Record<Locale, { label: string; flag: string }> = {
  vi: { label: 'VI', flag: '🇻🇳' },
  en: { label: 'EN', flag: '🇺🇸' },
}
