import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'vi' ? 'Chính sách bảo mật' : locale === 'km' ? 'គោលនយោបាយភាពឯកជន' : 'Privacy Policy',
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params

  const content = {
    vi: {
      title: 'Chính sách bảo mật',
      updated: 'Cập nhật lần cuối: Tháng 1, 2026',
      sections: [
        { title: '1. Thông tin chúng tôi thu thập', content: 'Chúng tôi thu thập thông tin bạn cung cấp trực tiếp như: họ tên, email, số điện thoại, tên công ty khi bạn điền form liên hệ hoặc yêu cầu báo giá. Chúng tôi cũng tự động thu thập một số thông tin khi bạn truy cập website như địa chỉ IP, loại trình duyệt, thời gian truy cập.' },
        { title: '2. Mục đích sử dụng thông tin', content: 'Thông tin của bạn được sử dụng để: phản hồi yêu cầu và câu hỏi của bạn, gửi báo giá và thông tin sản phẩm, cải thiện dịch vụ và trải nghiệm người dùng, gửi thông tin khuyến mãi (nếu bạn đồng ý nhận).' },
        { title: '3. Bảo mật thông tin', content: 'Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin của bạn khỏi truy cập trái phép, thay đổi, tiết lộ hoặc phá hủy. Thông tin được lưu trữ trên máy chủ bảo mật và chỉ nhân viên được ủy quyền mới có quyền truy cập.' },
        { title: '4. Chia sẻ thông tin', content: 'Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba, ngoại trừ: đối tác vận chuyển để giao hàng, cơ quan chức năng khi có yêu cầu pháp lý, với sự đồng ý của bạn.' },
        { title: '5. Cookie', content: 'Website sử dụng cookie để cải thiện trải nghiệm người dùng. Bạn có thể từ chối cookie trong cài đặt trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến một số chức năng của website.' },
        { title: '6. Quyền của bạn', content: 'Bạn có quyền: yêu cầu truy cập thông tin cá nhân của mình, yêu cầu chỉnh sửa thông tin không chính xác, yêu cầu xóa thông tin cá nhân, từ chối nhận email marketing.' },
        { title: '7. Liên hệ', content: 'Nếu có bất kỳ câu hỏi nào về chính sách bảo mật, vui lòng liên hệ: Email: info@v-ies.com, Điện thoại: (+84) 963 048 317' },
      ],
    },
    en: {
      title: 'Privacy Policy',
      updated: 'Last updated: January 2026',
      sections: [
        { title: '1. Information We Collect', content: 'We collect information you provide directly such as: name, email, phone number, company name when you fill out contact forms or request quotes. We also automatically collect certain information when you visit our website such as IP address, browser type, and access time.' },
        { title: '2. How We Use Information', content: 'Your information is used to: respond to your requests and questions, send quotes and product information, improve our services and user experience, send promotional information (if you consent).' },
        { title: '3. Information Security', content: 'We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. Information is stored on secure servers and only authorized personnel have access.' },
        { title: '4. Information Sharing', content: 'We do not sell, trade, or transfer your personal information to third parties, except: shipping partners for delivery, authorities when legally required, with your consent.' },
        { title: '5. Cookies', content: 'Our website uses cookies to improve user experience. You can decline cookies in your browser settings, however this may affect some website functionality.' },
        { title: '6. Your Rights', content: 'You have the right to: request access to your personal information, request correction of inaccurate information, request deletion of personal information, opt-out of marketing emails.' },
        { title: '7. Contact', content: 'If you have any questions about our privacy policy, please contact: Email: info@v-ies.com, Phone: (+84) 963 048 317' },
      ],
    },
    km: {
      title: 'គោលនយោបាយភាពឯកជន',
      updated: 'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ: មករា ២០២៦',
      sections: [
        { title: '១. ព័ត៌មានដែលយើងប្រមូល', content: 'យើងប្រមូលព័ត៌មានដែលអ្នកផ្តល់ដោយផ្ទាល់ដូចជា: ឈ្មោះ អ៊ីមែល លេខទូរស័ព្ទ ឈ្មោះក្រុមហ៊ុន នៅពេលអ្នកបំពេញទម្រង់ទំនាក់ទំនង ឬស្នើសុំសម្រង់តម្លៃ។' },
        { title: '២. របៀបប្រើប្រាស់ព័ត៌មាន', content: 'ព័ត៌មានរបស់អ្នកត្រូវបានប្រើដើម្បី: ឆ្លើយតបសំណើ និងសំណួររបស់អ្នក ផ្ញើសម្រង់តម្លៃ និងព័ត៌មានផលិតផល កែលម្អសេវាកម្ម និងបទពិសោធន៍អ្នកប្រើប្រាស់។' },
        { title: '៣. សុវត្ថិភាពព័ត៌មាន', content: 'យើងអនុវត្តវិធានការសុវត្ថិភាពសមស្រប ដើម្បីការពារព័ត៌មានរបស់អ្នកពីការចូលប្រើដោយគ្មានការអនុញ្ញាត ការផ្លាស់ប្តូរ ការបង្ហាញ ឬការបំផ្លាញ។' },
        { title: '៤. ការចែករំលែកព័ត៌មាន', content: 'យើងមិនលក់ ផ្លាស់ប្តូរ ឬផ្ទេរព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នកទៅភាគីទីបីទេ លើកលែងតែ: ដៃគូដឹកជញ្ជូន អាជ្ញាធរនៅពេលមានតម្រូវការច្បាប់។' },
        { title: '៥. ខូគី', content: 'គេហទំព័ររបស់យើងប្រើខូគីដើម្បីកែលម្អបទពិសោធន៍អ្នកប្រើប្រាស់។ អ្នកអាចបដិសេធខូគីនៅក្នុងការកំណត់កម្មវិធីរុករក។' },
        { title: '៦. សិទ្ធិរបស់អ្នក', content: 'អ្នកមានសិទ្ធិ: ស្នើសុំចូលប្រើព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក កែតម្រូវព័ត៌មានមិនត្រឹមត្រូវ ស្នើសុំលុបព័ត៌មានផ្ទាល់ខ្លួន បដិសេធការទទួលអ៊ីមែលទីផ្សារ។' },
        { title: '៧. ទំនាក់ទំនង', content: 'ប្រសិនបើអ្នកមានសំណួរអំពីគោលនយោបាយភាពឯកជន សូមទាក់ទង: អ៊ីមែល: info@v-ies.com ទូរស័ព្ទ: (+84) 963 048 317' },
      ],
    },
  }

  const c = content[locale as keyof typeof content] || content.en

  return (
    <div className="min-h-screen bg-gray-50">
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
