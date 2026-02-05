'use client'

import { useEffect, useState, useRef } from 'react'
import { useTranslations } from 'next-intl'

interface MobileStickyBarProps {
  phone: string
  zaloUrl: string
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 14.957c-.156.327-.529.714-1.08.714h-.742c-.14 0-.295-.082-.295-.082l-2.02-1.259c-.083-.054-.165 0-.165.082v1.078c0 .164-.083.247-.247.247h-.659c-.165 0-.248-.083-.248-.247V9.248c0-.165.083-.248.248-.248h.659c.164 0 .247.083.247.248v1.917c0 .082.082.137.165.082l1.937-1.835c.041-.041.124-.082.206-.082h.825c.289 0 .454.165.454.33 0 .082-.041.164-.082.206l-2.185 2.02c-.042.041-.042.123 0 .165l2.474 2.474c.083.082.124.165.124.247 0 .041 0 .124-.041.165zM9.587 14.875H6.618c-.289 0-.454-.165-.454-.454V9.662c0-.289.165-.454.454-.454h2.969c.289 0 .454.165.454.454v.619c0 .289-.165.454-.454.454H7.732v.866h1.855c.289 0 .454.165.454.454v.577c0 .289-.165.454-.454.454H7.732v.908h1.855c.289 0 .454.165.454.454v.619c0 .247-.165.412-.454.412z" />
    </svg>
  )
}

export function MobileStickyBar({ phone, zaloUrl }: MobileStickyBarProps) {
  const t = useTranslations('mobileCta')
  const [isVisible, setIsVisible] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    // Check if user prefers reduced motion and store in state
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes to motion preference
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    mediaQuery.addEventListener('change', handleMotionChange)

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const scrollingDown = currentScrollY > lastScrollY.current
          const scrollingUp = currentScrollY < lastScrollY.current
          const pastThreshold = currentScrollY > 100

          if (scrollingDown && pastThreshold) {
            setIsVisible(true) // scrolling down - show bar
          } else if (scrollingUp) {
            setIsVisible(false) // scrolling up - hide bar
          }

          lastScrollY.current = currentScrollY
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  // Format phone for tel: link (remove spaces and special chars)
  const telLink = `tel:${phone.replace(/[\s-]/g, '')}`

  return (
    <div
      role="complementary"
      aria-label={t('call')}
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-white border-t border-border shadow-lg
        md:hidden
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
      style={{
        transition: prefersReducedMotion ? 'none' : 'transform 300ms ease-in-out',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex">
        {/* Call button - Primary CTA */}
        <a
          href={telLink}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 font-medium hover:bg-primary/90 active:bg-primary/80 transition-colors"
        >
          <PhoneIcon className="w-5 h-5" />
          {t('call')}
        </a>

        {/* Zalo button - Secondary CTA */}
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#0068FF] text-white py-3 font-medium hover:bg-[#0058DD] active:bg-[#0048BB] transition-colors"
        >
          <ZaloIcon className="w-5 h-5" />
          {t('zalo')}
        </a>
      </div>
    </div>
  )
}
