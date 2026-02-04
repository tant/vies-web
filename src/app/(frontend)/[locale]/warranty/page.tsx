import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'vi' ? 'Chính sách bảo hành' : locale === 'km' ? 'គោលនយោបាយធានា' : 'Warranty Policy',
  }
}

export default async function WarrantyPage({ params }: Props) {
  const { locale } = await params

  const warranties = [
    { brand: 'SKF', period: '24', note: locale === 'vi' ? 'Bảo hành theo tiêu chuẩn SKF toàn cầu' : 'SKF global standard warranty' },
    { brand: 'FAG', period: '24', note: locale === 'vi' ? 'Bảo hành chính hãng Schaeffler' : 'Official Schaeffler warranty' },
    { brand: 'NTN', period: '18', note: locale === 'vi' ? 'Bảo hành theo chính sách NTN' : 'NTN policy warranty' },
    { brand: 'TIMKEN', period: '24', note: locale === 'vi' ? 'Bảo hành toàn cầu TIMKEN' : 'TIMKEN global warranty' },
    { brand: 'NSK', period: '18', note: locale === 'vi' ? 'Bảo hành chính hãng NSK' : 'Official NSK warranty' },
    { brand: 'KOYO', period: '12', note: locale === 'vi' ? 'Bảo hành theo JTEKT' : 'JTEKT warranty policy' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {locale === 'vi' ? 'Chính sách bảo hành' : locale === 'km' ? 'គោលនយោបាយធានា' : 'Warranty Policy'}
          </h1>
          <p className="text-blue-100">
            {locale === 'vi' ? 'Cam kết bảo hành chính hãng cho tất cả sản phẩm' : 'Official warranty commitment for all products'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Warranty Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {locale === 'vi' ? 'Thời gian bảo hành theo thương hiệu' : 'Warranty Period by Brand'}
              </h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {locale === 'vi' ? 'Thương hiệu' : 'Brand'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {locale === 'vi' ? 'Thời gian (tháng)' : 'Period (months)'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    {locale === 'vi' ? 'Ghi chú' : 'Note'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {warranties.map((w) => (
                  <tr key={w.brand}>
                    <td className="px-6 py-4 font-semibold text-primary">{w.brand}</td>
                    <td className="px-6 py-4">{w.period} {locale === 'vi' ? 'tháng' : 'months'}</td>
                    <td className="px-6 py-4 text-gray-600">{w.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Warranty Conditions */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {locale === 'vi' ? 'Điều kiện bảo hành' : 'Warranty Conditions'}
            </h2>
            <ul className="space-y-3 text-gray-600">
              {(locale === 'vi' ? [
                'Sản phẩm còn trong thời hạn bảo hành',
                'Có hóa đơn mua hàng hoặc phiếu bảo hành',
                'Lỗi do nhà sản xuất, không phải do người sử dụng',
                'Sản phẩm được lắp đặt và vận hành đúng hướng dẫn',
                'Không bị tác động bởi ngoại lực hoặc môi trường bất thường',
              ] : [
                'Product is within warranty period',
                'Has purchase invoice or warranty card',
                'Defect is from manufacturer, not user',
                'Product was installed and operated correctly',
                'Not affected by external force or abnormal environment',
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Covered */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {locale === 'vi' ? 'Không thuộc phạm vi bảo hành' : 'Not Covered by Warranty'}
            </h2>
            <ul className="space-y-3 text-gray-600">
              {(locale === 'vi' ? [
                'Hư hỏng do sử dụng sai cách hoặc quá tải',
                'Hư hỏng do lắp đặt không đúng kỹ thuật',
                'Sản phẩm đã qua sửa chữa bởi bên thứ ba',
                'Mài mòn tự nhiên do sử dụng lâu dài',
                'Hư hỏng do thiên tai, hỏa hoạn, ngập nước',
              ] : [
                'Damage due to misuse or overload',
                'Damage from improper installation',
                'Product repaired by third party',
                'Natural wear from long-term use',
                'Damage from natural disasters, fire, flooding',
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <XIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warranty Process */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {locale === 'vi' ? 'Quy trình bảo hành' : 'Warranty Process'}
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {(locale === 'vi' ? [
                { step: '1', title: 'Liên hệ', desc: 'Gọi hotline hoặc gửi email thông báo lỗi sản phẩm' },
                { step: '2', title: 'Gửi sản phẩm', desc: 'Gửi sản phẩm kèm hóa đơn đến VIES' },
                { step: '3', title: 'Kiểm tra', desc: 'Kỹ thuật viên kiểm tra và xác định lỗi' },
                { step: '4', title: 'Xử lý', desc: 'Đổi mới hoặc sửa chữa trong 5-7 ngày' },
              ] : [
                { step: '1', title: 'Contact', desc: 'Call hotline or email to report product issue' },
                { step: '2', title: 'Send Product', desc: 'Send product with invoice to VIES' },
                { step: '3', title: 'Inspection', desc: 'Technician inspects and identifies issue' },
                { step: '4', title: 'Resolution', desc: 'Replace or repair within 5-7 days' },
              ]).map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary/5 rounded-xl p-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">
              {locale === 'vi' ? 'Cần hỗ trợ bảo hành?' : 'Need warranty support?'}
            </h3>
            <p className="text-gray-600 mb-4">
              {locale === 'vi' ? 'Liên hệ ngay để được hỗ trợ nhanh nhất' : 'Contact us for fastest support'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+84963048317" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                (+84) 963 048 317
              </a>
              <Link href={`/${locale}/contact`} className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors border">
                {locale === 'vi' ? 'Gửi yêu cầu' : 'Send request'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
