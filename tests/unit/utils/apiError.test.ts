import { handleApiError, parseApiError } from "@/lib/utils/apiError";
import { AUTH_ERROR_MESSAGES, DEFAULT_ERROR_MESSAGES } from "@/types/apiError";

const makeResponse = (data: unknown, status: number): Response =>
  ({
    status,
    json: async () => data,
  }) as unknown as Response;

const makeJsonErrorResponse = (status: number): Response =>
  ({
    status,
    json: async () => {
      throw new Error("invalid json");
    },
  }) as unknown as Response;


describe("apiError utils", () => {
  it("parseApiError returns detail when provided", async () => {
    const response = makeResponse({ detail: "Custom error", type: "EMAIL_LOGIN_FAILED" }, 401);
    await expect(parseApiError(response)).resolves.toBe("Custom error");
  });

  it("parseApiError maps known auth error types", async () => {
    const response = makeResponse({ type: "EMAIL_LOGIN_FAILED" }, 401);
    await expect(parseApiError(response)).resolves.toBe(AUTH_ERROR_MESSAGES.EMAIL_LOGIN_FAILED);
  });

  it("parseApiError falls back to default status messages", async () => {
    const response = makeResponse({ type: "UNKNOWN" }, 404);
    await expect(parseApiError(response)).resolves.toBe(DEFAULT_ERROR_MESSAGES[404]);
  });

  it("parseApiError uses default message when detail/type are missing", async () => {
    const response = makeResponse({}, 400);
    await expect(parseApiError(response)).resolves.toBe(DEFAULT_ERROR_MESSAGES[400]);
  });

  it("parseApiError ignores empty detail and uses type mapping", async () => {
    const response = makeResponse({ detail: "", type: "EMAIL_LOGIN_FAILED" }, 401);
    await expect(parseApiError(response)).resolves.toBe(AUTH_ERROR_MESSAGES.EMAIL_LOGIN_FAILED);
  });

  it("parseApiError returns generic message for unknown status", async () => {
    const response = makeResponse({ type: "UNKNOWN" }, 418);
    await expect(parseApiError(response)).resolves.toBe("오류가 발생했습니다 (HTTP 418)");
  });

  it("parseApiError handles non-json responses", async () => {
    const response = makeJsonErrorResponse(418);
    await expect(parseApiError(response)).resolves.toBe("서버 오류가 발생했습니다 (HTTP 418)");
  });

  it("parseApiError handles non-json responses with default status message", async () => {
    const response = makeJsonErrorResponse(500);
    await expect(parseApiError(response)).resolves.toBe(DEFAULT_ERROR_MESSAGES[500]);
  });

  it("handleApiError normalizes error types", () => {
    expect(handleApiError(new TypeError("Network"))).toBe("네트워크 연결을 확인해주세요.");
    expect(handleApiError(new Error("Boom"))).toBe("Boom");
    expect(handleApiError("Plain string")).toBe("Plain string");
    expect(handleApiError({})).toBe("알 수 없는 오류가 발생했습니다.");
  });
});
