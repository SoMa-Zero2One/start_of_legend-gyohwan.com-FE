import { http, HttpResponse } from "msw";
import {
  mockCredentials,
  mockUsers,
  mockSignupVerificationCodes,
  mockPasswordResetCodes,
  SIGNUP_VERIFICATION_CODE,
  PASSWORD_RESET_VERIFICATION_CODE,
  setCurrentUserId,
  getCurrentUser,
  ensureMockBasicUser,
  findMockUserByEmail,
} from "../data/users";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

function buildAccessTokenCookie(
  accessToken: string,
  options?: {
    maxAge?: number;
    sameSite?: "Lax" | "Strict" | "None";
  }
) {
  const parts = [`accessToken=${accessToken}`, "Path=/"];

  if (options?.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  if (options?.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  parts.push("HttpOnly");
  return parts.join("; ");
}

/**
 * ProblemDetail 에러 응답 생성 헬퍼
 */
function createErrorResponse(status: number, detail: string, title?: string) {
  return HttpResponse.json(
    {
      type: "about:blank",
      title: title || getStatusText(status),
      status,
      detail,
    },
    { status }
  );
}

function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    500: "Internal Server Error",
  };
  return statusTexts[status] || "Error";
}

/**
 * JWT 토큰 생성 (mock)
 */
function generateMockToken(userId: number): string {
  return `mock-jwt-token-user-${userId}-${Date.now()}`;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * Auth Handlers
 */
export const authHandlers = [
  /**
   * POST /v1/auth/signup/email/check
   * 이메일 존재 여부 확인
   */
  http.get(`${BACKEND_URL}/v1/auth/signup/email/check`, ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return createErrorResponse(400, "이메일 파라미터가 필요합니다.");
    }

    const normalizedEmail = normalizeEmail(email);
    const exists = normalizedEmail in mockCredentials;

    return HttpResponse.json({ exists });
  }),

  /**
   * POST /__msw/auth/set-user
   * 개발용: userId로 로그인 상태 전환
   */
  http.post(`${BACKEND_URL}/__msw/auth/set-user`, async ({ request }) => {
    const body = (await request.json()) as { userId?: number | null };

    if (body.userId === null) {
      setCurrentUserId(null);
      return HttpResponse.json(
        { userId: null },
        {
          headers: {
            "Set-Cookie": buildAccessTokenCookie("", { maxAge: 0, sameSite: "Lax" }),
          },
        }
      );
    }

    if (typeof body.userId !== "number") {
      return createErrorResponse(400, "userId가 필요합니다.");
    }

    const user = mockUsers[body.userId];
    if (!user) {
      return createErrorResponse(404, "사용자를 찾을 수 없습니다.");
    }

    const accessToken = generateMockToken(body.userId);
    setCurrentUserId(body.userId);

    return HttpResponse.json(
      { userId: body.userId, accessToken },
      {
        headers: {
          "Set-Cookie": buildAccessTokenCookie(accessToken, { sameSite: "Lax" }),
        },
      }
    );
  }),

  /**
   * POST /v1/auth/signup/email
   * 이메일 회원가입 (인증 코드 발송)
   *
   * 에러 테스트:
   * - existing@example.com → 409 EMAIL_ALREADY_EXISTS
   * - password가 12자 미만 → 400 PASSWORD_TOO_SHORT
   * - 빈 email/password → 400 Bean Validation
   */
  http.post(`${BACKEND_URL}/v1/auth/signup/email`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    // Validation
    if (!body.email || body.email.trim() === "") {
      return createErrorResponse(400, "이메일을 입력해 주세요.");
    }
    if (!body.password || body.password.trim() === "") {
      return createErrorResponse(400, "비밀번호를 입력해 주세요.");
    }

    const email = normalizeEmail(body.email);

    // 이메일 중복 체크
    if (email === "existing@example.com") {
      return createErrorResponse(409, "이미 사용 중인 이메일입니다.");
    }

    // 비밀번호 길이 체크
    if (body.password.length < 12) {
      return createErrorResponse(400, "비밀번호는 최소 12자 이상이어야 합니다.");
    }

    // 인증 코드 저장 (실제로는 Redis)
    mockSignupVerificationCodes[email] = SIGNUP_VERIFICATION_CODE;

    return HttpResponse.json({ email });
  }),

  /**
   * POST /v1/auth/signup/email/confirm
   * 이메일 인증 코드 확인
   *
   * 에러 테스트:
   * - expired@example.com → 400 EMAIL_CONFIRM_REQUEST_NOT_FOUND
   * - 잘못된 코드 → 400 EMAIL_CONFIRM_CODE_DIFFERENT
   */
  http.post(`${BACKEND_URL}/v1/auth/signup/email/confirm`, async ({ request }) => {
    const body = (await request.json()) as { email: string; code: string };

    // Validation
    if (!body.email || body.email.trim() === "") {
      return createErrorResponse(400, "이메일을 입력해 주세요.");
    }
    if (!body.code || body.code.trim() === "") {
      return createErrorResponse(400, "인증코드를 입력해 주세요.");
    }

    // 만료된 이메일 시뮬레이션
    const email = normalizeEmail(body.email);

    if (email === "expired@example.com") {
      return createErrorResponse(400, "인증 시간이 만료되었거나 요청된 적 없는 이메일입니다.");
    }

    // 인증 코드 확인
    const savedCode = mockSignupVerificationCodes[email];
    if (!savedCode) {
      return createErrorResponse(400, "인증 시간이 만료되었거나 요청된 적 없는 이메일입니다.");
    }

    if (savedCode !== body.code) {
      return createErrorResponse(400, "인증 코드가 일치하지 않습니다.");
    }

    // 새 유저 생성 및 로그인 처리
    const user = ensureMockBasicUser(email);
    const accessToken = generateMockToken(user.userId);

    // Mock credential 저장 (실제로는 DB에 저장)
    mockCredentials[email] = "password123456"; // 임시 비밀번호
    setCurrentUserId(user.userId);

    // 인증 코드 삭제
    delete mockSignupVerificationCodes[email];

    return HttpResponse.json(
      { accessToken },
      {
        headers: {
          "Set-Cookie": buildAccessTokenCookie(accessToken, { sameSite: "Lax" }),
        },
      }
    );
  }),

  /**
   * POST /v1/auth/login/email
   * 이메일 로그인
   *
   * 에러 테스트:
   * - wrong@example.com / wrongpassword → 401 EMAIL_LOGIN_FAILED
   * - 빈 email/password → 400 Bean Validation
   */
  http.post(`${BACKEND_URL}/v1/auth/login/email`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    // Validation
    if (!body.email || body.email.trim() === "") {
      return createErrorResponse(400, "이메일을 입력해 주세요.");
    }
    if (!body.password || body.password.trim() === "") {
      return createErrorResponse(400, "비밀번호를 입력해 주세요.");
    }

    // 이메일 형식 체크 (간단한 버전)
    if (!body.email.includes("@")) {
      return createErrorResponse(400, "must be a well-formed email address");
    }

    const email = normalizeEmail(body.email);

    // 로그인 실패 테스트
    const savedPassword = mockCredentials[email];
    if (!savedPassword || savedPassword !== body.password) {
      return createErrorResponse(401, "이메일 로그인에 실패하였습니다. 이메일 또는 비밀번호를 확인해주세요.");
    }

    // 로그인 성공 - userId 찾기
    const user = findMockUserByEmail(email);
    if (!user) {
      return createErrorResponse(401, "이메일 로그인에 실패하였습니다. 이메일 또는 비밀번호를 확인해주세요.");
    }

    const accessToken = generateMockToken(user.userId);
    setCurrentUserId(user.userId);

    return HttpResponse.json(
      { accessToken },
      {
        headers: {
          "Set-Cookie": buildAccessTokenCookie(accessToken, { sameSite: "Lax" }),
        },
      }
    );
  }),

  /**
   * POST /v1/auth/password-reset/request
   * 비밀번호 재설정 요청 (이메일로 인증번호 발송)
   *
   * 에러 테스트:
   * - blocked@example.com → 429 TOO_MANY_REQUESTS
   * - 빈 이메일 → 400 Bean Validation
   */
  http.post(`${BACKEND_URL}/v1/auth/password-reset/request`, async ({ request }) => {
    const body = (await request.json()) as { email: string };

    if (!body.email || body.email.trim() === "") {
      return createErrorResponse(400, "이메일을 입력해 주세요.");
    }

    const email = normalizeEmail(body.email);

    if (email === "blocked@example.com") {
      return createErrorResponse(429, "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.");
    }

    if (email in mockCredentials) {
      mockPasswordResetCodes[email] = PASSWORD_RESET_VERIFICATION_CODE;
    } else {
      delete mockPasswordResetCodes[email];
    }

    return HttpResponse.json({ email }, { status: 202 });
  }),

  /**
   * POST /v1/auth/password-reset/confirm
   * 인증번호 + 새 비밀번호로 재설정
   *
   * 에러 테스트:
   * - 잘못된 코드 → 400 PASSWORD_RESET_CODE_INVALID
   * - 만료된 코드 → 400 PASSWORD_RESET_REQUEST_NOT_FOUND
   * - 새 비밀번호 12자 미만 → 400 INVALID_PASSWORD_FORMAT
   */
  http.post(`${BACKEND_URL}/v1/auth/password-reset/confirm`, async ({ request }) => {
    const body = (await request.json()) as { email: string; code: string; newPassword: string };

    if (!body.email || body.email.trim() === "") {
      return createErrorResponse(400, "이메일을 입력해 주세요.");
    }
    if (!body.code || body.code.trim() === "") {
      return createErrorResponse(400, "인증 코드를 입력해 주세요.");
    }
    if (!body.newPassword || body.newPassword.trim() === "") {
      return createErrorResponse(400, "새 비밀번호를 입력해 주세요.");
    }

    const email = normalizeEmail(body.email);
    const savedCode = mockPasswordResetCodes[email];
    if (!savedCode) {
      return createErrorResponse(400, "비밀번호 재설정 요청이 만료되었거나 존재하지 않습니다.");
    }

    if (savedCode !== body.code) {
      return createErrorResponse(400, "인증 코드가 일치하지 않습니다.");
    }

    if (body.newPassword.length < 12) {
      return createErrorResponse(400, "비밀번호는 최소 12자 이상이어야 합니다.");
    }

    mockCredentials[email] = body.newPassword;
    delete mockPasswordResetCodes[email];

    return HttpResponse.json({ message: "비밀번호가 재설정되었습니다." });
  }),

  /**
   * POST /v1/auth/login/social/kakao
   * 카카오 소셜 로그인
   *
   * 에러 테스트:
   * - code가 "invalid-code" → 400 INVALID_OR_EXPIRED_KAKAO_AUTH_CODE
   * - code가 "redirect-error" → 400 KAKAO_REDIRECT_URI_MISMATCH
   * - 빈 code → 400 Bean Validation
   */
  http.post(`${BACKEND_URL}/v1/auth/login/social/kakao`, async ({ request }) => {
    const body = (await request.json()) as { code: string };

    // Validation
    if (!body.code || body.code.trim() === "") {
      return createErrorResponse(400, "인증 코드를 입력해주세요.");
    }

    // Redirect URI 에러 시뮬레이션
    if (body.code === "redirect-error") {
      return createErrorResponse(400, "리다이렉트 uri가 잘못되었습니다.");
    }

    // 만료/유효하지 않은 코드 시뮬레이션
    if (body.code === "invalid-code" || body.code === "expired-code") {
      return createErrorResponse(
        400,
        "사용할 수 없는 카카오 인증 코드입니다. 카카오 인증 코드는 일회용이며, 인증 만료 시간은 10분입니다."
      );
    }

    // 카카오 유저로 로그인
    const userId = 3; // mockKakaoUser
    const accessToken = generateMockToken(userId);
    setCurrentUserId(userId);

    return HttpResponse.json(
      { accessToken },
      {
        headers: {
          "Set-Cookie": buildAccessTokenCookie(accessToken, { sameSite: "Lax" }),
        },
      }
    );
  }),

  /**
   * POST /v1/auth/login/social/google
   * 구글 소셜 로그인
   *
   * 에러 테스트:
   * - code가 "invalid-code" → 400 INVALID_OR_EXPIRED_GOOGLE_AUTH_CODE
   * - 빈 code → 400 Bean Validation
   */
  http.post(`${BACKEND_URL}/v1/auth/login/social/google`, async ({ request }) => {
    const body = (await request.json()) as { code: string };

    // Validation
    if (!body.code || body.code.trim() === "") {
      return createErrorResponse(400, "인증 코드를 입력해주세요.");
    }

    // 만료/유효하지 않은 코드 시뮬레이션
    if (body.code === "invalid-code" || body.code === "expired-code") {
      return createErrorResponse(400, "사용할 수 없는 구글 인증 코드입니다.");
    }

    // 구글 유저로 로그인
    const userId = 4; // mockGoogleUser
    const accessToken = generateMockToken(userId);
    setCurrentUserId(userId);

    return HttpResponse.json(
      { accessToken },
      {
        headers: {
          "Set-Cookie": buildAccessTokenCookie(accessToken, { sameSite: "Lax" }),
        },
      }
    );
  }),

  /**
   * POST /v1/auth/logout
   * 로그아웃
   *
   * 에러 테스트:
   * - logoutfail@example.com → 500 LOGOUT_FAILED
   */
  http.post(`${BACKEND_URL}/v1/auth/logout`, () => {
    const currentUser = getCurrentUser();
    if (currentUser?.email === "logoutfail@example.com") {
      return createErrorResponse(500, "로그아웃 처리 중 오류가 발생했습니다.");
    }

    setCurrentUserId(null);

    return HttpResponse.json(
      { message: "로그아웃되었습니다." },
      {
        headers: {
          "Set-Cookie": buildAccessTokenCookie("", { maxAge: 0, sameSite: "Lax" }),
        },
      }
    );
  }),
];
