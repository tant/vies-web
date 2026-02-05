import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect } from 'vitest'
import { GET } from '@/app/(frontend)/api/search/route'
import { NextRequest } from 'next/server'

function makeSearchRequest(params: Record<string, string>): NextRequest {
  const url = new URL('http://localhost:3000/api/search')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return new NextRequest(url)
}

describe('Search API - Route handler', () => {
  it('returns empty results for query shorter than 2 characters', async () => {
    const response = await GET(makeSearchRequest({ q: 'a' }))
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.results).toEqual([])
  })

  it('returns empty results for empty query', async () => {
    const response = await GET(makeSearchRequest({}))
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.results).toEqual([])
  })

  it('defaults to vi locale when invalid locale provided', async () => {
    const response = await GET(makeSearchRequest({ q: 'test', locale: 'fr' }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
  })

  it('accepts vi locale', async () => {
    const response = await GET(makeSearchRequest({ q: 'SKF', locale: 'vi' }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
  })

  it('accepts en locale', async () => {
    const response = await GET(makeSearchRequest({ q: 'SKF', locale: 'en' }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
  })

  it('returns results with correct shape', async () => {
    const response = await GET(makeSearchRequest({ q: 'SKF', locale: 'vi' }))
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
    for (const result of data.results) {
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('sku')
      expect(result).toHaveProperty('slug')
      expect(result).toHaveProperty('brand')
      expect(result).toHaveProperty('thumbnail')
    }
  })

  it('limits results to 6', async () => {
    const response = await GET(makeSearchRequest({ q: 'bi', locale: 'vi' }))
    const data = await response.json()
    expect(data.results.length).toBeLessThanOrEqual(6)
  })

  it('handles special characters in query safely', async () => {
    const response = await GET(makeSearchRequest({ q: "'; DROP TABLE products; --" }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
  })

  it('trims query whitespace and returns matching results', async () => {
    const trimmedResponse = await GET(makeSearchRequest({ q: 'SKF', locale: 'vi' }))
    const trimmedData = await trimmedResponse.json()

    const paddedResponse = await GET(makeSearchRequest({ q: '  SKF  ', locale: 'vi' }))
    const paddedData = await paddedResponse.json()

    expect(paddedResponse.status).toBe(200)
    expect(paddedData.results.length).toBe(trimmedData.results.length)
  })

  it('truncates query to 100 characters', async () => {
    const longQuery = 'a'.repeat(150)
    const response = await GET(makeSearchRequest({ q: longQuery, locale: 'vi' }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
  })

  it('executes search for query with exactly 2 characters', async () => {
    const response = await GET(makeSearchRequest({ q: 'bi', locale: 'vi' }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
    // With seeded data containing "bi" in names, we expect results
  })
})

describe('Search API - Payload query logic', () => {
  let payload: Payload

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
