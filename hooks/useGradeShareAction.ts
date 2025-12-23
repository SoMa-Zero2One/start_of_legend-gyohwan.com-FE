import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useSeasonsStore } from "@/stores/seasonsStore";
import { GRADE_SHARE_SCROLL_KEY, GRADE_SHARE_SCROLL_TARGET_ID } from "@/lib/constants/scrollTargets";

export function useGradeShareAction() {
  const router = useRouter();
  const pathname = usePathname();
  const { fetchActiveSeasons, hasAttempted } = useSeasonsStore();

  useEffect(() => {
    if (!hasAttempted && !useSeasonsStore.getState().hasAttempted) {
      fetchActiveSeasons().catch(() => {});
    }
  }, [fetchActiveSeasons, hasAttempted]);

  return useCallback(async () => {
    const seasonsState = useSeasonsStore.getState();
    if (!seasonsState.hasLoaded && !seasonsState.isLoading) {
      try {
        await seasonsState.fetchActiveSeasons();
      } catch {
        // fetchActiveSeasons handles error state
      }
    }

    const { activeSeasons } = useSeasonsStore.getState();
    const { user } = useAuthStore.getState();
    const mySchoolSeason = activeSeasons.find(
      (season) => user?.domesticUniversity && season.domesticUniversity === user.domesticUniversity
    );

    if (mySchoolSeason) {
      router.push(`/strategy-room/${mySchoolSeason.seasonId}`);
      return;
    }

    if (pathname === "/") {
      document.getElementById(GRADE_SHARE_SCROLL_TARGET_ID)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      sessionStorage.setItem(GRADE_SHARE_SCROLL_KEY, GRADE_SHARE_SCROLL_TARGET_ID);
    } catch {
      // sessionStorage may be unavailable; fallback to plain navigation
    }
    router.push("/");
  }, [pathname, router]);
}
