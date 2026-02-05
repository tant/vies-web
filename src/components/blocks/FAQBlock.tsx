'use client'

import { useState } from 'react'
import type { Page } from '@/payload-types'
import { RichTextContent } from '@/components/product/RichTextContent'
import { ChevronDownIcon } from '@/components/layout/icons'

type FAQBlockData = Extract<NonNullable<Page['layout']>[number], { blockType: 'faq' }>

interface FAQBlockProps {
  block: FAQBlockData
}

export function FAQBlock({ block }: FAQBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!block.items?.length) return null

  return (
    <section className="py-xl bg-gray-50">
      <div className="mx-auto max-w-[var(--container-max)] px-md">
        {block.heading && (
          <h2 className="text-3xl font-bold text-gray-900 mb-lg text-center">{block.heading}</h2>
        )}
        <div className="max-w-3xl mx-auto space-y-sm">
          {block.items.map((item, index) => (
            <div
              key={item.id ?? index}
              className="bg-white rounded-lg border border-border overflow-hidden"
            >
              <button
                id={`faq-question-${item.id ?? index}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-md py-md flex items-center justify-between text-left"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${item.id ?? index}`}
              >
                <span className="font-semibold text-gray-900">{item.question}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                id={`faq-answer-${item.id ?? index}`}
                className={`px-md pb-md ${openIndex === index ? '' : 'hidden'}`}
                role="region"
                aria-labelledby={`faq-question-${item.id ?? index}`}
              >
                <RichTextContent
                  data={item.answer}
                  className="prose prose-sm prose-gray max-w-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
