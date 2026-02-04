import React from 'react'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './styles.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
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
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
