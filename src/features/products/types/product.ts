export type ProductCategory =
  | 'Audio'
  | 'Computing'
  | 'Footwear'
  | 'Wearables'
  | 'Accessories'

export interface Product {
  id: string
  name: string
  description: string
  /** Price in cents. */
  price: number
  category: ProductCategory
  image: string
  imageAlt: string
}

export type CategoryFilter = ProductCategory | 'all'

export type SortOption = 'featured' | 'price-asc' | 'price-desc'
