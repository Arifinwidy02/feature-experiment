import { ShoppingBag } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { CartItem } from '../components/CartItem'
import { CartTotals } from '../components/CartTotals'
import { useCartActions, useCartState } from '../hooks/useCart'

export default function CartPage() {
  const { items, itemCount, subtotal, shipping, total } = useCartState()
  const { increaseQuantity, decreaseQuantity, removeItem } = useCartActions()

  if (items.length === 0) {
    return (
      <div>
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-ink">Your cart</h1>
        <EmptyState
          icon={<ShoppingBag aria-hidden className="size-6" />}
          title="Your cart is empty"
          description="Add a product from the catalog and it will show up here."
          action={<ButtonLink to="/products">Browse products</ButtonLink>}
        />
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-ink">
        Your cart <span className="text-lg font-normal text-slate-600">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
      </h1>

      <div className="grid items-start gap-8 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-label="Cart items" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <ul className="divide-y divide-slate-200">
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeItem}
              />
            ))}
          </ul>
        </section>

        <aside aria-label="Order totals" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 text-lg font-semibold text-ink">Summary</h2>
          <CartTotals subtotal={subtotal} shipping={shipping} total={total} />
          <div className="mt-6 flex flex-col gap-3">
            <ButtonLink to="/checkout" size="lg" fullWidth>
              Proceed to Checkout
            </ButtonLink>
            <ButtonLink to="/products" variant="secondary" fullWidth>
              Continue shopping
            </ButtonLink>
          </div>
        </aside>
      </div>
    </div>
  )
}
