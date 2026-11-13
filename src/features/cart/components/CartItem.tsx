import { Minus, Plus, Trash2 } from 'lucide-react'
import { ProductImage } from '@/components/ui/ProductImage'
import { formatCurrency } from '@/lib/format'
import { MAX_QUANTITY } from '../lib/cartReducer'
import type { CartItem as CartItemType } from '../types/cart'

interface CartItemProps {
  item: CartItemType
  onIncrease: (productId: string) => void
  onDecrease: (productId: string) => void
  onRemove: (productId: string) => void
}

const stepperButton =
  'flex size-11 items-center justify-center text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent'

export function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  const { product, quantity } = item

  return (
    <li className="flex gap-4 py-5 first:pt-0 last:pb-0">
      <ProductImage
        src={product.image}
        alt={product.imageAlt}
        className="size-20 shrink-0 rounded-lg sm:size-24"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-ink">{product.name}</h3>
          <p className="mt-0.5 text-sm text-slate-600">{product.category}</p>
          <p className="mt-1 text-sm text-slate-600">{formatCurrency(product.price)} each</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:flex-col sm:flex-nowrap sm:items-end">
          <p className="font-semibold text-ink">{formatCurrency(product.price * quantity)}</p>

          <div className="flex items-center gap-2">
            <div
              role="group"
              aria-label={`Quantity for ${product.name}`}
              className="flex items-center overflow-hidden rounded-lg border border-slate-300 bg-white"
            >
              <button
                type="button"
                className={stepperButton}
                onClick={() => onDecrease(product.id)}
                disabled={quantity <= 1}
                aria-label={`Decrease quantity of ${product.name}`}
              >
                <Minus aria-hidden className="size-4" />
              </button>
              <span className="min-w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                className={stepperButton}
                onClick={() => onIncrease(product.id)}
                disabled={quantity >= MAX_QUANTITY}
                aria-label={`Increase quantity of ${product.name}`}
              >
                <Plus aria-hidden className="size-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(product.id)}
              className="flex size-11 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
              aria-label={`Remove ${product.name} from cart`}
            >
              <Trash2 aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
