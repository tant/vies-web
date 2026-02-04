import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return {
    title: t('title'),
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const payload = await getPayload({ config: await config })

  // Get brands for partners section
  const brands = await payload.find({
    collection: 'brands',
    limit: 10,
  })

  const stats = [
    {
      value: '10+',
      label: locale === 'vi' ? 'Năm kinh nghiệm' : 'Years Experience',
    },
    {
      value: '1000+',
      label: locale === 'vi' ? 'Khách hàng tin tưởng' : 'Trusted Customers',
    },
    {
      value: '5000+',
      label: locale === 'vi' ? 'Sản phẩm đa dạng' : 'Products Available',
    },
    {
      value: '99%',
      label: locale === 'vi' ? 'Khách hàng hài lòng' : 'Customer Satisfaction',
    },
  ]

  const values = [
    {
      icon: ShieldCheckIcon,
      title: locale === 'vi' ? 'Chất lượng' : 'Quality',
      description: locale === 'vi'
        ? 'Cam kết chỉ cung cấp sản phẩm chính hãng từ các thương hiệu hàng đầu thế giới.'
        : 'Committed to providing only genuine products from world-leading brands.',
    },
    {
      icon: UsersIcon,
      title: locale === 'vi' ? 'Khách hàng' : 'Customer Focus',
      description: locale === 'vi'
        ? 'Luôn đặt lợi ích của khách hàng lên hàng đầu, tư vấn tận tâm và hỗ trợ nhanh chóng.'
        : 'Always putting customer interests first with dedicated consultation and quick support.',
    },
    {
      icon: TruckIcon,
      title: locale === 'vi' ? 'Giao hàng' : 'Delivery',
      description: locale === 'vi'
        ? 'Giao hàng nhanh chóng trên toàn quốc và các nước trong khu vực Đông Nam Á.'
        : 'Fast delivery nationwide and to Southeast Asian countries.',
    },
    {
      icon: AwardIcon,
      title: locale === 'vi' ? 'Uy tín' : 'Reputation',
      description: locale === 'vi'
        ? 'Xây dựng niềm tin với khách hàng qua nhiều năm hoạt động và phục vụ chuyên nghiệp.'
        : 'Building trust with customers through years of operation and professional service.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{t('title')}</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              {locale === 'vi'
                ? 'VIES - Nhà phân phối vòng bi và linh kiện công nghiệp chính hãng hàng đầu tại Việt Nam, phục vụ khách hàng trong và ngoài nước.'
                : 'VIES - Leading authentic industrial bearings and components distributor in Vietnam, serving domestic and international customers.'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Story */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              {locale === 'vi' ? 'Câu chuyện của chúng tôi' : 'Our Story'}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                {locale === 'vi'
                  ? 'Được thành lập với sứ mệnh mang đến những sản phẩm công nghiệp chất lượng cao nhất cho thị trường Việt Nam, VIES đã không ngừng phát triển và khẳng định vị thế là đối tác đáng tin cậy của hàng nghìn doanh nghiệp.'
                  : 'Founded with the mission of bringing the highest quality industrial products to the Vietnamese market, VIES has continuously grown and established itself as a trusted partner of thousands of businesses.'}
              </p>
              <p>
                {locale === 'vi'
                  ? 'Chúng tôi tự hào là nhà phân phối ủy quyền của các thương hiệu vòng bi và linh kiện công nghiệp hàng đầu thế giới như SKF, FAG, NTN, TIMKEN, NSK, và KOYO.'
                  : 'We are proud to be an authorized distributor of world-leading bearing and industrial component brands such as SKF, FAG, NTN, TIMKEN, NSK, and KOYO.'}
              </p>
              <p>
                {locale === 'vi'
                  ? 'Với đội ngũ nhân viên giàu kinh nghiệm và hệ thống kho hàng hiện đại, chúng tôi cam kết đáp ứng mọi nhu cầu của khách hàng một cách nhanh chóng và hiệu quả.'
                  : 'With an experienced team and modern warehouse system, we are committed to meeting all customer needs quickly and efficiently.'}
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="text-center">
                  <BuildingIcon className="w-24 h-24 text-primary/50 mx-auto mb-4" />
                  <span className="text-gray-500 font-medium">VIES Headquarters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              {locale === 'vi' ? 'Giá trị cốt lõi' : 'Core Values'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {locale === 'vi'
                ? 'Những nguyên tắc định hướng mọi hoạt động của VIES'
                : 'Principles that guide everything we do at VIES'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners/Brands */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            {locale === 'vi' ? 'Đối tác thương hiệu' : 'Brand Partners'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {locale === 'vi'
              ? 'Chúng tôi tự hào là nhà phân phối ủy quyền của các thương hiệu hàng đầu thế giới'
              : 'We are proud to be an authorized distributor of world-leading brands'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.docs.map((brand) => (
            <Link
              key={brand.id}
              href={`/${locale}/products?brand=${brand.slug}`}
              className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center hover:shadow-md transition-shadow group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/10 transition-colors">
                  <span className="font-bold text-gray-700 group-hover:text-primary transition-colors">{brand.name.slice(0, 3)}</span>
                </div>
                <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{brand.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            {locale === 'vi' ? 'Sẵn sàng hợp tác?' : 'Ready to Partner?'}
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            {locale === 'vi'
              ? 'Liên hệ với chúng tôi ngay hôm nay để được tư vấn và báo giá tốt nhất'
              : 'Contact us today for the best consultation and pricing'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {tCommon('contact')}
            </Link>
            <a
              href="tel:+84963048317"
              className="bg-secondary hover:bg-secondary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              (+84) 963 048 317
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Icons
function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  )
}

function AwardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}
