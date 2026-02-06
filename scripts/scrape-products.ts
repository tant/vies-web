/**
 * Script to scrape products from v-ies.com
 * Run with: npx tsx scripts/scrape-products.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Product URLs from the old website
const PRODUCT_URLS = [
  // Bôi trơn - Chất bôi trơn
  'https://v-ies.com/product/lgnl-2/',
  'https://v-ies.com/product/lgep-2/',
  'https://v-ies.com/product/lgmt-3/',
  'https://v-ies.com/product/lgmt-2/',
  // Bôi trơn - Progressive system
  'https://v-ies.com/product/bom-mo-p253-smart/',
  // Truyền động - Dây đai
  'https://v-ies.com/product/dai-dong-bo/',
  'https://v-ies.com/product/dai-hinh-luoc/',
  'https://v-ies.com/product/dai-luc-giac/',
  'https://v-ies.com/product/dai-thang-ghep-lien/',
  'https://v-ies.com/product/dai-bien-toc/',
  'https://v-ies.com/product/dai-thang-rang/',
  'https://v-ies.com/product/dai-thang-cai-tien/',
  'https://v-ies.com/product/dai-thang-thuong/',
  // Truyền động - Xích
  'https://v-ies.com/product/xich-1-day-tsubaki/',
  // Dụng cụ bảo trì
  'https://v-ies.com/product/skf-tmbh-5-may-gia-nhiet-cam-tay/',
  'https://v-ies.com/product/skf-tih-thiet-bi-gia-nhiet/',
  'https://v-ies.com/product/skf-tmma/',
  'https://v-ies.com/product/tmft-36/',
  // Vòng bi
  'https://v-ies.com/product/vong-bi-tru-dua-fag/',
  'https://v-ies.com/product/goi-uc/',
  'https://v-ies.com/product/vong-bi-tu-tinh/',
  'https://v-ies.com/product/vong-bi-dua/',
  'https://v-ies.com/product/vong-bi-tang-trong/',
  'https://v-ies.com/product/vong-bi-tiep-xuc-goc/',
  'https://v-ies.com/product/vong-bi-cau/',
]

// Category mapping
const CATEGORY_MAP: Record<string, { slug: string; name: string; nameEn: string }> = {
  'boi-tron': { slug: 'boi-tron', name: 'Bôi trơn', nameEn: 'Lubrication' },
  'dung-cu-bao-tri': { slug: 'dung-cu-bao-tri', name: 'Dụng cụ bảo trì', nameEn: 'Maintenance Tools' },
  'truyen-dong': { slug: 'truyen-dong', name: 'Truyền động', nameEn: 'Power Transmission' },
  'vong-bi': { slug: 'vong-bi', name: 'Vòng bi', nameEn: 'Bearings' },
  'goi-do': { slug: 'goi-do', name: 'Gối đỡ', nameEn: 'Bearing Housings' },
  'khi-nen': { slug: 'khi-nen', name: 'Khí nén', nameEn: 'Pneumatics' },
}

// Brand mapping
const BRAND_MAP: Record<string, { slug: string; name: string }> = {
  skf: { slug: 'skf', name: 'SKF' },
  fag: { slug: 'fag', name: 'FAG' },
  ntn: { slug: 'ntn', name: 'NTN' },
  timken: { slug: 'timken', name: 'TIMKEN' },
  ina: { slug: 'ina', name: 'INA' },
  optibelt: { slug: 'optibelt', name: 'Optibelt' },
  bando: { slug: 'bando', name: 'Bando' },
  tsubaki: { slug: 'tsubaki', name: 'Tsubaki' },
  lincoln: { slug: 'lincoln', name: 'Lincoln' },
  smc: { slug: 'smc', name: 'SMC' },
}

interface ProductData {
  slug: string
  name: string
  nameEn: string
  sku: string
  shortDescription: string
  shortDescriptionEn: string
  description: string
  descriptionEn: string
  category: string
  brand: string
  images: string[]
  specifications: Record<string, string>
}

// Simple HTML fetch function
async function fetchHTML(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => resolve(data))
      res.on('error', reject)
    })
  })
}

// Extract text between tags
function extractText(html: string, startTag: string, endTag: string): string {
  const startIdx = html.indexOf(startTag)
  if (startIdx === -1) return ''
  const contentStart = startIdx + startTag.length
  const endIdx = html.indexOf(endTag, contentStart)
  if (endIdx === -1) return ''
  return html.substring(contentStart, endIdx).trim()
}

// Remove HTML tags
function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Download image
async function downloadImage(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath)
    https.get(url, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(destPath, () => {}) // Delete partial file
      reject(err)
    })
  })
}

// Determine category from URL or content
function determineCategory(url: string, html: string): string {
  if (url.includes('lgmt') || url.includes('lgep') || url.includes('lgnl') || url.includes('bom-mo')) {
    return 'boi-tron'
  }
  if (url.includes('dai-') || url.includes('xich')) {
    return 'truyen-dong'
  }
  if (url.includes('tmbh') || url.includes('tih') || url.includes('tmma') || url.includes('tmft')) {
    return 'dung-cu-bao-tri'
  }
  if (url.includes('vong-bi') || url.includes('goi-uc')) {
    return 'vong-bi'
  }
  return 'vong-bi'
}

// Determine brand from URL or content
function determineBrand(url: string, html: string): string {
  const urlLower = url.toLowerCase()
  const htmlLower = html.toLowerCase()

  if (urlLower.includes('skf') || htmlLower.includes('skf lgmt') || htmlLower.includes('skf lgep') || htmlLower.includes('skf lgnl')) {
    return 'skf'
  }
  if (urlLower.includes('fag') || htmlLower.includes('fag')) {
    return 'fag'
  }
  if (urlLower.includes('optibelt') || html.includes('Optibelt')) {
    return 'optibelt'
  }
  if (urlLower.includes('bando') || html.includes('Bando')) {
    return 'bando'
  }
  if (urlLower.includes('tsubaki') || html.includes('Tsubaki')) {
    return 'tsubaki'
  }
  // Default to SKF for lubricants and tools
  if (url.includes('lgmt') || url.includes('lgep') || url.includes('lgnl') || url.includes('p253')) {
    return 'skf'
  }
  return 'skf'
}

// Scrape a single product
async function scrapeProduct(url: string): Promise<ProductData | null> {
  try {
    console.log(`Scraping: ${url}`)
    const html = await fetchHTML(url)

    const slug = url.split('/product/')[1]?.replace(/\/$/, '') || ''

    // Extract title
    const titleMatch = html.match(/<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([^<]+)<\/h1>/i)
    const name = titleMatch ? titleMatch[1].trim() : ''

    // Extract short description
    const shortDescMatch = html.match(/<div[^>]*class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
    const shortDescription = shortDescMatch ? stripTags(shortDescMatch[1]).substring(0, 500) : ''

    // Extract main description
    const descMatch = html.match(/<div[^>]*id="tab-description"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i)
    const description = descMatch ? descMatch[1] : ''

    // Extract images
    const imageMatches = html.matchAll(/data-large_image="([^"]+)"/g)
    const images: string[] = []
    for (const match of imageMatches) {
      if (!images.includes(match[1])) {
        images.push(match[1])
      }
    }

    // If no large images found, try regular src
    if (images.length === 0) {
      const srcMatches = html.matchAll(/src="(https:\/\/v-ies\.com\/wp-content\/uploads\/[^"]+)"/g)
      for (const match of srcMatches) {
        const imgUrl = match[1].replace(/-\d+x\d+\./, '.') // Remove size suffix
        if (!images.includes(imgUrl) && !imgUrl.includes('Logo')) {
          images.push(imgUrl)
        }
      }
    }

    const category = determineCategory(url, html)
    const brand = determineBrand(url, html)

    // Generate SKU from name
    const skuMatch = name.match(/([A-Z0-9]+-?[A-Z0-9]+)/i)
    const sku = skuMatch ? skuMatch[1].toUpperCase() : slug.toUpperCase().replace(/-/g, '')

    return {
      slug,
      name,
      nameEn: name, // Will need manual translation
      sku,
      shortDescription,
      shortDescriptionEn: shortDescription, // Will need manual translation
      description: stripTags(description).substring(0, 2000),
      descriptionEn: '', // Will need manual translation
      category,
      brand,
      images: images.slice(0, 5), // Limit to 5 images
      specifications: {},
    }
  } catch (error) {
    console.error(`Error scraping ${url}:`, error)
    return null
  }
}

// Main function
async function main() {
  const outputDir = path.join(__dirname, '../data/scraped-products')
  const imagesDir = path.join(__dirname, '../public/images/products-new')

  // Create directories
  fs.mkdirSync(outputDir, { recursive: true })
  fs.mkdirSync(imagesDir, { recursive: true })

  const products: ProductData[] = []

  for (const url of PRODUCT_URLS) {
    const product = await scrapeProduct(url)
    if (product) {
      products.push(product)

      // Download images
      for (let i = 0; i < product.images.length; i++) {
        const imgUrl = product.images[i]
        const ext = path.extname(imgUrl) || '.jpg'
        const imgName = `${product.slug}-${i + 1}${ext}`
        const imgPath = path.join(imagesDir, imgName)

        try {
          if (!fs.existsSync(imgPath)) {
            await downloadImage(imgUrl, imgPath)
            console.log(`  Downloaded: ${imgName}`)
          }
          product.images[i] = `/images/products-new/${imgName}`
        } catch (err) {
          console.error(`  Failed to download: ${imgUrl}`)
        }
      }

      // Small delay to be nice to the server
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  // Save products data
  const outputPath = path.join(outputDir, 'products.json')
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2))
  console.log(`\nSaved ${products.length} products to ${outputPath}`)

  // Generate summary
  console.log('\n=== Summary ===')
  console.log(`Total products: ${products.length}`)

  const byCategory: Record<string, number> = {}
  const byBrand: Record<string, number> = {}

  for (const p of products) {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1
    byBrand[p.brand] = (byBrand[p.brand] || 0) + 1
  }

  console.log('\nBy Category:')
  for (const [cat, count] of Object.entries(byCategory)) {
    console.log(`  ${cat}: ${count}`)
  }

  console.log('\nBy Brand:')
  for (const [brand, count] of Object.entries(byBrand)) {
    console.log(`  ${brand}: ${count}`)
  }
}

main().catch(console.error)
