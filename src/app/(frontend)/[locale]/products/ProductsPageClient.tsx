'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { CategoryFilter } from '@/components/ui/CategoryFilter'
import { ProductCard, type ProductCardData } from '@/components/ui/ProductCard'

interface ProductsPageClientProps {
  products: ProductCardData[]
  brands: Array<{ id: number; name: string; slug: string }>
  categories: Array<{ id: number; name: string; slug: string; parent?: number | null }>
  activeFilters: {
    brands: string[]
    categories: string[]
  }
  locale: string
  totalProducts: number
  hasMore: boolean
  currentPage: number
}

export function ProductsPageClient({
  products,
  brands,
  categories,
  activeFilters,
  locale,
  totalProducts,
  hasMore,
  currentPage,
}: ProductsPageClientProps) {
  const searchParams = useSearchParams()
  const t = useTranslations('products')

  // Build Load More URL preserving filters (Task 3.4)
  const buildLoadMoreUrl = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(currentPage + 1))
    return `/${locale}/products?${params.toString()}`
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* CategoryFilter sidebar/bottom sheet (Task 3.3) */}
      <CategoryFilter
        brands={brands}
        categories={categories}
        activeFilters={activeFilters}
        locale={locale}
        totalProducts={totalProducts}
      />

      {/* Product Grid (Task 3.3) */}
      <div className="flex-1">
        <div
          role="list"
          aria-label={t('title')}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} />
          ))}
        </div>

        {/* Load More Button (Task 2.7) */}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <Link
              href={buildLoadMoreUrl()}
              className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border-2 border-primary text-primary hover:bg-primary hover:text-white focus-visible:ring-primary px-7 py-3.5 text-lg"
            >
              {t('loadMore')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
