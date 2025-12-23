import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useSeasonsStore } from "@/stores/seasonsStore";

const STRATEGY_ANCHOR_ID = "strategy-room-entrances";

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
      document.getElementById(STRATEGY_ANCHOR_ID)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    router.push(`/#${STRATEGY_ANCHOR_ID}`);
  }, [pathname, router]);
}
