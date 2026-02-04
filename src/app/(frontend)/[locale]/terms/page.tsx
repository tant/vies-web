type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'vi' ? 'Điều khoản sử dụng' : locale === 'km' ? 'លក្ខខណ្ឌប្រើប្រាស់' : 'Terms of Service',
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params

  const content = {
    vi: {
      title: 'Điều khoản sử dụng',
      updated: 'Cập nhật lần cuối: Tháng 1, 2026',
      sections: [
        { title: '1. Chấp nhận điều khoản', content: 'Bằng việc truy cập và sử dụng website v-ies.com, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây. Nếu không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng website.' },
        { title: '2. Thông tin sản phẩm', content: 'Chúng tôi nỗ lực cung cấp thông tin sản phẩm chính xác nhất có thể. Tuy nhiên, thông số kỹ thuật, hình ảnh và giá cả có thể thay đổi mà không cần thông báo trước. Giá hiển thị trên website chỉ mang tính tham khảo, giá chính thức sẽ được xác nhận khi báo giá.' },
        { title: '3. Đặt hàng và thanh toán', content: 'Đơn hàng chỉ được xác nhận sau khi VIES gửi email/điện thoại xác nhận. Chúng tôi có quyền từ chối đơn hàng nếu phát hiện thông tin không chính xác hoặc có dấu hiệu gian lận. Thanh toán phải được thực hiện theo phương thức đã thỏa thuận.' },
        { title: '4. Giao hàng', content: 'Thời gian giao hàng là ước tính và có thể thay đổi tùy thuộc vào tình trạng kho hàng và địa điểm giao. VIES không chịu trách nhiệm cho các chậm trễ do nguyên nhân bất khả kháng như thiên tai, dịch bệnh.' },
        { title: '5. Đổi trả hàng', content: 'Sản phẩm có thể được đổi trả trong vòng 7 ngày nếu: còn nguyên seal/bao bì, chưa qua sử dụng, có hóa đơn mua hàng. Sản phẩm đặt hàng theo yêu cầu đặc biệt không được đổi trả.' },
        { title: '6. Quyền sở hữu trí tuệ', content: 'Tất cả nội dung trên website bao gồm văn bản, hình ảnh, logo, thiết kế đều thuộc quyền sở hữu của VIES hoặc các đối tác. Nghiêm cấm sao chép, phân phối mà không có sự cho phép bằng văn bản.' },
        { title: '7. Giới hạn trách nhiệm', content: 'VIES không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên phát sinh từ việc sử dụng hoặc không thể sử dụng website hoặc sản phẩm, trừ khi có quy định khác của pháp luật.' },
        { title: '8. Thay đổi điều khoản', content: 'VIES có quyền sửa đổi các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website. Việc tiếp tục sử dụng website đồng nghĩa với việc bạn chấp nhận các thay đổi.' },
      ],
    },
    en: {
      title: 'Terms of Service',
      updated: 'Last updated: January 2026',
      sections: [
        { title: '1. Acceptance of Terms', content: 'By accessing and using v-ies.com website, you agree to comply with the terms and conditions stated below. If you do not agree with any terms, please do not use the website.' },
        { title: '2. Product Information', content: 'We strive to provide the most accurate product information possible. However, specifications, images, and prices may change without prior notice. Prices displayed on the website are for reference only; official prices will be confirmed upon quotation.' },
        { title: '3. Orders and Payment', content: 'Orders are only confirmed after VIES sends email/phone confirmation. We reserve the right to reject orders if inaccurate information or signs of fraud are detected. Payment must be made according to the agreed method.' },
        { title: '4. Delivery', content: 'Delivery times are estimates and may vary depending on stock availability and delivery location. VIES is not responsible for delays due to force majeure such as natural disasters or epidemics.' },
        { title: '5. Returns and Exchanges', content: 'Products can be returned within 7 days if: still sealed/packaged, unused, with purchase invoice. Custom-ordered products cannot be returned.' },
        { title: '6. Intellectual Property', content: 'All content on the website including text, images, logos, and designs are owned by VIES or its partners. Copying or distributing without written permission is strictly prohibited.' },
        { title: '7. Limitation of Liability', content: 'VIES is not liable for any direct, indirect, or incidental damages arising from the use or inability to use the website or products, unless otherwise required by law.' },
        { title: '8. Changes to Terms', content: 'VIES reserves the right to modify these terms at any time. Changes will be effective immediately upon posting on the website. Continued use of the website means you accept the changes.' },
      ],
    },
    km: {
      title: 'លក្ខខណ្ឌប្រើប្រាស់',
      updated: 'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ: មករា ២០២៦',
      sections: [
        { title: '១. ការទទួលយកលក្ខខណ្ឌ', content: 'តាមរយៈការចូលប្រើ និងប្រើប្រាស់គេហទំព័រ v-ies.com អ្នកយល់ព្រមអនុវត្តតាមលក្ខខណ្ឌដែលបានចែងខាងក្រោម។ ប្រសិនបើអ្នកមិនយល់ព្រមជាមួយលក្ខខណ្ឌណាមួយ សូមកុំប្រើប្រាស់គេហទំព័រ។' },
        { title: '២. ព័ត៌មានផលិតផល', content: 'យើងខិតខំផ្តល់ព័ត៌មានផលិតផលត្រឹមត្រូវបំផុតតាមដែលអាចធ្វើទៅបាន។ ទោះជាយ៉ាងណា លក្ខណៈបច្ចេកទេស រូបភាព និងតម្លៃអាចផ្លាស់ប្តូរដោយគ្មានការជូនដំណឹងជាមុន។' },
        { title: '៣. ការបញ្ជាទិញ និងការបង់ប្រាក់', content: 'ការបញ្ជាទិញត្រូវបានបញ្ជាក់បន្ទាប់ពី VIES ផ្ញើអ៊ីមែល/ទូរស័ព្ទបញ្ជាក់។ យើងរក្សាសិទ្ធិក្នុងការបដិសេធការបញ្ជាទិញប្រសិនបើរកឃើញព័ត៌មានមិនត្រឹមត្រូវ។' },
        { title: '៤. ការដឹកជញ្ជូន', content: 'ពេលវេលាដឹកជញ្ជូនគឺជាការប៉ាន់ស្មាន ហើយអាចប្រែប្រួលអាស្រ័យលើភាពអាចរកបានក្នុងស្តុក និងទីតាំងដឹកជញ្ជូន។' },
        { title: '៥. ការប្រគល់ និងដូរ', content: 'ផលិតផលអាចប្រគល់វិញក្នុងរយៈពេល ៧ ថ្ងៃប្រសិនបើ: នៅតែមានត្រា/វេចខ្ចប់ មិនទាន់បានប្រើប្រាស់ មានវិក្កយបត្រទិញ។' },
        { title: '៦. កម្មសិទ្ធិបញ្ញា', content: 'មាតិកាទាំងអស់នៅលើគេហទំព័ររួមទាំងអត្ថបទ រូបភាព និមិត្តសញ្ញា និងការរចនាជាកម្មសិទ្ធិរបស់ VIES ឬដៃគូរបស់ខ្លួន។' },
        { title: '៧. ការកំណត់ទំនួលខុសត្រូវ', content: 'VIES មិនទទួលខុសត្រូវចំពោះការខូចខាតផ្ទាល់ ប្រយោល ឬចៃដន្យណាមួយដែលកើតឡើងពីការប្រើប្រាស់ ឬអសមត្ថភាពក្នុងការប្រើប្រាស់គេហទំព័រ ឬផលិតផល។' },
        { title: '៨. ការផ្លាស់ប្តូរលក្ខខណ្ឌ', content: 'VIES រក្សាសិទ្ធិក្នុងការកែប្រែលក្ខខណ្ឌទាំងនេះនៅពេលណាក៏បាន។ ការផ្លាស់ប្តូរនឹងមានប្រសិទ្ធភាពភ្លាមៗនៅពេលប្រកាសនៅលើគេហទំព័រ។' },
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
          {c.sections.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-600">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
