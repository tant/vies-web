import { getTranslations } from 'next-intl/server'
import { MapPinIcon, ExternalLinkIcon } from '@/components/layout/icons'

interface ContactMapProps {
  address: string
  locale: string
  className?: string
}

export async function ContactMap({ address, locale, className }: ContactMapProps) {
  const t = await getTranslations({ locale, namespace: 'contact' })

  // Encode address for URL
  const encodedAddress = encodeURIComponent(address)

  // Google Maps embed URL (no API key needed for basic embed)
  const embedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`

  // Link to open in Google Maps
  const mapsLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`

  return (
    <div className={className}>
      {/* Map Embed */}
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-border bg-bg-alt">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={t('map')}
          className="w-full h-full"
        />
      </div>

      {/* Link to open in Google Maps */}
      <a
        href={mapsLinkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-3 text-sm text-primary hover:underline"
      >
        <MapPinIcon className="w-4 h-4" />
        <span>{t('openInMaps')}</span>
        <ExternalLinkIcon className="w-3.5 h-3.5" />
      </a>
    </div>
  )
}
