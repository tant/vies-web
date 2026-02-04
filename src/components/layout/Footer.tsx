'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const currentYear = new Date().getFullYear()

  const brandLinks = [
    { name: 'SKF', href: `/${locale}/products?brand=skf` },
    { name: 'FAG', href: `/${locale}/products?brand=fag` },
    { name: 'NTN', href: `/${locale}/products?brand=ntn` },
    { name: 'TIMKEN', href: `/${locale}/products?brand=timken` },
    { name: 'NSK', href: `/${locale}/products?brand=nsk` },
    { name: 'KOYO', href: `/${locale}/products?brand=koyo` },
  ]

  const quickLinks = [
    { name: tCommon('home'), href: `/${locale}` },
    { name: tCommon('products'), href: `/${locale}/products` },
    { name: locale === 'vi' ? 'Dịch vụ' : locale === 'km' ? 'សេវាកម្ម' : 'Services', href: `/${locale}/services` },
    { name: tCommon('news'), href: `/${locale}/news` },
    { name: tCommon('about'), href: `/${locale}/about` },
    { name: tCommon('contact'), href: `/${locale}/contact` },
  ]

  const supportLinks = [
    { name: locale === 'vi' ? 'Giao hàng và đổi trả' : locale === 'km' ? 'ការដឹកជញ្ជូន និងការប្ដូរ' : 'Shipping & Returns', href: `/${locale}/shipping` },
    { name: locale === 'vi' ? 'Hình thức thanh toán' : locale === 'km' ? 'វិធីបង់ប្រាក់' : 'Payment', href: `/${locale}/payment` },
    { name: locale === 'vi' ? 'Chính sách bảo hành' : locale === 'km' ? 'គោលនយោបាយធានា' : 'Warranty', href: `/${locale}/warranty` },
    { name: locale === 'vi' ? 'Câu hỏi thường gặp' : locale === 'km' ? 'សំណួរញឹកញាប់' : 'FAQ', href: `/${locale}/faq` },
    { name: locale === 'vi' ? 'Chính sách bảo mật' : locale === 'km' ? 'គោលនយោបាយភាពឯកជន' : 'Privacy', href: `/${locale}/privacy` },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <span className="font-bold text-xl text-white">VIES</span>
                <span className="block text-xs text-gray-400 -mt-1">TRUST PARTNER</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              {locale === 'vi'
                ? 'Nhà phân phối vòng bi và linh kiện công nghiệp chính hãng hàng đầu Việt Nam.'
                : locale === 'km'
                ? 'អ្នកចែកចាយគ្រាប់បេរីង និងគ្រឿងបន្លាស់ឧស្សាហកម្មពិតប្រាកដឈានមុខនៅវៀតណាម។'
                : 'Leading authentic industrial bearings and components distributor in Vietnam.'}
            </p>
            <div className="flex gap-3 mb-6">
              <a href="https://facebook.com/vies.vietnam" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="https://zalo.me/0908748304" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <span className="text-sm font-bold">Zalo</span>
              </a>
            </div>
            {/* Contact Info */}
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  {locale === 'vi'
                    ? 'Số 16, Đường DD3-1, P. Tân Hưng Thuận, Q.12, TP.HCM'
                    : 'No. 16, DD3-1 Street, District 12, HCMC'}
                </span>
              </li>
              <li>
                <a href="tel:+84963048317" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <PhoneIcon className="w-4 h-4 text-primary" />
                  (+84) 963 048 317
                </a>
              </li>
              <li>
                <a href="mailto:info@v-ies.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <MailIcon className="w-4 h-4 text-primary" />
                  info@v-ies.com
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {locale === 'vi' ? 'Liên kết' : locale === 'km' ? 'តំណភ្ជាប់' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {locale === 'vi' ? 'Thương hiệu' : locale === 'km' ? 'ម៉ាក' : 'Brands'}
            </h3>
            <ul className="space-y-2">
              {brandLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {locale === 'vi' ? 'Hỗ trợ' : locale === 'km' ? 'ជំនួយ' : 'Support'}
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {locale === 'vi' ? 'Đăng ký nhận tin' : locale === 'km' ? 'ចុះឈ្មោះទទួលព័ត៌មាន' : 'Newsletter'}
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              {locale === 'vi' ? 'Nhận thông tin sản phẩm mới' : 'Get new product updates'}
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-3 py-2 bg-gray-800 rounded-l-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button type="submit" className="bg-primary hover:bg-primary-dark px-3 py-2 rounded-r-lg transition-colors">
                <ArrowIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>{t('copyright', { year: currentYear })}</p>
            <div className="flex items-center gap-4">
              <span>MST: 0318321326</span>
              <span>|</span>
              <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
                {locale === 'vi' ? 'Bảo mật' : 'Privacy'}
              </Link>
              <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">
                {locale === 'vi' ? 'Điều khoản' : 'Terms'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Icons
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
}
