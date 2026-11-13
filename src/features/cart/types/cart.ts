import type { Product } from '@/features/products/types/product'

export interface CartItem {
  product: Product
  quantity: number
}

/** Shape persisted to localStorage. Product data is re-read from the catalog on load. */
export interface StoredCartLine {
  productId: string
  quantity: number
}

export interface CartTotals {
  itemCount: number
  /** Cents. */
  subtotal: number
  /** Cents. */
  shipping: number
  /** Cents. */
  total: number
}
