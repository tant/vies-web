import type { GlobalConfig } from 'payload'
import { revalidateLayoutData } from '@/lib/payload/hooks/revalidateCache'

export const Footer: GlobalConfig = {
  slug: 'footer',
  hooks: {
    afterChange: [revalidateLayoutData],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      localized: true,
      defaultValue: '© 2026 VIES. All rights reserved.',
    },
  ],
}
