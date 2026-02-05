import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTelHref(number: string): string {
  const digits = number.replace(/\s/g, '')
  return `tel:+84${digits.replace(/^0/, '')}`
}
