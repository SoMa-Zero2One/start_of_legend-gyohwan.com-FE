"use client";

import { useState, useEffect } from "react";

/**
 * matchMedia를 사용한 미디어 쿼리 감지 훅
 * @param query - CSS 미디어 쿼리 문자열 (예: "(min-width: 1024px)")
 * @returns 미디어 쿼리 매칭 여부
 */
export function useMediaQuery(query: string): boolean {
  // 초기값을 함수로 지연 실행하여 SSR 호환 + 초기 렌더링 최적화
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    // 초기 마운트 시 상태 동기화 (query 변경 시에도 동기화)
    setMatches(media.matches);

    // 브레이크포인트 변경 시 호출되는 리스너
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 리스너 등록 (브레이크포인트 넘을 때만 발생, 디바운싱 불필요)
    media.addEventListener("change", listener);

    // 클린업
    return () => media.removeEventListener("change", listener);
  }, [query]); // matches 제거: query 변경 시에만 effect 재실행

  return matches;
}

/**
 * Tailwind 브레이크포인트에 따른 디바이스 타입 반환
 * - mobile: < 768px
 * - tablet: 768px ~ 1023px (md ~ lg 미만)
 * - desktop: >= 1024px (lg)
 */
export function useBreakpoint(): "mobile" | "tablet" | "desktop" {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");

  if (isDesktop) return "desktop";
  if (isTablet) return "tablet";
  return "mobile";
}

/**
 * Tailwind lg 브레이크포인트 (1024px) 이상인지 확인
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

/**
 * Tailwind md 브레이크포인트 (768px) 이상인지 확인
 */
export function useIsTabletOrDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)");
}
