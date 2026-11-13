import type { CartItem } from '@/features/cart/types/cart'
import type { CartTotals } from '@/features/cart/types/cart'

export interface CheckoutFormValues {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormValues, string>>

/** Snapshot taken at submit time, since the live cart is cleared afterwards. */
export interface PlacedOrder {
  orderId: string
  email: string
  items: readonly CartItem[]
  totals: CartTotals
}
