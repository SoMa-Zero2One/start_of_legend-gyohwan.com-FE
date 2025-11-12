import { http, HttpResponse } from "msw";
import { getCurrentUser, mockGpas, mockLanguages } from "../data/users";
import { mockSeasons, findSeasonById, mockSeasonApplicantCounts } from "../data/seasons";
import { mockSeasonSlots, findSlotById } from "../data/slots";
import {
  findApplicationByUserAndSeason,
  addApplication,
  updateApplication,
} from "../data/applications";

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
  return null;
}

/**
 * Season Handlers
 */
export const seasonHandlers = [
  /**
   * GET /v1/seasons
   * 시즌 목록 조회 (인증 선택)
   */
  http.get(`${BACKEND_URL}/v1/seasons`, () => {
    const user = getCurrentUser();

    // 사용자별 hasApplied 업데이트
    const seasonsWithApplied = mockSeasons.map((season) => {
      const hasApplied = user ? !!findApplicationByUserAndSeason(user.userId, season.seasonId) : false;

      return {
        ...season,
        isApplied: hasApplied, // API 명세에서는 isApplied로 되어 있음
      };
    });

    return HttpResponse.json({
      seasons: seasonsWithApplied,
    });
  }),

  /**
   * GET /v1/seasons/:seasonId
   * 시즌 상세 조회
   *
   * 에러 테스트:
   * - 존재하지 않는 seasonId → 404 SEASON_NOT_FOUND
   */
  http.get(`${BACKEND_URL}/v1/seasons/:seasonId`, ({ params }) => {
    const seasonId = Number(params.seasonId);
    const season = findSeasonById(seasonId);

    if (!season) {
      return createErrorResponse(404, "시즌을 찾을 수 없습니다.");
    }

    const user = getCurrentUser();
    const hasApplied = user ? !!findApplicationByUserAndSeason(user.userId, seasonId) : false;

    const applicantCount = mockSeasonApplicantCounts[seasonId] || 0;

    return HttpResponse.json({
      seasonId: season.seasonId,
      domesticUniversity: season.domesticUniversity,
      domesticUniversityLogoUri: season.domesticUniversityLogoUri,
      name: season.name,
      startDate: season.startDate,
      endDate: season.endDate,
      hasApplied,
      applicantCount,
    });
  }),

  /**
   * GET /v1/seasons/:seasonId/slots
   * 시즌별 슬롯 목록 조회
   *
   * 에러 테스트:
   * - 존재하지 않는 seasonId → 404 SEASON_NOT_FOUND
   */
  http.get(`${BACKEND_URL}/v1/seasons/:seasonId/slots`, ({ params }) => {
    const seasonId = Number(params.seasonId);
    const season = findSeasonById(seasonId);

    if (!season) {
      return createErrorResponse(404, "시즌을 찾을 수 없습니다.");
    }

    const user = getCurrentUser();
    const hasApplied = user ? !!findApplicationByUserAndSeason(user.userId, seasonId) : false;

    const applicantCount = mockSeasonApplicantCounts[seasonId] || 0;

    // 시즌에 속한 슬롯들 가져오기
    const slotIds = mockSeasonSlots[seasonId] || [];
    const slots = slotIds.map((id) => findSlotById(id)).filter((slot) => slot !== undefined);

    return HttpResponse.json({
      seasonId,
      seasonName: season.name,
      hasApplied,
      applicantCount,
      slots,
    });
  }),

  /**
   * GET /v1/seasons/:seasonId/eligibility
   * 지원 가능 여부 확인 (인증 필수)
   *
   * 에러 테스트:
   * - 학교 인증 안된 유저 → 403 SCHOOL_NOT_VERIFIED
   * - 다른 학교 시즌 → 403 SEASON_SCHOOL_MISMATCH
   * - 이미 지원한 시즌 → 409 ALREADY_APPLIED
   * - 존재하지 않는 seasonId → 404 SEASON_NOT_FOUND
   */
  http.get(`${BACKEND_URL}/v1/seasons/:seasonId/eligibility`, ({ params }) => {
    const authError = checkAuth();
    if (authError) return authError;

    const user = getCurrentUser()!;
    const seasonId = Number(params.seasonId);
    const season = findSeasonById(seasonId);

    if (!season) {
      return createErrorResponse(404, "시즌을 찾을 수 없습니다.");
    }

    // 학교 인증 체크
    if (!user.schoolVerified || !user.domesticUniversity) {
      return createErrorResponse(403, "학교 인증이 완료되지 않았습니다.");
    }

    // 학교 매칭 체크
    if (season.domesticUniversity !== user.domesticUniversity) {
      return createErrorResponse(403, "해당 시즌은 귀하의 학교에서 지원할 수 없습니다.");
    }

    // 이미 지원했는지 체크
    const existingApplication = findApplicationByUserAndSeason(user.userId, seasonId);
    if (existingApplication) {
      return createErrorResponse(409, "이미 해당 시즌에 지원하였습니다.");
    }

    return HttpResponse.json({
      eligible: true,
      detail: "지원 가능합니다.",
    });
  }),

  /**
   * POST /v1/seasons/:seasonId
   * 시즌 지원 등록 (인증 필수)
   *
   * 에러 테스트:
   * - choices 빈 배열 → 400 CHOICES_REQUIRED
   * - 학교 인증 안됨 → 400 SCHOOL_NOT_VERIFIED
   * - 학교 불일치 → 403 UNIV_MISMATCH
   * - 다른 사람 GPA 사용 → 403 UNAUTHORIZED_GPA
   * - 다른 사람 Language 사용 → 403 UNAUTHORIZED_LANGUAGE
   * - 존재하지 않는 gpaId → 404 GPA_NOT_FOUND
   * - 존재하지 않는 languageId → 404 LANGUAGE_NOT_FOUND
   * - 존재하지 않는 slotId → 404 SLOT_NOT_FOUND
   * - 이미 지원함 → 409 ALREADY_APPLIED
   */
  http.post(`${BACKEND_URL}/v1/seasons/:seasonId`, async ({ params, request }) => {
    const authError = checkAuth();
    if (authError) return authError;

    const user = getCurrentUser()!;
    const seasonId = Number(params.seasonId);
    const season = findSeasonById(seasonId);

    if (!season) {
      return createErrorResponse(404, "시즌을 찾을 수 없습니다.");
    }

    const body = (await request.json()) as {
      extraScore: number;
      gpaId: number;
      languageId: number;
      choices: Array<{ choice: number; slotId: number }>;
    };

    // Validation - choices 필수
    if (!body.choices || body.choices.length === 0) {
      return createErrorResponse(400, "지원 선택 항목은 필수입니다.");
    }

    // 필수 필드 체크
    if (body.gpaId === undefined || body.languageId === undefined || body.extraScore === undefined) {
      return createErrorResponse(400, "필수 필드가 누락되었습니다.");
    }

    // 학교 인증 체크
    if (!user.schoolVerified || !user.domesticUniversity) {
      return createErrorResponse(400, "학교 인증이 완료되지 않았습니다.");
    }

    // 학교 매칭 체크
    if (season.domesticUniversity !== user.domesticUniversity) {
      return createErrorResponse(403, "해당 시즌은 귀하의 학교에서 지원할 수 없습니다.");
    }

    // 이미 지원했는지 체크
    const existingApplication = findApplicationByUserAndSeason(user.userId, seasonId);
    if (existingApplication) {
      return createErrorResponse(409, "이미 해당 시즌에 지원하였습니다.");
    }

    // GPA 확인
    const userGpas = mockGpas[user.userId] || [];
    const gpa = userGpas.find((g) => g.gpaId === body.gpaId);
    if (!gpa) {
      return createErrorResponse(404, "학점 정보를 찾을 수 없습니다.");
    }

    // Language 확인
    const userLanguages = mockLanguages[user.userId] || [];
    const language = userLanguages.find((l) => l.languageId === body.languageId);
    if (!language) {
      return createErrorResponse(404, "어학 정보를 찾을 수 없습니다.");
    }

    // Slot 확인
    for (const choice of body.choices) {
      const slot = findSlotById(choice.slotId);
      if (!slot) {
        return createErrorResponse(404, "슬롯을 찾을 수 없습니다.");
      }
    }

    // 지원서 생성
    const newApplication = addApplication(
      user.userId,
      seasonId,
      body.gpaId,
      body.languageId,
      body.extraScore,
      body.choices
    );

    // 응답 생성
    const choicesWithSlot = newApplication.choices.map((c) => ({
      choice: c.choice,
      slot: findSlotById(c.slotId)!,
    }));

    return HttpResponse.json(
      {
        applicationId: newApplication.applicationId,
        seasonId: newApplication.seasonId,
        nickname: newApplication.nickname,
        choices: choicesWithSlot,
      },
      { status: 201 }
    );
  }),

  /**
   * GET /v1/seasons/:seasonId/my-application
   * 내 지원서 조회 (인증 필수)
   *
   * 에러 테스트:
   * - 존재하지 않는 seasonId → 404 SEASON_NOT_FOUND
   * - 지원서 없음 → 404 APPLICATION_NOT_FOUND
   */
  http.get(`${BACKEND_URL}/v1/seasons/:seasonId/my-application`, ({ params }) => {
    const authError = checkAuth();
    if (authError) return authError;

    const user = getCurrentUser()!;
    const seasonId = Number(params.seasonId);
    const season = findSeasonById(seasonId);

    if (!season) {
      return createErrorResponse(404, "시즌을 찾을 수 없습니다.");
    }

    const application = findApplicationByUserAndSeason(user.userId, seasonId);
    if (!application) {
      return createErrorResponse(404, "지원 정보를 찾을 수 없습니다.");
    }

    // GPA, Language 정보 가져오기
    const userGpas = mockGpas[user.userId] || [];
    const gpa = userGpas.find((g) => g.gpaId === application.gpaId);

    const userLanguages = mockLanguages[user.userId] || [];
    const language = userLanguages.find((l) => l.languageId === application.languageId);

    // Choices 변환
    const choicesWithSlot = application.choices.map((c) => ({
      choice: c.choice,
      slot: findSlotById(c.slotId)!,
    }));

    return HttpResponse.json({
      applicationId: application.applicationId,
      seasonId: application.seasonId,
      nickname: application.nickname,
      gpa: gpa ? { score: gpa.score, criteria: gpa.criteria } : null,
      language: language
        ? {
            testType: language.testType,
            score: language.score || "",
            grade: language.grade,
          }
        : null,
      choices: choicesWithSlot,
    });
  }),

  /**
   * PUT /v1/seasons/:seasonId/my-application
   * 지원서 수정 (지망 대학 재선택) (인증 필수)
   *
   * 에러 테스트:
   * - choices 빈 배열 → 400 CHOICES_REQUIRED
   * - 수정 횟수 초과 → 400 MODIFY_COUNT_EXCEEDED
   * - 존재하지 않는 seasonId → 404 SEASON_NOT_FOUND
   * - 지원서 없음 → 404 APPLICATION_NOT_FOUND
   * - 존재하지 않는 slotId → 404 SLOT_NOT_FOUND
   */
  http.put(`${BACKEND_URL}/v1/seasons/:seasonId/my-application`, async ({ params, request }) => {
    const authError = checkAuth();
    if (authError) return authError;

    const user = getCurrentUser()!;
    const seasonId = Number(params.seasonId);
    const season = findSeasonById(seasonId);

    if (!season) {
      return createErrorResponse(404, "시즌을 찾을 수 없습니다.");
    }

    const body = (await request.json()) as {
      choices: Array<{ choice: number; slotId: number }>;
    };

    // Validation - choices 필수
    if (!body.choices || body.choices.length === 0) {
      return createErrorResponse(400, "지원 선택 항목은 필수입니다.");
    }

    const application = findApplicationByUserAndSeason(user.userId, seasonId);
    if (!application) {
      return createErrorResponse(404, "지원 정보를 찾을 수 없습니다.");
    }

    // 수정 횟수 체크
    if (application.modifyCount <= 0) {
      return createErrorResponse(400, "지원서 수정 가능 횟수를 초과했습니다.");
    }

    // Slot 확인
    for (const choice of body.choices) {
      const slot = findSlotById(choice.slotId);
      if (!slot) {
        return createErrorResponse(404, "슬롯을 찾을 수 없습니다.");
      }
    }

    // 지원서 수정
    const updatedApplication = updateApplication(application.applicationId, body.choices);

    if (!updatedApplication) {
      return createErrorResponse(500, "지원서 수정에 실패했습니다.");
    }

    // 응답 생성
    const choicesWithSlot = updatedApplication.choices.map((c) => ({
      choice: c.choice,
      slot: findSlotById(c.slotId)!,
    }));

    return HttpResponse.json({
      applicationId: updatedApplication.applicationId,
      seasonId: updatedApplication.seasonId,
      nickname: updatedApplication.nickname,
      choices: choicesWithSlot,
    });
  }),
];
