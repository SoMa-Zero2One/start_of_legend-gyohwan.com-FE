import { enrichCountryData } from "@/lib/utils/countryTransform";
import { mapContinentCodeToLabel, DEFAULT_CONTINENT } from "@/lib/utils/continent";
import type { CountryApiResponse } from "@/types/community";

describe("countryTransform", () => {
  it("fills name and continent from fallbacks", () => {
    const input: CountryApiResponse[] = [
      {
        countryCode: "kr",
        name: null,
        continentCode: "ASIA",
        continentName: null,
        data: null,
      },
    ];

    const result = enrichCountryData(input)[0];

    expect(result.name).toBe("KR");
    expect(result.continent).toBe(mapContinentCodeToLabel("ASIA"));
  });

  it("prefers valid continentName when present", () => {
    const continentName = mapContinentCodeToLabel("EUROPE");
    const input: CountryApiResponse[] = [
      {
        countryCode: "fr",
        name: "France",
        continentCode: null,
        continentName: continentName,
        data: null,
      },
    ];

    const result = enrichCountryData(input)[0];
    expect(result.continent).toBe(continentName);
  });

  it("defaults to fallback continent when data is unknown", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const input: CountryApiResponse[] = [
      {
        countryCode: "xx",
        name: "Unknown",
        continentCode: "UNKNOWN",
        continentName: "UNKNOWN",
        data: null,
      },
    ];

    const result = enrichCountryData(input)[0];
    expect(result.continent).toBe(DEFAULT_CONTINENT);
    warnSpy.mockRestore();
  });
});
