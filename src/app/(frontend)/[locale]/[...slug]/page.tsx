import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { RichTextContent } from '@/components/product/RichTextContent'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string; slug: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const slugString = slug.join('/')
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slugString } },
    limit: 1,
    locale: locale as Locale,
    depth: 1,
  })

  const page = docs[0]
  if (!page) {
    return { title: locale === 'vi' ? 'Không tìm thấy trang' : 'Page Not Found' }
  }

  // Extract og:image from featuredImage
  const imageUrl =
    typeof page.featuredImage === 'object' && page.featuredImage
      ? page.featuredImage.sizes?.large?.url ?? page.featuredImage.url
      : null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'

  const pageUrl = `${siteUrl}/${locale}/${slugString}`

  return {
    title: `${page.meta?.title || page.title} | VIES`,
    description: page.meta?.description ?? undefined,
    openGraph: {
      title: page.meta?.title || page.title,
      description: page.meta?.description ?? undefined,
      url: pageUrl,
      type: 'website',
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.meta?.title || page.title,
      description: page.meta?.description ?? undefined,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: pageUrl,
    },
  }
}

export default async function DynamicPage({ params }: Props) {
  const { locale, slug } = await params
  const slugString = slug.join('/')
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slugString } },
    limit: 1,
    locale: locale as Locale,
    depth: 2, // Populate images in layout blocks
  })

  const page = docs[0]

  if (!page) {
    notFound()
  }

  return (
    <>
      {/* Breadcrumb: Home > [Page Title] */}
      <Breadcrumb
        items={[
          { label: page.title },
        ]}
      />

      {/* Page Title (only if no HeroBlock at start of layout) */}
      {(!page.layout?.length || page.layout[0].blockType !== 'hero') && (
        <section className="bg-white py-lg border-b border-border">
          <div className="mx-auto max-w-[var(--container-max)] px-md">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {page.title}
            </h1>
          </div>
        </section>
      )}

      {/* Layout Blocks (if any) */}
      {page.layout && page.layout.length > 0 && (
        <RenderBlocks blocks={page.layout} locale={locale} />
      )}

      {/* Rich Text Content (if any, separate from blocks) */}
      {page.content && (
        <section className="py-xl bg-white">
          <div className="mx-auto max-w-[var(--container-max)] px-md">
            <RichTextContent
              data={page.content}
              className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600"
            />
          </div>
        </section>
      )}
    </>
  )
}
