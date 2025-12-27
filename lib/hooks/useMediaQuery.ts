"use client";

import { useState, useEffect } from "react";

/**
 * matchMedia를 사용한 미디어 쿼리 감지 훅
 * @param query - CSS 미디어 쿼리 문자열 (예: "(min-width: 1280px)")
 * @returns 미디어 쿼리 매칭 여부
 */
export function useMediaQuery(query: string): boolean {
  // SSR 단계에서는 항상 false를 반환해 서버/클라이언트 초기 렌더 결과를 일치시킨다.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);

    // hydration 이후 실제 값으로 동기화
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/**
 * Tailwind 브레이크포인트에 따른 디바이스 타입 반환
 * - mobile: < 768px
 * - tablet: 768px ~ 1279px (md ~ lg 미만)
 * - desktop: >= 1280px (lg)
 */
export function useBreakpoint(): "mobile" | "tablet" | "desktop" {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1279px)");

  if (isDesktop) return "desktop";
  if (isTablet) return "tablet";
  return "mobile";
}

/**
 * Tailwind lg 브레이크포인트 (1280px) 이상인지 확인
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1280px)");
}

/**
 * Tailwind md 브레이크포인트 (768px) 이상인지 확인
 */
export function useIsTabletOrDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)");
}
