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
    { name: 'SKF', slug: 'skf', website: 'https://www.skf.com', description: { vi: 'Thương hiệu vòng bi hàng đầu thế giới từ Thụy Điển', en: 'World leading bearing brand from Sweden' } },
    { name: 'FAG', slug: 'fag', website: 'https://www.schaeffler.com', description: { vi: 'Thương hiệu vòng bi cao cấp từ Đức, thuộc tập đoàn Schaeffler', en: 'Premium bearing brand from Germany, part of Schaeffler Group' } },
    { name: 'NTN', slug: 'ntn', website: 'https://www.ntn.co.jp', description: { vi: 'Thương hiệu vòng bi Nhật Bản với công nghệ tiên tiến', en: 'Japanese bearing brand with advanced technology' } },
    { name: 'TIMKEN', slug: 'timken', website: 'https://www.timken.com', description: { vi: 'Thương hiệu vòng bi Mỹ với hơn 100 năm kinh nghiệm', en: 'American bearing brand with over 100 years of experience' } },
    { name: 'INA', slug: 'ina', website: 'https://www.schaeffler.com', description: { vi: 'Chuyên gia về hệ thống truyền động tịnh tiến', en: 'Linear motion systems specialist' } },
    { name: 'Lincoln', slug: 'lincoln', website: 'https://www.skf.com/lincoln', description: { vi: 'Hệ thống bôi trơn tự động hàng đầu', en: 'Leading automatic lubrication systems' } },
    { name: 'Optibelt', slug: 'optibelt', website: 'https://www.optibelt.com', description: { vi: 'Dây đai truyền động chất lượng cao từ Đức', en: 'High quality power transmission belts from Germany' } },
    { name: 'SMC', slug: 'smc', website: 'https://www.smc.eu', description: { vi: 'Thiết bị khí nén công nghiệp Nhật Bản', en: 'Japanese industrial pneumatic equipment' } },
  ]

  // Categories
  const categoriesData = [
    { name: { vi: 'Vòng bi', en: 'Bearings' }, slug: 'vong-bi', description: { vi: 'Các loại vòng bi công nghiệp chính hãng', en: 'Genuine industrial bearings' } },
    { name: { vi: 'Bôi trơn', en: 'Lubrication' }, slug: 'boi-tron', description: { vi: 'Mỡ bôi trơn và hệ thống bôi trơn tự động', en: 'Lubricants and automatic lubrication systems' } },
    { name: { vi: 'Dụng cụ bảo trì', en: 'Maintenance Tools' }, slug: 'dung-cu-bao-tri', description: { vi: 'Thiết bị và dụng cụ bảo trì công nghiệp', en: 'Industrial maintenance equipment and tools' } },
    { name: { vi: 'Truyền động', en: 'Power Transmission' }, slug: 'truyen-dong', description: { vi: 'Dây đai, xích và các sản phẩm truyền động', en: 'Belts, chains and transmission products' } },
    { name: { vi: 'Gối đỡ', en: 'Bearing Housings' }, slug: 'goi-do', description: { vi: 'Gối đỡ và cụm vòng bi', en: 'Bearing housings and assemblies' } },
    { name: { vi: 'Khí nén', en: 'Pneumatics' }, slug: 'khi-nen', description: { vi: 'Thiết bị khí nén công nghiệp', en: 'Industrial pneumatic equipment' } },
  ]

  // Products
  const productsData = [
    {
      name: { vi: 'Vòng bi cầu SKF 6205-2RS', en: 'SKF 6205-2RS Deep Groove Ball Bearing' },
      slug: 'skf-6205-2rs',
      sku: '6205-2RS',
      brand: 'skf',
      category: 'vong-bi',
      description: { vi: 'Vòng bi cầu một dãy, hai phớt cao su, chịu tải cao', en: 'Single row deep groove ball bearing with two rubber seals, high load capacity' },
      specifications: [
        { key: { vi: 'Đường kính trong', en: 'Inner diameter' }, value: { vi: '25mm', en: '25mm' } },
        { key: { vi: 'Đường kính ngoài', en: 'Outer diameter' }, value: { vi: '52mm', en: '52mm' } },
        { key: { vi: 'Chiều rộng', en: 'Width' }, value: { vi: '15mm', en: '15mm' } },
      ],
      featured: true,
    },
    {
      name: { vi: 'Vòng bi đũa FAG NU206E', en: 'FAG NU206E Cylindrical Roller Bearing' },
      slug: 'fag-nu206e',
      sku: 'NU206E',
      brand: 'fag',
      category: 'vong-bi',
      description: { vi: 'Vòng bi đũa trụ chịu tải hướng tâm cao', en: 'Cylindrical roller bearing with high radial load capacity' },
      specifications: [
        { key: { vi: 'Đường kính trong', en: 'Inner diameter' }, value: { vi: '30mm', en: '30mm' } },
        { key: { vi: 'Đường kính ngoài', en: 'Outer diameter' }, value: { vi: '62mm', en: '62mm' } },
        { key: { vi: 'Chiều rộng', en: 'Width' }, value: { vi: '16mm', en: '16mm' } },
      ],
      featured: true,
    },
    {
      name: { vi: 'Mỡ SKF LGMT 3', en: 'SKF LGMT 3 Grease' },
      slug: 'skf-lgmt-3',
      sku: 'LGMT 3/1',
      brand: 'skf',
      category: 'boi-tron',
      description: { vi: 'Mỡ bôi trơn đa dụng cho vòng bi công nghiệp', en: 'General purpose industrial bearing grease' },
      specifications: [
        { key: { vi: 'Dung tích', en: 'Capacity' }, value: { vi: '1kg', en: '1kg' } },
        { key: { vi: 'Nhiệt độ hoạt động', en: 'Operating temperature' }, value: { vi: '-30°C đến +120°C', en: '-30°C to +120°C' } },
      ],
      featured: true,
    },
    {
      name: { vi: 'Máy gia nhiệt cảm ứng SKF TMBH 1', en: 'SKF TMBH 1 Induction Heater' },
      slug: 'skf-tmbh-1',
      sku: 'TMBH 1',
      brand: 'skf',
      category: 'dung-cu-bao-tri',
      description: { vi: 'Máy gia nhiệt cảm ứng di động để lắp vòng bi', en: 'Portable induction heater for bearing mounting' },
      specifications: [
        { key: { vi: 'Công suất', en: 'Power' }, value: { vi: '3.6 kVA', en: '3.6 kVA' } },
        { key: { vi: 'Trọng lượng tối đa', en: 'Max weight' }, value: { vi: '40kg', en: '40kg' } },
      ],
      featured: false,
    },
    {
      name: { vi: 'Dây đai răng Optibelt OMEGA', en: 'Optibelt OMEGA Timing Belt' },
      slug: 'optibelt-omega',
      sku: 'OMEGA-HTD-8M',
      brand: 'optibelt',
      category: 'truyen-dong',
      description: { vi: 'Dây đai răng đồng bộ chất lượng cao từ Đức', en: 'High quality synchronous timing belt from Germany' },
      specifications: [
        { key: { vi: 'Loại', en: 'Type' }, value: { vi: 'HTD 8M', en: 'HTD 8M' } },
        { key: { vi: 'Vật liệu', en: 'Material' }, value: { vi: 'Cao su HNBR', en: 'HNBR rubber' } },
      ],
      featured: false,
    },
    {
      name: { vi: 'Vòng bi NTN 6308LLU', en: 'NTN 6308LLU Ball Bearing' },
      slug: 'ntn-6308llu',
      sku: '6308LLU',
      brand: 'ntn',
      category: 'vong-bi',
      description: { vi: 'Vòng bi cầu chịu tải cao, phớt kép', en: 'High load ball bearing with double seals' },
      specifications: [
        { key: { vi: 'Đường kính trong', en: 'Inner diameter' }, value: { vi: '40mm', en: '40mm' } },
        { key: { vi: 'Đường kính ngoài', en: 'Outer diameter' }, value: { vi: '90mm', en: '90mm' } },
        { key: { vi: 'Chiều rộng', en: 'Width' }, value: { vi: '23mm', en: '23mm' } },
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
        // Seed English locale
        await payload.update({
          collection: 'brands',
          id: created.id,
          locale: 'en',
          data: {
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
        const created = await payload.create({
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
        // Seed English locale
        await payload.update({
          collection: 'products',
          id: created.id,
          locale: 'en',
          data: {
            name: product.name.en,
            description: makeRichText(product.description.en),
            specifications: product.specifications.map(spec => ({
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
