import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'vi' ? 'Giao hàng và đổi trả' : 'Shipping & Returns',
  }
}

export default async function ShippingPage({ params }: Props) {
  const { locale } = await params

  const payload = await getPayload({ config: await config })

  const page = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'shipping' } },
    locale: locale as 'vi' | 'en',
    limit: 1,
  })

  const pageData = page.docs[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {pageData?.title || (locale === 'vi' ? 'Giao hàng và đổi trả hàng' : 'Shipping & Returns')}
          </h1>
          <p className="text-blue-100">
            {locale === 'vi'
              ? 'Thông tin chi tiết về phương thức giao hàng và chính sách đổi trả'
              : 'Detailed information about shipping methods and return policy'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {pageData?.content ? (
            <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 prose prose-lg max-w-none">
              <RichText data={pageData.content} />
            </div>
          ) : (
            /* Fallback content when CMS data is not yet available */
            <div className="space-y-8">
              {/* Shipping Methods */}
              <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <TruckIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {locale === 'vi' ? 'Phương thức giao hàng' : 'Shipping Methods'}
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  {locale === 'vi'
                    ? 'Công ty VIES áp dụng linh hoạt các phương thức giao hàng cho Quý khách hàng bao gồm:'
                    : 'VIES applies flexible shipping methods for customers including:'}
                </p>
                <ul className="space-y-3 mb-6">
                  {(locale === 'vi'
                    ? ['Vận chuyển bằng xe máy', 'Vận chuyển bằng xe tải', 'Gửi hàng qua dịch vụ chuyển phát nhanh']
                    : ['Motorcycle delivery', 'Truck delivery', 'Express courier service']
                  ).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-600 text-sm">
                  {locale === 'vi'
                    ? 'Quý khách hàng vui lòng liên hệ trước với chúng tôi để chọn phương án vận chuyển phù hợp.'
                    : 'Please contact us in advance to choose the appropriate shipping method.'}
                </p>
              </div>

              {/* Delivery Time */}
              <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <ClockIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {locale === 'vi' ? 'Thời gian giao hàng' : 'Delivery Time'}
                  </h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>
                    {locale === 'vi'
                      ? 'Thời gian giao hàng ước tính tùy thuộc vào phương thức vận chuyển, vị trí địa lý, và tình hình tại thời điểm giao hàng. Chúng tôi cam kết nỗ lực giao hàng trong thời gian sớm nhất.'
                      : 'Estimated delivery time depends on shipping method, geographic location, and conditions at the time of delivery. We are committed to delivering as soon as possible.'}
                  </p>
                </div>
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                      {locale === 'vi' ? 'Trong phạm vi 20km' : 'Within 20km'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {locale === 'vi'
                        ? 'Vận chuyển tận nơi bằng xe máy hoặc chuyển phát nhanh'
                        : 'Direct delivery by motorcycle or express courier'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                      {locale === 'vi' ? 'Trên 20km hoặc trên 100kg' : 'Over 20km or over 100kg'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {locale === 'vi'
                        ? 'Vận chuyển bằng xe tải hoặc chuyển phát nhanh'
                        : 'Delivery by truck or express courier'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  {locale === 'vi'
                    ? 'Hình thức vận chuyển và chi phí vận chuyển sẽ do hai bên thỏa thuận trước khi giao hàng.'
                    : 'Shipping method and costs will be agreed upon by both parties before delivery.'}
                </p>
              </div>

              {/* Return Policy */}
              <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <ReturnIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {locale === 'vi' ? 'Chính sách đổi trả' : 'Return Policy'}
                  </h2>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {locale === 'vi' ? 'Điều kiện đổi trả' : 'Return Conditions'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {locale === 'vi'
                    ? 'Quý Khách hàng cần kiểm tra tình trạng hàng hóa và có thể đổi hàng/trả lại hàng ngay tại thời điểm giao/nhận hàng trong những trường hợp sau:'
                    : 'Customers should inspect goods and may exchange/return at the time of delivery in the following cases:'}
                </p>
                <ul className="space-y-3 mb-8">
                  {(locale === 'vi'
                    ? [
                        'Hàng không đúng chủng loại, mẫu mã trong đơn hàng đã đặt hoặc như trên website tại thời điểm đặt hàng',
                        'Không đủ số lượng, không đủ bộ như trong đơn hàng',
                        'Tình trạng bên ngoài bị ảnh hưởng như rách bao bì, bong tróc, bể vỡ',
                      ]
                    : [
                        'Items do not match the type or model in the order or on the website',
                        'Insufficient quantity or incomplete set as in the order',
                        'External condition is affected such as torn packaging, peeling, or breakage',
                      ]
                  ).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <XCircleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {locale === 'vi' ? 'Quy định về thời gian đổi trả' : 'Return Timeline'}
                </h3>
                <ul className="space-y-3">
                  {(locale === 'vi'
                    ? [
                        'Thời gian thông báo đổi trả: trong vòng 48h kể từ khi nhận sản phẩm.',
                        'Thời gian gửi chuyển trả sản phẩm: trong vòng 03 ngày kể từ khi nhận sản phẩm.',
                        'Địa điểm đổi trả: tại kho, qua bưu điện hoặc trực tiếp tại văn phòng/kho công ty.',
                      ]
                    : [
                        'Return notification: within 48 hours of receiving the product.',
                        'Product return shipping: within 3 days of receiving the product.',
                        'Return location: at warehouse, via postal service, or directly at our office.',
                      ]
                  ).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <InfoIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 bg-primary/5 rounded-xl p-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">
              {locale === 'vi' ? 'Cần hỗ trợ về giao hàng?' : 'Need shipping support?'}
            </h3>
            <p className="text-gray-600 mb-4">
              {locale === 'vi' ? 'Liên hệ ngay để được hỗ trợ nhanh nhất' : 'Contact us for fastest support'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+84963048317" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                0963 048 317
              </a>
              <a href="mailto:info@v-ies.com" className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors border">
                info@v-ies.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Icons
function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ReturnIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
