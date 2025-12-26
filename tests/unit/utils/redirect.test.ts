import { clearRedirectUrl, getRedirectUrl, saveRedirectUrl } from "@/lib/utils/redirect";

describe("redirect utils", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("saves and reads redirect url", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T00:00:00Z"));

    saveRedirectUrl("/strategy-room/1");
    expect(getRedirectUrl()).toBe("/strategy-room/1");
  });

  it("expires redirect url after 10 minutes", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T00:00:00Z"));

    saveRedirectUrl("/community");

    jest.setSystemTime(new Date("2024-01-01T00:10:00.001Z"));

    expect(getRedirectUrl()).toBeNull();
    expect(sessionStorage.getItem("redirectAfterAuth")).toBeNull();
  });

  it("clears stored redirect url", () => {
    saveRedirectUrl("/login");
    clearRedirectUrl();
    expect(getRedirectUrl()).toBeNull();
  });

  it("handles invalid storage data", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    sessionStorage.setItem("redirectAfterAuth", "invalid-json");
    expect(getRedirectUrl()).toBeNull();
    expect(sessionStorage.getItem("redirectAfterAuth")).toBeNull();
    errorSpy.mockRestore();
  });
});
