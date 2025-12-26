import { CACHE_KEYS, clearAllCache, getCachedData, invalidateCache, setCachedData } from "@/lib/utils/sessionCache";

describe("sessionCache utils", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("stores and retrieves cached data with predefined keys", () => {
    setCachedData("COUNTRIES", [{ name: "Korea" }]);
    const result = getCachedData<{ name: string }[]>("COUNTRIES");
    expect(result).toEqual([{ name: "Korea" }]);
  });

  it("stores and retrieves cached data with custom keys", () => {
    setCachedData("custom_key", { value: 1 });
    const result = getCachedData<{ value: number }>("custom_key");
    expect(result).toEqual({ value: 1 });
  });

  it("invalidates cache by key", () => {
    setCachedData("COUNTRIES", ["KR"]);
    invalidateCache("COUNTRIES");
    expect(getCachedData("COUNTRIES")).toBeNull();
  });

  it("clears all predefined caches", () => {
    setCachedData("COUNTRIES", ["KR"]);
    setCachedData("UNIVERSITIES", ["UNI"]);
    clearAllCache();
    expect(sessionStorage.getItem(CACHE_KEYS.COUNTRIES)).toBeNull();
    expect(sessionStorage.getItem(CACHE_KEYS.UNIVERSITIES)).toBeNull();
  });

  it("returns null on invalid cached JSON", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    sessionStorage.setItem(CACHE_KEYS.COUNTRIES, "invalid-json");
    expect(getCachedData("COUNTRIES")).toBeNull();
    errorSpy.mockRestore();
  });
});
