import type {
  AnalyticsEvent,
  AnalyticsEventName,
} from "../types/analytics.types";

import { getUserId } from "./user-identity.service";

const EVENTS_KEY = "experiment-lab:events";

export function track(
  eventName: AnalyticsEventName,
  properties?: Record<string, unknown>,
): void {
  const existingEvents = getStoredEvents();

  const newEvent: AnalyticsEvent = {
    id: crypto.randomUUID(),
    eventName,
    userId: getUserId(),
    timestamp: Date.now(),
    properties,
  };

  const updatedEvents = [...existingEvents, newEvent];

  localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
}

export function getStoredEvents(): AnalyticsEvent[] {
  const storedEvents = localStorage.getItem(EVENTS_KEY);

  if (!storedEvents) {
    return [];
  }

  try {
    const parsedEvents: unknown = JSON.parse(storedEvents);

    if (!Array.isArray(parsedEvents)) {
      return [];
    }

    return parsedEvents as AnalyticsEvent[];
  } catch {
    return [];
  }
}

export function clearEvents(): void {
  localStorage.removeItem(EVENTS_KEY);
}
