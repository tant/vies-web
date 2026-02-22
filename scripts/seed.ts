import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

const downloadImage = (url: string, filepath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(filepath)

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          downloadImage(redirectUrl, filepath).then(resolve).catch(reject)
          return
        }
      }
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })
  })
}

// Upload image from local path to Media collection
const uploadProductImage = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  imagePath: string,
  altText: string
): Promise<number | null> => {
  try {
    const absolutePath = path.join(process.cwd(), 'public', imagePath)
    if (!fs.existsSync(absolutePath)) {
      console.log(`    Image not found: ${imagePath}`)
      return null
    }

    // Check if image already exists by filename
    const filename = path.basename(imagePath)
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { contains: filename.replace(/\.[^.]+$/, '') } },
    })

    if (existing.docs.length > 0) {
      return existing.docs[0].id as number
    }

    // Read file and create buffer
    const fileBuffer = fs.readFileSync(absolutePath)
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg'

    const created = await payload.create({
      collection: 'media',
      data: {
        alt: altText,
      },
      file: {
        data: fileBuffer,
        mimetype: mimeType,
        name: filename,
        size: fileBuffer.length,
      },
    })

    console.log(`    Uploaded: ${filename}`)
    return created.id as number
  } catch (error) {
    console.error(`    Error uploading image ${imagePath}:`, error)
    return null
  }
}

const makeRichText = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [
          { type: 'text', text, version: 1, format: 0, style: '', detail: 0, mode: 'normal' },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        textStyle: '',
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const seedData = async () => {
  const payload = await getPayload({ config: await config })

  console.log('🌱 Starting seed...')

  // Create temp directory for downloads
  const tempDir = path.join(process.cwd(), 'temp-images')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  // Brand data from manufacturer research
  const brandsData = [
    { name: 'SKF', slug: 'skf', website: 'https://www.skf.com', description: { vi: 'Thương hiệu vòng bi hàng đầu thế giới từ Thụy Điển, thành lập năm 1907', en: 'World-leading bearing brand from Sweden, established in 1907' } },
    { name: 'FAG', slug: 'fag', website: 'https://www.schaeffler.com', description: { vi: 'Thương hiệu vòng bi cao cấp từ Đức, thuộc tập đoàn Schaeffler', en: 'Premium bearing brand from Germany, part of Schaeffler Group' } },
    { name: 'NTN', slug: 'ntn', website: 'https://www.ntn.co.jp', description: { vi: 'Thương hiệu vòng bi uy tín từ Nhật Bản', en: 'Trusted bearing brand from Japan' } },
    { name: 'TIMKEN', slug: 'timken', website: 'https://www.timken.com', description: { vi: 'Thương hiệu vòng bi công nghiệp hàng đầu từ Mỹ', en: 'Leading industrial bearing brand from USA' } },
    { name: 'Optibelt', slug: 'optibelt', website: 'https://www.optibelt.com', description: { vi: 'Thương hiệu dây đai công nghiệp cao cấp từ Đức', en: 'Premium industrial belt brand from Germany' } },
    { name: 'Bando', slug: 'bando', website: 'https://www.bando.co.jp', description: { vi: 'Thương hiệu dây đai công nghiệp uy tín từ Nhật Bản', en: 'Trusted industrial belt brand from Japan' } },
    { name: 'Tsubaki', slug: 'tsubaki', website: 'https://www.tsubakimoto.jp', description: { vi: 'Thương hiệu xích công nghiệp hàng đầu từ Nhật Bản', en: 'Leading industrial chain brand from Japan' } },
  ]

  // Categories from manufacturer research
  const categoriesData = [
    { name: { vi: 'Vòng bi', en: 'Bearings' }, slug: 'vong-bi', description: { vi: 'Vòng bi công nghiệp chính hãng từ các thương hiệu hàng đầu thế giới', en: 'Genuine industrial bearings from world-leading brands' } },
    { name: { vi: 'Bôi trơn', en: 'Lubrication' }, slug: 'boi-tron', description: { vi: 'Mỡ bôi trơn và hệ thống bôi trơn tự động chính hãng SKF', en: 'Genuine SKF lubricants and automatic lubrication systems' } },
    { name: { vi: 'Dụng cụ bảo trì', en: 'Maintenance Tools' }, slug: 'dung-cu-bao-tri', description: { vi: 'Dụng cụ lắp đặt và bảo trì vòng bi chuyên nghiệp', en: 'Professional bearing installation and maintenance tools' } },
    { name: { vi: 'Truyền động', en: 'Power Transmission' }, slug: 'truyen-dong', description: { vi: 'Dây đai, xích và các sản phẩm truyền động công nghiệp', en: 'Belts, chains and industrial power transmission products' } },
    { name: { vi: 'Gối đỡ', en: 'Bearing Housings' }, slug: 'goi-do', description: { vi: 'Gối đỡ vòng bi và cụm gối bi công nghiệp', en: 'Bearing housings and pillow block units' } },
    { name: { vi: 'Khí nén', en: 'Pneumatics' }, slug: 'khi-nen', description: { vi: 'Thiết bị khí nén công nghiệp', en: 'Industrial pneumatic equipment' } },
  ]

  // Products from manufacturer research (18 products)
  const productsData = [
    // Lubrication products
    {
      name: { vi: 'Mỡ bôi trơn đa dụng SKF LGMT 2', en: 'SKF LGMT 2 General Purpose Grease' },
      slug: 'skf-lgmt-2',
      sku: 'LGMT 2',
      brand: 'skf',
      category: 'boi-tron',
      shortDescription: { vi: 'Mỡ bôi trơn đa dụng NLGI 2, gốc dầu khoáng với chất làm đặc lithium', en: 'General purpose NLGI 2 grease, mineral oil based with lithium thickener' },
      description: { vi: 'SKF LGMT 2 là mỡ bôi trơn đa dụng gốc dầu khoáng với chất làm đặc xà phòng lithium. Đây là loại mỡ NLGI cấp 2 có độ ổn định oxy hóa tuyệt vời, độ ổn định cơ học tốt, khả năng chống nước và chống gỉ xuất sắc. Phù hợp cho vòng bi có đường kính trục đến 100mm.', en: 'SKF LGMT 2 is a general purpose mineral oil based grease with lithium soap thickener. This NLGI 2 grade grease offers excellent oxidation stability, good mechanical stability, and excellent water resistance and rust inhibiting properties. Suitable for bearings with shaft diameter up to 100mm.' },
      specifications: [
        { key: { vi: 'Cấp NLGI', en: 'NLGI Grade' }, value: { vi: '2', en: '2' } },
        { key: { vi: 'Dầu gốc', en: 'Base Oil' }, value: { vi: 'Dầu khoáng', en: 'Mineral oil' } },
        { key: { vi: 'Chất làm đặc', en: 'Thickener' }, value: { vi: 'Xà phòng lithium', en: 'Lithium soap' } },
        { key: { vi: 'Màu sắc', en: 'Color' }, value: { vi: 'Nâu đỏ', en: 'Red-brown' } },
        { key: { vi: 'Nhiệt độ hoạt động', en: 'Operating Temp' }, value: { vi: '-30°C đến +120°C', en: '-30°C to +120°C' } },
      ],
      featured: true,
      image: '/images/products-new/lgmt-2-1.jpg',
    },
    {
      name: { vi: 'Mỡ bôi trơn đa dụng SKF LGMT 3', en: 'SKF LGMT 3 General Purpose Grease' },
      slug: 'skf-lgmt-3',
      sku: 'LGMT 3',
      brand: 'skf',
      category: 'boi-tron',
      shortDescription: { vi: 'Mỡ bôi trơn đa dụng NLGI 3, cho vòng bi lớn và nhiệt độ cao', en: 'General purpose NLGI 3 grease, for large bearings and high temperatures' },
      description: { vi: 'SKF LGMT 3 là mỡ bôi trơn đa dụng gốc dầu khoáng với chất làm đặc xà phòng lithium. Đây là loại mỡ NLGI cấp 3, có tính chống rỉ sét tuyệt vời và độ ổn định oxy hóa cao. Phù hợp cho vòng bi có đường kính trục trên 100mm, thiết bị hoạt động theo phương đứng, và môi trường nhiệt độ cao liên tục trên 35°C.', en: 'SKF LGMT 3 is a general purpose mineral oil based grease with lithium soap thickener. This NLGI 3 grade grease features excellent rust inhibiting properties and high oxidation stability. Suitable for bearings with shaft diameter over 100mm, vertical shaft applications, and continuous high ambient temperatures above 35°C.' },
      specifications: [
        { key: { vi: 'Cấp NLGI', en: 'NLGI Grade' }, value: { vi: '3', en: '3' } },
        { key: { vi: 'Dầu gốc', en: 'Base Oil' }, value: { vi: 'Dầu khoáng', en: 'Mineral oil' } },
        { key: { vi: 'Chất làm đặc', en: 'Thickener' }, value: { vi: 'Xà phòng lithium', en: 'Lithium soap' } },
        { key: { vi: 'Nhiệt độ hoạt động', en: 'Operating Temp' }, value: { vi: '-30°C đến +120°C', en: '-30°C to +120°C' } },
        { key: { vi: 'Điểm nhỏ giọt', en: 'Dropping Point' }, value: { vi: '>180°C', en: '>180°C' } },
      ],
      featured: true,
      image: '/images/products-new/lgmt-3-1.jpg',
    },
    {
      name: { vi: 'Mỡ chịu tải nặng SKF LGEP 2', en: 'SKF LGEP 2 High Load EP Grease' },
      slug: 'skf-lgep-2',
      sku: 'LGEP 2',
      brand: 'skf',
      category: 'boi-tron',
      shortDescription: { vi: 'Mỡ chịu tải nặng với phụ gia cực áp EP cho điều kiện khắc nghiệt', en: 'High load grease with EP additives for harsh conditions' },
      description: { vi: 'SKF LGEP 2 là mỡ bôi trơn gốc dầu khoáng với chất làm đặc xà phòng lithium và phụ gia cực áp (EP). Có độ ổn định cơ học xuất sắc, đặc tính ức chế ăn mòn cực tốt và hiệu suất EP tuyệt vời. Phù hợp cho các ứng dụng chịu tải trọng lớn và điều kiện khắc nghiệt.', en: 'SKF LGEP 2 is a mineral oil based grease with lithium soap thickener and extreme pressure (EP) additives. Features excellent mechanical stability, extremely good corrosion inhibiting properties, and excellent EP performance. Suitable for heavy load applications and harsh conditions.' },
      specifications: [
        { key: { vi: 'Cấp NLGI', en: 'NLGI Grade' }, value: { vi: '2', en: '2' } },
        { key: { vi: 'Phụ gia', en: 'Additives' }, value: { vi: 'Cực áp (EP)', en: 'EP (Extreme Pressure)' } },
        { key: { vi: 'Nhiệt độ hoạt động', en: 'Operating Temp' }, value: { vi: '-20°C đến +110°C', en: '-20°C to +110°C' } },
        { key: { vi: 'Điểm nhỏ giọt', en: 'Dropping Point' }, value: { vi: '>180°C', en: '>180°C' } },
      ],
      featured: false,
      image: '/images/products-new/lgep-2-1.jpg',
    },
    {
      name: { vi: 'Mỡ chống nước SKF LGNL 2', en: 'SKF LGNL 2 Water Resistant Grease' },
      slug: 'skf-lgnl-2',
      sku: 'LGNL 2',
      brand: 'skf',
      category: 'boi-tron',
      shortDescription: { vi: 'Mỡ bôi trơn chống nước và chống ăn mòn tuyệt vời', en: 'Excellent water resistance and corrosion protection grease' },
      description: { vi: 'SKF LGNL 2 là mỡ bôi trơn với khả năng chống nước và chống ăn mòn tuyệt vời. Có độ ổn định cơ học tốt, khả năng bơm tốt và bảo vệ chống mài mòn xuất sắc. Phù hợp cho thiết bị làm việc trong môi trường ẩm ướt và có rung động.', en: 'SKF LGNL 2 is a grease with excellent water and corrosion resistance. Features good mechanical stability, good pumpability, and excellent wear protection. Suitable for equipment operating in wet environments and vibrating applications.' },
      specifications: [
        { key: { vi: 'Cấp NLGI', en: 'NLGI Grade' }, value: { vi: '2', en: '2' } },
        { key: { vi: 'Chống nước', en: 'Water Resistance' }, value: { vi: 'Xuất sắc', en: 'Excellent' } },
        { key: { vi: 'Chống ăn mòn', en: 'Corrosion Protection' }, value: { vi: 'Xuất sắc', en: 'Excellent' } },
      ],
      featured: false,
      image: '/images/products-new/lgnl-2-1.jpg',
    },
    {
      name: { vi: 'Bơm mỡ tự động SKF P253 Smart', en: 'SKF P253 Smart Lubrication Pump' },
      slug: 'skf-p253-smart',
      sku: 'P253 Smart',
      brand: 'skf',
      category: 'boi-tron',
      shortDescription: { vi: 'Bơm mỡ tự động thông minh với kết nối không dây qua ứng dụng eLube', en: 'Smart automatic lubrication pump with wireless connectivity via eLube app' },
      description: { vi: 'SKF P253 Smart là bơm mỡ tự động thuộc dòng sản phẩm eLube của SKF. Người dùng có thể xác định từ xa mức chất bôi trơn và chức năng bơm thông qua ứng dụng SKF eLube. Không cần phải dừng máy hoặc truy cập vật lý vào máy bơm để kiểm tra. Có sẵn 4 kích cỡ bình chứa lên đến 15 lít.', en: 'SKF P253 Smart is an automatic lubrication pump from SKF eLube product line. Users can remotely determine lubricant levels and pump functions via the SKF eLube App. No need to stop the machine or physically access the pump for inspection. Available in four reservoir sizes up to 15 liters.' },
      specifications: [
        { key: { vi: 'Kích thước bình', en: 'Reservoir Sizes' }, value: { vi: 'Đến 15L', en: 'Up to 15L' } },
        { key: { vi: 'Kết nối', en: 'Connectivity' }, value: { vi: 'Bluetooth', en: 'Wireless (Bluetooth)' } },
        { key: { vi: 'Ứng dụng', en: 'App' }, value: { vi: 'SKF eLube', en: 'SKF eLube' } },
        { key: { vi: 'Điện áp', en: 'Voltage' }, value: { vi: '24V DC', en: '24V DC' } },
      ],
      featured: true,
      image: '/images/products-new/bom-mo-p253-smart-1.jpg',
    },
    // Maintenance tools
    {
      name: { vi: 'Máy gia nhiệt cảm ứng SKF TMBH 1', en: 'SKF TMBH 1 Portable Induction Heater' },
      slug: 'skf-tmbh-1',
      sku: 'TMBH 1',
      brand: 'skf',
      category: 'dung-cu-bao-tri',
      shortDescription: { vi: 'Máy gia nhiệt cảm ứng di động nhẹ chỉ 4.5kg, hiệu suất trên 85%', en: 'Lightweight portable induction heater at 4.5kg, over 85% efficiency' },
      description: { vi: 'SKF TMBH 1 là máy gia nhiệt cảm ứng di động sử dụng công nghệ tần số trung bình tiên tiến. Thiết bị hoạt động gần như êm ái, chỉ nặng 4.5 kg, có hiệu suất gia nhiệt trên 85%. Phù hợp cho vòng bi có đường kính trong 20-100mm và trọng lượng tối đa 5kg. Có chế độ nhiệt độ và thời gian.', en: 'SKF TMBH 1 is a portable induction heater using advanced medium-frequency technology. The device operates nearly silently, weighs only 4.5 kg, with heating efficiency over 85%. Suitable for bearings with inner diameter 20-100mm and maximum weight 5kg. Features temperature and time control modes.' },
      specifications: [
        { key: { vi: 'Trọng lượng', en: 'Weight' }, value: { vi: '4.5 kg', en: '4.5 kg' } },
        { key: { vi: 'Đường kính trong vòng bi', en: 'Bearing ID Range' }, value: { vi: '20-100 mm', en: '20-100 mm' } },
        { key: { vi: 'Trọng lượng vòng bi tối đa', en: 'Max Bearing Weight' }, value: { vi: '5 kg', en: '5 kg' } },
        { key: { vi: 'Phạm vi nhiệt độ', en: 'Temperature Range' }, value: { vi: '0-200°C', en: '0-200°C' } },
        { key: { vi: 'Hiệu suất', en: 'Heating Efficiency' }, value: { vi: '>85%', en: '>85%' } },
      ],
      featured: true,
      image: '/images/products-new/skf-tmbh-5-may-gia-nhiet-cam-tay-1.jpg',
    },
    {
      name: { vi: 'Thiết bị gia nhiệt cảm ứng SKF TIH', en: 'SKF TIH Induction Heater' },
      slug: 'skf-tih',
      sku: 'TIH',
      brand: 'skf',
      category: 'dung-cu-bao-tri',
      shortDescription: { vi: 'Máy gia nhiệt cảm ứng công nghiệp cho vòng bi lớn đến 300kg', en: 'Industrial induction heater for large bearings up to 300kg' },
      description: { vi: 'SKF TIH là dòng máy gia nhiệt cảm ứng công nghiệp được trang bị các tính năng an toàn và dễ sử dụng. Có cánh tay đỡ vòng bi giảm nguy cơ lật, thiết kế công thái học giảm mệt mỏi cho người vận hành. Cuộn dây cảm ứng đặt bên ngoài cho phép làm nóng vòng bi từ vài kg đến 300kg. Có 3 model: TIH 030m (<40kg), TIH 100m (<120kg), TIH 220m (<300kg).', en: 'SKF TIH is an industrial induction heater series equipped with safety and ease-of-use features. Features bearing support arm to reduce tipping risk, ergonomic design to reduce operator fatigue. External induction coil allows heating bearings from a few kg up to 300kg. Available in 3 models: TIH 030m (<40kg), TIH 100m (<120kg), TIH 220m (<300kg).' },
      specifications: [
        { key: { vi: 'Model', en: 'Models' }, value: { vi: 'TIH 030m, TIH 100m, TIH 220m', en: 'TIH 030m, TIH 100m, TIH 220m' } },
        { key: { vi: 'Trọng lượng vòng bi tối đa', en: 'Max Bearing Weight' }, value: { vi: 'Đến 300 kg', en: 'Up to 300 kg' } },
        { key: { vi: 'Điện áp', en: 'Voltage Options' }, value: { vi: '230V hoặc 400-460V', en: '230V or 400-460V' } },
      ],
      featured: false,
      image: '/images/products-new/skf-tih-thiet-bi-gia-nhiet-1.jpg',
    },
    {
      name: { vi: 'Bộ cảo thủy lực SKF TMMA', en: 'SKF TMMA Hydraulic Puller' },
      slug: 'skf-tmma',
      sku: 'TMMA',
      brand: 'skf',
      category: 'dung-cu-bao-tri',
      shortDescription: { vi: 'Bộ cảo thủy lực tích hợp xi lanh và bơm, lực kéo đến 100kN', en: 'Integrated hydraulic puller with cylinder and pump, pulling force up to 100kN' },
      description: { vi: 'SKF TMMA là bộ cảo thủy lực tích hợp xi lanh, bơm và bộ cảo - không cần lắp ráp hoặc mua bộ phận riêng. Van an toàn giúp trục chính và bộ cảo không bị quá tải. TMMA 100H có lực kéo tối đa 100 kN và hành trình 80 mm. TMMA 75H có lực kéo 75 kN và hành trình 75 mm. Đi kèm thanh nối dài và thanh định tâm.', en: 'SKF TMMA is an integrated hydraulic puller with cylinder, pump and puller - no assembly or separate parts needed. Safety valve prevents overloading of spindle and puller. TMMA 100H has maximum pulling force of 100 kN and 80 mm stroke. TMMA 75H has 75 kN pulling force and 75 mm stroke. Includes extension rods and centering tip.' },
      specifications: [
        { key: { vi: 'Model', en: 'Models' }, value: { vi: 'TMMA 75H, TMMA 100H', en: 'TMMA 75H, TMMA 100H' } },
        { key: { vi: 'Lực kéo tối đa', en: 'Max Pulling Force' }, value: { vi: '75-100 kN', en: '75-100 kN' } },
        { key: { vi: 'Hành trình', en: 'Stroke' }, value: { vi: '75-80 mm', en: '75-80 mm' } },
      ],
      featured: false,
      image: '/images/products-new/skf-tmma-1.jpg',
    },
    {
      name: { vi: 'Bộ dụng cụ lắp vòng bi SKF TMFT 36', en: 'SKF TMFT 36 Bearing Fitting Tool Kit' },
      slug: 'skf-tmft-36',
      sku: 'TMFT 36',
      brand: 'skf',
      category: 'dung-cu-bao-tri',
      shortDescription: { vi: 'Bộ dụng cụ lắp vòng bi chuyên nghiệp cho đường kính trong 10-55mm', en: 'Professional bearing fitting kit for bore diameter 10-55mm' },
      description: { vi: 'SKF TMFT 36 là bộ dụng cụ lắp vòng bi được thiết kế cho việc lắp nhanh chóng, chính xác và an toàn vòng bi có đường kính trong từ 10 đến 55 mm. Bao gồm 36 vòng chịu va đập, 3 ống lót truyền lực và búa chì bọc cao su 0.9kg, đóng gói trong hộp đựng nhẹ. Thiết kế chính xác giúp truyền lực lắp qua vòng trong/ngoài, không qua các phần tử lăn, tránh hư hỏng vòng bi.', en: 'SKF TMFT 36 is a bearing fitting tool kit designed for quick, precise and safe mounting of bearings with bore diameters from 10 to 55 mm. Includes 36 impact rings, 3 impact sleeves and 0.9kg dead-blow hammer, packed in lightweight carrying case. Precise design transmits mounting force through inner/outer rings, not through rolling elements, preventing bearing damage.' },
      specifications: [
        { key: { vi: 'Đường kính trong', en: 'Bore Diameter Range' }, value: { vi: '10-55 mm', en: '10-55 mm' } },
        { key: { vi: 'Đường kính ngoài', en: 'Outer Diameter Range' }, value: { vi: '26-120 mm', en: '26-120 mm' } },
        { key: { vi: 'Vòng chịu va đập', en: 'Impact Rings' }, value: { vi: '36 cái', en: '36 pcs' } },
        { key: { vi: 'Trọng lượng búa', en: 'Hammer Weight' }, value: { vi: '0.9 kg', en: '0.9 kg' } },
      ],
      featured: true,
      image: '/images/products-new/tmft-36-1.jpg',
    },
    // Bearings
    {
      name: { vi: 'Vòng bi cầu SKF', en: 'SKF Deep Groove Ball Bearings' },
      slug: 'vong-bi-cau-skf',
      sku: '6205-2RS',
      brand: 'skf',
      category: 'vong-bi',
      shortDescription: { vi: 'Vòng bi cầu một dãy, loại vòng bi được sử dụng rộng rãi nhất', en: 'Single row deep groove ball bearings, most widely used bearing type' },
      description: { vi: 'Vòng bi cầu SKF (DGBB - Deep Groove Ball Bearings) là loại vòng bi được sử dụng rộng rãi nhất và đặc biệt linh hoạt. Chúng có độ ma sát thấp và được tối ưu hóa để giảm tiếng ồn và độ rung thấp, cho phép tốc độ quay cao. Chúng chịu được tải trọng hướng kính và hướng trục theo cả hai hướng, dễ lắp đặt và yêu cầu bảo trì ít hơn so với các loại vòng bi khác.', en: 'SKF Deep Groove Ball Bearings (DGBB) are the most widely used bearing type and particularly versatile. They have low friction and are optimized for low noise and low vibration, enabling high rotational speeds. They accommodate radial and axial loads in both directions, are easy to install and require less maintenance than other bearing types.' },
      specifications: [
        { key: { vi: 'Loại', en: 'Type' }, value: { vi: 'Bi cầu một dãy', en: 'Single row deep groove' } },
        { key: { vi: 'Tải trọng', en: 'Load Type' }, value: { vi: 'Hướng kính + Dọc trục (2 hướng)', en: 'Radial + Axial (both directions)' } },
        { key: { vi: 'Phớt', en: 'Sealing Options' }, value: { vi: 'Hở, 2Z (nắp), 2RS (phớt)', en: 'Open, 2Z (shields), 2RS (seals)' } },
        { key: { vi: 'Ví dụ 6205', en: 'Example 6205' }, value: { vi: '25x52x15mm', en: '25x52x15mm' } },
      ],
      featured: true,
      image: '/images/products-new/vong-bi-cau-1.jpg',
    },
    {
      name: { vi: 'Vòng bi đũa trụ FAG', en: 'FAG Cylindrical Roller Bearings' },
      slug: 'vong-bi-dua-fag',
      sku: 'NU206E',
      brand: 'fag',
      category: 'vong-bi',
      shortDescription: { vi: 'Vòng bi đũa trụ với thiết kế cải tiến, tải trọng hướng trục tăng 50%', en: 'Cylindrical roller bearings with improved design, 50% higher axial load' },
      description: { vi: 'Vòng bi đũa trụ FAG có thiết kế mới với mặt đầu vòng bi cong làm tăng kích thước bề mặt tiếp xúc, giảm đáng kể áp lực tiếp xúc. Tải trọng hướng trục cho phép được tăng thêm theo hệ số 1.5 so với vòng bi tiêu chuẩn. Nhiệt độ vòng bi thấp hơn nhờ giảm mô-men quay do ma sát trong điều kiện tải trọng hướng trục được giảm thêm đến 50%.', en: 'FAG cylindrical roller bearings feature a new design with curved roller ends that increase contact surface area, significantly reducing contact pressure. Allowable axial load is increased by a factor of 1.5 compared to standard bearings. Lower bearing temperature due to 50% reduction in friction-induced torque under axial loading conditions.' },
      specifications: [
        { key: { vi: 'Loại', en: 'Type' }, value: { vi: 'Bi đũa trụ', en: 'Cylindrical roller' } },
        { key: { vi: 'Thiết kế', en: 'Design' }, value: { vi: 'TB (cải tiến)', en: 'TB (improved)' } },
        { key: { vi: 'Tiêu chuẩn', en: 'Standards' }, value: { vi: 'DIN 5412', en: 'DIN 5412' } },
        { key: { vi: 'Ví dụ NU206', en: 'Example NU206' }, value: { vi: '30x62x16mm', en: '30x62x16mm' } },
      ],
      featured: true,
      image: '/images/products-new/vong-bi-tru-dua-fag-1.jpg',
    },
    {
      name: { vi: 'Vòng bi tang trống SKF', en: 'SKF Spherical Roller Bearings' },
      slug: 'vong-bi-tang-trong',
      sku: '22210E',
      brand: 'skf',
      category: 'vong-bi',
      shortDescription: { vi: 'Vòng bi tự lựa hai dãy, chịu tải hướng tâm và dọc trục rất nặng', en: 'Self-aligning double row bearings for very heavy radial and axial loads' },
      description: { vi: 'Vòng bi tang trống SKF (SRB - Spherical Roller Bearings) là giải pháp cho tải trọng hướng tâm và dọc trục rất nặng trong các ứng dụng có xu hướng lệch trục hoặc võng trục. Với khả năng chịu tải cao và khả năng điều chỉnh độ lệch, mang lại chi phí bảo trì thấp và tuổi thọ vòng bi lâu dài. Có hai dãy bi dạng tang trống, tự lựa theo rãnh lăn cầu trên vòng ngoài.', en: 'SKF Spherical Roller Bearings (SRB) are the solution for very heavy radial and axial loads in applications prone to misalignment or shaft deflection. High load capacity and misalignment accommodation provide low maintenance cost and long bearing life. Features two rows of barrel-shaped rollers, self-aligning on spherical raceway in outer ring.' },
      specifications: [
        { key: { vi: 'Loại', en: 'Type' }, value: { vi: 'Bi tang trống hai dãy', en: 'Spherical roller, double row' } },
        { key: { vi: 'Tự lựa', en: 'Self-aligning' }, value: { vi: 'Có', en: 'Yes' } },
        { key: { vi: 'Tải trọng', en: 'Load Type' }, value: { vi: 'Hướng tâm + Dọc trục nặng', en: 'Heavy radial + axial' } },
        { key: { vi: 'Ví dụ 22210E', en: 'Example 22210E' }, value: { vi: '50x90x23mm', en: '50x90x23mm' } },
      ],
      featured: true,
      image: '/images/products-new/vong-bi-tang-trong-1.jpg',
    },
    {
      name: { vi: 'Vòng bi tiếp xúc góc', en: 'Angular Contact Ball Bearings' },
      slug: 'vong-bi-tiep-xuc-goc',
      sku: '7205',
      brand: 'skf',
      category: 'vong-bi',
      shortDescription: { vi: 'Vòng bi chịu tải kết hợp hướng tâm và dọc trục đồng thời', en: 'Bearings for combined radial and axial loads simultaneously' },
      description: { vi: 'Vòng bi tiếp xúc góc có các rãnh lăn vòng trong và vòng ngoài được dịch chuyển tương đối với nhau theo hướng của trục vòng bi. Điều này có nghĩa là các vòng bi này được thiết kế để chịu được tải trọng kết hợp, tức là tác dụng đồng thời của tải trọng hướng tâm và tải dọc trục. Thường được sử dụng theo cặp hoặc bộ.', en: 'Angular contact ball bearings have inner and outer ring raceways displaced relative to each other in the direction of the bearing axis. This means these bearings are designed for combined loads, i.e., simultaneous radial and axial loads. Usually used in pairs or sets.' },
      specifications: [
        { key: { vi: 'Loại', en: 'Type' }, value: { vi: 'Bi tiếp xúc góc', en: 'Angular contact ball' } },
        { key: { vi: 'Góc tiếp xúc', en: 'Contact Angles' }, value: { vi: '15°, 25°, 40°', en: '15°, 25°, 40°' } },
        { key: { vi: 'Tốc độ cao', en: 'High Speed' }, value: { vi: 'Có', en: 'Yes' } },
      ],
      featured: false,
      image: '/images/products-new/vong-bi-tiep-xuc-goc-1.jpg',
    },
    {
      name: { vi: 'Vòng bi đũa trụ SKF', en: 'SKF Cylindrical Roller Bearings' },
      slug: 'vong-bi-dua-skf',
      sku: 'NU208',
      brand: 'skf',
      category: 'vong-bi',
      shortDescription: { vi: 'Vòng bi đũa chịu tải hướng kính lớn và tốc độ cao', en: 'Cylindrical roller bearings for heavy radial loads and high speeds' },
      description: { vi: 'Vòng bi đũa SKF (CRB - Cylindrical Roller Bearings) có thể đáp ứng những thách thức của các ứng dụng phải đối mặt với tải trọng hướng kính lớn và tốc độ cao. Có khả năng dịch chuyển dọc trục trong quá trình hoạt động, độ cứng vững cao, ma sát thấp và tuổi thọ dài. Thiết kế mặt bích mở cùng với bề mặt hoàn thiện thúc đẩy sự hình thành màng bôi trơn.', en: 'SKF Cylindrical Roller Bearings (CRB) can meet the challenges of applications facing heavy radial loads and high speeds. Feature axial displacement capability during operation, high rigidity, low friction and long service life. Open flange design combined with surface finish promotes lubricant film formation.' },
      specifications: [
        { key: { vi: 'Loại', en: 'Type' }, value: { vi: 'Bi đũa trụ', en: 'Cylindrical roller' } },
        { key: { vi: 'Tải trọng', en: 'Load Type' }, value: { vi: 'Hướng kính nặng', en: 'Heavy radial' } },
        { key: { vi: 'Dịch chuyển dọc trục', en: 'Axial Displacement' }, value: { vi: 'Có (trừ NJ, NUP)', en: 'Yes (except NJ, NUP)' } },
      ],
      featured: false,
      image: '/images/products-new/vong-bi-dua-1.jpg',
    },
    {
      name: { vi: 'Vòng bi từ tính SKF', en: 'SKF Magnetic Bearings' },
      slug: 'vong-bi-tu-tinh',
      sku: 'Magnetic Bearing',
      brand: 'skf',
      category: 'vong-bi',
      shortDescription: { vi: 'Vòng bi từ tính chủ động không tiếp xúc, không ma sát và không mài mòn', en: 'Active magnetic bearings with no contact, no friction and no wear' },
      description: { vi: 'Vòng bi từ tính SKF hoạt động mà không tiếp xúc với bề mặt, loại bỏ ma sát và mài mòn. Nam châm điện tạo ra lực theo hướng tâm và hướng trục để nâng trục lên, cho phép quay không tiếp xúc. Hệ thống điều khiển chủ động giám sát và điều chỉnh liên tục dòng điện trong nam châm điện để duy trì vị trí trục. Độ chính xác và độ ổn định cao phù hợp với phạm vi hoạt động rộng hơn nhiều so với vòng bi thông thường.', en: 'SKF magnetic bearings operate without surface contact, eliminating friction and wear. Electromagnets generate radial and axial forces to levitate the shaft, enabling contactless rotation. Active control system continuously monitors and adjusts current in electromagnets to maintain shaft position. High precision and stability suitable for much wider operating range than conventional bearings.' },
      specifications: [
        { key: { vi: 'Loại', en: 'Type' }, value: { vi: 'Từ tính chủ động', en: 'Active magnetic' } },
        { key: { vi: 'Tiếp xúc', en: 'Contact' }, value: { vi: 'Không (không tiếp xúc)', en: 'None (contactless)' } },
        { key: { vi: 'Ma sát', en: 'Friction' }, value: { vi: 'Không', en: 'None' } },
        { key: { vi: 'Bôi trơn', en: 'Lubrication' }, value: { vi: 'Không cần', en: 'Not required' } },
      ],
      featured: false,
      image: '/images/products-new/vong-bi-tu-tinh-1.jpg',
    },
    // Bearing housings
    {
      name: { vi: 'Gối UC SKF', en: 'SKF UC Bearing Units' },
      slug: 'goi-uc-skf',
      sku: 'UCP205',
      brand: 'skf',
      category: 'goi-do',
      shortDescription: { vi: 'Cụm gối bi UC với hệ thống khóa chắc chắn và thiết kế chân đế vững chắc', en: 'UC bearing units with secure locking system and robust base design' },
      description: { vi: 'Cụm gối bi UC của SKF có hệ thống khóa chắc chắn bằng vít cố định hoặc ống lót, cho phép lắp và tháo dễ dàng. Kích thước tương thích với Tiêu chuẩn Công nghiệp Nhật Bản JIS, có thể hoán đổi với các sản phẩm hiện có. Thiết kế chân đế vững chắc với bề mặt nhẵn bóng loại bỏ chỗ trú ẩn gây ô nhiễm, cải thiện khả năng chống rung.', en: 'SKF UC bearing units feature secure locking with set screws or adapter sleeves, allowing easy mounting and dismounting. Dimensions compatible with Japanese Industrial Standard JIS, interchangeable with existing products. Robust base design with smooth surface eliminates contamination pockets, improves vibration resistance.' },
      specifications: [
        { key: { vi: 'Khóa', en: 'Locking' }, value: { vi: 'Vít cố định hoặc ống lót', en: 'Set screw or Adapter sleeve' } },
        { key: { vi: 'Tiêu chuẩn', en: 'Standard' }, value: { vi: 'Tương thích JIS', en: 'JIS compatible' } },
        { key: { vi: 'Loại vỏ', en: 'Housing Types' }, value: { vi: 'Gối đỡ, Mặt bích, Căng', en: 'Pillow block, Flange, Take-up' } },
        { key: { vi: 'Ví dụ UCP205', en: 'Example UCP205' }, value: { vi: 'Trục 25mm', en: '25mm shaft' } },
      ],
      featured: false,
      image: '/images/products-new/goi-uc-1.jpg',
    },
    // Power transmission
    {
      name: { vi: 'Đai đồng bộ Optibelt', en: 'Optibelt Timing Belts' },
      slug: 'dai-dong-bo-optibelt',
      sku: 'Timing Belt',
      brand: 'optibelt',
      category: 'truyen-dong',
      shortDescription: { vi: 'Đai đồng bộ cao cấp với độ chính xác định vị cao, chống trượt', en: 'Premium timing belts with high positioning accuracy, no slip' },
      description: { vi: 'Đai đồng bộ Optibelt sử dụng biên dạng HTD cải tiến đặc biệt phù hợp cho truyền động công suất và truyền động tuyến tính nhờ khả năng chống trượt cao và giảm tiếng ồn. Đai OMEGA là sự phát triển tiếp theo của đai HTD, có thể sử dụng trong puly HTD với biên dạng 3M, 5M, 8M và 14M. Có sẵn phiên bản cao su và polyurethane.', en: 'Optibelt timing belts use improved HTD profile especially suitable for power drives and linear drives thanks to high skip protection and reduced noise. OMEGA belts are the evolution of HTD, compatible with HTD pulleys in 3M, 5M, 8M and 14M profiles. Available in rubber and polyurethane versions.' },
      specifications: [
        { key: { vi: 'Biên dạng', en: 'Profiles' }, value: { vi: 'HTD, OMEGA, AT', en: 'HTD, OMEGA, AT' } },
        { key: { vi: 'Kích thước hệ mét', en: 'Metric Sizes' }, value: { vi: '3M, 5M, 8M, 14M', en: '3M, 5M, 8M, 14M' } },
        { key: { vi: 'Vật liệu', en: 'Materials' }, value: { vi: 'Cao su, Polyurethane', en: 'Rubber, Polyurethane' } },
      ],
      featured: true,
      image: '/images/products-new/dai-dong-bo-1.jpg',
    },
    {
      name: { vi: 'Dây đai thang Bando', en: 'Bando V-Belts' },
      slug: 'dai-thang-bando',
      sku: 'V-Belt',
      brand: 'bando',
      category: 'truyen-dong',
      shortDescription: { vi: 'Dây đai thang công nghiệp chất lượng cao từ Nhật Bản', en: 'High quality industrial V-belts from Japan' },
      description: { vi: 'Dây đai thang Bando có nhiều loại: đai thang thường (A/B/C/D/E), đai thang răng (AX/BX/CX), đai thang cải tiến (SPZ/SPA/SPB/SPC), và đai biến tốc (VA/VB/VC/VD/VE). Sợi tăng cường sợi thủy tinh và lõi cao su pha aramid mang lại độ bền cho các ứng dụng công nghiệp nặng.', en: 'Bando V-belts come in various types: classical V-belts (A/B/C/D/E), cogged V-belts (AX/BX/CX), narrow V-belts (SPZ/SPA/SPB/SPC), and variable speed belts (VA/VB/VC/VD/VE). Fiberglass cords and aramid blended fiber rubber core provide strength for heavy industrial applications.' },
      specifications: [
        { key: { vi: 'Thường', en: 'Classical' }, value: { vi: 'A, B, C, D, E', en: 'A, B, C, D, E' } },
        { key: { vi: 'Răng', en: 'Cogged' }, value: { vi: 'AX, BX, CX', en: 'AX, BX, CX' } },
        { key: { vi: 'Cải tiến', en: 'Narrow' }, value: { vi: 'SPZ, SPA, SPB, SPC', en: 'SPZ, SPA, SPB, SPC' } },
        { key: { vi: 'Biến tốc', en: 'Variable Speed' }, value: { vi: 'VA, VB, VC, VD, VE', en: 'VA, VB, VC, VD, VE' } },
      ],
      featured: false,
      image: '/images/products-new/dai-thang-thuong-1.jpg',
    },
    {
      name: { vi: 'Xích công nghiệp Tsubaki', en: 'Tsubaki Industrial Roller Chain' },
      slug: 'xich-tsubaki',
      sku: 'RS Roller Chain',
      brand: 'tsubaki',
      category: 'truyen-dong',
      shortDescription: { vi: 'Xích con lăn ANSI G8 với công nghệ rãnh bôi trơn độc quyền', en: 'ANSI G8 roller chain with patented lube groove technology' },
      description: { vi: 'Xích con lăn công nghiệp Tsubaki tiêu chuẩn ANSI G8 có tuổi thọ gấp đôi trong nhiều ứng dụng. Công nghệ tiên tiến kết hợp độ bền của ống lót đặc với rãnh bôi trơn độc quyền trên bề mặt bên trong cho các cỡ RS80 đến RS140. Thiết kế cải tiến tăng công suất lên 33% cho xích RS80-RS240. Có 14 kích cỡ từ RS25 đến RS240.', en: 'Tsubaki ANSI G8 industrial roller chain lasts up to twice as long in many applications. Advanced technology combines solid bushing strength with patented lube groove on inner surface for sizes RS80 through RS140. Improved design provides 33% horsepower increase for RS80-RS240 chains. Available in 14 sizes from RS25 to RS240.' },
      specifications: [
        { key: { vi: 'Tiêu chuẩn', en: 'Standard' }, value: { vi: 'ANSI G8', en: 'ANSI G8' } },
        { key: { vi: 'Kích cỡ', en: 'Sizes' }, value: { vi: 'RS25 đến RS240', en: 'RS25 to RS240' } },
        { key: { vi: 'Bước xích', en: 'Pitch Range' }, value: { vi: '4.76mm đến 127mm', en: '4.76mm to 127mm' } },
        { key: { vi: 'Loại', en: 'Types' }, value: { vi: 'Đơn, Đôi, Ba dãy', en: 'Single, Double, Triple strand' } },
      ],
      featured: false,
      image: '/images/products-new/xich-1-day-tsubaki-1.jpg',
    },
  ]

  // Create brands
  console.log('📦 Creating brands...')
  const brandMap: Record<string, number> = {}
  for (const brand of brandsData) {
    try {
      const existing = await payload.find({
        collection: 'brands',
        where: { slug: { equals: brand.slug } },
      })

      if (existing.docs.length === 0) {
        const created = await payload.create({
          collection: 'brands',
          data: {
            name: brand.name,
            slug: brand.slug,
            website: brand.website,
            description: makeRichText(brand.description.vi),
          },
        })
        // Seed English locale
        await payload.update({
          collection: 'brands',
          id: created.id,
          locale: 'en',
          data: {
            name: brand.name,
            description: makeRichText(brand.description.en),
          },
        })
        brandMap[brand.slug] = created.id as number
        console.log(`  ✓ Created brand: ${brand.name}`)
      } else {
        brandMap[brand.slug] = existing.docs[0].id as number
        console.log(`  - Brand exists: ${brand.name}`)
      }
    } catch (error) {
      console.error(`  ✗ Error creating brand ${brand.name}:`, error)
    }
  }

  // Create categories
  console.log('📁 Creating categories...')
  const categoryMap: Record<string, number> = {}
  for (const category of categoriesData) {
    try {
      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: category.slug } },
      })

      if (existing.docs.length === 0) {
        const created = await payload.create({
          collection: 'categories',
          data: {
            name: category.name.vi,
            slug: category.slug,
            description: makeRichText(category.description.vi),
          },
        })
        // Seed English locale
        await payload.update({
          collection: 'categories',
          id: created.id,
          locale: 'en',
          data: {
            name: category.name.en,
            description: makeRichText(category.description.en),
          },
        })
        categoryMap[category.slug] = created.id as number
        console.log(`  ✓ Created category: ${category.name.vi}`)
      } else {
        categoryMap[category.slug] = existing.docs[0].id as number
        console.log(`  - Category exists: ${category.name.vi}`)
      }
    } catch (error) {
      console.error(`  ✗ Error creating category ${category.name.vi}:`, error)
    }
  }

  // Create products
  console.log('🏭 Creating products...')
  for (const product of productsData) {
    try {
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: product.slug } },
      })

      if (existing.docs.length === 0) {
        // Upload product image if available
        let imageId: number | null = null
        if (product.image) {
          imageId = await uploadProductImage(payload, product.image, product.name.vi)
        }

        const created = await payload.create({
          collection: 'products',
          data: {
            name: product.name.vi,
            slug: product.slug,
            sku: product.sku,
            shortDescription: product.shortDescription?.vi || '',
            description: makeRichText(product.description.vi),
            brand: brandMap[product.brand],
            categories: [categoryMap[product.category]],
            images: imageId ? [{ image: imageId }] : [],
            specifications: product.specifications.map(spec => ({
              key: spec.key.vi,
              value: spec.value.vi,
            })),
            featured: product.featured,
            _status: 'published',
          },
        })
        // Seed English locale - map spec IDs from created product to preserve array items
        const createdSpecs = created.specifications ?? []
        await payload.update({
          collection: 'products',
          id: created.id,
          locale: 'en',
          data: {
            name: product.name.en,
            shortDescription: product.shortDescription?.en || '',
            description: makeRichText(product.description.en),
            specifications: product.specifications.map((spec, i) => ({
              id: createdSpecs[i]?.id ?? undefined,
              key: spec.key.en,
              value: spec.value.en,
            })),
          },
        })
        console.log(`  ✓ Created product: ${product.name.vi}`)
      } else {
        console.log(`  - Product exists: ${product.name.vi}`)
      }
    } catch (error) {
      console.error(`  ✗ Error creating product ${product.name.vi}:`, error)
    }
  }

  // Create services
  console.log('🔧 Creating services...')
  const servicesData = [
    {
      title: { vi: 'Tư vấn kỹ thuật', en: 'Technical Consulting' },
      slug: 'tu-van-ky-thuat',
      excerpt: {
        vi: 'Đội ngũ chuyên gia giàu kinh nghiệm sẵn sàng tư vấn loại vòng bi phù hợp nhất với điều kiện làm việc và yêu cầu kỹ thuật của từng máy móc. Chúng tôi giúp bạn chọn đúng loại chất bôi trơn để tăng tuổi thọ và hiệu suất của thiết bị.',
        en: 'Our experienced team of experts is ready to advise on the most suitable bearing type for your working conditions and technical requirements. We help you choose the right lubricant to extend equipment life and performance.',
      },
      benefits: {
        vi: [
          { text: 'Tư vấn lựa chọn vòng bi phù hợp với điều kiện làm việc' },
          { text: 'Lựa chọn chất bôi trơn tối ưu cho thiết bị' },
          { text: 'Hỗ trợ kỹ thuật toàn diện trong quá trình lắp đặt và bảo trì' },
          { text: 'Tiết kiệm chi phí và tăng năng suất máy móc' },
        ],
        en: [
          { text: 'Expert advice on selecting bearings suitable for working conditions' },
          { text: 'Optimal lubricant selection for your equipment' },
          { text: 'Comprehensive technical support during installation and maintenance' },
          { text: 'Cost savings and increased machine productivity' },
        ],
      },
      order: 1,
    },
    {
      title: { vi: 'Đo và phân tích rung động', en: 'Vibration Measurement & Analysis' },
      slug: 'do-va-phan-tich-rung-dong',
      excerpt: {
        vi: 'Dịch vụ đo và phân tích rung động giúp phát hiện sớm các vấn đề tiềm ẩn của vòng bi và thiết bị quay. Bằng việc giám sát tình trạng rung động, chúng tôi giúp bạn lên kế hoạch bảo trì chủ động, tránh hỏng hóc bất ngờ và giảm thiểu thời gian dừng máy.',
        en: 'Our vibration measurement and analysis service helps detect potential issues in bearings and rotating equipment early. By monitoring vibration conditions, we help you plan proactive maintenance, avoid unexpected failures and minimize downtime.',
      },
      benefits: {
        vi: [
          { text: 'Phát hiện sớm hư hỏng vòng bi và thiết bị' },
          { text: 'Lập kế hoạch bảo trì chủ động' },
          { text: 'Giảm thiểu thời gian dừng máy ngoài kế hoạch' },
          { text: 'Kéo dài tuổi thọ thiết bị' },
        ],
        en: [
          { text: 'Early detection of bearing and equipment damage' },
          { text: 'Proactive maintenance planning' },
          { text: 'Minimize unplanned machine downtime' },
          { text: 'Extend equipment lifespan' },
        ],
      },
      order: 2,
    },
    {
      title: { vi: 'Tư vấn lắp đặt và bôi trơn vòng bi', en: 'Bearing Installation & Lubrication Consulting' },
      slug: 'tu-van-lap-dat-va-boi-tron',
      excerpt: {
        vi: 'Lắp đặt đúng cách và bôi trơn phù hợp là yếu tố quan trọng quyết định tuổi thọ của vòng bi. Chúng tôi cung cấp dịch vụ hướng dẫn lắp đặt tại chỗ, tư vấn quy trình bôi trơn và lựa chọn loại mỡ/dầu phù hợp cho từng ứng dụng cụ thể.',
        en: 'Proper installation and appropriate lubrication are key factors determining bearing lifespan. We provide on-site installation guidance, lubrication process consulting, and help select the right grease/oil for each specific application.',
      },
      benefits: {
        vi: [
          { text: 'Hướng dẫn lắp đặt vòng bi đúng kỹ thuật' },
          { text: 'Tư vấn quy trình bôi trơn đúng cách' },
          { text: 'Lựa chọn loại mỡ/dầu phù hợp cho từng ứng dụng' },
          { text: 'Tăng tuổi thọ vòng bi và giảm chi phí thay thế' },
        ],
        en: [
          { text: 'Technical guidance for proper bearing installation' },
          { text: 'Correct lubrication process consulting' },
          { text: 'Appropriate grease/oil selection for each application' },
          { text: 'Extended bearing life and reduced replacement costs' },
        ],
      },
      order: 3,
    },
  ]

  // Delete existing services first to recreate with proper data
  const existingServices = await payload.find({
    collection: 'services',
    limit: 100,
  })
  for (const existing of existingServices.docs) {
    await payload.delete({
      collection: 'services',
      id: existing.id,
    })
    console.log(`  🗑️ Deleted existing service: ${existing.title}`)
  }

  for (const service of servicesData) {
    try {
      // Create service with VI locale (default)
      await payload.create({
        collection: 'services',
        data: {
          title: service.title.vi,
          slug: service.slug,
          excerpt: service.excerpt.vi,
          benefits: service.benefits.vi,
          order: service.order,
          _status: 'published',
        },
      })

      // Note: EN locale for services needs to be updated manually in admin
      // due to PayloadCMS validation issues with required localized array fields

      console.log(`  ✓ Created service: ${service.title.vi}`)
    } catch (error) {
      console.error(`  ✗ Error creating service ${service.title.vi}:`, error)
    }
  }

  // Create pages
  console.log('📄 Creating pages...')
  const pagesData = [
    {
      title: 'Giao hàng và đổi trả hàng',
      slug: 'shipping',
    },
    {
      title: 'Hình thức thanh toán',
      slug: 'payment',
    },
  ]

  for (const page of pagesData) {
    try {
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } },
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'pages',
          data: {
            title: page.title,
            slug: page.slug,
            _status: 'published',
          },
        })
        console.log(`  ✓ Created page: ${page.title}`)
      } else {
        console.log(`  - Page exists: ${page.title}`)
      }
    } catch (error) {
      console.error(`  ✗ Error creating page ${page.title}:`, error)
    }
  }

  // Update Site Settings
  console.log('⚙️ Updating site settings...')
  try {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        siteName: 'VIES',
        contact: {
          phone: [
            { number: '(+84) 963 048 317', label: 'Hotline' },
            { number: '0903 326 309', label: 'Mr. Lâm - Báo giá' },
            { number: '0908 748 304', label: 'Mr. Hiển - Kỹ thuật' },
          ],
          email: 'info@v-ies.com',
          address: 'Số 16, Đường DD3-1, Phường Tân Hưng Thuận, Quận 12, TP. Hồ Chí Minh',
        },
        social: {
          facebook: 'https://facebook.com/vies.vietnam',
          zalo: 'https://zalo.me/0963048317',
        },
      },
    })
    console.log('  ✓ Updated site settings')

    // Seed English locale for site settings
    await payload.updateGlobal({
      slug: 'site-settings',
      locale: 'en',
      data: {
        contact: {
          phone: [
            { number: '(+84) 963 048 317', label: 'Hotline' },
            { number: '0903 326 309', label: 'Mr. Lam - Quote' },
            { number: '0908 748 304', label: 'Mr. Hien - Technical' },
          ],
          address: '16 DD3-1 Street, Tan Hung Thuan Ward, District 12, Ho Chi Minh City',
        },
      },
    })
    console.log('  ✓ Updated site settings (EN)')
  } catch (error) {
    console.error('  ✗ Error updating site settings:', error)
  }

  // Update Header
  console.log('🔝 Updating header...')
  try {
    await payload.updateGlobal({
      slug: 'header',
      data: {
        topBar: {
          enabled: true,
          content: 'Hotline: (+84) 963 048 317 | Email: info@v-ies.com',
        },
        navigation: [
          { label: 'Trang chủ', link: '/' },
          { label: 'Sản phẩm', link: '/products', children: [
            { label: 'Vòng bi', link: '/products?category=vong-bi' },
            { label: 'Bôi trơn', link: '/products?category=boi-tron' },
            { label: 'Dụng cụ bảo trì', link: '/products?category=dung-cu-bao-tri' },
            { label: 'Truyền động', link: '/products?category=truyen-dong' },
          ]},
          { label: 'Dịch vụ', link: '/services' },
          { label: 'Tin tức', link: '/news' },
          { label: 'Giới thiệu', link: '/about' },
          { label: 'Liên hệ', link: '/contact' },
        ],
      },
    })
    console.log('  ✓ Updated header')

    // Seed English locale for header
    await payload.updateGlobal({
      slug: 'header',
      locale: 'en',
      data: {
        topBar: {
          content: 'Hotline: (+84) 963 048 317 | Email: info@v-ies.com',
        },
        navigation: [
          { label: 'Home', link: '/' },
          { label: 'Products', link: '/products', children: [
            { label: 'Bearings', link: '/products?category=vong-bi' },
            { label: 'Lubrication', link: '/products?category=boi-tron' },
            { label: 'Maintenance Tools', link: '/products?category=dung-cu-bao-tri' },
            { label: 'Power Transmission', link: '/products?category=truyen-dong' },
          ]},
          { label: 'Services', link: '/services' },
          { label: 'News', link: '/news' },
          { label: 'About', link: '/about' },
          { label: 'Contact', link: '/contact' },
        ],
      },
    })
    console.log('  ✓ Updated header (EN)')
  } catch (error) {
    console.error('  ✗ Error updating header:', error)
  }

  // Update Footer
  console.log('🔻 Updating footer...')
  try {
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        columns: [
          {
            title: 'Sản phẩm',
            links: [
              { label: 'Vòng bi SKF', url: '/products?brand=skf' },
              { label: 'Vòng bi FAG', url: '/products?brand=fag' },
              { label: 'Vòng bi NTN', url: '/products?brand=ntn' },
              { label: 'Dụng cụ bảo trì', url: '/products?category=dung-cu-bao-tri' },
            ],
          },
          {
            title: 'Dịch vụ',
            links: [
              { label: 'Tư vấn kỹ thuật', url: '/services' },
              { label: 'Đo và phân tích rung động', url: '/services' },
              { label: 'Tư vấn lắp đặt và bôi trơn', url: '/services' },
            ],
          },
          {
            title: 'Thông tin',
            links: [
              { label: 'Giao hàng và đổi trả', url: '/shipping' },
              { label: 'Hình thức thanh toán', url: '/payment' },
              { label: 'Chính sách bảo hành', url: '/warranty' },
              { label: 'Liên hệ', url: '/contact' },
            ],
          },
        ],
        copyright: '© 2026 VIES. Công ty TNHH TM & DV VIES. MST: 0318321326',
      },
    })
    console.log('  ✓ Updated footer')

    // Seed English locale for footer
    await payload.updateGlobal({
      slug: 'footer',
      locale: 'en',
      data: {
        columns: [
          {
            title: 'Products',
            links: [
              { label: 'SKF Bearings', url: '/products?brand=skf' },
              { label: 'FAG Bearings', url: '/products?brand=fag' },
              { label: 'NTN Bearings', url: '/products?brand=ntn' },
              { label: 'Maintenance Tools', url: '/products?category=dung-cu-bao-tri' },
            ],
          },
          {
            title: 'Services',
            links: [
              { label: 'Technical Consulting', url: '/services' },
              { label: 'Vibration Analysis', url: '/services' },
              { label: 'Installation & Lubrication', url: '/services' },
            ],
          },
          {
            title: 'Information',
            links: [
              { label: 'Shipping & Returns', url: '/shipping' },
              { label: 'Payment Methods', url: '/payment' },
              { label: 'Warranty Policy', url: '/warranty' },
              { label: 'Contact', url: '/contact' },
            ],
          },
        ],
        copyright: '© 2026 VIES. VIES Trading & Services Co., Ltd. Tax ID: 0318321326',
      },
    })
    console.log('  ✓ Updated footer (EN)')
  } catch (error) {
    console.error('  ✗ Error updating footer:', error)
  }

  // Cleanup
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true })
  }

  console.log('\n✅ Seed completed!')
  process.exit(0)
}

seedData().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
