import type { GlobalConfig } from 'payload'
import { revalidateLayoutData } from '@/lib/payload/hooks/revalidateCache'

export const Header: GlobalConfig = {
  slug: 'header',
  hooks: {
    afterChange: [revalidateLayoutData],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'topBar',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'content',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'navigation',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
        },
        {
          name: 'children',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
