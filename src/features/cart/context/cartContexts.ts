import { createContext } from 'react'
import type { Product } from '@/features/products/types/product'
import type { CartItem, CartTotals } from '../types/cart'

export interface CartState extends CartTotals {
  items: readonly CartItem[]
}

export interface CartActions {
  addItem: (product: Product) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

// State and actions live in separate contexts so components that only
// dispatch (e.g. product cards) do not re-render when the cart changes.
export const CartStateContext = createContext<CartState | null>(null)
export const CartActionsContext = createContext<CartActions | null>(null)
