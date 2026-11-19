import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearEvents,
  getStoredEvents,
  track,
} from '@/services/analytics.service'
import { getUserId } from '@/utils/user-identity'

const EVENTS_KEY = 'experiment-lab:events'
const USER_ID_KEY = 'experiment-lab:user-id'

function createLocalStorageMock(): Storage {
  const entries = new Map<string, string>()

  return {
    get length() {
      return entries.size
    },
    clear: () => entries.clear(),
    getItem: (key) => entries.get(key) ?? null,
    key: (index) => Array.from(entries.keys())[index] ?? null,
    removeItem: (key) => {
      entries.delete(key)
    },
    setItem: (key, value) => {
      entries.set(key, value)
    },
  }
}

let storage: Storage

beforeEach(() => {
  storage = createLocalStorageMock()
  vi.stubGlobal('localStorage', storage)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getStoredEvents', () => {
  it('returns an empty array when nothing is stored', () => {
    expect(getStoredEvents()).toEqual([])
  })

  it('returns an empty array for invalid JSON', () => {
    storage.setItem(EVENTS_KEY, '{not-json')

    expect(getStoredEvents()).toEqual([])
  })

  it('returns an empty array when the stored value is not an array', () => {
    storage.setItem(EVENTS_KEY, JSON.stringify({ eventName: 'product_viewed' }))

    expect(getStoredEvents()).toEqual([])
  })
})

describe('track', () => {
  it('stores an event with an id, user, timestamp, and properties', () => {
    track('product_viewed', { productId: 'studio-headphones' })

    const events = getStoredEvents()

    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({
      eventName: 'product_viewed',
      properties: { productId: 'studio-headphones' },
    })
    expect(events[0].id).toBeTruthy()
    expect(events[0].userId).toBeTruthy()
    expect(events[0].timestamp).toBeGreaterThan(0)
  })

  it('appends events and reuses the same user id', () => {
    track('product_viewed')
    track('add_to_cart', { productId: 'halo-watch', quantity: 1 })

    const events = getStoredEvents()

    expect(events.map((event) => event.eventName)).toEqual([
      'product_viewed',
      'add_to_cart',
    ])
    expect(events[0].id).not.toBe(events[1].id)
    expect(events[0].userId).toBe(events[1].userId)
    expect(events[1].properties).toEqual({
      productId: 'halo-watch',
      quantity: 1,
    })
  })

  it('omits properties when none are provided', () => {
    track('checkout_started')

    expect(getStoredEvents()[0].properties).toBeUndefined()
  })
})

describe('getUserId', () => {
  it('creates and persists a user id on first use', () => {
    const userId = getUserId()

    expect(userId).toBeTruthy()
    expect(storage.getItem(USER_ID_KEY)).toBe(userId)
    expect(getUserId()).toBe(userId)
  })

  it('keeps an existing user id', () => {
    storage.setItem(USER_ID_KEY, 'existing-user')

    expect(getUserId()).toBe('existing-user')
  })
})

describe('clearEvents', () => {
  it('removes events without removing the user id', () => {
    const userId = getUserId()
    track('purchase_completed', { orderId: 'order-1' })

    clearEvents()

    expect(getStoredEvents()).toEqual([])
    expect(storage.getItem(USER_ID_KEY)).toBe(userId)
  })

  it('does nothing when there are no events', () => {
    expect(() => clearEvents()).not.toThrow()
  })
})
