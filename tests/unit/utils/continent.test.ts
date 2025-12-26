import { mapContinentCodeToLabel, normalizeContinentName } from "@/lib/utils/continent";

describe("continent utils", () => {
  it("mapContinentCodeToLabel maps known codes", () => {
    expect(mapContinentCodeToLabel("asia")).toBe("아시아");
    expect(mapContinentCodeToLabel("EUROPE")).toBe("유럽");
  });

  it("mapContinentCodeToLabel returns null for empty code", () => {
    expect(mapContinentCodeToLabel(null)).toBeNull();
    expect(mapContinentCodeToLabel(undefined)).toBeNull();
  });

  it("mapContinentCodeToLabel warns for unknown codes", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    expect(mapContinentCodeToLabel("UNKNOWN")).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("normalizeContinentName accepts known names", () => {
    expect(normalizeContinentName("아시아")).toBe("아시아");
    expect(normalizeContinentName("유럽")).toBe("유럽");
  });

  it("normalizeContinentName rejects empty or unknown names", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    expect(normalizeContinentName(" ")).toBeNull();
    expect(normalizeContinentName("UNKNOWN")).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
