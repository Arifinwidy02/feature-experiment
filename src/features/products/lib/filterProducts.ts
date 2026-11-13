import type { CategoryFilter, Product, SortOption } from '../types/product'

export interface ProductQuery {
  search: string
  category: CategoryFilter
  sort: SortOption
}

export function queryProducts(
  products: readonly Product[],
  { search, category, sort }: ProductQuery,
): Product[] {
  const needle = search.trim().toLowerCase()

  const filtered = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category
    const matchesSearch = needle === '' || product.name.toLowerCase().includes(needle)
    return matchesCategory && matchesSearch
  })

  if (sort === 'price-asc') return filtered.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return filtered.sort((a, b) => b.price - a.price)
  return filtered
}
