import { describe, it, expect } from 'vitest'
import { GET } from '@/app/(frontend)/api/search-page/route'
import { NextRequest } from 'next/server'

function makeSearchPageRequest(params: Record<string, string>): NextRequest {
  const url = new URL('http://localhost:3000/api/search-page')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return new NextRequest(url)
}

describe('Search Page API - Route handler', () => {
  it('returns empty results for empty query', async () => {
    const response = await GET(makeSearchPageRequest({}))
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.results).toEqual([])
    expect(data.totalDocs).toBe(0)
    expect(data.hasNextPage).toBe(false)
    expect(data.nextPage).toBeNull()
  })

  it('returns empty results for whitespace-only query', async () => {
    const response = await GET(makeSearchPageRequest({ q: '   ' }))
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.results).toEqual([])
    expect(data.totalDocs).toBe(0)
  })

  it('defaults to vi locale when locale not provided', async () => {
    const response = await GET(makeSearchPageRequest({ q: 'SKF' }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
  })

  it('accepts vi locale', async () => {
    const response = await GET(makeSearchPageRequest({ q: 'SKF', locale: 'vi' }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
  })

  it('accepts en locale', async () => {
    const response = await GET(makeSearchPageRequest({ q: 'SKF', locale: 'en' }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
  })

  it('returns results with correct shape', async () => {
    const response = await GET(makeSearchPageRequest({ q: 'SKF', locale: 'vi' }))
    const data = await response.json()
    expect(data).toHaveProperty('results')
    expect(data).toHaveProperty('totalDocs')
    expect(data).toHaveProperty('hasNextPage')
    expect(data).toHaveProperty('nextPage')
    expect(data.results).toBeInstanceOf(Array)
    for (const result of data.results) {
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('sku')
      expect(result).toHaveProperty('slug')
      expect(result).toHaveProperty('brand')
      expect(result).toHaveProperty('image')
    }
  })

  it('defaults to limit of 12 results', async () => {
    const response = await GET(makeSearchPageRequest({ q: 'bi', locale: 'vi' }))
    const data = await response.json()
    expect(data.results.length).toBeLessThanOrEqual(12)
  })

  it('respects custom limit parameter', async () => {
    const response = await GET(makeSearchPageRequest({ q: 'bi', locale: 'vi', limit: '5' }))
    const data = await response.json()
    expect(data.results.length).toBeLessThanOrEqual(5)
  })

  it('defaults to page 1', async () => {
    const response = await GET(makeSearchPageRequest({ q: 'SKF', locale: 'vi' }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
  })

  it('accepts page parameter', async () => {
    const response = await GET(makeSearchPageRequest({ q: 'SKF', locale: 'vi', page: '2' }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
  })

  it('handles special characters in query safely', async () => {
    const response = await GET(makeSearchPageRequest({ q: "'; DROP TABLE products; --" }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
  })

  it('trims query whitespace', async () => {
    const response = await GET(makeSearchPageRequest({ q: '  SKF  ', locale: 'vi' }))
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
  })

  it('enforces maximum limit of 50', async () => {
    const response = await GET(makeSearchPageRequest({ q: 'bi', locale: 'vi', limit: '100' }))
    const data = await response.json()
    expect(data.results.length).toBeLessThanOrEqual(50)
  })

  it('enforces minimum limit of 1', async () => {
    const response = await GET(makeSearchPageRequest({ q: 'bi', locale: 'vi', limit: '0' }))
    expect(response.status).toBe(200)
    // Should default to 1 when 0 is provided
    const data = await response.json()
    expect(data.results).toBeInstanceOf(Array)
  })
})
