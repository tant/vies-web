import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Search API - Payload query logic', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('finds products by name containing query', async () => {
    const results = await payload.find({
      collection: 'products',
      where: {
        or: [
          { name: { contains: 'SKF' } },
          { sku: { contains: 'SKF' } },
        ],
      },
      limit: 6,
      select: { name: true, sku: true, slug: true, brand: true, images: true },
    })

    expect(results).toBeDefined()
    expect(results.docs).toBeInstanceOf(Array)
    expect(results.docs.length).toBeLessThanOrEqual(6)
    for (const doc of results.docs) {
      const nameMatch = doc.name?.toLowerCase().includes('skf')
      const skuMatch = doc.sku?.toLowerCase().includes('skf')
      expect(nameMatch || skuMatch).toBe(true)
    }
  })

  it('finds products by sku containing query', async () => {
    const results = await payload.find({
      collection: 'products',
      where: {
        or: [
          { name: { contains: '6205' } },
          { sku: { contains: '6205' } },
        ],
      },
      limit: 6,
      select: { name: true, sku: true, slug: true, brand: true, images: true },
    })

    expect(results).toBeDefined()
    expect(results.docs).toBeInstanceOf(Array)
    for (const doc of results.docs) {
      const nameMatch = doc.name?.toLowerCase().includes('6205')
      const skuMatch = doc.sku?.toLowerCase().includes('6205')
      expect(nameMatch || skuMatch).toBe(true)
    }
  })

  it('handles short query without error', async () => {
    // Payload handles single-char queries fine; the < 2 char guard is in the API route
    const results = await payload.find({
      collection: 'products',
      where: {
        or: [
          { name: { contains: 'a' } },
          { sku: { contains: 'a' } },
        ],
      },
      limit: 6,
    })

    expect(results).toBeDefined()
    expect(results.docs).toBeInstanceOf(Array)
  })

  it('respects limit of 6 results', async () => {
    const results = await payload.find({
      collection: 'products',
      where: {
        or: [
          { name: { contains: '' } },
          { sku: { contains: '' } },
        ],
      },
      limit: 6,
    })

    expect(results.docs.length).toBeLessThanOrEqual(6)
  })

  it('includes populated brand with name in results', async () => {
    const results = await payload.find({
      collection: 'products',
      limit: 1,
      select: { name: true, brand: true },
    })

    if (results.docs.length > 0) {
      const product = results.docs[0]
      if (product.brand) {
        expect(typeof product.brand).toBe('object')
        expect((product.brand as { name: string }).name).toBeDefined()
      }
    }
  })

  it('can transform results matching API route response shape', async () => {
    const results = await payload.find({
      collection: 'products',
      limit: 1,
      select: { name: true, sku: true, slug: true, brand: true, images: true },
    })

    if (results.docs.length > 0) {
      const doc = results.docs[0]
      const transformed = {
        id: doc.id,
        name: doc.name,
        sku: doc.sku,
        slug: doc.slug,
        brand:
          typeof doc.brand === 'object' && doc.brand
            ? (doc.brand as { name: string }).name
            : null,
        thumbnail:
          typeof doc.images?.[0]?.image === 'object' && doc.images[0].image
            ? ((doc.images[0].image as { sizes?: { thumbnail?: { url?: string } }; url?: string })
                .sizes?.thumbnail?.url ??
              (doc.images[0].image as { url?: string }).url)
            : null,
      }
      expect(transformed.id).toBeDefined()
      expect(typeof transformed.name).toBe('string')
      expect(typeof transformed.slug).toBe('string')
    }
  })
})
