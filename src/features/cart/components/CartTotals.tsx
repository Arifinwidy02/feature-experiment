import { formatCurrency } from '@/lib/format'
import { FREE_SHIPPING_THRESHOLD } from '../lib/totals'
import type { CartTotals as CartTotalsData } from '../types/cart'

export function CartTotals({ subtotal, shipping, total }: Omit<CartTotalsData, 'itemCount'>) {
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-slate-600">Subtotal</dt>
        <dd className="font-medium text-ink">{formatCurrency(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-slate-600">Shipping</dt>
        <dd className="font-medium text-ink">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</dd>
      </div>
      {shipping > 0 && (
        <p className="text-xs text-slate-600">
          Add {formatCurrency(remainingForFreeShipping)} more for free shipping.
        </p>
      )}
      <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
        <dt className="font-semibold text-ink">Total</dt>
        <dd className="font-semibold text-ink">{formatCurrency(total)}</dd>
      </div>
    </dl>
  )
}
