import { http, HttpResponse } from "msw";
import { getCurrentUser, mockUsers, mockGpas, mockLanguages, mockVerificationCodes } from "../data/users";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

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
 * 인증 체크 헬퍼
 */
function checkAuth() {
  const user = getCurrentUser();
  if (!user) {
    return createErrorResponse(401, "Full authentication is required to access this resource", "Unauthorized");
  }
  return null; // 인증 성공
}

/**
 * User Handlers
 */
export const userHandlers = [
  /**
   * GET /v1/users/me
   * 내 프로필 조회
   *
   * 에러 테스트:
   * - 로그인하지 않은 상태 → 401 Unauthorized
   */
  http.get(`${BACKEND_URL}/v1/users/me`, () => {
    const authError = checkAuth();
    if (authError) return authError;

    const user = getCurrentUser()!;

    return HttpResponse.json({
      userId: user.userId,
      email: user.email,
      schoolEmail: user.schoolEmail,
      nickname: user.nickname,
      domesticUniversity: user.domesticUniversity,
      schoolVerified: user.schoolVerified,
      loginType: user.loginType,
      socialType: user.socialType,
    });
  }),

  /**
   * GET /v1/users/me/gpas
   * 내 GPA 목록 조회
   *
   * 에러 테스트:
   * - 로그인하지 않은 상태 → 401 Unauthorized
   */
  http.get(`${BACKEND_URL}/v1/users/me/gpas`, () => {
    const authError = checkAuth();
    if (authError) return authError;

    const user = getCurrentUser()!;
    const gpas = mockGpas[user.userId] || [];

    return HttpResponse.json({
      userId: user.userId,
      gpas,
    });
  }),

  /**
   * POST /v1/users/me/gpas
   * GPA 등록
   *
   * 에러 테스트:
   * - criteria가 4.0/4.3/4.5가 아닌 경우 → 400 INVALID_GPA_CRITERIA
   * - score 또는 criteria 누락 → 400 Bean Validation
   * - score가 0 이하 → 400 Bean Validation
   */
  http.post(`${BACKEND_URL}/v1/users/me/gpas`, async ({ request }) => {
    const authError = checkAuth();
    if (authError) return authError;

    const user = getCurrentUser()!;
    const body = (await request.json()) as { score: number; criteria: number };

    // Validation
    if (body.score === undefined || body.score === null) {
      return createErrorResponse(400, "must not be null");
    }
    if (body.criteria === undefined || body.criteria === null) {
      return createErrorResponse(400, "must not be null");
    }
    if (body.score <= 0) {
      return createErrorResponse(400, "must be greater than 0");
    }

    // Criteria 검증 (4.0, 4.3, 4.5만 허용, ±0.01 오차 허용)
    const validCriterias = [4.0, 4.3, 4.5];
    const isValidCriteria = validCriterias.some((valid) => Math.abs(body.criteria - valid) <= 0.01);

    if (!isValidCriteria) {
      return createErrorResponse(400, "유효하지 않은 학점 기준입니다. 4.0, 4.3, 4.5 중 하나여야 합니다.");
    }

    // 새 GPA 생성
    const newGpa = {
      gpaId: Date.now(), // 간단한 ID 생성
      score: body.score,
      criteria: body.criteria.toString(),
      verifyStatus: "APPROVED" as const,
      statusReason: null,
    };

    // Mock 데이터에 추가
    if (!mockGpas[user.userId]) {
      mockGpas[user.userId] = [];
    }
    mockGpas[user.userId].push(newGpa);

    return HttpResponse.json(newGpa);
  }),

  /**
   * GET /v1/users/me/languages
   * 내 어학 성적 목록 조회
   */
  http.get(`${BACKEND_URL}/v1/users/me/languages`, () => {
    const authError = checkAuth();
    if (authError) return authError;

    const user = getCurrentUser()!;
    const languages = mockLanguages[user.userId] || [];

    return HttpResponse.json({
      userId: user.userId,
      languages,
    });
  }),

  /**
   * POST /v1/users/me/languages
   * 어학 성적 등록
   *
   * 에러 테스트:
   * - testType 누락 → 400 Bean Validation
   * - 지원하지 않는 testType → 400 INVALID_LANGUAGE_TEST_TYPE
   */
  http.post(`${BACKEND_URL}/v1/users/me/languages`, async ({ request }) => {
    const authError = checkAuth();
    if (authError) return authError;

    const user = getCurrentUser()!;
    const body = (await request.json()) as {
      testType: string;
      score?: string;
      grade?: string;
    };

    // Validation
    if (!body.testType) {
      return createErrorResponse(400, "must not be null");
    }

    // 지원하는 testType 체크
    const validTestTypes = ["TOEFL_IBT", "TOEFL_ITP", "IELTS", "TOEIC", "HSK", "JLPT"];
    if (!validTestTypes.includes(body.testType)) {
      return createErrorResponse(400, "유효하지 않은 어학 시험 유형입니다.");
    }

    // 새 Language 생성
    const newLanguage = {
      languageId: Date.now(), // 간단한 ID 생성
      testType: body.testType,
      score: body.score || null,
      grade: body.grade || null,
      verifyStatus: "APPROVED" as const,
      statusReason: null,
    };

    // Mock 데이터에 추가
    if (!mockLanguages[user.userId]) {
      mockLanguages[user.userId] = [];
    }
    mockLanguages[user.userId].push(newLanguage);

    return HttpResponse.json(newLanguage);
  }),

  /**
   * POST /v1/users/me/password
   * 비밀번호 변경
   *
   * 에러 테스트:
   * - currentPassword가 틀린 경우 → 400 PASSWORD_CHANGE_FAILED
   * - newPassword가 8자 미만 → 400 INVALID_PASSWORD_FORMAT
   * - 필드 누락 → 400 Bean Validation
   */
  http.post(`${BACKEND_URL}/v1/users/me/password`, async ({ request }) => {
    const authError = checkAuth();
    if (authError) return authError;

    const body = (await request.json()) as {
      currentPassword: string;
      newPassword: string;
    };

    // Validation
    if (!body.currentPassword || body.currentPassword.trim() === "") {
      return createErrorResponse(400, "현재 비밀번호는 필수입니다");
    }
    if (!body.newPassword || body.newPassword.trim() === "") {
      return createErrorResponse(400, "새 비밀번호는 필수입니다");
    }

    // 현재 비밀번호 확인 (간단한 시뮬레이션)
    if (body.currentPassword !== "password123456") {
      return createErrorResponse(400, "비밀번호 변경에 실패하였습니다. 현재 비밀번호를 확인해주세요.");
    }

    // 새 비밀번호 길이 체크
    if (body.newPassword.length < 8) {
      return createErrorResponse(400, "비밀번호는 최소 8자 이상이어야 합니다.");
    }

    return HttpResponse.json({
      message: "비밀번호가 성공적으로 변경되었습니다.",
    });
  }),

  /**
   * POST /v1/users/me/school-email
   * 학교 이메일 인증 요청
   *
   * 에러 테스트:
   * - unsupported@wrongdomain.com → 400 SCHOOL_EMAIL_DOMAIN_NOT_SUPPORTED
   * - 이미 인증된 유저 → 409 SCHOOL_EMAIL_ALREADY_VERIFIED
   * - 빈 이메일 → 400 Bean Validation
   */
  http.post(`${BACKEND_URL}/v1/users/me/school-email`, async ({ request }) => {
    const authError = checkAuth();
    if (authError) return authError;

    const user = getCurrentUser()!;
    const body = (await request.json()) as { schoolEmail: string };

    // Validation
    if (!body.schoolEmail || body.schoolEmail.trim() === "") {
      return createErrorResponse(400, "학교 이메일은 필수입니다");
    }

    // 이메일 형식 체크
    if (!body.schoolEmail.includes("@")) {
      return createErrorResponse(400, "올바른 이메일 형식이 아닙니다");
    }

    // 이미 인증된 유저
    if (user.schoolVerified) {
      return createErrorResponse(409, "이미 학교 인증이 완료된 계정입니다.");
    }

    // 지원하지 않는 도메인 체크
    const supportedDomains = ["univ.ac.kr", "university.edu", "college.ac.kr"];
    const domain = body.schoolEmail.split("@")[1];
    if (!supportedDomains.includes(domain)) {
      return createErrorResponse(400, "지원하지 않는 학교 이메일 도메인입니다.");
    }

    // 인증 코드 저장 (실제로는 Redis)
    mockVerificationCodes[body.schoolEmail] = "111111";

    return HttpResponse.json({ schoolEmail: body.schoolEmail }, { status: 202 });
  }),

  /**
   * POST /v1/users/me/school-email/confirm
   * 학교 이메일 인증 확인
   *
   * 에러 테스트:
   * - 잘못된 코드 → 400 SCHOOL_EMAIL_CONFIRM_CODE_DIFFERENT
   * - 만료된 코드 → 400 SCHOOL_EMAIL_CONFIRM_REQUEST_NOT_FOUND
   * - 빈 코드 → 400 Bean Validation
   */
  http.post(`${BACKEND_URL}/v1/users/me/school-email/confirm`, async ({ request }) => {
    const authError = checkAuth();
    if (authError) return authError;

    const user = getCurrentUser()!;
    const body = (await request.json()) as { code: string };

    // Validation
    if (!body.code || body.code.trim() === "") {
      return createErrorResponse(400, "인증 코드는 필수입니다");
    }

    // 학교 이메일 찾기 (간단한 시뮬레이션)
    const schoolEmail = Object.keys(mockVerificationCodes).find(
      (email) => email.includes("univ.ac.kr") || email.includes("university.edu")
    );

    if (!schoolEmail) {
      return createErrorResponse(400, "인증 시간이 만료되었거나 요청된 적 없는 이메일입니다.");
    }

    const savedCode = mockVerificationCodes[schoolEmail];
    if (savedCode !== body.code) {
      return createErrorResponse(400, "인증 코드가 일치하지 않습니다.");
    }

    // 인증 성공 - 유저 정보 업데이트
    mockUsers[user.userId].schoolVerified = true;
    mockUsers[user.userId].schoolEmail = schoolEmail;
    mockUsers[user.userId].domesticUniversity = "교환대학교";

    // 인증 코드 삭제
    delete mockVerificationCodes[schoolEmail];

    return HttpResponse.json({ schoolEmail });
  }),

  /**
   * DELETE /v1/users/me/withdraw
   * 회원 탈퇴
   */
  http.delete(`${BACKEND_URL}/v1/users/me/withdraw`, () => {
    const authError = checkAuth();
    if (authError) return authError;

    const user = getCurrentUser()!;

    // Mock 데이터에서 유저 삭제
    delete mockUsers[user.userId];
    delete mockGpas[user.userId];
    delete mockLanguages[user.userId];

    return HttpResponse.json(
      { message: "회원탈퇴가 완료되었습니다." },
      {
        headers: {
          "Set-Cookie": "accessToken=; Path=/; HttpOnly; Max-Age=0",
        },
      }
    );
  }),
];
