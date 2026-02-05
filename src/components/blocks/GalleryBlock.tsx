import Image from 'next/image'
import type { Page, Media } from '@/payload-types'

type GalleryBlockData = Extract<NonNullable<Page['layout']>[number], { blockType: 'gallery' }>

interface GalleryBlockProps {
  block: GalleryBlockData
}

export function GalleryBlock({ block }: GalleryBlockProps) {
  if (!block.images?.length) return null

  return (
    <section className="py-xl">
      <div className="mx-auto max-w-[var(--container-max)] px-md">
        {block.heading && (
          <h2 className="text-3xl font-bold text-gray-900 mb-lg text-center">{block.heading}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {block.images.map((item, index) => {
            const imageData = typeof item.image === 'object' ? (item.image as Media) : null
            const imageUrl = imageData?.sizes?.medium?.url ?? imageData?.url
            const imageAlt = imageData?.alt || item.caption || 'Gallery image'

            if (!imageUrl) return null

            return (
              <figure key={item.id ?? index} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                {item.caption && (
                  <figcaption className="mt-sm text-sm text-text-muted text-center">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
