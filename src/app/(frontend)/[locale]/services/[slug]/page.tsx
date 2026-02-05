import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { CTASection } from '@/components/ui/CTASection'
import { RichTextContent } from '@/components/product/RichTextContent'
import { CheckCircleIcon } from '@/components/layout/icons'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: locale as Locale,
  })

  const service = docs[0]
  if (!service) {
    return { title: locale === 'vi' ? 'Không tìm thấy dịch vụ' : 'Service Not Found' }
  }

  const imageUrl =
    typeof service.featuredImage === 'object' && service.featuredImage
      ? service.featuredImage.sizes?.large?.url ?? service.featuredImage.url
      : null

  return {
    title: `${service.title} | VIES`,
    description: service.excerpt ?? undefined,
    openGraph: {
      title: service.title,
      description: service.excerpt ?? undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })

  const t = await getTranslations({ locale, namespace: 'services' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  // Fetch service by slug (publishedOnly handles draft filtering)
  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: locale as Locale,
    depth: 1, // Populate featuredImage
  })

  const service = docs[0]

  // 404 if not found
  if (!service) {
    notFound()
  }

  // Fetch site settings for CTA
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    locale: locale as Locale,
  })

  // Extract image data
  const imageUrl =
    typeof service.featuredImage === 'object' && service.featuredImage
      ? service.featuredImage.sizes?.large?.url ?? service.featuredImage.url
      : null
  const imageAlt =
    typeof service.featuredImage === 'object' && service.featuredImage
      ? service.featuredImage.alt || service.title
      : service.title

  const benefits = service.benefits ?? []

  return (
    <>
      {/* Breadcrumb: Home > Dịch vụ > [Service Name] */}
      <Breadcrumb
        items={[
          { label: tNav('breadcrumb.services'), href: `/${locale}/services` },
          { label: service.title },
        ]}
      />

      {/* Hero Section with Featured Image */}
      <section className="bg-white">
        {imageUrl && (
          <div className="w-full aspect-[21/9] md:aspect-[3/1] relative overflow-hidden">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}

        {/* Title Section */}
        <div className="mx-auto max-w-[var(--container-max)] px-md py-lg md:py-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {service.title}
          </h1>
          {service.excerpt && (
            <p className="text-lg text-text-muted mt-md max-w-3xl">
              {service.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Content Section */}
      {service.content && (
        <section className="py-xl bg-white">
          <div className="mx-auto max-w-[var(--container-max)] px-md">
            <RichTextContent
              data={service.content}
              className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600"
            />
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {benefits.length > 0 && (
        <section className="py-xl bg-gray-50">
          <div className="mx-auto max-w-[var(--container-max)] px-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-lg">
              {t('benefits')}
            </h2>
            <ul className="space-y-md">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-sm">
                  <CheckCircleIcon
                    className="w-6 h-6 text-success shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-lg text-gray-700">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <CTASection
        title={t('contactConsult')}
        subtitle={t('contactSubtitle')}
        phone={siteSettings.contact?.phone?.[0]?.number || '0908748304'}
        zaloLink={siteSettings.social?.zalo ?? undefined}
        callLabel={tCommon('callNow')}
        zaloLabel={tCommon('zaloChat')}
      />
    </>
  )
}
