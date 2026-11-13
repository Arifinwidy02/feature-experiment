import { ProductImage } from '@/components/ui/ProductImage'
import { CartTotals } from '@/features/cart/components/CartTotals'
import type { CartItem, CartTotals as CartTotalsData } from '@/features/cart/types/cart'
import { formatCurrency } from '@/lib/format'

interface OrderSummaryProps {
  items: readonly CartItem[]
  totals: CartTotalsData
  headingId?: string
}

export function OrderSummary({ items, totals, headingId = 'order-summary-heading' }: OrderSummaryProps) {
  return (
    <section
      aria-labelledby={headingId}
      className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <h2 id={headingId} className="mb-4 text-lg font-semibold text-ink">
        Order summary
      </h2>
      <ul className="divide-y divide-slate-200">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex items-center gap-3 py-3 first:pt-0">
            <ProductImage
              src={product.image}
              alt={product.imageAlt}
              className="size-14 shrink-0 rounded-lg"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{product.name}</p>
              <p className="text-sm text-slate-600">Qty {quantity}</p>
            </div>
            <p className="text-sm font-medium text-ink">{formatCurrency(product.price * quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-2 border-t border-slate-200 pt-4">
        <CartTotals subtotal={totals.subtotal} shipping={totals.shipping} total={totals.total} />
      </div>
    </section>
  )
}
