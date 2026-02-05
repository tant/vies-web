import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { CTASection } from '@/components/ui/CTASection'
import type { Locale } from '@/i18n/config'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })

  return {
    title: `${t('title')} | VIES`,
    description: locale === 'vi'
      ? 'Dịch vụ tư vấn kỹ thuật vòng bi, đo rung động, lắp đặt và bôi trơn từ VIES'
      : 'Technical consulting services for bearings, vibration analysis, installation and lubrication from VIES',
    openGraph: {
      title: t('title'),
    },
  }
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params

  const t = await getTranslations({ locale, namespace: 'services' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tHome = await getTranslations({ locale, namespace: 'home' })

  const payload = await getPayload({ config: await config })

  // Fetch services sorted by order (publishedOnly access handles draft filtering)
  const { docs: services } = await payload.find({
    collection: 'services',
    sort: 'order',
    locale: locale as Locale,
    depth: 1, // Populate featuredImage
  })

  // Fetch site settings for CTA
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    locale: locale as Locale,
  })

  return (
    <>
      {/* Breadcrumb: Home > Dịch vụ */}
      <Breadcrumb
        items={[{ label: tNav('breadcrumb.services') }]}
      />

      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-white border-b border-border">
          <div className="mx-auto max-w-[var(--container-max)] px-md py-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('title')}
            </h1>
            <p className="text-text-muted mt-2 text-lg">
              {tHome('servicesDesc')}
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mx-auto max-w-[var(--container-max)] px-md py-xl">
          {services.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-lg shadow-sm p-xl text-center">
              <p className="text-text-muted">{tCommon('noResults')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  locale={locale}
                  viewDetailsText={t('viewDetails')}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <CTASection
          title={tHome('ctaTitle')}
          subtitle={tHome('ctaSubtitle')}
          phone={siteSettings.contact?.phone?.[0]?.number || '0908748304'}
          zaloLink={siteSettings.social?.zalo ?? undefined}
          callLabel={tCommon('callNow')}
          zaloLabel={tCommon('zaloChat')}
        />
      </div>
    </>
  )
}
