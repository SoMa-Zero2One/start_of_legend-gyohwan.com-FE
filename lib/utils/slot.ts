import type { Slot } from "@/types/slot";

/**
 * Slot 데이터의 안전한 기본값을 반환
 *
 * @description
 * API 응답이 불완전하거나 null이어도 UI가 크래시하지 않도록 방어적 기본값 제공
 *
 * @example
 * // 전체 객체 사용
 * const safeSlot = getSlotSafeDefaults(slot);
 * <div>{safeSlot.name}</div>
 *
 * @example
 * // 구조 분해 할당
 * const { name, country } = getSlotSafeDefaults(slot);
 * <div>{name}</div>
 *
 * @param slot - Slot 객체 (null/undefined 가능)
 * @returns 안전한 기본값이 적용된 Slot 객체
 */
export function getSlotSafeDefaults(slot: Slot | null | undefined): Slot {
  if (!slot) {
    return {
      slotId: 0,
      name: "정보 없음",
      country: "기타",
      choiceCount: null,
      slotCount: null,
      duration: null,
      logoUrl: null,
      homepageUrl: null,
    };
  }

  return {
    slotId: slot.slotId,
    name: slot.name ?? "정보 없음",
    country: slot.country ?? "기타",
    choiceCount: slot.choiceCount,
    slotCount: slot.slotCount,
    duration: slot.duration,
    logoUrl: slot.logoUrl,
    homepageUrl: slot.homepageUrl,
  };
}

/**
 * choiceCount의 표시 문자열 반환
 *
 * @description
 * - null: "정보 없음" (데이터 미수집)
 * - 0 이상: "N명" (실제 지원자 수)
 *
 * @param choiceCount - 지원자 수 (null 가능)
 * @returns 표시용 문자열
 */
export function getChoiceCountDisplay(choiceCount: number | null): string {
  return choiceCount === null ? "정보 없음" : `${choiceCount}명`;
}

/**
 * slotCount의 표시 문자열 반환
 *
 * @description
 * - null: "미정" (모집인원 미정)
 * - 값 있음: "N명" (API가 "2" 같은 문자열로 전달)
 *
 * @param slotCount - 모집인원 (null 가능)
 * @returns 표시용 문자열
 */
export function getSlotCountDisplay(slotCount: string | null): string {
  return slotCount === null ? "미정" : `${slotCount}명`;
}
