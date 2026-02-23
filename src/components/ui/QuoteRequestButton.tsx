'use client'

import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'

const QuoteRequestModal = dynamic(
  () => import('./QuoteRequestForm').then((m) => ({ default: m.QuoteRequestModal })),
  { ssr: false },
)

interface QuoteRequestButtonProps {
  productName: string
  productSku?: string
  locale: string
  label: string
  className?: string
}

export function QuoteRequestButton({
  productName,
  productSku,
  locale,
  label,
  className,
}: QuoteRequestButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClose = useCallback(() => {
    setIsModalOpen(false)
    // Return focus to trigger button for accessibility (WCAG 2.4.3)
    requestAnimationFrame(() => {
      buttonRef.current?.focus()
    })
  }, [])

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsModalOpen(true)}
        className={
          className ||
          'inline-flex items-center justify-center px-6 py-3 bg-accent text-gray-900 font-semibold rounded-lg hover:bg-accent/90 transition-colors'
        }
      >
        {label}
      </button>

      {isModalOpen && (
        <QuoteRequestModal
          isOpen={isModalOpen}
          onClose={handleClose}
          productName={productName}
          productSku={productSku}
          locale={locale}
        />
      )}
    </>
  )
}
