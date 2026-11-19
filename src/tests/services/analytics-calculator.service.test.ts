import { beforeEach, describe, expect, it } from 'vitest'
import {
  calculateAnalytics,
  getEventsByName,
  getSequentialFunnelUsers,
  getUniqueUsers,
} from '@/services/analytics-calculator.service'
import {
  completeFunnelFor,
  makeEvent,
  resetAnalyticsEventIds,
} from '../fixtures/analytics-events'

beforeEach(() => {
  resetAnalyticsEventIds()
})

describe('getUniqueUsers', () => {
  it('returns one entry per unique user', () => {
    const events = [
      makeEvent('product_viewed', 'user-1', 1),
      makeEvent('add_to_cart', 'user-1', 2),
      makeEvent('product_viewed', 'user-2', 3),
    ]

    expect(getUniqueUsers(events)).toEqual(new Set(['user-1', 'user-2']))
  })

  it('returns an empty set for no events', () => {
    expect(getUniqueUsers([]).size).toBe(0)
  })
})

describe('getEventsByName', () => {
  it('filters events by name and keeps their order', () => {
    const firstAddToCart = makeEvent('add_to_cart', 'user-1', 2)
    const secondAddToCart = makeEvent('add_to_cart', 'user-1', 4)
    const events = [
      makeEvent('product_viewed', 'user-1', 1),
      firstAddToCart,
      makeEvent('checkout_started', 'user-1', 3),
      secondAddToCart,
    ]

    expect(getEventsByName(events, 'add_to_cart')).toEqual([
      firstAddToCart,
      secondAddToCart,
    ])
  })

  it('returns an empty array when no event matches', () => {
    const events = [makeEvent('product_viewed', 'user-1', 1)]

    expect(getEventsByName(events, 'purchase_completed')).toEqual([])
  })
})

describe('calculateAnalytics', () => {
  it('returns zeroed metrics and safe rates for no events', () => {
    expect(calculateAnalytics([])).toEqual({
      totalEvents: 0,
      totalAddToCart: 0,
      uniqueVisitors: 0,
      uniqueAddToCartUsers: 0,
      uniqueCheckoutUsers: 0,
      uniquePurchasers: 0,
      addToCartRate: 0,
      purchaseConversionRate: 0,
      funnel: [
        {
          eventName: 'product_viewed',
          totalEvents: 0,
          uniqueUsers: 0,
          conversionRate: 0,
        },
        {
          eventName: 'add_to_cart',
          totalEvents: 0,
          uniqueUsers: 0,
          conversionRate: 0,
        },
        {
          eventName: 'checkout_started',
          totalEvents: 0,
          uniqueUsers: 0,
          conversionRate: 0,
        },
        {
          eventName: 'purchase_completed',
          totalEvents: 0,
          uniqueUsers: 0,
          conversionRate: 0,
        },
      ],
    })
  })

  it('calculates totals, unique users, and conversion rates', () => {
    const events = [
      makeEvent('product_viewed', 'user-1', 1),
      makeEvent('product_viewed', 'user-2', 2),
      makeEvent('add_to_cart', 'user-1', 3),
      makeEvent('add_to_cart', 'user-2', 4),
      makeEvent('add_to_cart', 'user-2', 5),
      makeEvent('checkout_started', 'user-1', 6),
      makeEvent('purchase_completed', 'user-1', 7),
    ]

    const metrics = calculateAnalytics(events)

    expect(metrics.totalEvents).toBe(7)
    expect(metrics.totalAddToCart).toBe(3)
    expect(metrics.uniqueVisitors).toBe(2)
    expect(metrics.uniqueAddToCartUsers).toBe(2)
    expect(metrics.uniqueCheckoutUsers).toBe(1)
    expect(metrics.uniquePurchasers).toBe(1)
    expect(metrics.addToCartRate).toBe(1)
    expect(metrics.purchaseConversionRate).toBe(0.5)

    expect(metrics.funnel.map((step) => step.uniqueUsers)).toEqual([2, 2, 1, 1])
    expect(metrics.funnel.map((step) => step.conversionRate)).toEqual([
      1, 1, 0.5, 1,
    ])
  })

  it('returns 0 for rates whose denominator is 0', () => {
    const events = [
      makeEvent('add_to_cart', 'user-1', 1),
      makeEvent('purchase_completed', 'user-1', 2),
    ]

    const metrics = calculateAnalytics(events)

    expect(metrics.uniqueVisitors).toBe(0)
    expect(metrics.addToCartRate).toBe(0)
    expect(metrics.purchaseConversionRate).toBe(0)
    expect(metrics.funnel.map((step) => step.conversionRate)).toEqual([
      0, 0, 0, 0,
    ])
  })
})

describe('sequential funnel', () => {
  it('counts a user who completes every step in order', () => {
    const metrics = calculateAnalytics(completeFunnelFor('user-1'))

    expect(metrics.funnel.map((step) => step.uniqueUsers)).toEqual([1, 1, 1, 1])
    expect(metrics.funnel.map((step) => step.conversionRate)).toEqual([
      1, 1, 1, 1,
    ])
  })

  it('ignores events that arrive out of order', () => {
    const events = [
      makeEvent('add_to_cart', 'user-1', 1),
      makeEvent('product_viewed', 'user-1', 2),
      makeEvent('purchase_completed', 'user-1', 3),
    ]

    const metrics = calculateAnalytics(events)

    expect(metrics.funnel.map((step) => step.uniqueUsers)).toEqual([1, 0, 0, 0])
    expect(metrics.funnel.map((step) => step.conversionRate)).toEqual([
      1, 0, 0, 0,
    ])
  })

  it('does not let a later step stand in for a skipped step', () => {
    const events = [
      makeEvent('product_viewed', 'user-1', 1),
      makeEvent('checkout_started', 'user-1', 2),
      makeEvent('purchase_completed', 'user-1', 3),
    ]

    const metrics = calculateAnalytics(events)

    expect(metrics.funnel.map((step) => step.uniqueUsers)).toEqual([1, 0, 0, 0])
  })

  it('deduplicates repeated events while keeping raw event totals', () => {
    const events = [
      makeEvent('product_viewed', 'user-1', 1),
      makeEvent('add_to_cart', 'user-1', 2),
      makeEvent('add_to_cart', 'user-1', 3),
      makeEvent('checkout_started', 'user-1', 4),
      makeEvent('purchase_completed', 'user-1', 5),
    ]

    const metrics = calculateAnalytics(events)

    expect(metrics.funnel.map((step) => step.totalEvents)).toEqual([1, 2, 1, 1])
    expect(metrics.funnel.map((step) => step.uniqueUsers)).toEqual([1, 1, 1, 1])
    expect(metrics.funnel.map((step) => step.conversionRate)).toEqual([
      1, 1, 1, 1,
    ])
  })

  it('sorts each user events by timestamp before walking the funnel', () => {
    const events = [
      makeEvent('purchase_completed', 'user-1', 4),
      makeEvent('add_to_cart', 'user-1', 2),
      makeEvent('product_viewed', 'user-1', 1),
      makeEvent('checkout_started', 'user-1', 3),
    ]

    const metrics = calculateAnalytics(events)

    expect(metrics.funnel.map((step) => step.uniqueUsers)).toEqual([1, 1, 1, 1])
  })

  it('keeps each user funnel independent', () => {
    const events = [
      makeEvent('product_viewed', 'user-1', 1),
      makeEvent('add_to_cart', 'user-2', 2),
      makeEvent('product_viewed', 'user-2', 3),
    ]

    const funnelUsers = getSequentialFunnelUsers(events)

    expect(funnelUsers.product_viewed).toEqual(new Set(['user-1', 'user-2']))
    expect(funnelUsers.add_to_cart.size).toBe(0)
    expect(funnelUsers.checkout_started.size).toBe(0)
    expect(funnelUsers.purchase_completed.size).toBe(0)
  })

  it('returns one user set per funnel step', () => {
    expect(getSequentialFunnelUsers([])).toEqual({
      product_viewed: new Set(),
      add_to_cart: new Set(),
      checkout_started: new Set(),
      purchase_completed: new Set(),
    })
  })

  it('calculates mixed conversion rates across multiple users', () => {
    const events = [
      ...completeFunnelFor('user-1'),
      ...completeFunnelFor('user-2', 10).slice(0, 2),
      makeEvent('product_viewed', 'user-3', 20),
    ]

    const metrics = calculateAnalytics(events)

    expect(metrics.funnel.map((step) => step.uniqueUsers)).toEqual([3, 2, 1, 1])
    expect(metrics.funnel[0].conversionRate).toBe(1)
    expect(metrics.funnel[1].conversionRate).toBeCloseTo(2 / 3)
    expect(metrics.funnel[2].conversionRate).toBe(0.5)
    expect(metrics.funnel[3].conversionRate).toBe(1)
  })
})
