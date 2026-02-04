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

  // Brand logos - using placeholder colors since actual logos need permission
  const brandsData = [
    { name: 'SKF', slug: 'skf', website: 'https://www.skf.com', description: { vi: 'Thương hiệu vòng bi hàng đầu thế giới từ Thụy Điển', en: 'World leading bearing brand from Sweden', km: 'ម៉ាកគ្រាប់បេរីងឈានមុខពិភពលោកពីប្រទេសស៊ុយអែត' } },
    { name: 'FAG', slug: 'fag', website: 'https://www.schaeffler.com', description: { vi: 'Thương hiệu vòng bi cao cấp từ Đức, thuộc tập đoàn Schaeffler', en: 'Premium bearing brand from Germany, part of Schaeffler Group', km: 'ម៉ាកគ្រាប់បេរីងលំដាប់ខ្ពស់ពីប្រទេសអាល្លឺម៉ង់' } },
    { name: 'NTN', slug: 'ntn', website: 'https://www.ntn.co.jp', description: { vi: 'Thương hiệu vòng bi Nhật Bản với công nghệ tiên tiến', en: 'Japanese bearing brand with advanced technology', km: 'ម៉ាកគ្រាប់បេរីងជប៉ុនជាមួយបច្ចេកវិទ្យាទំនើប' } },
    { name: 'TIMKEN', slug: 'timken', website: 'https://www.timken.com', description: { vi: 'Thương hiệu vòng bi Mỹ với hơn 100 năm kinh nghiệm', en: 'American bearing brand with over 100 years of experience', km: 'ម៉ាកគ្រាប់បេរីងអាមេរិកជាមួយបទពិសោធន៍ជាង ១០០ ឆ្នាំ' } },
    { name: 'INA', slug: 'ina', website: 'https://www.schaeffler.com', description: { vi: 'Chuyên gia về hệ thống truyền động tịnh tiến', en: 'Linear motion systems specialist', km: 'អ្នកជំនាញប្រព័ន្ធចលនាលីនេអ៊ែរ' } },
    { name: 'Lincoln', slug: 'lincoln', website: 'https://www.skf.com/lincoln', description: { vi: 'Hệ thống bôi trơn tự động hàng đầu', en: 'Leading automatic lubrication systems', km: 'ប្រព័ន្ធប្រេងរំអិលស្វ័យប្រវត្តិឈានមុខ' } },
    { name: 'Optibelt', slug: 'optibelt', website: 'https://www.optibelt.com', description: { vi: 'Dây đai truyền động chất lượng cao từ Đức', en: 'High quality power transmission belts from Germany', km: 'ខ្សែក្រវ៉ាត់បញ្ជូនថាមពលគុណភាពខ្ពស់ពីប្រទេសអាល្លឺម៉ង់' } },
    { name: 'SMC', slug: 'smc', website: 'https://www.smc.eu', description: { vi: 'Thiết bị khí nén công nghiệp Nhật Bản', en: 'Japanese industrial pneumatic equipment', km: 'ឧបករណ៍ខ្យល់ឧស្សាហកម្មជប៉ុន' } },
  ]

  // Categories
  const categoriesData = [
    { name: { vi: 'Vòng bi', en: 'Bearings', km: 'គ្រាប់បេរីង' }, slug: 'vong-bi', description: { vi: 'Các loại vòng bi công nghiệp chính hãng', en: 'Genuine industrial bearings', km: 'គ្រាប់បេរីងឧស្សាហកម្មពិតប្រាកដ' } },
    { name: { vi: 'Bôi trơn', en: 'Lubrication', km: 'ប្រេងរំអិល' }, slug: 'boi-tron', description: { vi: 'Mỡ bôi trơn và hệ thống bôi trơn tự động', en: 'Lubricants and automatic lubrication systems', km: 'ប្រេងរំអិល និងប្រព័ន្ធប្រេងរំអិលស្វ័យប្រវត្តិ' } },
    { name: { vi: 'Dụng cụ bảo trì', en: 'Maintenance Tools', km: 'ឧបករណ៍ថែទាំ' }, slug: 'dung-cu-bao-tri', description: { vi: 'Thiết bị và dụng cụ bảo trì công nghiệp', en: 'Industrial maintenance equipment and tools', km: 'ឧបករណ៍ និងឧបករណ៍ថែទាំឧស្សាហកម្ម' } },
    { name: { vi: 'Truyền động', en: 'Power Transmission', km: 'ការបញ្ជូនថាមពល' }, slug: 'truyen-dong', description: { vi: 'Dây đai, xích và các sản phẩm truyền động', en: 'Belts, chains and transmission products', km: 'ខ្សែក្រវ៉ាត់ ច្រវ៉ាក់ និងផលិតផលបញ្ជូន' } },
    { name: { vi: 'Gối đỡ', en: 'Bearing Housings', km: 'គ្រឿងទ្រគ្រាប់បេរីង' }, slug: 'goi-do', description: { vi: 'Gối đỡ và cụm vòng bi', en: 'Bearing housings and assemblies', km: 'គ្រឿងទ្រ និងការផ្គុំគ្រាប់បេរីង' } },
    { name: { vi: 'Khí nén', en: 'Pneumatics', km: 'ឧបករណ៍ខ្យល់' }, slug: 'khi-nen', description: { vi: 'Thiết bị khí nén công nghiệp', en: 'Industrial pneumatic equipment', km: 'ឧបករណ៍ខ្យល់ឧស្សាហកម្ម' } },
  ]

  // Products
  const productsData = [
    {
      name: { vi: 'Vòng bi cầu SKF 6205-2RS', en: 'SKF 6205-2RS Deep Groove Ball Bearing', km: 'គ្រាប់បេរីងបាល់ស៊ីជម្រៅ SKF 6205-2RS' },
      slug: 'skf-6205-2rs',
      sku: '6205-2RS',
      brand: 'skf',
      category: 'vong-bi',
      description: { vi: 'Vòng bi cầu một dãy, hai phớt cao su, chịu tải cao', en: 'Single row deep groove ball bearing with two rubber seals, high load capacity', km: 'គ្រាប់បេរីងបាល់មួយជួរជាមួយត្រាកៅស៊ូពីរ សមត្ថភាពផ្ទុកខ្ពស់' },
      specifications: [
        { key: { vi: 'Đường kính trong', en: 'Inner diameter', km: 'អង្កត់ផ្ចិតខាងក្នុង' }, value: { vi: '25mm', en: '25mm', km: '25mm' } },
        { key: { vi: 'Đường kính ngoài', en: 'Outer diameter', km: 'អង្កត់ផ្ចិតខាងក្រៅ' }, value: { vi: '52mm', en: '52mm', km: '52mm' } },
        { key: { vi: 'Chiều rộng', en: 'Width', km: 'ទទឹង' }, value: { vi: '15mm', en: '15mm', km: '15mm' } },
      ],
      featured: true,
    },
    {
      name: { vi: 'Vòng bi đũa FAG NU206E', en: 'FAG NU206E Cylindrical Roller Bearing', km: 'គ្រាប់បេរីងរមូរស៊ីឡាំង FAG NU206E' },
      slug: 'fag-nu206e',
      sku: 'NU206E',
      brand: 'fag',
      category: 'vong-bi',
      description: { vi: 'Vòng bi đũa trụ chịu tải hướng tâm cao', en: 'Cylindrical roller bearing with high radial load capacity', km: 'គ្រាប់បេរីងរមូរស៊ីឡាំងជាមួយសមត្ថភាពផ្ទុករ៉ាឌីអាល់ខ្ពស់' },
      specifications: [
        { key: { vi: 'Đường kính trong', en: 'Inner diameter', km: 'អង្កត់ផ្ចិតខាងក្នុង' }, value: { vi: '30mm', en: '30mm', km: '30mm' } },
        { key: { vi: 'Đường kính ngoài', en: 'Outer diameter', km: 'អង្កត់ផ្ចិតខាងក្រៅ' }, value: { vi: '62mm', en: '62mm', km: '62mm' } },
        { key: { vi: 'Chiều rộng', en: 'Width', km: 'ទទឹង' }, value: { vi: '16mm', en: '16mm', km: '16mm' } },
      ],
      featured: true,
    },
    {
      name: { vi: 'Mỡ SKF LGMT 3', en: 'SKF LGMT 3 Grease', km: 'ប្រេងរំអិល SKF LGMT 3' },
      slug: 'skf-lgmt-3',
      sku: 'LGMT 3/1',
      brand: 'skf',
      category: 'boi-tron',
      description: { vi: 'Mỡ bôi trơn đa dụng cho vòng bi công nghiệp', en: 'General purpose industrial bearing grease', km: 'ប្រេងរំអិលគ្រាប់បេរីងឧស្សាហកម្មគោលបំណងទូទៅ' },
      specifications: [
        { key: { vi: 'Dung tích', en: 'Capacity', km: 'សមត្ថភាព' }, value: { vi: '1kg', en: '1kg', km: '1kg' } },
        { key: { vi: 'Nhiệt độ hoạt động', en: 'Operating temperature', km: 'សីតុណ្ហភាពប្រតិបត្តិការ' }, value: { vi: '-30°C đến +120°C', en: '-30°C to +120°C', km: '-30°C ដល់ +120°C' } },
      ],
      featured: true,
    },
    {
      name: { vi: 'Máy gia nhiệt cảm ứng SKF TMBH 1', en: 'SKF TMBH 1 Induction Heater', km: 'ឧបករណ៍កម្តៅបញ្ចុះ SKF TMBH 1' },
      slug: 'skf-tmbh-1',
      sku: 'TMBH 1',
      brand: 'skf',
      category: 'dung-cu-bao-tri',
      description: { vi: 'Máy gia nhiệt cảm ứng di động để lắp vòng bi', en: 'Portable induction heater for bearing mounting', km: 'ឧបករណ៍កម្តៅបញ្ចុះចល័តសម្រាប់ការដំឡើងគ្រាប់បេរីង' },
      specifications: [
        { key: { vi: 'Công suất', en: 'Power', km: 'ថាមពល' }, value: { vi: '3.6 kVA', en: '3.6 kVA', km: '3.6 kVA' } },
        { key: { vi: 'Trọng lượng tối đa', en: 'Max weight', km: 'ទម្ងន់អតិបរមា' }, value: { vi: '40kg', en: '40kg', km: '40kg' } },
      ],
      featured: false,
    },
    {
      name: { vi: 'Dây đai răng Optibelt OMEGA', en: 'Optibelt OMEGA Timing Belt', km: 'ខ្សែក្រវ៉ាត់ពេលវេលា Optibelt OMEGA' },
      slug: 'optibelt-omega',
      sku: 'OMEGA-HTD-8M',
      brand: 'optibelt',
      category: 'truyen-dong',
      description: { vi: 'Dây đai răng đồng bộ chất lượng cao từ Đức', en: 'High quality synchronous timing belt from Germany', km: 'ខ្សែក្រវ៉ាត់ពេលវេលាសមកាលកម្មគុណភាពខ្ពស់ពីប្រទេសអាល្លឺម៉ង់' },
      specifications: [
        { key: { vi: 'Loại', en: 'Type', km: 'ប្រភេទ' }, value: { vi: 'HTD 8M', en: 'HTD 8M', km: 'HTD 8M' } },
        { key: { vi: 'Vật liệu', en: 'Material', km: 'សម្ភារៈ' }, value: { vi: 'Cao su HNBR', en: 'HNBR rubber', km: 'កៅស៊ូ HNBR' } },
      ],
      featured: false,
    },
    {
      name: { vi: 'Vòng bi NTN 6308LLU', en: 'NTN 6308LLU Ball Bearing', km: 'គ្រាប់បេរីងបាល់ NTN 6308LLU' },
      slug: 'ntn-6308llu',
      sku: '6308LLU',
      brand: 'ntn',
      category: 'vong-bi',
      description: { vi: 'Vòng bi cầu chịu tải cao, phớt kép', en: 'High load ball bearing with double seals', km: 'គ្រាប់បេរីងបាល់ផ្ទុកខ្ពស់ជាមួយត្រាពីរ' },
      specifications: [
        { key: { vi: 'Đường kính trong', en: 'Inner diameter', km: 'អង្កត់ផ្ចិតខាងក្នុង' }, value: { vi: '40mm', en: '40mm', km: '40mm' } },
        { key: { vi: 'Đường kính ngoài', en: 'Outer diameter', km: 'អង្កត់ផ្ចិតខាងក្រៅ' }, value: { vi: '90mm', en: '90mm', km: '90mm' } },
        { key: { vi: 'Chiều rộng', en: 'Width', km: 'ទទឹង' }, value: { vi: '23mm', en: '23mm', km: '23mm' } },
      ],
      featured: true,
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
        await payload.create({
          collection: 'products',
          data: {
            name: product.name.vi,
            slug: product.slug,
            sku: product.sku,
            description: makeRichText(product.description.vi),
            brand: brandMap[product.brand],
            categories: [categoryMap[product.category]],
            specifications: product.specifications.map(spec => ({
              key: spec.key.vi,
              value: spec.value.vi,
            })),
            featured: product.featured,
            _status: 'published',
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
      title: 'Tư vấn kỹ thuật',
      slug: 'tu-van-ky-thuat',
      excerpt: 'Đội ngũ chuyên gia giàu kinh nghiệm sẵn sàng tư vấn loại vòng bi phù hợp nhất với điều kiện làm việc và yêu cầu kỹ thuật của từng máy móc. Chúng tôi giúp bạn chọn đúng loại chất bôi trơn để tăng tuổi thọ và hiệu suất của thiết bị.',
      benefits: [
        { text: 'Tư vấn lựa chọn vòng bi phù hợp với điều kiện làm việc' },
        { text: 'Lựa chọn chất bôi trơn tối ưu cho thiết bị' },
        { text: 'Hỗ trợ kỹ thuật toàn diện trong quá trình lắp đặt và bảo trì' },
        { text: 'Tiết kiệm chi phí và tăng năng suất máy móc' },
      ],
      order: 1,
    },
    {
      title: 'Đo và phân tích rung động',
      slug: 'do-va-phan-tich-rung-dong',
      excerpt: 'Dịch vụ đo và phân tích rung động giúp phát hiện sớm các vấn đề tiềm ẩn của vòng bi và thiết bị quay. Bằng việc giám sát tình trạng rung động, chúng tôi giúp bạn lên kế hoạch bảo trì chủ động, tránh hỏng hóc bất ngờ và giảm thiểu thời gian dừng máy.',
      benefits: [
        { text: 'Phát hiện sớm hư hỏng vòng bi và thiết bị' },
        { text: 'Lập kế hoạch bảo trì chủ động' },
        { text: 'Giảm thiểu thời gian dừng máy ngoài kế hoạch' },
        { text: 'Kéo dài tuổi thọ thiết bị' },
      ],
      order: 2,
    },
    {
      title: 'Tư vấn lắp đặt và bôi trơn vòng bi',
      slug: 'tu-van-lap-dat-va-boi-tron',
      excerpt: 'Lắp đặt đúng cách và bôi trơn phù hợp là yếu tố quan trọng quyết định tuổi thọ của vòng bi. Chúng tôi cung cấp dịch vụ hướng dẫn lắp đặt tại chỗ, tư vấn quy trình bôi trơn và lựa chọn loại mỡ/dầu phù hợp cho từng ứng dụng cụ thể.',
      benefits: [
        { text: 'Hướng dẫn lắp đặt vòng bi đúng kỹ thuật' },
        { text: 'Tư vấn quy trình bôi trơn đúng cách' },
        { text: 'Lựa chọn loại mỡ/dầu phù hợp cho từng ứng dụng' },
        { text: 'Tăng tuổi thọ vòng bi và giảm chi phí thay thế' },
      ],
      order: 3,
    },
  ]

  for (const service of servicesData) {
    try {
      const existing = await payload.find({
        collection: 'services',
        where: { slug: { equals: service.slug } },
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'services',
          data: {
            title: service.title,
            slug: service.slug,
            excerpt: service.excerpt,
            benefits: service.benefits,
            order: service.order,
            _status: 'published',
          },
        })
        console.log(`  ✓ Created service: ${service.title}`)
      } else {
        console.log(`  - Service exists: ${service.title}`)
      }
    } catch (error) {
      console.error(`  ✗ Error creating service ${service.title}:`, error)
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
