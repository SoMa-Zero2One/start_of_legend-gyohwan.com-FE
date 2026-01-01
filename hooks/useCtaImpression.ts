"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/gtag";

type CtaImpressionParams = {
  cta_id: string;
  cta_location: string;
  cta_label?: string;
  cta_variant?: string;
  season_id?: number | string;
  season_name?: string;
};

interface UseCtaImpressionOptions {
  enabled?: boolean;
  threshold?: number;
}

export const useCtaImpression = (
  ref: RefObject<HTMLElement>,
  params: CtaImpressionParams,
  options: UseCtaImpressionOptions = {}
) => {
  const { enabled = true, threshold = 0.5 } = options;
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (hasTrackedRef.current) return;

    const element = ref.current;
    if (!element) return;

    if (typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) {
      if (trackEvent("cta_impression", params)) {
        hasTrackedRef.current = true;
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (hasTrackedRef.current) return;
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            if (trackEvent("cta_impression", params)) {
              hasTrackedRef.current = true;
              observer.disconnect();
            }
          }
        });
      },
      {
        threshold: [threshold],
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [
    enabled,
    params.cta_id,
    params.cta_label,
    params.cta_location,
    params.cta_variant,
    params.season_id,
    params.season_name,
    ref,
    threshold,
  ]);
};
