"use client";

import { useRef } from "react";
import { checkEligibility } from "@/lib/api/season";
import { handleApiError } from "@/lib/utils/apiError";
import { useAuthStore } from "@/stores/authStore";

type GuardOptions = {
  onFail?: (message: string) => void;
};

export function useEligibilityGuard() {
  const { user, isLoggedIn, isLoading: isAuthLoading } = useAuthStore();
  const isCheckingRef = useRef(false);

  const guardEligibility = async (seasonId: number, onSuccess: () => void, options: GuardOptions = {}) => {
    if (isCheckingRef.current) return;

    if (!isAuthLoading && isLoggedIn && user?.schoolVerified) {
      isCheckingRef.current = true;
      try {
        await checkEligibility(seasonId);
      } catch (error) {
        const errorMessage = handleApiError(error) || "해당 시즌은 귀하의 학교에서 지원할 수 없습니다.";
        options.onFail?.(errorMessage);
        return;
      } finally {
        isCheckingRef.current = false;
      }
    }

    onSuccess();
  };

  return { guardEligibility };
}
