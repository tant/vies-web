import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

export const revalidateHomeData: CollectionAfterChangeHook = ({ doc }) => {
  revalidateTag('home-data', 'default')
  revalidateTag('product-filters', 'default')
  return doc
}

export const revalidateLayoutData: GlobalAfterChangeHook = ({ doc }) => {
  revalidateTag('layout-data', 'default')
  return doc
}
