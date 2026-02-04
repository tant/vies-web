import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'vi' ? 'Hình thức thanh toán' : locale === 'km' ? 'វិធីបង់ប្រាក់' : 'Payment Methods',
  }
}

export default async function PaymentPage({ params }: Props) {
  const { locale } = await params

  const payload = await getPayload({ config: await config })

  const page = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'payment' } },
    locale: locale as 'vi' | 'en' | 'km',
    limit: 1,
  })

  const pageData = page.docs[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {pageData?.title || (locale === 'vi' ? 'Hình thức thanh toán' : 'Payment Methods')}
          </h1>
          <p className="text-blue-100">
            {locale === 'vi'
              ? 'Các phương thức thanh toán linh hoạt phù hợp với nhu cầu của bạn'
              : 'Flexible payment methods to suit your needs'}
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
            <>
              <p className="text-gray-600 mb-8 text-lg">
                {locale === 'vi'
                  ? 'Công ty VIES áp dụng phương thức thanh toán linh hoạt cho Quý Khách hàng cụ thể như sau:'
                  : 'VIES applies flexible payment methods for customers as follows:'}
              </p>

              <div className="grid gap-6">
                {[
                  {
                    icon: CashIcon,
                    title: locale === 'vi' ? 'Thanh toán khi nhận hàng (COD)' : 'Cash on Delivery (COD)',
                    description: locale === 'vi'
                      ? 'Giao hàng và thu tiền tận địa chỉ của Quý Khách hàng. Phương thức thuận tiện cho các đơn hàng trong khu vực TP.HCM.'
                      : 'Deliver and collect payment at your address. Convenient for orders within Ho Chi Minh City area.',
                  },
                  {
                    icon: BankIcon,
                    title: locale === 'vi' ? 'Chuyển khoản ngân hàng' : 'Bank Transfer',
                    description: locale === 'vi'
                      ? 'Chuyển khoản qua tài khoản ngân hàng. Vui lòng liên hệ với chúng tôi để nhận thông tin tài khoản ngân hàng.'
                      : 'Transfer via bank account. Please contact us to receive bank account information.',
                  },
                  {
                    icon: OfficeIcon,
                    title: locale === 'vi' ? 'Thanh toán tại văn phòng' : 'Payment at Office',
                    description: locale === 'vi'
                      ? 'Thu tiền mặt tại văn phòng Công ty VIES. Địa chỉ: Số 16, đường DD3-1, P. Tân Hưng Thuận, Quận 12, Tp. HCM.'
                      : 'Cash payment at VIES office. Address: No. 16, DD3-1 Street, District 12, HCMC.',
                  },
                ].map((method, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-sm p-6 lg:p-8 flex items-start gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <method.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h2>
                      <p className="text-gray-600">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Note */}
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <InfoIcon className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-1">
                      {locale === 'vi' ? 'Lưu ý' : 'Note'}
                    </h3>
                    <p className="text-yellow-700 text-sm">
                      {locale === 'vi'
                        ? 'Liên hệ với chúng tôi nếu bạn chuyển khoản qua ngân hàng để xác nhận thanh toán. Chi tiết thanh toán sẽ được gửi qua email hoặc qua nhân viên bán hàng phụ trách.'
                        : 'Contact us if you transfer via bank to confirm payment. Payment details will be sent via email or through your assigned sales representative.'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* CTA */}
          <div className="mt-8 bg-primary/5 rounded-xl p-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">
              {locale === 'vi' ? 'Cần hỗ trợ thanh toán?' : 'Need payment support?'}
            </h3>
            <p className="text-gray-600 mb-4">
              {locale === 'vi' ? 'Liên hệ bộ phận bán hàng để được hỗ trợ' : 'Contact our sales team for assistance'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+84903326309" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                0903 326 309 (Mr. Lâm)
              </a>
              <Link href={`/${locale}/contact`} className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors border">
                {locale === 'vi' ? 'Liên hệ' : 'Contact'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Icons
function CashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

function BankIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}

function OfficeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
