import type {
  AnalyticsEvent,
  AnalyticsEventName,
} from '@/types/analytics.types'

let eventId = 0

export function resetAnalyticsEventIds(): void {
  eventId = 0
}

export function makeEvent(
  eventName: AnalyticsEventName,
  userId: string,
  timestamp: number,
): AnalyticsEvent {
  eventId += 1

  return {
    id: `event-${eventId}`,
    eventName,
    userId,
    timestamp,
  }
}

export function completeFunnelFor(userId: string, startAt = 0): AnalyticsEvent[] {
  return [
    makeEvent('product_viewed', userId, startAt + 1),
    makeEvent('add_to_cart', userId, startAt + 2),
    makeEvent('checkout_started', userId, startAt + 3),
    makeEvent('purchase_completed', userId, startAt + 4),
  ]
}
