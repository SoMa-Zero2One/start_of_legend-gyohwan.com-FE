import type { Season } from "@/types/season";

const HIDDEN_SEASON_IDS = new Set([1, 2]);

/**
 * Filters out seasons that should never be surfaced to end users
 * (e.g., placeholder or seed data).
 */
export const filterVisibleSeasons = (seasons: Season[] | null | undefined): Season[] => {
  if (!seasons) {
    return [];
  }

  return seasons.filter((season) => !HIDDEN_SEASON_IDS.has(season.seasonId));
};
