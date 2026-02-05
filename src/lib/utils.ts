import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTelHref(number: string): string {
  const digits = number.replace(/[\s()+-]/g, '')
  if (digits.startsWith('84')) {
    return `tel:+${digits}`
  }
  return `tel:+84${digits.replace(/^0/, '')}`
}
