import { create } from "zustand";
import { getSeasons } from "@/lib/api/season";
import type { Season } from "@/types/season";

interface SeasonsState {
  activeSeasons: Season[];
  hasLoaded: boolean;
  hasAttempted: boolean;
  isLoading: boolean;
  error: string | null;
}

interface SeasonsActions {
  setActiveSeasons: (seasons: Season[]) => void;
  fetchActiveSeasons: () => Promise<void>;
}

export const useSeasonsStore = create<SeasonsState & SeasonsActions>((set, get) => ({
  activeSeasons: [],
  hasLoaded: false,
  hasAttempted: false,
  isLoading: false,
  error: null,
  setActiveSeasons: (seasons) =>
    set({
      activeSeasons: seasons,
      hasLoaded: true,
      hasAttempted: true,
      isLoading: false,
      error: null,
    }),
  fetchActiveSeasons: async () => {
    const { isLoading, hasLoaded } = get();
    if (isLoading || hasLoaded) {
      return;
    }
    set({ isLoading: true, error: null, hasAttempted: true });
    try {
      const response = await getSeasons({ expired: false });
      set({
        activeSeasons: response.seasons ?? [],
        hasLoaded: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load seasons",
      });
    }
  },
}));
