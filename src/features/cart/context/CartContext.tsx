import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Product } from '@/features/products/types/product'
import { cartReducer } from '../lib/cartReducer'
import { loadCart, saveCart } from '../lib/storage'
import { calculateTotals } from '../lib/totals'
import {
  CartActionsContext,
  CartStateContext,
  type CartActions,
  type CartState,
} from './cartContexts'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const state = useMemo<CartState>(() => ({ items, ...calculateTotals(items) }), [items])

  const actions = useMemo<CartActions>(
    () => ({
      addItem: (product: Product) => dispatch({ type: 'add', product }),
      increaseQuantity: (productId) => dispatch({ type: 'increase', productId }),
      decreaseQuantity: (productId) => dispatch({ type: 'decrease', productId }),
      removeItem: (productId) => dispatch({ type: 'remove', productId }),
      clearCart: () => dispatch({ type: 'clear' }),
    }),
    [],
  )

  return (
    <CartActionsContext.Provider value={actions}>
      <CartStateContext.Provider value={state}>{children}</CartStateContext.Provider>
    </CartActionsContext.Provider>
  )
}
