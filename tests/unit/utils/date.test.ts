import {
  calculateDDay,
  formatDate,
  formatDateTime,
  getKstMidnight,
  parseKstDate,
} from "@/lib/utils/date";

afterEach(() => {
  jest.useRealTimers();
});

describe("date utils", () => {
  it("parseKstDate uses timezone when present", () => {
    const date = parseKstDate("2024-01-01T00:00:00Z");
    expect(date.getTime()).toBe(new Date("2024-01-01T00:00:00Z").getTime());
  });

  it("parseKstDate assumes KST when timezone missing", () => {
    const date = parseKstDate("2024-01-01T00:00:00");
    expect(date.getTime()).toBe(new Date("2024-01-01T00:00:00+09:00").getTime());
  });

  it("getKstMidnight returns KST midnight in UTC", () => {
    const midnight = getKstMidnight("2024-01-01T00:00:00Z");
    expect(midnight.toISOString()).toBe("2023-12-31T15:00:00.000Z");
  });

  it("calculateDDay returns days relative to today (KST)", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T12:00:00Z"));

    expect(calculateDDay("2024-01-02T00:00:00Z")).toBe(1);
    expect(calculateDDay("2023-12-31T00:00:00Z")).toBe(-1);
  });

  it("formatDate formats as yyyy.mm.dd in KST", () => {
    expect(formatDate("2024-01-01T00:00:00Z")).toBe("2024.01.01");
  });

  it("formatDateTime handles invalid inputs and formats in KST", () => {
    expect(formatDateTime(null)).toBe("");
    expect(formatDateTime("invalid")).toBe("");
    expect(formatDateTime("2024-01-01T00:00:00Z")).toBe("2024-01-01 09:00");
    expect(formatDateTime("2024-01-01T12:34:00")).toBe("2024-01-01 12:34");
  });
});
