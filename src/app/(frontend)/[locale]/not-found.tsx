import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'common' })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {locale === 'vi' ? 'Không tìm thấy trang' : 'Page Not Found'}
          </h2>
          <p className="text-gray-600 mb-8">
            {locale === 'vi'
              ? 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.'
              : 'The page you are looking for does not exist or has been moved.'}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/${locale}`} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            {locale === 'vi' ? 'Về trang chủ' : 'Go Home'}
          </Link>
          <Link href={`/${locale}/products`} className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors border">
            {locale === 'vi' ? 'Xem sản phẩm' : 'View Products'}
          </Link>
        </div>
      </div>
    </div>
  )
}
