import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'

const uploadImage = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  imagePath: string,
  altText: string
): Promise<number | null> => {
  try {
    if (!fs.existsSync(imagePath)) {
      console.log(`  Image not found: ${imagePath}`)
      return null
    }

    const filename = path.basename(imagePath)

    // Check if image already exists
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { contains: filename.replace(/\.[^.]+$/, '') } },
    })

    if (existing.docs.length > 0) {
      console.log(`  Image already exists: ${filename}`)
      return existing.docs[0].id as number
    }

    const fileBuffer = fs.readFileSync(imagePath)
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg'

    const created = await payload.create({
      collection: 'media',
      data: { alt: altText },
      file: {
        data: fileBuffer,
        mimetype: mimeType,
        name: filename,
        size: fileBuffer.length,
      },
    })

    console.log(`  Uploaded: ${filename}`)
    return created.id as number
  } catch (error) {
    console.error(`  Error uploading image:`, error)
    return null
  }
}

const updateProductImage = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  productSlug: string,
  imageId: number
) => {
  try {
    // Fetch with 'all' locale to get complete specification data
    const products = await payload.find({
      collection: 'products',
      where: { slug: { equals: productSlug } },
      depth: 1,
      locale: 'all',
    })

    if (products.docs.length === 0) {
      console.log(`  Product not found: ${productSlug}`)
      return
    }

    const product = products.docs[0] as any

    // Check if product already has images
    const existingImages = product.images || []

    // Check if this image is already in the array
    const hasImage = existingImages.some((img: any) => {
      const imgId = typeof img.image === 'object' ? img.image?.id : img.image
      return imgId === imageId
    })

    if (hasImage) {
      console.log(`  Product already has this image: ${(product.name as any)?.vi || product.name}`)
      return
    }

    // Add the new image at the beginning of the array (as featured)
    const newImages = [
      { image: imageId },
      ...existingImages.map((img: any) => ({
        image: typeof img.image === 'object' ? img.image?.id : img.image,
      })),
    ]

    // Get existing specifications with proper locale handling
    // If vi locale is missing, copy from en
    const existingSpecs = (product.specifications || []).map((spec: any) => {
      const keyVi = spec.key?.vi || spec.key?.en || ''
      const keyEn = spec.key?.en || ''
      const valueVi = spec.value?.vi || spec.value?.en || ''
      const valueEn = spec.value?.en || ''
      return {
        id: spec.id,
        key: keyVi || keyEn, // Use vi if available, fallback to en
        value: valueVi || valueEn,
      }
    })

    // Update with vi locale (default) to fix missing vi data
    await payload.update({
      collection: 'products',
      id: product.id,
      locale: 'vi',
      data: {
        images: newImages,
        specifications: existingSpecs.length > 0 ? existingSpecs : undefined,
        _status: 'published',
      },
      overrideAccess: true,
    })

    console.log(`  Updated product images: ${(product.name as any)?.vi || product.name}`)
  } catch (error) {
    console.error(`  Error updating product ${productSlug}:`, error)
  }
}

const main = async () => {
  console.log('Updating product images...\n')

  const payload = await getPayload({ config: await config })

  const imageUpdates = [
    {
      imagePath: 'data/product-images/optibelt-omega.jpg',
      altText: 'Dây đai răng Optibelt OMEGA',
      productSlug: 'optibelt-omega',
    },
    {
      imagePath: 'data/product-images/skf-tmbh-1.jpg',
      altText: 'Máy gia nhiệt cảm ứng SKF TMBH 1',
      productSlug: 'skf-tmbh-1',
    },
    {
      imagePath: 'data/product-images/skf-lgmt-3.jpg',
      altText: 'Mỡ SKF LGMT 3',
      productSlug: 'skf-lgmt-3',
    },
  ]

  for (const update of imageUpdates) {
    console.log(`Processing: ${update.productSlug}`)
    const absolutePath = path.join(process.cwd(), update.imagePath)
    const imageId = await uploadImage(payload, absolutePath, update.altText)

    if (imageId) {
      await updateProductImage(payload, update.productSlug, imageId)
    }
    console.log('')
  }

  console.log('Done!')
  process.exit(0)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
