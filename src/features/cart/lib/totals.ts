import type { CartItem, CartTotals } from '../types/cart'

export const SHIPPING_FLAT_RATE = 1200
export const FREE_SHIPPING_THRESHOLD = 15000

export function calculateShipping(subtotal: number): number {
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0
  return SHIPPING_FLAT_RATE
}

export function calculateTotals(items: readonly CartItem[]): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = calculateShipping(subtotal)
  return { itemCount, subtotal, shipping, total: subtotal + shipping }
}
