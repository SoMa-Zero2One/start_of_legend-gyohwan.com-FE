import { formatLanguageTest } from "@/lib/utils/language";

describe("language utils", () => {
  it("returns null or empty input as-is", () => {
    expect(formatLanguageTest(null)).toBeNull();
    expect(formatLanguageTest("")).toBe("");
  });

  it("maps known language test types", () => {
    expect(formatLanguageTest("TOEFL_IBT")).toBe("TOEFL IBT");
    expect(formatLanguageTest("TOEFL_ITP")).toBe("TOEFL ITP");
    expect(formatLanguageTest("TOEIC")).toBe("TOEIC");
    expect(formatLanguageTest("IELTS")).toBe("IELTS");
  });

  it("returns unknown values unchanged", () => {
    expect(formatLanguageTest("CUSTOM")).toBe("CUSTOM");
  });
});
