import type { CollectionConfig } from 'payload'
import { anyone, isAdmin } from '@/lib/payload/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media',
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  defaultPopulate: {
    url: true,
    alt: true,
    width: true,
    height: true,
    filename: true,
    mimeType: true,
    sizes: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
      },
      {
        name: 'medium',
        width: 900,
        height: undefined,
      },
      {
        name: 'large',
        width: 1400,
        height: undefined,
      },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
  },
}
