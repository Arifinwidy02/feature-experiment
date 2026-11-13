import type { Product } from '@/features/products/types/product'
import type { CartItem } from '../types/cart'

export const MAX_QUANTITY = 99

export type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'increase'; productId: string }
  | { type: 'decrease'; productId: string }
  | { type: 'remove'; productId: string }
  | { type: 'clear' }

function updateQuantity(items: CartItem[], productId: string, delta: number): CartItem[] {
  return items.map((item) =>
    item.product.id === productId
      ? { ...item, quantity: Math.min(MAX_QUANTITY, Math.max(1, item.quantity + delta)) }
      : item,
  )
}

export function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'add': {
      const exists = items.some((item) => item.product.id === action.product.id)
      return exists
        ? updateQuantity(items, action.product.id, 1)
        : [...items, { product: action.product, quantity: 1 }]
    }
    case 'increase':
      return updateQuantity(items, action.productId, 1)
    case 'decrease':
      return updateQuantity(items, action.productId, -1)
    case 'remove':
      return items.filter((item) => item.product.id !== action.productId)
    case 'clear':
      return []
  }
}
