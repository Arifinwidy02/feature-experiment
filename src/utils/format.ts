const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

/** All monetary values in the app are integer cents to avoid float drift. */
export function formatCurrency(cents: number): string {
  return currencyFormatter.format(cents / 100)
}
