import { CircleCheck } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { OrderSummary } from './OrderSummary'
import type { PlacedOrder } from '../types/checkout'

export function OrderConfirmation({ order }: { order: PlacedOrder }) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Move focus so screen readers announce the result of the submit.
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center sm:p-10">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-50 text-green-700">
          <CircleCheck aria-hidden className="size-6" />
        </div>
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight text-ink">
          Order placed
        </h1>
        <p className="mt-2 text-slate-600">
          Your order ID is <span className="font-semibold text-ink">{order.orderId}</span>.
        </p>
        <p className="mt-1 text-sm text-slate-600">
          This is a demo, so no confirmation email to {order.email} will be sent and nothing will ship.
        </p>
        <div className="mt-8">
          <ButtonLink to="/products" size="lg">
            Back to products
          </ButtonLink>
        </div>
      </div>
      <div className="mt-6">
        <OrderSummary items={order.items} totals={order.totals} headingId="confirmation-summary-heading" />
      </div>
    </div>
  )
}
