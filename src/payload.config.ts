import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Brands } from './collections/Brands'
import { Products } from './collections/Products'
import { News } from './collections/News'
import { Services } from './collections/Services'
import { Pages } from './collections/Pages'

// Globals
import { SiteSettings } from './globals/SiteSettings'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | VIES Admin',
    },
    livePreview: {
      url: ({ data, collectionConfig, locale }) => {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const localeCode = locale?.code || 'vi'
        const slug = data?.slug || ''

        if (collectionConfig?.slug === 'products') {
          return `${baseUrl}/${localeCode}/product/${slug}`
        }
        if (collectionConfig?.slug === 'news') {
          return `${baseUrl}/${localeCode}/news/${slug}`
        }
        if (collectionConfig?.slug === 'pages') {
          return `${baseUrl}/${localeCode}/${slug}`
        }
        if (collectionConfig?.slug === 'services') {
          return `${baseUrl}/${localeCode}/services`
        }

        return `${baseUrl}/${localeCode}`
      },
      collections: ['products', 'news', 'pages', 'services'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Media, Categories, Brands, Products, News, Services, Pages],
  globals: [SiteSettings, Header, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  localization: {
    locales: [
      { label: 'Tiếng Việt', code: 'vi' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'vi',
    fallback: true,
  },
  defaultDepth: 1,
  sharp,
  plugins: [
    seoPlugin({
      collections: ['products', 'news', 'services', 'pages'],
      tabbedUI: true,
      generateTitle: ({ doc }: { doc: Record<string, unknown> }) => {
        const title = (doc?.title || doc?.name || '') as string
        return title ? `${title} | VIES` : 'VIES'
      },
      generateDescription: ({ doc }: { doc: Record<string, unknown> }) => {
        return (doc?.excerpt || '') as string
      },
    }),
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        select: true,
        email: true,
        number: true,
        checkbox: true,
      },
      formOverrides: {
        admin: {
          group: 'Forms',
        },
      },
      formSubmissionOverrides: {
        admin: {
          group: 'Forms',
        },
      },
    }),
  ],
})
