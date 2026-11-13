import type { CheckoutFormErrors, CheckoutFormValues } from '../types/checkout'

export const EMPTY_CHECKOUT_FORM: CheckoutFormValues = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^\+?[\d\s().-]{7,20}$/

export function validateCheckoutForm(values: CheckoutFormValues): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {}

  if (!values.fullName.trim()) errors.fullName = 'Enter your full name.'

  if (!values.email.trim()) errors.email = 'Enter your email address.'
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address.'

  if (!values.phone.trim()) errors.phone = 'Enter your phone number.'
  else if (!PHONE_PATTERN.test(values.phone.trim())) errors.phone = 'Enter a valid phone number.'

  if (!values.address.trim()) errors.address = 'Enter your street address.'
  if (!values.city.trim()) errors.city = 'Enter your city.'
  if (!values.postalCode.trim()) errors.postalCode = 'Enter your postal code.'

  return errors
}
