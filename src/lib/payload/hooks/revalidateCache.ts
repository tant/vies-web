import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

// revalidateTag only works inside a Next.js request/render context. When Payload
// runs outside one (e.g. the seed script or other standalone tooling), Next throws
// "Invariant: static generation store missing". Swallow that so writes still succeed —
// there is no cache to revalidate in those contexts anyway.
const safeRevalidateTag = (tag: string) => {
  try {
    revalidateTag(tag, 'default')
  } catch {
    // no request context (seed/CLI) — nothing to revalidate
  }
}

export const revalidateHomeData: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidateTag('home-data')
  safeRevalidateTag('product-filters')
  return doc
}

export const revalidateLayoutData: GlobalAfterChangeHook = ({ doc }) => {
  safeRevalidateTag('layout-data')
  return doc
}
