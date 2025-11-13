import {
  CountryApiResponse,
  EnrichedCountry,
  CountryFieldValue,
  FieldMetadata,
} from "@/types/community";
import { getFieldMetadata } from "@/lib/metadata/countryFields";

/**
 * API 응답을 EnrichedCountry로 변환 (방어적 코딩)
 */
export function enrichCountryData(apiData: CountryApiResponse[]): EnrichedCountry[] {
  return apiData.map((country) => {
    const fields = new Map<string, CountryFieldValue>();
    let continent = "미분류"; // 기본값: 미분류 (필터 일치)

    // 방어: data가 null이면 빈 배열로 처리
    const countryData = country.data ?? [];

    countryData.forEach((field) => {
      // fieldId로 메타데이터 조회
      const metadata = getFieldMetadata(field.fieldId);

      if (!metadata) {
        // 메타데이터 없는 필드는 무시하거나 경고
        console.warn(`Unknown field: ${field.fieldId} - ${field.fieldName}`);
        return;
      }

      // 대륙은 필터 전용으로 별도 처리 (fieldId 기반)
      if (metadata.key === "continent") {
        continent = field.value ?? "미분류";
        return; // 테이블에 표시 안 함
      }

      const enrichedField: CountryFieldValue = {
        fieldId: field.fieldId,
        key: metadata.key,
        label: metadata.label,
        value: field.value ?? "", // null → "" for consistency
        displayValue: transformDisplayValue(field.value, metadata),
        numericValue: extractNumericValue(field.value, metadata.type),
        type: metadata.type,
        sortable: metadata.sortable,
        displayOrder: metadata.displayOrder,
        renderConfig: metadata.renderConfig,
      };

      fields.set(metadata.key, enrichedField);
    });

    // isFilled 계산: 하나라도 값이 있는 필드가 있는지 체크 (continent 제외)
    // 원본 API 데이터(countryData)에서 체크해야 함!
    const isFilled = countryData.some((field) => {
      const metadata = getFieldMetadata(field.fieldId);
      // continent 제외하고 값이 있는 필드가 있으면 true
      return metadata && metadata.key !== "continent" && field.value !== null && field.value !== "";
    });

    return {
      countryCode: country.countryCode,
      name: country.name ?? country.countryCode.toUpperCase(),
      continent,
      fields,
      isFilled,
      rawData: countryData,
    };
  });
}

/**
 * 표시용 값 변환
 */
function transformDisplayValue(value: string | null, metadata: FieldMetadata): string {
  // null이나 빈 문자열 처리
  if (!value) return "";

  if (metadata.type === "level") {
    // LEVEL 타입: 1→하, 2→중하, 3→중, 4→중상, 5→상
    const num = parseInt(value);
    if (isNaN(num)) return value;

    switch (num) {
      case 1:
        return "하";
      case 2:
        return "중하";
      case 3:
        return "중";
      case 4:
        return "중상";
      case 5:
        return "상";
      default:
        return value;
    }
  }

  if (metadata.type === "number") {
    // NUMBER 타입: 숫자 포맷팅
    const num = Number(value);
    if (isNaN(num)) return value; // 원본 문자열 유지 (예: "정보 없음")
    return num.toLocaleString();
  }

  // STRING 타입: 그대로 반환
  return value;
}

/**
 * 정렬용 숫자 추출
 */
function extractNumericValue(value: string | null, type: FieldMetadata["type"]): number | undefined {
  // null이나 빈 문자열이면 undefined 반환 (정렬 시 맨 뒤로)
  if (!value) return undefined;

  if (type === "number") {
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  }

  if (type === "level") {
    // "1~5" 형태에서 숫자 추출
    const num = parseInt(value);
    return isNaN(num) ? undefined : num;
  }

  return undefined;
}
