import { CountryApiResponse, EnrichedCountry, Continent } from "@/types/community";
import { DEFAULT_CONTINENT, mapContinentCodeToLabel, normalizeContinentName } from "@/lib/utils/continent";

/**
 * API 응답을 EnrichedCountry로 변환 (방어적 코딩)
 */
export function enrichCountryData(apiData: CountryApiResponse[]): EnrichedCountry[] {
  return apiData.map((country) => ({
    countryCode: country.countryCode,
    name: country.name ?? country.countryCode.toUpperCase(),
    continent: resolveContinent(country),
  }));
}

function resolveContinent(country: CountryApiResponse): Continent {
  const continentName = normalizeContinentName(country.continentName);
  if (continentName) return continentName;

  const continentFromCode = mapContinentCodeToLabel(country.continentCode);
  if (continentFromCode) return continentFromCode;

  return DEFAULT_CONTINENT;
}
