import { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ContactForm } from '@/components/ui/ContactForm'
import { ContactInfo } from '@/components/ui/ContactInfo'
import { ContactMap } from '@/components/ui/ContactMap'
import type { Locale } from '@/i18n/config'

interface ContactPageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return {
    title: `${t('title')} | VIES`,
    description: t('subtitle'),
  }
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  const payload = await getPayload({ config: await config })

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    locale,
  })

  const contact = siteSettings.contact || {}
  const social = siteSettings.social || {}
  const address = contact.address || 'VIES Vietnam'

  return (
    <main>
      {/* Breadcrumb - AC #8 */}
      <Breadcrumb items={[{ label: t('title') }]} />

      {/* Page Content */}
      <div className="mx-auto max-w-[var(--container-max)] px-md py-xl lg:py-2xl">
        {/* Header */}
        <div className="text-center mb-xl lg:mb-2xl">
          <h1 className="text-2xl lg:text-3xl font-bold text-text mb-md">{t('title')}</h1>
          <p className="text-text-muted max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        {/* Two Column Layout - AC #1, #2, #3 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-lg lg:gap-2xl">
          {/* Form - takes more space (AC #1, #4, #5, #6, #7) */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-border rounded-lg p-lg lg:p-xl">
              <h2 className="text-xl font-semibold text-text mb-sm">{t('formTitle')}</h2>
              <p className="text-text-muted text-sm mb-lg">{t('formSubtitle')}</p>
              <ContactForm locale={locale} />
            </div>
          </div>

          {/* Sidebar - Info + Map (AC #2, #3) */}
          <div className="lg:col-span-2 space-y-lg">
            {/* Contact Info Card */}
            <div className="bg-white border border-border rounded-lg p-lg">
              <h2 className="text-xl font-semibold text-text mb-lg">{t('contactInfo')}</h2>
              <ContactInfo contact={contact} social={social} locale={locale} />
            </div>

            {/* Map */}
            <div className="bg-white border border-border rounded-lg p-lg">
              <h2 className="text-xl font-semibold text-text mb-md">{t('map')}</h2>
              <ContactMap address={address} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
