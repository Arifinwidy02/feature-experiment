import { Search } from 'lucide-react'
import { PRODUCT_CATEGORIES } from '../data/products'
import type { CategoryFilter, SortOption } from '../types/product'

interface ProductFiltersProps {
  search: string
  category: CategoryFilter
  sort: SortOption
  onSearchChange: (value: string) => void
  onCategoryChange: (value: CategoryFilter) => void
  onSortChange: (value: SortOption) => void
}

const controlClass =
  'block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-ink sm:text-sm'

export function ProductFilters({
  search,
  category,
  sort,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <form
      role="search"
      aria-label="Filter products"
      onSubmit={(event) => event.preventDefault()}
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_14rem_14rem]"
    >
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="product-search" className="sr-only">
          Search products by name
        </label>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
          />
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products by name"
            className={`${controlClass} pl-9 placeholder:text-slate-500`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="product-category" className="sr-only">
          Category
        </label>
        <select
          id="product-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value as CategoryFilter)}
          className={controlClass}
        >
          <option value="all">All categories</option>
          {PRODUCT_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="product-sort" className="sr-only">
          Sort by
        </label>
        <select
          id="product-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          className={controlClass}
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </form>
  )
}
