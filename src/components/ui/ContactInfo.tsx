import { getTranslations } from 'next-intl/server'
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  FacebookIcon,
  ClockIcon,
  ZaloIcon,
} from '@/components/layout/icons'

interface ContactInfoProps {
  contact: {
    phone?: Array<{ number: string; label?: string | null }> | null
    email?: string | null
    address?: string | null
  }
  social?: {
    facebook?: string | null
    zalo?: string | null
    youtube?: string | null
  } | null
  locale: string
}

export async function ContactInfo({ contact, social, locale }: ContactInfoProps) {
  const t = await getTranslations({ locale, namespace: 'contact' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  return (
    <div className="space-y-6">
      {/* Address */}
      {contact.address && (
        <div className="flex gap-3">
          <MapPinIcon className="w-5 h-5 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-text text-sm mb-1">{t('address')}</h3>
            <p className="text-text-muted text-sm whitespace-pre-line">{contact.address}</p>
          </div>
        </div>
      )}

      {/* Phone numbers */}
      {contact.phone && contact.phone.length > 0 && (
        <div className="flex gap-3">
          <PhoneIcon className="w-5 h-5 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-text text-sm mb-1">{t('phone')}</h3>
            <div className="space-y-1">
              {contact.phone.map((p, i) => (
                <a
                  key={i}
                  href={`tel:${p.number.replace(/[\s-]/g, '')}`}
                  className="block text-primary hover:underline text-sm"
                >
                  {p.number}
                  {p.label && <span className="text-text-muted ml-1">({p.label})</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Email */}
      {contact.email && (
        <div className="flex gap-3">
          <MailIcon className="w-5 h-5 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-text text-sm mb-1">{tCommon('email')}</h3>
            <a
              href={`mailto:${contact.email}`}
              className="text-primary hover:underline text-sm break-all"
            >
              {contact.email}
            </a>
          </div>
        </div>
      )}

      {/* Working Hours */}
      <div className="flex gap-3">
        <ClockIcon className="w-5 h-5 text-primary shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-text text-sm mb-1">{t('workingHours')}</h3>
          <p className="text-text-muted text-sm whitespace-pre-line">{t('workingHoursDetail')}</p>
        </div>
      </div>

      {/* Social Links */}
      {(social?.zalo || social?.facebook) && (
        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold text-text text-sm mb-3">{t('followUs')}</h3>
          <div className="flex gap-3">
            {social.zalo && (
              <a
                href={social.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#0068FF] text-white rounded-lg hover:bg-[#0068FF]/90 transition-colors text-sm"
                aria-label="Zalo"
              >
                <ZaloIcon className="w-5 h-5" />
                <span>Zalo</span>
              </a>
            )}
            {social.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1877F2]/90 transition-colors text-sm"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
                <span>Facebook</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
