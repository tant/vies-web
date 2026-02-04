import type { CollectionConfig } from 'payload'
import { anyone, isAdmin } from '@/lib/payload/access'
import { formatSlug } from '@/lib/payload/slugHook'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'logo'],
    group: 'Content',
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('name')],
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
