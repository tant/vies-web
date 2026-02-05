import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export async function Breadcrumb({ items }: BreadcrumbProps) {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'nav' })

  const allItems: BreadcrumbItem[] = [
    { label: t('breadcrumb.home'), href: `/${locale}` },
    ...items,
  ]

  return (
    <nav aria-label="Breadcrumb" className="bg-white border-b border-border">
      <div className="mx-auto max-w-[var(--container-max)] px-md py-sm">
        <ol className="flex items-center gap-sm text-sm">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1

            return (
              <li key={item.href ?? item.label} className="flex items-center gap-sm">
                {index > 0 && (
                  <ChevronRightIcon className="w-3 h-3 text-text-muted shrink-0" />
                )}
                {isLast || !item.href ? (
                  <span aria-current={isLast ? 'page' : undefined} className="text-text font-medium truncate max-w-[200px] sm:max-w-none">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-text-muted hover:text-primary transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}
