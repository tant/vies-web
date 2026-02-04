import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'vi' ? 'Câu hỏi thường gặp' : 'FAQ',
  }
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const faqs = [
    {
      q: locale === 'vi' ? 'VIES có phải là nhà phân phối chính hãng không?' : 'Is VIES an authorized distributor?',
      a: locale === 'vi' ? 'Có, VIES là nhà phân phối ủy quyền chính thức của các thương hiệu vòng bi hàng đầu thế giới như SKF, FAG, NTN, TIMKEN, NSK và KOYO tại Việt Nam và khu vực Đông Nam Á.' : 'Yes, VIES is an officially authorized distributor of world-leading bearing brands such as SKF, FAG, NTN, TIMKEN, NSK, and KOYO in Vietnam and Southeast Asia.',
    },
    {
      q: locale === 'vi' ? 'Làm thế nào để đặt hàng?' : 'How do I place an order?',
      a: locale === 'vi' ? 'Quý khách có thể liên hệ trực tiếp qua hotline (+84) 963 048 317, email info@v-ies.com hoặc điền form yêu cầu báo giá trên website. Đội ngũ của chúng tôi sẽ phản hồi trong vòng 24 giờ.' : 'You can contact us directly via hotline (+84) 963 048 317, email info@v-ies.com, or fill out the quote request form on our website. Our team will respond within 24 hours.',
    },
    {
      q: locale === 'vi' ? 'Thời gian giao hàng là bao lâu?' : 'What is the delivery time?',
      a: locale === 'vi' ? 'Đối với sản phẩm có sẵn trong kho: 1-3 ngày làm việc tại TP.HCM, 3-5 ngày cho các tỉnh thành khác. Sản phẩm đặt hàng: 2-4 tuần tùy thuộc vào nhà sản xuất.' : 'For in-stock products: 1-3 business days in HCMC, 3-5 days for other provinces. Special orders: 2-4 weeks depending on the manufacturer.',
    },
    {
      q: locale === 'vi' ? 'Chính sách bảo hành như thế nào?' : 'What is the warranty policy?',
      a: locale === 'vi' ? 'Tất cả sản phẩm đều được bảo hành theo chính sách của nhà sản xuất. Thời gian bảo hành từ 12-24 tháng tùy loại sản phẩm. Xem chi tiết tại trang Chính sách bảo hành.' : 'All products are warranted according to the manufacturer\'s policy. Warranty period ranges from 12-24 months depending on product type. See details on the Warranty Policy page.',
    },
    {
      q: locale === 'vi' ? 'VIES có hỗ trợ kỹ thuật không?' : 'Does VIES provide technical support?',
      a: locale === 'vi' ? 'Có, đội ngũ kỹ thuật của chúng tôi sẵn sàng tư vấn và hỗ trợ quý khách chọn lựa sản phẩm phù hợp, cũng như giải đáp các thắc mắc về lắp đặt và bảo trì.' : 'Yes, our technical team is ready to advise and help you select the right products, as well as answer questions about installation and maintenance.',
    },
    {
      q: locale === 'vi' ? 'Có thể mua số lượng nhỏ không?' : 'Can I buy in small quantities?',
      a: locale === 'vi' ? 'Có, chúng tôi phục vụ cả khách hàng mua lẻ và mua sỉ. Tuy nhiên, giá sẽ ưu đãi hơn cho đơn hàng số lượng lớn. Liên hệ để được báo giá tốt nhất.' : 'Yes, we serve both retail and wholesale customers. However, better prices are available for bulk orders. Contact us for the best quote.',
    },
    {
      q: locale === 'vi' ? 'Phương thức thanh toán nào được chấp nhận?' : 'What payment methods are accepted?',
      a: locale === 'vi' ? 'Chúng tôi chấp nhận chuyển khoản ngân hàng, thanh toán khi nhận hàng (COD) cho đơn hàng dưới 10 triệu VNĐ, và thanh toán qua các ví điện tử phổ biến.' : 'We accept bank transfers, cash on delivery (COD) for orders under 10 million VND, and payment via popular e-wallets.',
    },
    {
      q: locale === 'vi' ? 'VIES có giao hàng quốc tế không?' : 'Does VIES ship internationally?',
      a: locale === 'vi' ? 'Có, chúng tôi giao hàng đến các nước trong khu vực Đông Nam Á như Campuchia, Lào, Myanmar. Phí vận chuyển và thời gian giao hàng sẽ được báo cụ thể theo từng đơn hàng.' : 'Yes, we ship to Southeast Asian countries such as Cambodia, Laos, and Myanmar. Shipping costs and delivery times will be quoted specifically for each order.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {locale === 'vi' ? 'Câu hỏi thường gặp' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-blue-100">
            {locale === 'vi' ? 'Giải đáp các thắc mắc phổ biến' : 'Answers to common questions'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="bg-white rounded-xl shadow-sm group">
                <summary className="px-6 py-5 cursor-pointer font-semibold text-gray-900 flex justify-between items-center list-none">
                  {faq.q}
                  <ChevronIcon className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-5 text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>

          <div className="mt-12 bg-primary/5 rounded-xl p-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">
              {locale === 'vi' ? 'Không tìm thấy câu trả lời?' : 'Can\'t find your answer?'}
            </h3>
            <p className="text-gray-600 mb-4">
              {locale === 'vi' ? 'Liên hệ với chúng tôi để được hỗ trợ' : 'Contact us for assistance'}
            </p>
            <Link href={`/${locale}/contact`} className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              {tCommon('contact')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}
