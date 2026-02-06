import type { Page } from '@/payload-types'
import type { Locale } from '@/i18n/config'
import { HeroBlock } from './HeroBlock'
import { ContentBlock } from './ContentBlock'
import { CTABlock } from './CTABlock'
import { FAQBlock } from './FAQBlock'
import { GalleryBlock } from './GalleryBlock'

interface RenderBlocksProps {
  blocks: Page['layout']
  locale: Locale
}

export function RenderBlocks({ blocks, locale }: RenderBlocksProps) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={block.id ?? index} block={block} />
          case 'content':
            return <ContentBlock key={block.id ?? index} block={block} />
          case 'cta':
            return <CTABlock key={block.id ?? index} block={block} locale={locale} />
          case 'faq':
            return <FAQBlock key={block.id ?? index} block={block} />
          case 'gallery':
            return <GalleryBlock key={block.id ?? index} block={block} locale={locale} />
          default:
            return null
        }
      })}
    </>
  )
}
