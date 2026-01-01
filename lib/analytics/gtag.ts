"use client";

import { useAuthStore } from "@/stores/authStore";

type GtagEventParams = Record<string, unknown>;

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
  if (typeof window.gtag !== "function") return false;

  const baseParams = getBaseParams();
  window.gtag("event", eventName, { ...baseParams, ...params });
  return true;
};
