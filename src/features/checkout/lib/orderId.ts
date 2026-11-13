// Unambiguous characters only (no 0/O, 1/I).
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateOrderId(): string {
  const bytes = new Uint8Array(8)
  window.crypto.getRandomValues(bytes)
  const suffix = Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join('')
  return `EL-${suffix}`
}
