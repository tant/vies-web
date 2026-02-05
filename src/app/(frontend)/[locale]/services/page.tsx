import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'vi' ? 'Dịch vụ' : 'Services',
  }
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params

  const payload = await getPayload({ config: await config })

  const services = await payload.find({
    collection: 'services',
    sort: 'order',
    locale: locale as 'vi' | 'en',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {locale === 'vi' ? 'Dịch vụ của VIES' : 'VIES Services'}
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              {locale === 'vi'
                ? 'Chúng tôi cung cấp các dịch vụ tư vấn kỹ thuật chuyên sâu, hỗ trợ khách hàng giải quyết mọi vấn đề liên quan đến vòng bi và bôi trơn công nghiệp.'
                : 'We provide in-depth technical consulting services, helping customers solve all issues related to bearings and industrial lubrication.'}
            </p>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-16">
          {services.docs.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-8 lg:p-12">
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <ServiceIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{service.title}</h2>
                    {service.excerpt && (
                      <p className="text-gray-600 leading-relaxed text-lg">{service.excerpt}</p>
                    )}
                  </div>
                </div>

                {service.benefits && service.benefits.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      {locale === 'vi' ? 'Lợi ích' : 'Benefits'}
                    </h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {service.benefits.map((benefit, bidx) => (
                        <li key={bidx} className="flex items-start gap-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-gray-600">{benefit.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {services.docs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {locale === 'vi' ? 'Chưa có dịch vụ nào.' : 'No services available yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            {locale === 'vi' ? 'Cần tư vấn miễn phí?' : 'Need free consultation?'}
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            {locale === 'vi'
              ? 'Liên hệ ngay với đội ngũ kỹ thuật của VIES để được tư vấn và hỗ trợ tốt nhất.'
              : 'Contact our technical team now for the best consultation and support.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+84908748304"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              0908 748 304 (Mr. Hiển)
            </a>
            <Link
              href={`/${locale}/contact`}
              className="bg-secondary hover:bg-secondary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {locale === 'vi' ? 'Gửi yêu cầu' : 'Send request'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ServiceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
