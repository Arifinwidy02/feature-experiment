import { useContext } from 'react'
import {
  CartActionsContext,
  CartStateContext,
  type CartActions,
  type CartState,
} from '../context/cartContexts'

export function useCartState(): CartState {
  const state = useContext(CartStateContext)
  if (!state) throw new Error('useCartState must be used within a CartProvider')
  return state
}

export function useCartActions(): CartActions {
  const actions = useContext(CartActionsContext)
  if (!actions) throw new Error('useCartActions must be used within a CartProvider')
  return actions
}
