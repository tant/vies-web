export type RssItem = {
  title: string
  link: string
  description?: string | null
  pubDate?: string | null
  category?: string | null
}

export type RssChannel = {
  title: string
  link: string
  description: string
  language: string
  selfUrl: string
  items: RssItem[]
}

// Bỏ ký tự điều khiển không hợp lệ trong XML 1.0, rồi thoát 5 ký tự đặc biệt.
export function escapeXml(s: string): string {
  return s
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildRss(ch: RssChannel, now: Date = new Date()): string {
  const items = ch.items.map((it) => {
    const date = it.pubDate ? new Date(it.pubDate) : null
    return [
      '    <item>',
      `      <title>${escapeXml(it.title)}</title>`,
      `      <link>${escapeXml(it.link)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(it.link)}</guid>`,
      date && !isNaN(+date) ? `      <pubDate>${date.toUTCString()}</pubDate>` : '',
      it.description ? `      <description>${escapeXml(it.description)}</description>` : '',
      it.category ? `      <category>${escapeXml(it.category)}</category>` : '',
      '    </item>',
    ].filter(Boolean).join('\n')
  })
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(ch.title)}</title>
    <link>${escapeXml(ch.link)}</link>
    <description>${escapeXml(ch.description)}</description>
    <language>${escapeXml(ch.language)}</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(ch.selfUrl)}" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>
`
}
