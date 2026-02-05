import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload

describe('publishedOnly access control', () => {
  let publishedProductId: string | number
  let draftProductId: string | number

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // Create a published product
    const published = await payload.create({
      collection: 'products',
      data: {
        name: '__test_published_product__',
        slug: '__test-published-product__',
        _status: 'published',
      },
    })
    publishedProductId = published.id

    // Create a draft product
    const draft = await payload.create({
      collection: 'products',
      data: {
        name: '__test_draft_product__',
        slug: '__test-draft-product__',
        _status: 'draft',
      },
    })
    draftProductId = draft.id
  })

  afterAll(async () => {
    // Clean up test data
    await payload.delete({ collection: 'products', id: publishedProductId })
    await payload.delete({ collection: 'products', id: draftProductId })
  })

  it('anonymous query returns only published products', async () => {
    // Local API without user context simulates anonymous access
    const result = await payload.find({
      collection: 'products',
      where: {
        slug: { in: ['__test-published-product__', '__test-draft-product__'] },
      },
    })

    const slugs = result.docs.map((doc) => doc.slug)
    expect(slugs).toContain('__test-published-product__')
    expect(slugs).not.toContain('__test-draft-product__')
  })

  it('authenticated query returns both published and draft products', async () => {
    // overrideAccess: true simulates authenticated admin access
    const result = await payload.find({
      collection: 'products',
      where: {
        slug: { in: ['__test-published-product__', '__test-draft-product__'] },
      },
      overrideAccess: true,
    })

    const slugs = result.docs.map((doc) => doc.slug)
    expect(slugs).toContain('__test-published-product__')
    expect(slugs).toContain('__test-draft-product__')
  })
})
