import type { AnalyticsEvent } from "../types/analytics.types";

export interface FunnelStep {
  eventName: AnalyticsEvent["eventName"];
  totalEvents: number;
  uniqueUsers: number;
  conversionRate: number;
}

export interface AnalyticsMetrics {
  totalEvents: number;
  totalAddToCart: number;

  uniqueVisitors: number;
  uniqueAddToCartUsers: number;
  uniqueCheckoutUsers: number;
  uniquePurchasers: number;

  addToCartRate: number;
  purchaseConversionRate: number;

  funnel: FunnelStep[];
}

type FunnelUsers = Record<AnalyticsEvent["eventName"], Set<string>>;

export function getUniqueUsers(events: AnalyticsEvent[]): Set<string> {
  return new Set(events.map((event) => event.userId));
}

export function getEventsByName(
  events: AnalyticsEvent[],
  eventName: AnalyticsEvent["eventName"],
): AnalyticsEvent[] {
  return events.filter((event) => event.eventName === eventName);
}

function calculateRate(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Users must reach each step in order (view -> cart -> checkout -> purchase)
 * for it to count in the sequential funnel.
 */
export function getSequentialFunnelUsers(events: AnalyticsEvent[]): FunnelUsers {
  const eventsByUser = new Map<string, AnalyticsEvent[]>();

  for (const event of events) {
    const userEvents = eventsByUser.get(event.userId) ?? [];
    userEvents.push(event);
    eventsByUser.set(event.userId, userEvents);
  }

  const funnelUsers: FunnelUsers = {
    product_viewed: new Set<string>(),
    add_to_cart: new Set<string>(),
    checkout_started: new Set<string>(),
    purchase_completed: new Set<string>(),
  };

  for (const [userId, userEvents] of eventsByUser) {
    const sortedEvents = [...userEvents].sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    let stage = 0;

    for (const event of sortedEvents) {
      if (stage === 0 && event.eventName === "product_viewed") {
        stage = 1;
        funnelUsers.product_viewed.add(userId);
      } else if (stage === 1 && event.eventName === "add_to_cart") {
        stage = 2;
        funnelUsers.add_to_cart.add(userId);
      } else if (stage === 2 && event.eventName === "checkout_started") {
        stage = 3;
        funnelUsers.checkout_started.add(userId);
      } else if (stage === 3 && event.eventName === "purchase_completed") {
        stage = 4;
        funnelUsers.purchase_completed.add(userId);
      }
    }
  }

  return funnelUsers;
}

export function calculateAnalytics(events: AnalyticsEvent[]): AnalyticsMetrics {
  const productViewedEvents = getEventsByName(events, "product_viewed");
  const addToCartEvents = getEventsByName(events, "add_to_cart");
  const checkoutEvents = getEventsByName(events, "checkout_started");
  const purchaseEvents = getEventsByName(events, "purchase_completed");

  const visitors = getUniqueUsers(productViewedEvents);
  const addToCartUsers = getUniqueUsers(addToCartEvents);
  const checkoutUsers = getUniqueUsers(checkoutEvents);
  const purchasers = getUniqueUsers(purchaseEvents);

  const funnelUsers = getSequentialFunnelUsers(events);
  const uniqueVisitors = visitors.size;

  const funnel: FunnelStep[] = [
    {
      eventName: "product_viewed",
      totalEvents: productViewedEvents.length,
      uniqueUsers: funnelUsers.product_viewed.size,
      // Baseline step: 100% when there are visitors, 0 when there are none.
      conversionRate: calculateRate(
        funnelUsers.product_viewed.size,
        funnelUsers.product_viewed.size,
      ),
    },
    {
      eventName: "add_to_cart",
      totalEvents: addToCartEvents.length,
      uniqueUsers: funnelUsers.add_to_cart.size,
      conversionRate: calculateRate(
        funnelUsers.add_to_cart.size,
        funnelUsers.product_viewed.size,
      ),
    },
    {
      eventName: "checkout_started",
      totalEvents: checkoutEvents.length,
      uniqueUsers: funnelUsers.checkout_started.size,
      conversionRate: calculateRate(
        funnelUsers.checkout_started.size,
        funnelUsers.add_to_cart.size,
      ),
    },
    {
      eventName: "purchase_completed",
      totalEvents: purchaseEvents.length,
      uniqueUsers: funnelUsers.purchase_completed.size,
      conversionRate: calculateRate(
        funnelUsers.purchase_completed.size,
        funnelUsers.checkout_started.size,
      ),
    },
  ];

  return {
    totalEvents: events.length,
    totalAddToCart: addToCartEvents.length,

    uniqueVisitors,
    uniqueAddToCartUsers: addToCartUsers.size,
    uniqueCheckoutUsers: checkoutUsers.size,
    uniquePurchasers: purchasers.size,

    addToCartRate: calculateRate(addToCartUsers.size, uniqueVisitors),

    purchaseConversionRate: calculateRate(purchasers.size, uniqueVisitors),

    funnel,
  };
}
