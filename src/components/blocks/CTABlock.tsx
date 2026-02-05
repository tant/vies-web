import Link from 'next/link'
import type { Page } from '@/payload-types'
import { cn } from '@/lib/utils'

type CTABlockData = Extract<NonNullable<Page['layout']>[number], { blockType: 'cta' }>

interface CTABlockProps {
  block: CTABlockData
  locale: string
}

const buttonStyles = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark',
  outline: 'border-2 border-white text-white hover:bg-white hover:text-primary',
}

export function CTABlock({ block, locale }: CTABlockProps) {
  const buttons = block.buttons?.slice(0, 3) ?? []

  return (
    <section className="py-xl bg-accent">
      <div className="mx-auto max-w-[var(--container-max)] px-md text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">{block.heading}</h2>
        {block.description && (
          <p className="mt-md text-lg text-white/90 max-w-2xl mx-auto">{block.description}</p>
        )}
        {buttons.length > 0 && (
          <div className="mt-lg flex flex-wrap items-center justify-center gap-md">
            {buttons.map((button, index) => {
              const style = button.style ?? 'primary'
              const href = button.link.startsWith('/')
                ? `/${locale}${button.link}`
                : button.link

              return (
                <Link
                  key={button.id ?? index}
                  href={href}
                  className={cn(
                    'inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-200',
                    buttonStyles[style]
                  )}
                >
                  {button.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
