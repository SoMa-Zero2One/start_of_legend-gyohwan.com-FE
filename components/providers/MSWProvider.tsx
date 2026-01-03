"use client";

import { useEffect, useState } from "react";
import { setCurrentUserId } from "@/mocks/data/users";
import { useAuthStore } from "@/stores/authStore";

declare global {
  interface Window {
    __setMockUser?: (userId: number | null) => void;
  }
}

/**
 * MSW Provider
 * 개발 환경에서만 MSW를 활성화하는 클라이언트 컴포넌트
 */
export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initMSW() {
      // 개발 환경에서만 MSW 활성화
      if (process.env.NODE_ENV === "development") {
        // 환경 변수로 MSW 활성화 여부 제어 가능
        const enableMSW = process.env.NEXT_PUBLIC_ENABLE_MSW === "true";

        if (enableMSW) {
          try {
            const { enableMocking } = await import("@/mocks/browser");
            await enableMocking();
            console.log("🔶 MSW is enabled for development");
            await useAuthStore.getState().fetchUser();
          } catch (error) {
            console.error("Failed to initialize MSW:", error);
          }
        }

        if (typeof window !== "undefined") {
          window.__setMockUser = (userId) => {
            setCurrentUserId(userId);
            useAuthStore.getState().fetchUser();
            console.info("[MSW] currentUserId ->", userId);
          };
        }
      }
      setIsReady(true);
    }

    initMSW();
  }, []);

  // MSW가 초기화될 때까지 로딩 상태 유지 (선택 사항)
  // 프로덕션에서는 즉시 렌더링
  if (!isReady && process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_MSW === "true") {
    return null; // 또는 로딩 스피너
  }

  return <>{children}</>;
}
