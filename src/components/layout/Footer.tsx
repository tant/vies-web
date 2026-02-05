import Link from 'next/link'
import Image from 'next/image'
import type { Footer as FooterType, SiteSetting, Media } from '@/payload-types'
import { formatTelHref } from '@/lib/utils'
import { PhoneIcon, MailIcon, MapPinIcon, FacebookIcon, YouTubeIcon } from './icons'

interface FooterProps {
  footerData: FooterType
  siteSettings: SiteSetting
  locale: string
}

function FooterLink({ url, label }: { url: string; label: string }) {
  const isExternal = url.startsWith('http') || url.startsWith('//')
  if (isExternal) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-white transition-colors text-sm"
      >
        {label}
      </a>
    )
  }
  return (
    <Link href={url} className="text-gray-400 hover:text-white transition-colors text-sm">
      {label}
    </Link>
  )
}

export function Footer({ footerData, siteSettings, locale }: FooterProps) {
  const columns = (footerData.columns ?? []).slice(0, 4)
  const contact = siteSettings.contact
  const social = siteSettings.social
  const logo = siteSettings.logo as Media | null

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-[var(--container-max)] px-md py-3xl lg:py-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
          {/* Company Info — always first column */}
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-md">
              {logo?.url ? (
                <Image
                  src={logo.url}
                  alt={logo.alt || siteSettings.siteName || 'VIES'}
                  width={120}
                  height={40}
                  className="h-10 w-auto brightness-0 invert"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">V</span>
                  </div>
                  <span className="font-bold text-xl text-white">VIES</span>
                </div>
              )}
            </Link>

            {/* Contact info */}
            <ul className="space-y-sm text-sm">
              {contact?.address && (
                <li className="flex items-start gap-sm">
                  <MapPinIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-gray-400">{contact.address}</span>
                </li>
              )}
              {contact?.phone?.map((phone, index) => (
                <li key={phone.id ?? index}>
                  <a
                    href={formatTelHref(phone.number)}
                    className="flex items-center gap-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <PhoneIcon className="w-4 h-4 text-primary" />
                    {phone.label ? <span>{phone.label}: {phone.number}</span> : phone.number}
                  </a>
                </li>
              ))}
              {contact?.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <MailIcon className="w-4 h-4 text-primary" />
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>

            {/* Social links */}
            <div className="flex gap-sm mt-md">
              {social?.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {social?.zalo && (
                <a
                  href={social.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label="Zalo"
                >
                  <span className="text-sm font-bold">Zalo</span>
                </a>
              )}
              {social?.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label="YouTube"
                >
                  <YouTubeIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* CMS Columns — dynamic from Footer global */}
          {columns.map((column, colIndex) => (
            <nav key={column.id ?? colIndex} aria-label={column.title}>
              <h3 className="text-white font-semibold mb-md">{column.title}</h3>
              <ul className="space-y-sm">
                {column.links?.map((link, linkIndex) => (
                  <li key={link.id ?? linkIndex}>
                    <FooterLink url={link.url} label={link.label} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Bottom Bar — copyright */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-[var(--container-max)] px-md py-lg">
          <p className="text-center text-sm text-gray-500">{footerData.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
