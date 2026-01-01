"use client";

import { useAuthStore } from "@/stores/authStore";

type GtagEventParams = Record<string, unknown>;

interface QueuedEvent {
  eventName: string;
  params: GtagEventParams;
}

const eventQueue: QueuedEvent[] = [];
let flushTimer: number | null = null;
let flushAttempts = 0;
const MAX_FLUSH_ATTEMPTS = 50;
const FLUSH_INTERVAL_MS = 200;

const flushQueue = (): boolean => {
  if (typeof window === "undefined") return false;
  const gtag = window.gtag;
  if (typeof gtag !== "function") return false;

  while (eventQueue.length > 0) {
    const queued = eventQueue.shift();
    if (queued) {
      gtag("event", queued.eventName, queued.params);
    }
  }

  return true;
};

const scheduleFlush = () => {
  if (flushTimer !== null) return;

  flushTimer = window.setTimeout(() => {
    flushTimer = null;

    if (flushQueue()) {
      flushAttempts = 0;
      return;
    }

    flushAttempts += 1;
    if (flushAttempts < MAX_FLUSH_ATTEMPTS) {
      scheduleFlush();
    }
  }, FLUSH_INTERVAL_MS);
};

const getBaseParams = (): GtagEventParams => {
  const { isLoggedIn, user } = useAuthStore.getState();

  if (isLoggedIn && user) {
    return {
      user_status: "member",
      school_verified: Boolean(user.schoolVerified),
      user_id: String(user.userId),
      ...(user.domesticUniversity ? { domestic_university: user.domesticUniversity } : {}),
    };
  }

  return {
    user_status: "guest",
  };
};

export const trackEvent = (eventName: string, params: GtagEventParams = {}): boolean => {
  if (typeof window === "undefined") return false;
  const baseParams = getBaseParams();
  const payload = { ...baseParams, ...params };

  const gtag = window.gtag;
  if (typeof gtag !== "function") {
    eventQueue.push({ eventName, params: payload });
    scheduleFlush();
    return true;
  }

  flushQueue();
  gtag("event", eventName, payload);
  return true;
};
