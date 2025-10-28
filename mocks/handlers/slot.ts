import { http, HttpResponse } from 'msw';
import { getCurrentUser } from '../data/users';
import {
  findSlotById,
  mockSlotApplicants,
  mockSlotApplicantsRestricted,
} from '../data/slots';
import { findSeasonById } from '../data/seasons';
import { findApplicationById, mockApplications } from '../data/applications';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * ProblemDetail 에러 응답 생성 헬퍼
 */
function createErrorResponse(status: number, detail: string, title?: string) {
  return HttpResponse.json(
    {
      type: 'about:blank',
      title: title || getStatusText(status),
      status,
      detail,
    },
    { status }
  );
}

function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error',
  };
  return statusTexts[status] || 'Error';
}

/**
 * 유저가 해당 슬롯에 지원했는지 확인
 */
function hasUserAppliedToSlot(userId: number, slotId: number): boolean {
  const userApplications = mockApplications.filter(
    (app) => app.userId === userId
  );

  for (const app of userApplications) {
    const hasSlot = app.choices.some((choice) => choice.slotId === slotId);
    if (hasSlot) return true;
  }

  return false;
}

/**
 * Slot Handlers
 */
export const slotHandlers = [
  /**
   * GET /v1/slots/:slotId
   * 슬롯 상세 조회 (인증 선택)
   *
   * - 로그인 안했거나 해당 시즌에 지원하지 않은 경우: 민감 정보(점수) null
   * - 로그인했고 해당 시즌에 지원한 경우: 전체 정보 제공
   *
   * 에러 테스트:
   * - 존재하지 않는 slotId → 404 SLOT_NOT_FOUND
   */
  http.get(`${BACKEND_URL}/v1/slots/:slotId`, ({ params }) => {
    const slotId = Number(params.slotId);
    const slot = findSlotById(slotId);

    if (!slot) {
      return createErrorResponse(404, '슬롯을 찾을 수 없습니다.');
    }

    const user = getCurrentUser();

    // 사용자가 이 슬롯에 지원했는지 확인
    const hasApplied = user ? hasUserAppliedToSlot(user.userId, slotId) : false;

    // 지원자 목록 가져오기
    let applicants = mockSlotApplicants[slotId] || [];

    // 지원하지 않은 경우 민감 정보 숨김
    if (!hasApplied) {
      applicants = (mockSlotApplicantsRestricted[slotId] || applicants).map(
        (applicant) => ({
          ...applicant,
          gpaScore: null,
          gpaCriteria: null,
          languageTest: null,
          languageGrade: null,
          languageScore: null,
          extraScore: null,
          score: null,
        })
      );
    }

    // 슬롯이 속한 시즌 찾기 (간단하게 첫 번째 시즌으로 가정)
    const seasonId = 1; // 실제로는 슬롯에서 seasonId를 가져와야 함

    return HttpResponse.json({
      slotId: slot.slotId,
      seasonId,
      name: slot.name,
      country: slot.country,
      logoUrl: slot.logoUrl,
      choiceCount: slot.choiceCount,
      slotCount: slot.slotCount,
      duration: slot.duration,
      etc: null,
      hasApplied,
      choices: applicants,
    });
  }),

  /**
   * GET /v1/applications/:applicationId
   * 지원자 상세 정보 조회 (인증 필수)
   *
   * 에러 테스트:
   * - 존재하지 않는 applicationId → 404 APPLICATION_NOT_FOUND
   */
  http.get(`${BACKEND_URL}/v1/applications/:applicationId`, ({ params }) => {
    const applicationId = Number(params.applicationId);
    const application = findApplicationById(applicationId);

    if (!application) {
      return createErrorResponse(404, '지원 정보를 찾을 수 없습니다.');
    }

    // Mock에서 GPA/Language 정보 가져오기
    const { mockGpas, mockLanguages } = require('../data/users');
    const userGpas = mockGpas[application.userId] || [];
    const gpa = userGpas.find((g: any) => g.gpaId === application.gpaId);

    const userLanguages = mockLanguages[application.userId] || [];
    const language = userLanguages.find(
      (l: any) => l.languageId === application.languageId
    );

    // Choices 변환
    const choicesWithSlot = application.choices.map((c) => ({
      choice: c.choice,
      slot: findSlotById(c.slotId)!,
    }));

    return HttpResponse.json({
      applicationId: application.applicationId,
      seasonId: application.seasonId,
      nickname: application.nickname,
      gpa: gpa
        ? { score: gpa.score, criteria: gpa.criteria }
        : null,
      language: language
        ? {
            testType: language.testType,
            score: language.score || '',
            grade: language.grade,
          }
        : null,
      choices: choicesWithSlot,
    });
  }),
];
