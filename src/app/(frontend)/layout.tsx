import React from 'react'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Locale } from '@/i18n/config'
import { ContactBar } from '@/components/layout/ContactBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/ToastProvider'
import './styles.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'VIES - Vòng bi & Linh kiện công nghiệp',
    template: '%s | VIES',
  },
  description: 'VIES - Nhà phân phối vòng bi và linh kiện công nghiệp chính hãng SKF, FAG, NTN, TIMKEN tại Việt Nam',
  keywords: ['vòng bi', 'bearing', 'SKF', 'FAG', 'NTN', 'TIMKEN', 'công nghiệp', 'VIES'],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = (await getLocale()) as Locale
  const messages = await getMessages()

  const payload = await getPayload({ config: configPromise })

  const [siteSettings, headerData, footerData] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', locale, select: { contact: true, logo: true, siteName: true, social: true, favicon: true } }),
    payload.findGlobal({ slug: 'header', locale, select: { topBar: true, navigation: true } }),
    payload.findGlobal({ slug: 'footer', locale }),
  ])

  return (
    <html lang={locale} className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <ContactBar
              phones={siteSettings.contact?.phone ?? []}
              email={siteSettings.contact?.email}
              topBarEnabled={headerData.topBar?.enabled}
            />
            <Header headerData={headerData} siteSettings={siteSettings} />
            <main className="flex-1">
              {children}
            </main>
            <Footer footerData={footerData} siteSettings={siteSettings} locale={locale} />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
