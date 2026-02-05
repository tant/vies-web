import type { Page } from '@/payload-types'
import { RichTextContent } from '@/components/product/RichTextContent'

type ContentBlockData = Extract<NonNullable<Page['layout']>[number], { blockType: 'content' }>

interface ContentBlockProps {
  block: ContentBlockData
}

export function ContentBlock({ block }: ContentBlockProps) {
  return (
    <section className="py-xl">
      <div className="mx-auto max-w-[var(--container-max)] px-md">
        <RichTextContent
          data={block.content}
          className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600"
        />
      </div>
    </section>
  )
}
