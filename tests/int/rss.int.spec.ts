import { describe, it, expect } from 'vitest'
import { buildRss } from '@/lib/seo/rss'

describe('buildRss', () => {
  it('thoát ký tự đặc biệt, giữ tiếng Việt, đặt pubDate RFC 822', () => {
    const xml = buildRss(
      {
        title: 'Tin & tức',
        link: 'https://vies.com.vn/vi/news',
        description: 'Mô tả <b>',
        language: 'vi-VN',
        selfUrl: 'https://vies.com.vn/vi/news/feed.xml',
        items: [
          {
            title: 'Vòng bi "SKF" ]]> mới',
            link: 'https://vies.com.vn/vi/news/a',
            description: 'x\u0001y',
            pubDate: '2026-11-01T03:00:00.000Z',
          },
        ],
      },
      new Date('2026-11-10T00:00:00Z'),
    )
    expect(xml).toContain('<title>Tin &amp; tức</title>')
    expect(xml).toContain('Vòng bi &quot;SKF&quot; ]]&gt; mới')
    expect(xml).toContain('<description>xy</description>')
    expect(xml).toContain('<pubDate>Sun, 01 Nov 2026 03:00:00 GMT</pubDate>')
    expect(xml).toContain('<lastBuildDate>Tue, 10 Nov 2026 00:00:00 GMT</lastBuildDate>')
  })
})
