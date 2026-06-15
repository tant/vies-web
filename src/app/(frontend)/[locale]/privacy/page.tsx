import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { getHreflangAlternates } from '@/lib/seo/alternates'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy',
    alternates: {
      languages: getHreflangAlternates('/privacy').languages,
    },
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const content = {
    vi: {
      title: 'Chính sách bảo mật',
      updated: 'Cập nhật lần cuối: Tháng 6, 2026',
      sections: [
        { title: '1. Bên kiểm soát dữ liệu cá nhân', content: 'Chính sách này được ban hành và thực hiện bởi:\nCông ty TNHH Thương mại và Dịch vụ VIES\nMã số thuế: 0318321326\nĐịa chỉ: Số 16 đường DD3-1, Phường Đông Hưng Thuận, Thành phố Hồ Chí Minh\nEmail: info@vies.com.vn — Điện thoại: (+84) 963 048 317\nVIES là Bên Kiểm soát dữ liệu cá nhân đối với dữ liệu bạn cung cấp qua website vies.com.vn, và cam kết tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.' },
        { title: '2. Dữ liệu cá nhân chúng tôi thu thập', content: 'Dữ liệu bạn cung cấp trực tiếp khi điền form liên hệ hoặc yêu cầu báo giá: họ tên, số điện thoại, email, tên công ty, nội dung yêu cầu. Đây là dữ liệu cá nhân cơ bản; chúng tôi không thu thập dữ liệu cá nhân nhạy cảm.\nDữ liệu kỹ thuật tự động ghi nhận trong nhật ký máy chủ phục vụ vận hành và bảo mật: địa chỉ IP, loại trình duyệt, thời gian truy cập.' },
        { title: '3. Mục đích xử lý dữ liệu', content: 'Dữ liệu của bạn chỉ được xử lý cho các mục đích: tiếp nhận và phản hồi yêu cầu, lập và gửi báo giá, tư vấn sản phẩm và chăm sóc khách hàng, vận hành và bảo mật website. Chúng tôi không sử dụng dữ liệu của bạn cho mục đích nằm ngoài phạm vi đã thông báo.' },
        { title: '4. Cơ sở pháp lý và sự đồng ý', content: 'Việc xử lý dữ liệu cá nhân được thực hiện trên cơ sở sự đồng ý của bạn, thể hiện qua việc bạn chủ động cung cấp thông tin và xác nhận đồng ý khi gửi form. Sự đồng ý là tự nguyện và bạn được biết rõ loại dữ liệu, mục đích xử lý, bên xử lý và quyền của mình trước khi đồng ý. Bạn có thể rút lại sự đồng ý bất cứ lúc nào (xem mục 9); việc rút lại không ảnh hưởng tới tính hợp pháp của hoạt động xử lý trước thời điểm rút lại.' },
        { title: '5. Thời gian lưu trữ', content: 'Dữ liệu cá nhân được lưu trữ trong thời gian cần thiết để hoàn thành mục đích đã nêu hoặc theo thời hạn pháp luật yêu cầu. Khi không còn cần thiết, dữ liệu sẽ được xóa hoặc hủy theo quy định. Bạn có thể yêu cầu xóa sớm hơn theo mục 9.' },
        { title: '6. Chia sẻ và tiết lộ dữ liệu', content: 'Chúng tôi không bán, trao đổi hay cho thuê dữ liệu cá nhân của bạn. Dữ liệu chỉ được tiết lộ khi: có sự đồng ý của bạn; cho đối tác/đơn vị hỗ trợ vận hành website hoặc vận chuyển trong phạm vi cần thiết và có cam kết bảo mật; hoặc theo yêu cầu hợp pháp của cơ quan nhà nước có thẩm quyền.' },
        { title: '7. Lưu trữ và an toàn dữ liệu', content: 'Dữ liệu được lưu trữ trên hệ thống máy chủ đặt tại Việt Nam. Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ dữ liệu khỏi truy cập trái phép, thay đổi, tiết lộ hay phá hủy; chỉ nhân sự được ủy quyền mới được truy cập dữ liệu.' },
        { title: '8. Cookie', content: 'Website chỉ sử dụng cookie kỹ thuật cần thiết để vận hành, gồm: ghi nhớ lựa chọn ngôn ngữ và duy trì phiên đăng nhập của quản trị viên. Chúng tôi KHÔNG sử dụng cookie quảng cáo, cookie theo dõi hành vi hay công cụ phân tích của bên thứ ba. Vì chỉ dùng cookie cần thiết, website không yêu cầu thiết lập đồng ý cookie riêng; bạn vẫn có thể quản lý hoặc xóa cookie trong cài đặt trình duyệt.' },
        { title: '9. Quyền của bạn đối với dữ liệu cá nhân', content: 'Theo Nghị định 13/2023/NĐ-CP, bạn có các quyền: được biết về hoạt động xử lý; đồng ý hoặc không đồng ý; truy cập, xem và chỉnh sửa dữ liệu; rút lại sự đồng ý; yêu cầu xóa dữ liệu; yêu cầu hạn chế xử lý; yêu cầu cung cấp dữ liệu; phản đối xử lý; khiếu nại, tố cáo, khởi kiện; yêu cầu bồi thường thiệt hại; và quyền tự bảo vệ. Để thực hiện các quyền này, vui lòng liên hệ chúng tôi theo mục 11; chúng tôi sẽ phản hồi trong thời hạn luật định.' },
        { title: '10. Dữ liệu của trẻ em', content: 'Website hướng tới khách hàng doanh nghiệp và không chủ đích thu thập dữ liệu của trẻ em. Nếu phát hiện đã thu thập dữ liệu trẻ em mà không có sự đồng ý hợp lệ, chúng tôi sẽ xóa theo quy định.' },
        { title: '11. Liên hệ về dữ liệu cá nhân', content: 'Mọi yêu cầu, câu hỏi hoặc khiếu nại liên quan đến dữ liệu cá nhân, vui lòng liên hệ:\nEmail: info@vies.com.vn — Điện thoại: (+84) 963 048 317.' },
        { title: '12. Thay đổi chính sách', content: 'Chúng tôi có thể cập nhật chính sách này để phù hợp với quy định pháp luật và hoạt động thực tế. Phiên bản mới có hiệu lực khi được đăng tải trên website kèm ngày cập nhật.' },
      ],
    },
    en: {
      title: 'Privacy Policy',
      updated: 'Last updated: June 2026',
      sections: [
        { title: '1. Data Controller', content: 'This policy is issued and implemented by:\nVIES Service and Trading Co., Ltd.\nTax ID: 0318321326\nAddress: No. 16 DD3-1 Street, Dong Hung Thuan Ward, Ho Chi Minh City\nEmail: info@vies.com.vn — Phone: (+84) 963 048 317\nVIES is the Personal Data Controller for the data you provide through vies.com.vn and is committed to complying with Decree 13/2023/ND-CP on Personal Data Protection.' },
        { title: '2. Personal Data We Collect', content: 'Data you provide directly when filling out contact or quote request forms: name, phone number, email, company name, and your message. This is basic personal data; we do not collect sensitive personal data.\nTechnical data automatically recorded in server logs for operation and security: IP address, browser type, and access time.' },
        { title: '3. Purposes of Processing', content: 'Your data is processed only to: receive and respond to your requests, prepare and send quotes, provide product advice and customer care, and operate and secure the website. We do not use your data for purposes beyond those notified.' },
        { title: '4. Legal Basis and Consent', content: 'Processing of personal data is based on your consent, expressed by your voluntary provision of information and your confirmation when submitting a form. Consent is voluntary, and you are clearly informed of the data types, processing purposes, the processing party, and your rights before consenting. You may withdraw consent at any time (see section 9); withdrawal does not affect the lawfulness of processing carried out before withdrawal.' },
        { title: '5. Data Retention', content: 'Personal data is retained only for as long as necessary to fulfill the stated purposes or as required by law. When no longer needed, data is deleted or destroyed in accordance with regulations. You may request earlier deletion under section 9.' },
        { title: '6. Data Sharing and Disclosure', content: 'We do not sell, trade, or rent your personal data. Data is disclosed only: with your consent; to partners supporting website operation or delivery, to the extent necessary and under confidentiality commitments; or upon lawful request from competent state authorities.' },
        { title: '7. Storage and Security', content: 'Data is stored on server systems located in Vietnam. We apply appropriate technical and organizational measures to protect data from unauthorized access, alteration, disclosure, or destruction; only authorized personnel may access the data.' },
        { title: '8. Cookies', content: 'The website uses only strictly necessary technical cookies for operation, namely: remembering your language preference and maintaining the administrator login session. We do NOT use advertising cookies, behavioral tracking cookies, or third-party analytics. As only essential cookies are used, no separate cookie consent banner is required; you may still manage or delete cookies in your browser settings.' },
        { title: '9. Your Rights Regarding Personal Data', content: 'Under Decree 13/2023/ND-CP, you have the rights to: be informed of processing; give or withhold consent; access, view and correct your data; withdraw consent; request deletion; request restriction of processing; request provision of data; object to processing; complain, denounce and litigate; claim damages; and self-protect. To exercise these rights, please contact us per section 11; we will respond within the statutory time limits.' },
        { title: '10. Children’s Data', content: 'The website targets business customers and does not intentionally collect children’s data. If we discover that children’s data has been collected without valid consent, we will delete it as required.' },
        { title: '11. Contact for Personal Data Matters', content: 'For any request, question, or complaint regarding personal data, please contact:\nEmail: info@vies.com.vn — Phone: (+84) 963 048 317.' },
        { title: '12. Changes to This Policy', content: 'We may update this policy to align with legal requirements and actual operations. The new version takes effect when posted on the website together with its update date.' },
      ],
    },
  }

  const c = content[locale as keyof typeof content] || content.en

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb items={[{ label: tNav('breadcrumb.privacy') }]} />
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{c.title}</h1>
          <p className="text-blue-100">{c.updated}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <div className="prose max-w-none">
            {c.sections.map((section, idx) => (
              <div key={idx} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h2>
                <p className="text-gray-600 whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
