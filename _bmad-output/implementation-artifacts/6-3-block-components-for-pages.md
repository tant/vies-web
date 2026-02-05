# Story 6.3: Block Components for Pages

Status: done

## Story

As a admin,
I want block components that render CMS content blocks,
so that Pages collection content displays correctly on the frontend.

## Acceptance Criteria

1. **Given** Pages collection có layout blocks, **When** HeroBlock render, **Then** hiện heading + subheading + background image
2. **Given** Pages collection có layout blocks, **When** ContentBlock render, **Then** hiện richText content rendered
3. **Given** Pages collection có layout blocks, **When** CTABlock render, **Then** hiện heading + description + buttons (max 3, primary/secondary/outline styles)
4. **Given** Pages collection có layout blocks, **When** FAQBlock render, **Then** hiện heading + accordion items (question/answer)
5. **Given** Pages collection có layout blocks, **When** GalleryBlock render, **Then** hiện heading + image grid with captions
6. **Given** block components, **Then** mỗi block nhận block data via props, tất cả là Server Components

## Tasks / Subtasks

- [x] Task 1: Create block component infrastructure (AC: #6)
  - [x] 1.1 Create `src/components/blocks/` directory
  - [x] 1.2 Create `src/components/blocks/index.ts` for exports
  - [x] 1.3 Create `src/components/blocks/RenderBlocks.tsx` - block renderer that maps blockType to components

- [x] Task 2: Create HeroBlock component (AC: #1)
  - [x] 2.1 Create `src/components/blocks/HeroBlock.tsx`
  - [x] 2.2 Accept block data with heading, subheading, image props
  - [x] 2.3 Render full-width hero with background image using `next/image`
  - [x] 2.4 Display heading (large text) and subheading (smaller text)
  - [x] 2.5 Add overlay for text readability when image exists
  - [x] 2.6 Center text vertically and horizontally

- [x] Task 3: Create ContentBlock component (AC: #2)
  - [x] 3.1 Create `src/components/blocks/ContentBlock.tsx`
  - [x] 3.2 Accept block data with content (richText) prop
  - [x] 3.3 Render using existing `RichTextContent` component
  - [x] 3.4 Apply prose styling with consistent container max-width

- [x] Task 4: Create CTABlock component (AC: #3)
  - [x] 4.1 Create `src/components/blocks/CTABlock.tsx`
  - [x] 4.2 Accept block data with heading, description, buttons[] props
  - [x] 4.3 Render heading and description text
  - [x] 4.4 Render max 3 buttons with Link component
  - [x] 4.5 Map button style (primary/secondary/outline) to existing Button variant styles
  - [x] 4.6 Use accent background color for visual emphasis

- [x] Task 5: Create FAQBlock component (AC: #4)
  - [x] 5.1 Create `src/components/blocks/FAQBlock.tsx`
  - [x] 5.2 Accept block data with heading, items[] (question/answer) props
  - [x] 5.3 Create accordion UI with expand/collapse functionality
  - [x] 5.4 Use Client Component for accordion interaction state
  - [x] 5.5 Render answer using `RichTextContent` component
  - [x] 5.6 Add accessible expand/collapse button with aria attributes

- [x] Task 6: Create GalleryBlock component (AC: #5)
  - [x] 6.1 Create `src/components/blocks/GalleryBlock.tsx`
  - [x] 6.2 Accept block data with heading, images[] (image/caption) props
  - [x] 6.3 Render responsive image grid (1 col mobile, 2 col tablet, 3 col desktop)
  - [x] 6.4 Use `next/image` for optimized images
  - [x] 6.5 Display captions below each image
  - [ ] 6.6 Add lightbox functionality (optional - stretch goal)

- [x] Task 7: Build and test (AC: all)
  - [x] 7.1 Run build to verify no TypeScript errors
  - [ ] 7.2 Test each block component renders correctly (manual verification only - no automated tests)
  - [x] 7.3 Verify Server Component rendering (no 'use client' except FAQBlock accordion)

## Dev Notes

### Critical Implementation Guidance

**DO:**
- Create Server Components for all blocks (except FAQBlock accordion wrapper)
- Use existing `RichTextContent` component for rich text fields
- Use `next/image` for all images (HeroBlock, GalleryBlock)
- Use existing Button component styles for CTABlock buttons
- Follow existing container pattern: `max-w-[var(--container-max)] mx-auto px-md`
- Extract types from `Page['layout']` in payload-types.ts

**DON'T:**
- Don't create new RichText renderer - reuse `RichTextContent`
- Don't use `<img>` tags - use `next/image`
- Don't hardcode strings - use i18n when possible
- Don't over-complicate - keep blocks simple and focused
- Don't add Client Component wrapper for blocks that don't need interactivity

### Architecture Compliance

**Block Types from payload-types.ts** (lines 402-516):

```typescript
// Page layout block types
type HeroBlockType = {
  heading: string;
  subheading?: string | null;
  image?: (number | null) | Media;
  id?: string | null;
  blockName?: string | null;
  blockType: 'hero';
}

type ContentBlockType = {
  content: { root: { ... } }; // Lexical richText
  id?: string | null;
  blockName?: string | null;
  blockType: 'content';
}

type CTABlockType = {
  heading: string;
  description?: string | null;
  buttons?: {
    label: string;
    link: string;
    style?: ('primary' | 'secondary' | 'outline') | null;
    id?: string | null;
  }[] | null;
  id?: string | null;
  blockName?: string | null;
  blockType: 'cta';
}

type FAQBlockType = {
  heading?: string | null;
  items?: {
    question: string;
    answer: { root: { ... } }; // Lexical richText
    id?: string | null;
  }[] | null;
  id?: string | null;
  blockName?: string | null;
  blockType: 'faq';
}

type GalleryBlockType = {
  heading?: string | null;
  images?: {
    image: (number | null) | Media;
    caption?: string | null;
    id?: string | null;
  }[] | null;
  id?: string | null;
  blockName?: string | null;
  blockType: 'gallery';
}
```

**Data Fetching Pattern** (for pages that use blocks):
```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config: await config })

// Page by slug - publishedOnly access handles draft filtering
const { docs } = await payload.find({
  collection: 'pages',
  where: { slug: { equals: slug } },
  limit: 1,
  locale: locale as Locale,
  depth: 2, // Populate images in blocks
})

const page = docs[0]
// Access blocks: page.layout (array of block objects)
```

### Block Definitions Reference

From [blocks.ts:1-143](src/lib/payload/blocks.ts):
- `HeroBlock`: heading (required), subheading, image → media
- `ContentBlock`: content (required, richText)
- `CTABlock`: heading (required), description, buttons[] (max 3) with label, link, style
- `FAQBlock`: heading, items[] with question (required), answer (required, richText)
- `GalleryBlock`: heading, images[] with image (required → media), caption

### Patterns to Follow

**Image Extraction Pattern** (from [ServiceCard.tsx:12-21](src/components/ui/ServiceCard.tsx)):
```typescript
const imageUrl =
  typeof block.image === 'object' && block.image
    ? block.image.sizes?.large?.url ?? block.image.url
    : null
const imageAlt =
  typeof block.image === 'object' && block.image
    ? block.image.alt || 'Hero image'
    : 'Hero image'
```

**RichText Rendering Pattern** (from [RichTextContent.tsx:39-48](src/components/product/RichTextContent.tsx)):
```typescript
import { RichTextContent } from '@/components/product/RichTextContent'

// In ContentBlock
<RichTextContent
  data={block.content}
  className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600"
/>
```

**Button Styling** (from [Button.tsx:16-21](src/components/ui/Button.tsx)):
```typescript
// Map CMS style to Button variant
const styleMap = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-accent text-white hover:bg-accent/90',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
}
```

### Component Structures

**RenderBlocks Component:**
```typescript
// src/components/blocks/RenderBlocks.tsx
import type { Page } from '@/payload-types'
import { HeroBlock } from './HeroBlock'
import { ContentBlock } from './ContentBlock'
import { CTABlock } from './CTABlock'
import { FAQBlock } from './FAQBlock'
import { GalleryBlock } from './GalleryBlock'

type LayoutBlock = NonNullable<Page['layout']>[number]

interface RenderBlocksProps {
  blocks: Page['layout']
  locale: string
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
            return <GalleryBlock key={block.id ?? index} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
```

**HeroBlock Component:**
```typescript
// src/components/blocks/HeroBlock.tsx
import Image from 'next/image'
import type { Page, Media } from '@/payload-types'

type HeroBlockData = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

interface HeroBlockProps {
  block: HeroBlockData
}

export function HeroBlock({ block }: HeroBlockProps) {
  const imageUrl =
    typeof block.image === 'object' && block.image
      ? block.image.sizes?.large?.url ?? block.image.url
      : null
  const imageAlt =
    typeof block.image === 'object' && block.image
      ? block.image.alt || block.heading
      : block.heading

  return (
    <section className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center">
      {/* Background image */}
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}
        </>
      )}
      {/* Content */}
      <div className="relative z-10 text-center px-md py-xl max-w-4xl">
        <h1 className={`text-4xl md:text-5xl font-bold ${imageUrl ? 'text-white' : 'text-gray-900'}`}>
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
```

**FAQBlock Component (Client Component for accordion):**
```typescript
// src/components/blocks/FAQBlock.tsx
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
          <h2 className="text-3xl font-bold text-gray-900 mb-lg text-center">
            {block.heading}
          </h2>
        )}
        <div className="max-w-3xl mx-auto space-y-sm">
          {block.items.map((item, index) => (
            <div key={item.id ?? index} className="bg-white rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-md py-md flex items-center justify-between text-left"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-gray-900">{item.question}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === index && (
                <div className="px-md pb-md">
                  <RichTextContent
                    data={item.answer}
                    className="prose prose-sm prose-gray max-w-none"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Project Structure Notes

**Files to create:**
- `src/components/blocks/index.ts` - Exports
- `src/components/blocks/RenderBlocks.tsx` - Block renderer
- `src/components/blocks/HeroBlock.tsx` - Hero block
- `src/components/blocks/ContentBlock.tsx` - Content block
- `src/components/blocks/CTABlock.tsx` - CTA block
- `src/components/blocks/FAQBlock.tsx` - FAQ block (Client Component)
- `src/components/blocks/GalleryBlock.tsx` - Gallery block

**Existing components to reuse:**
- `src/components/product/RichTextContent.tsx` - Rich text rendering
- `src/components/ui/Button.tsx` - Button styles (reference for CTA)
- `src/components/layout/icons.tsx` - Icons (ChevronDownIcon for FAQ)

**Directory structure:**
```
src/components/blocks/
├── index.ts
├── RenderBlocks.tsx
├── HeroBlock.tsx
├── ContentBlock.tsx
├── CTABlock.tsx
├── FAQBlock.tsx
└── GalleryBlock.tsx
```

### Design Tokens

From [styles.css](src/app/(frontend)/styles.css):
- Container: `max-w-[var(--container-max)]` (1280px)
- Section padding: `py-xl` (32px)
- Content padding: `px-md` (16px)
- Grid gap: `gap-lg` (24px)
- Colors: `--color-primary`, `--color-accent`, `text-gray-900`, `text-text-muted`
- Border: `border-border`
- Radius: `rounded-lg` (8px)

### Previous Story Intelligence (6.1, 6.2)

From Story 6.1 & 6.2 implementations:
- NewsCard component pattern works well for card-based UIs
- Use `useTransition` or simple `useState` for loading states
- CalendarIcon added to shared icons - check for ChevronDownIcon
- Date formatting with `toLocaleDateString`
- Server Actions work well for data loading

**Check if ChevronDownIcon exists in icons.tsx - if not, add it.**

### FR Coverage

This story covers:
- **PG-01 → PG-07**: Block components enable all content pages functionality

### i18n Considerations

Currently no i18n keys specific to blocks. If needed, add:
```json
{
  "blocks": {
    "faq": {
      "expandAnswer": "Expand answer",
      "collapseAnswer": "Collapse answer"
    },
    "gallery": {
      "viewImage": "View image"
    }
  }
}
```

For now, blocks rely on CMS-provided localized content.

### Icon Requirements

Need ChevronDownIcon for FAQ accordion. Check [icons.tsx](src/components/layout/icons.tsx) for existing icons. If not present, add:

```typescript
export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}
```

### References

- [epics.md:633-652](/_bmad-output/planning-artifacts/epics.md#L633-L652) - Story 6.3 requirements
- [architecture.md:726-731](/_bmad-output/planning-artifacts/architecture.md#L726-L731) - Block components structure
- [blocks.ts](src/lib/payload/blocks.ts) - Block definitions
- [Pages.ts](src/collections/Pages.ts) - Pages collection schema
- [payload-types.ts:402-516](src/payload-types.ts#L402-L516) - Block type definitions
- [RichTextContent.tsx](src/components/product/RichTextContent.tsx) - Rich text renderer
- [Button.tsx](src/components/ui/Button.tsx) - Button component styles
- [ServiceCard.tsx](src/components/ui/ServiceCard.tsx) - Card component pattern

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

### Completion Notes List

- Created block component infrastructure with RenderBlocks, index.ts exports
- HeroBlock: Full-width hero with background image, overlay, centered text
- ContentBlock: Rich text rendering with prose styling
- CTABlock: Heading, description, max 3 buttons with primary/secondary/outline styles on accent background
- FAQBlock: Client Component accordion with expand/collapse, RichText answers, aria attributes
- GalleryBlock: Responsive 1/2/3 column grid with next/image and captions
- All blocks use Server Components except FAQBlock (requires interaction state)
- Build passes with no TypeScript errors
- Note: Lightbox functionality (Task 6.6) skipped as optional stretch goal

### File List

- src/components/blocks/index.ts (new)
- src/components/blocks/RenderBlocks.tsx (new)
- src/components/blocks/HeroBlock.tsx (new)
- src/components/blocks/ContentBlock.tsx (new)
- src/components/blocks/CTABlock.tsx (new)
- src/components/blocks/FAQBlock.tsx (modified - accessibility fix)
- src/components/blocks/GalleryBlock.tsx (new)
- src/app/(frontend)/styles.css (modified - added --color-secondary colors)

### Change Log

- 2026-02-05: Implemented all block components for Pages collection (Tasks 1-7)
- 2026-02-05: Code review fixes applied (see below)

### Code Review Fixes Applied

- [M1/M2] Added `--color-secondary` and `--color-secondary-dark` to theme (styles.css)
- [L1] FAQBlock: Changed from conditional rendering to CSS-based hidden for better ARIA compliance
- [H1] Updated Task 7.2 to reflect reality - manual verification only, no automated tests
