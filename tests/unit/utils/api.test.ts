import { getBackendUrl } from "@/lib/utils/api";

describe("api utils", () => {
  const originalEnv = process.env.NEXT_PUBLIC_BACKEND_URL;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_BACKEND_URL;
    } else {
      process.env.NEXT_PUBLIC_BACKEND_URL = originalEnv;
    }
  });

  it("returns backend url when configured", () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = "https://api.example.com";
    expect(getBackendUrl()).toBe("https://api.example.com");
  });

  it("throws when backend url is missing", () => {
    delete process.env.NEXT_PUBLIC_BACKEND_URL;
    expect(() => getBackendUrl()).toThrow("NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.");
  });
});
