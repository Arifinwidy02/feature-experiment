import { SearchX } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useCartActions } from '@/features/cart/hooks/useCart'
import { ProductCard } from '../components/ProductCard'
import { ProductFilters } from '../components/ProductFilters'
import { products } from '../data/products'
import { queryProducts } from '../lib/filterProducts'
import type { CategoryFilter, Product, SortOption } from '../types/product'

export default function ProductListingPage() {
  const { addItem } = useCartActions()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [sort, setSort] = useState<SortOption>('featured')

  const visibleProducts = useMemo(
    () => queryProducts(products, { search, category, sort }),
    [search, category, sort],
  )

  // Stable reference so memoized cards do not re-render on every keystroke.
  const handleAddToCart = useCallback((product: Product) => addItem(product), [addItem])

  const resetFilters = () => {
    setSearch('')
    setCategory('all')
    setSort('featured')
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Products</h1>
        <p className="mt-2 text-slate-600">Browse the full catalog, then add what you need to your cart.</p>
      </header>

      {/* Slot: a recommendation banner can be rendered here later. */}

      <section aria-label="Product catalog">
        <ProductFilters
          search={search}
          category={category}
          sort={sort}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSortChange={setSort}
        />

        <p className="mt-6 text-sm text-slate-600" aria-live="polite">
          {visibleProducts.length} {visibleProducts.length === 1 ? 'product' : 'products'}
        </p>

        {visibleProducts.length > 0 ? (
          <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <li key={product.id} className="flex">
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4">
            <EmptyState
              icon={<SearchX aria-hidden className="size-6" />}
              title="No products match your search"
              description="Try a different name or category, or clear the filters to see everything."
              action={<Button onClick={resetFilters}>Clear filters</Button>}
            />
          </div>
        )}
      </section>
    </div>
  )
}
