import type {
  SeasonSlotsResponse,
  SlotDetailResponse,
  MyApplicationResponse,
  ApplicationDetailResponse,
} from "@/types/slot";
import { getBackendUrl } from "@/lib/utils/api";
import { formatLanguageTest } from "@/lib/utils/language";

/**
 * 시즌별 교환학생 지원 슬롯 목록 조회
 * @param seasonId - 시즌 ID
 * @returns 슬롯 목록
 * @throws {Error} API 호출 실패 시
 */
export const getSeasonSlots = async (seasonId: number): Promise<SeasonSlotsResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/seasons/${seasonId}/slots`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 포함
  });

  if (!response.ok) {
    throw new Error(`슬롯 목록 조회 실패 (HTTP ${response.status})`);
  }

  return await response.json();
};

/**
 * 내 지원서 조회
 * @param seasonId - 시즌 ID
 * @returns 내 지원서 정보
 * @throws {Error} API 호출 실패 시
 */
export const getMyApplication = async (seasonId: number): Promise<MyApplicationResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/seasons/${seasonId}/my-application`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 포함
  });

  if (!response.ok) {
    throw new Error(`내 지원서 조회 실패 (HTTP ${response.status})`);
  }

  const data: MyApplicationResponse = await response.json();

  // language.testType 포맷 변환 (TOEFL_IBT → TOEFL IBT)
  if (data.language?.testType) {
    data.language.testType = formatLanguageTest(data.language.testType);
  }

  return data;
};

/**
 * 슬롯 상세 정보 조회
 * @param slotId - 슬롯 ID
 * @returns 슬롯 상세 정보 및 지원자 목록
 * @throws {Error} API 호출 실패 시
 */
export const getSlotDetail = async (slotId: number): Promise<SlotDetailResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/slots/${slotId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 포함
  });

  if (!response.ok) {
    throw new Error(`슬롯 상세 조회 실패 (HTTP ${response.status})`);
  }

  const data: SlotDetailResponse = await response.json();

  // 지원자들의 languageTest 포맷 변환 (TOEFL_IBT → TOEFL IBT)
  if (data.choices) {
    data.choices = data.choices.map((choice) => ({
      ...choice,
      languageTest: formatLanguageTest(choice.languageTest),
    }));
  }

  return data;
};

/**
 * 지원자 상세 정보 조회
 * @param applicationId - 지원서 ID
 * @returns 지원자 상세 정보
 * @throws {Error} API 호출 실패 시
 */
export const getApplicationDetail = async (applicationId: number): Promise<ApplicationDetailResponse> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/applications/${applicationId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 포함
  });

  if (!response.ok) {
    throw new Error(`지원자 상세 조회 실패 (HTTP ${response.status})`);
  }

  const data: ApplicationDetailResponse = await response.json();

  // language.testType 포맷 변환 (TOEFL_IBT → TOEFL IBT)
  if (data.language?.testType) {
    data.language.testType = formatLanguageTest(data.language.testType);
  }

  return data;
};
