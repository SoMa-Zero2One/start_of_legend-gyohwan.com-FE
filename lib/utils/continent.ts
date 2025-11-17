import { Continent, CONTINENTS } from "@/types/community";

export const DEFAULT_CONTINENT: Continent = "미분류";

const CONTINENT_CODES: Record<string, Continent> = {
  ASIA: "아시아",
  EUROPE: "유럽",
  NORTH_AMERICA: "북아메리카",
  SOUTH_AMERICA: "남아메리카",
  AFRICA: "아프리카",
  OCEANIA: "오세아니아",
};

const CONTINENT_NAME_SET = new Set(CONTINENTS);

export function mapContinentCodeToLabel(code: string | null | undefined): Continent | null {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  const label = CONTINENT_CODES[normalized];
  if (!label && process.env.NODE_ENV !== "production") {
    console.warn(`[continent] Unknown continent code: "${code}" (normalized: "${normalized}")`);
  }
  return label ?? null;
}

export function normalizeContinentName(name: string | null | undefined): Continent | null {
  if (!name) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  if (!CONTINENT_NAME_SET.has(trimmed as Continent)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[continent] Unknown continent name: "${trimmed}"`);
    }
    return null;
  }
  return trimmed as Continent;
}
