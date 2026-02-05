import Image from 'next/image'
import type { Page, Media } from '@/payload-types'

type HeroBlockData = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

interface HeroBlockProps {
  block: HeroBlockData
}

export function HeroBlock({ block }: HeroBlockProps) {
  const imageUrl =
    typeof block.image === 'object' && block.image
      ? (block.image as Media).sizes?.large?.url ?? (block.image as Media).url
      : null
  const imageAlt =
    typeof block.image === 'object' && block.image
      ? (block.image as Media).alt || block.heading
      : block.heading

  return (
    <section className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center">
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt={imageAlt || ''}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}
      <div className="relative z-10 text-center px-md py-xl max-w-4xl">
        <h1
          className={`text-4xl md:text-5xl font-bold ${imageUrl ? 'text-white' : 'text-gray-900'}`}
        >
          {block.heading}
        </h1>
        {block.subheading && (
          <p className={`mt-md text-xl ${imageUrl ? 'text-white/90' : 'text-text-muted'}`}>
            {block.subheading}
          </p>
        )}
      </div>
    </section>
  )
}
