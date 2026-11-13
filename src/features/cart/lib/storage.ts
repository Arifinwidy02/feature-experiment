import { getProductById } from '@/features/products/data/products'
import type { CartItem, StoredCartLine } from '../types/cart'
import { MAX_QUANTITY } from './cartReducer'

export const CART_STORAGE_KEY = 'experiment-lab:cart:v1'

function isStoredLine(value: unknown): value is StoredCartLine {
  if (typeof value !== 'object' || value === null) return false
  const line = value as Record<string, unknown>
  return (
    typeof line.productId === 'string' &&
    typeof line.quantity === 'number' &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0
  )
}

export function loadCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isStoredLine).flatMap((line) => {
      const product = getProductById(line.productId)
      return product ? [{ product, quantity: Math.min(line.quantity, MAX_QUANTITY) }] : []
    })
  } catch {
    return []
  }
}

export function saveCart(items: readonly CartItem[]): void {
  try {
    const lines: StoredCartLine[] = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }))
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
  } catch {
    // Storage can be unavailable (private mode, quota). The cart still works in memory.
  }
}
