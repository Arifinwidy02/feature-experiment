import { ShoppingBag } from 'lucide-react'
import { useState, type ChangeEvent, type SyntheticEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { useCartActions, useCartState } from '@/features/cart/hooks/useCart'
import { OrderConfirmation } from '../components/OrderConfirmation'
import { OrderSummary } from '../components/OrderSummary'
import { generateOrderId } from '../lib/orderId'
import { EMPTY_CHECKOUT_FORM, validateCheckoutForm } from '../lib/validation'
import type { CheckoutFormErrors, CheckoutFormValues, PlacedOrder } from '../types/checkout'

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, itemCount } = useCartState()
  const { clearCart } = useCartActions()
  const [values, setValues] = useState<CheckoutFormValues>(EMPTY_CHECKOUT_FORM)
  const [errors, setErrors] = useState<CheckoutFormErrors>({})
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null)

  // Shown even though the cart is now empty.
  if (placedOrder) return <OrderConfirmation order={placedOrder} />

  if (items.length === 0) {
    return (
      <div>
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-ink">Checkout</h1>
        <EmptyState
          icon={<ShoppingBag aria-hidden className="size-6" />}
          title="Nothing to check out"
          description="Your cart is empty. Add a product first, then come back here."
          action={<ButtonLink to="/products">Browse products</ButtonLink>}
        />
      </div>
    )
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name as keyof CheckoutFormValues
    const value = event.target.value
    setValues((current) => ({ ...current, [field]: value }))
    // Clear the error for a field as soon as the user edits it.
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))
  }

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateCheckoutForm(values)
    setErrors(nextErrors)

    const firstInvalid = (Object.keys(nextErrors) as (keyof CheckoutFormValues)[])[0]
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus()
      return
    }

    setPlacedOrder({
      orderId: generateOrderId(),
      email: values.email.trim(),
      items,
      totals: { itemCount, subtotal, shipping, total },
    })
    clearCart()
  }

  const fieldProps = (name: keyof CheckoutFormValues) => ({
    id: name,
    name,
    value: values[name],
    error: errors[name],
    onChange: handleChange,
    required: true,
  })

  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-ink">Checkout</h1>

      <div className="grid items-start gap-8 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_24rem]">
        <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-6">
          <fieldset className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <legend className="float-left mb-4 w-full text-lg font-semibold text-ink">
              Customer information
            </legend>
            <div className="clear-both grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input label="Full name" autoComplete="name" {...fieldProps('fullName')} />
              </div>
              <Input label="Email" type="email" autoComplete="email" placeholder="email@example.com" {...fieldProps('email')} />
              <Input label="Phone number" type="tel" autoComplete="tel" {...fieldProps('phone')} />
            </div>
          </fieldset>

          <fieldset className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <legend className="float-left mb-4 w-full text-lg font-semibold text-ink">
              Shipping information
            </legend>
            <div className="clear-both grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input label="Address" autoComplete="street-address" {...fieldProps('address')} />
              </div>
              <Input label="City" autoComplete="address-level2" {...fieldProps('city')} />
              <Input label="Postal code" autoComplete="postal-code" {...fieldProps('postalCode')} />
            </div>
          </fieldset>

          {/* Submit lives in the form so the label/copy can be swapped in one place later. */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ButtonLink to="/cart" variant="ghost">
              Back to cart
            </ButtonLink>
            <Button type="submit" size="lg">
              Place order
            </Button>
          </div>
          <p className="text-sm text-slate-600">
            Demo checkout: no payment is collected and your details are not stored.
          </p>
        </form>

        <div className="lg:sticky lg:top-24">
          <OrderSummary items={items} totals={{ itemCount, subtotal, shipping, total }} />
        </div>
      </div>
    </div>
  )
}
