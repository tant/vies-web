import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  return {
    title: t('hero.title'),
    description: t('hero.subtitle'),
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  // Fetch data from Payload
  const payload = await getPayload({ config: await config })

  const [brands, categories, featuredProducts] = await Promise.all([
    payload.find({ collection: 'brands', limit: 8 }),
    payload.find({ collection: 'categories', limit: 6 }),
    payload.find({
      collection: 'products',
      where: { featured: { equals: true } },
      limit: 6,
    }),
  ])

  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/products`}
                className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {tCommon('products')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {tCommon('contact')}
              </Link>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="bg-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold">10+</div>
                <div className="text-sm text-blue-100">
                  {locale === 'vi' ? 'Năm kinh nghiệm' : 'Years Experience'}
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">8+</div>
                <div className="text-sm text-blue-100">
                  {locale === 'vi' ? 'Thương hiệu đối tác' : 'Partner Brands'}
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">1000+</div>
                <div className="text-sm text-blue-100">
                  {locale === 'vi' ? 'Khách hàng tin tưởng' : 'Trusted Customers'}
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">100%</div>
                <div className="text-sm text-blue-100">
                  {locale === 'vi' ? 'Hàng chính hãng' : 'Authentic Products'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {locale === 'vi' ? 'Danh mục sản phẩm' : 'Product Categories'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {locale === 'vi'
                ? 'Đa dạng các sản phẩm vòng bi và linh kiện công nghiệp chính hãng từ các thương hiệu hàng đầu thế giới'
                : 'Wide range of genuine bearings and industrial components from world-leading brands'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.docs.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/products?category=${category.slug}`}
                className="card p-6 text-center group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <CategoryIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {t('featuredProducts')}
              </h2>
              <p className="text-gray-600">
                {locale === 'vi'
                  ? 'Các sản phẩm được khách hàng tin dùng'
                  : 'Products trusted by our customers'}
              </p>
            </div>
            <Link
              href={`/${locale}/products`}
              className="hidden md:flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              {tCommon('viewAll')}
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.docs.map((product) => (
              <Link
                key={product.id}
                href={`/${locale}/product/${product.slug}`}
                className="card overflow-hidden group"
              >
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <BearingIcon className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <div className="p-5">
                  {product.sku && (
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {product.sku}
                    </span>
                  )}
                  <h3 className="font-semibold text-gray-900 mt-2 group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {typeof product.brand === 'object' && product.brand?.name}
                    </span>
                    <span className="text-primary font-medium text-sm group-hover:underline">
                      {tCommon('readMore')} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              {tCommon('viewAll')}
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t('ourBrands')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {locale === 'vi'
                ? 'Đại lý phân phối chính thức của các thương hiệu vòng bi hàng đầu thế giới'
                : 'Official distributor of world-leading bearing brands'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {brands.docs.map((brand) => (
              <Link
                key={brand.id}
                href={`/${locale}/products?brand=${brand.slug}`}
                className="card p-8 flex items-center justify-center group"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                    <span className="text-2xl font-bold text-gray-700 group-hover:text-primary transition-colors">
                      {brand.name?.charAt(0)}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {brand.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SKF Introduction Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <BearingIcon className="w-24 h-24 text-primary/40 mx-auto mb-4" />
                  <span className="text-gray-400 font-medium">SKF Bearings</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {locale === 'vi'
                  ? 'Giới thiệu về vòng bi SKF'
                  : 'About SKF Bearings'}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {locale === 'vi'
                    ? 'Vòng bi SKF được sản xuất đầu tiên vào năm 1907 tại Thụy Điển, được phát minh bởi Kỹ sư Sven Gustaf Wingqvist. Trải qua hơn 1 thế kỷ, hiện nay việc sản xuất vòng bi SKF ngày càng phát triển mạnh mẽ. SKF trở thành một trong những nhà sản xuất vòng bi uy tín, lớn mạnh nhất thế giới.'
                    : 'SKF bearings were first manufactured in 1907 in Sweden, invented by engineer Sven Gustaf Wingqvist. Over a century later, SKF has become one of the most reputable and largest bearing manufacturers in the world.'}
                </p>
                <p>
                  {locale === 'vi'
                    ? 'SKF có mặt tại 130 quốc gia, sở hữu hơn 100 nhà máy và 15 trung tâm kỹ thuật trên toàn thế giới. Với lịch sử hoạt động trên 100 năm, SKF được khách hàng ở mọi quốc gia tin tưởng và lựa chọn.'
                    : 'SKF operates in 130 countries, owns over 100 factories and 15 technical centers worldwide. With over 100 years of history, SKF is trusted and chosen by customers in every country.'}
                </p>
                <p>
                  {locale === 'vi'
                    ? 'Công ty VIES chuyên cung cấp, phân phối các sản phẩm và giải pháp chính hãng SKF bao gồm: Vòng bi SKF, Gối đỡ SKF, Thiết bị truyền động, Gioăng phớt, Dụng cụ bảo trì, Mỡ và hệ thống bôi trơn SKF.'
                    : 'VIES specializes in distributing genuine SKF products and solutions including: SKF Bearings, SKF Housings, Power Transmission, Seals, Maintenance Tools, and SKF Lubrication Systems.'}
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href={`/${locale}/products?brand=skf`}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
                >
                  {locale === 'vi' ? 'Xem sản phẩm SKF' : 'View SKF Products'}
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {locale === 'vi' ? 'Dịch vụ của chúng tôi' : 'Our Services'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {locale === 'vi'
                ? 'Chúng tôi cung cấp các dịch vụ tư vấn kỹ thuật chuyên sâu, hỗ trợ khách hàng giải quyết mọi vấn đề về vòng bi và bôi trơn'
                : 'We provide in-depth technical consulting services, helping customers solve all bearing and lubrication issues'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: locale === 'vi' ? 'Tư vấn kỹ thuật' : 'Technical Consultation',
                desc: locale === 'vi'
                  ? 'Đội ngũ chuyên gia sẵn sàng tư vấn loại vòng bi và chất bôi trơn phù hợp nhất.'
                  : 'Expert team ready to advise on the most suitable bearings and lubricants.',
                icon: WrenchIcon,
              },
              {
                title: locale === 'vi' ? 'Đo và phân tích rung động' : 'Vibration Analysis',
                desc: locale === 'vi'
                  ? 'Phát hiện sớm các vấn đề tiềm ẩn, lên kế hoạch bảo trì chủ động.'
                  : 'Early detection of potential issues, proactive maintenance planning.',
                icon: ChartBarIcon,
              },
              {
                title: locale === 'vi' ? 'Lắp đặt và bôi trơn' : 'Installation & Lubrication',
                desc: locale === 'vi'
                  ? 'Hướng dẫn lắp đặt đúng kỹ thuật và tư vấn quy trình bôi trơn phù hợp.'
                  : 'Proper installation guidance and appropriate lubrication process consulting.',
                icon: CogIcon,
              },
            ].map((service, idx) => (
              <Link
                key={idx}
                href={`/${locale}/services`}
                className="card p-6 group text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {locale === 'vi'
              ? 'Cần tư vấn hoặc báo giá?'
              : 'Need consultation or a quote?'}
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            {locale === 'vi'
              ? 'Đội ngũ kỹ thuật của VIES luôn sẵn sàng hỗ trợ bạn. Liên hệ ngay để được tư vấn miễn phí.'
              : 'Our technical team is always ready to help. Contact us now for free consultation.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+84963048317"
              className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <PhoneIcon className="w-5 h-5" />
              (+84) 963 048 317
            </a>
            <Link
              href={`/${locale}/contact`}
              className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {locale === 'vi' ? 'Gửi yêu cầu báo giá' : 'Send quote request'}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

// Icons
function CategoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  )
}

function BearingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17l-5.08 5.08a2.36 2.36 0 01-3.33-3.33l5.08-5.09m3.33 3.34l4.24-4.24a2.82 2.82 0 003.33-.47l1.4-1.4a2.82 2.82 0 00-3.98-3.98l-1.4 1.4a2.82 2.82 0 00-.47 3.33l-4.24 4.24m3.33 3.34l-3.33-3.34" />
    </svg>
  )
}

function ChartBarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function CogIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
