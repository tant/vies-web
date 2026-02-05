import Link from 'next/link'
import Image from 'next/image'
import { getLocale } from 'next-intl/server'
import type { Footer as FooterType, SiteSetting, Media } from '@/payload-types'
import { formatTelHref } from '@/lib/utils'

interface FooterProps {
  footerData: FooterType
  siteSettings: SiteSetting
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

export async function Footer({ footerData, siteSettings }: FooterProps) {
  const locale = await getLocale()
  const columns = (footerData.columns ?? []).slice(0, 3)
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

// Icons
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}
