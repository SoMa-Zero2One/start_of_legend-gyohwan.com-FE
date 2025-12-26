import { enrichUniversityData } from "@/lib/utils/universityTransform";
import { mapContinentCodeToLabel, DEFAULT_CONTINENT } from "@/lib/utils/continent";
import type { UniversityApiResponse } from "@/types/community";

describe("universityTransform", () => {
  it("fills defaults and maps fields", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const input: UniversityApiResponse[] = [
      {
        univId: 42,
        name: null,
        countryCode: null,
        countryName: null,
        continentCode: "EUROPE",
        continentName: null,
        isFavorite: null,
        logoUrl: null,
        data: [
          { fieldId: 6, fieldName: "QS", value: "100", type: "NUMBER" },
          { fieldId: 5, fieldName: "Cost", value: null, type: "STRING" },
          { fieldId: 999, fieldName: "Unknown", value: "x", type: "STRING" },
        ],
      },
    ];

    const result = enrichUniversityData(input)[0];

    expect(result.name).toBe("대학교 #42");
    expect(result.countryName).toBe("기타");
    expect(result.continent).toBe(mapContinentCodeToLabel("EUROPE"));
    expect(result.isFavorite).toBe(false);
    expect(result.logoUrl).toBe("");

    expect(result.fields.has("country")).toBe(true);
    expect(result.fields.has("qsRanking")).toBe(true);
    expect(result.fields.has("unknown")).toBe(false);

    const qsRanking = result.fields.get("qsRanking");
    expect(qsRanking?.value).toBe("100");
    expect(qsRanking?.displayValue).toBe("100");
    expect(qsRanking?.numericValue).toBeUndefined();

    expect(result.isFilled).toBe(true);
    expect(result.rawData.length).toBe(3);

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("handles missing data safely", () => {
    const input: UniversityApiResponse[] = [
      {
        univId: 7,
        name: "Test Univ",
        countryCode: null,
        countryName: "Test Country",
        continentCode: null,
        continentName: null,
        isFavorite: true,
        logoUrl: "https://example.com/logo.png",
        data: null,
      },
    ];

    const result = enrichUniversityData(input)[0];

    expect(result.rawData).toEqual([]);
    expect(result.isFilled).toBe(false);
    expect(result.continent).toBe(DEFAULT_CONTINENT);
  });
});
