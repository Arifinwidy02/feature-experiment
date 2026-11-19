export type AnalyticsEventName =
  | "product_viewed"
  | "add_to_cart"
  | "checkout_started"
  | "purchase_completed";

export interface AnalyticsEvent {
  id: string;
  eventName: AnalyticsEventName;
  userId: string;
  timestamp: number;
  properties?: Record<string, unknown>;
}
