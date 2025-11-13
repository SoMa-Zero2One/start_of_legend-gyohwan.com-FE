import {
  UniversityApiResponse,
  EnrichedUniversity,
  UniversityFieldValue,
  FieldMetadata,
} from "@/types/community";
import { getUniversityFieldMetadata, getUniversityFieldByKey } from "@/lib/metadata/universityFields";

/**
 * API 응답을 EnrichedUniversity로 변환 (방어적 코딩)
 */
export function enrichUniversityData(apiData: UniversityApiResponse[]): EnrichedUniversity[] {
  return apiData.map((university) => {
    const fields = new Map<string, UniversityFieldValue>();
    let continent = "미분류"; // 기본값: 미분류 (필터 일치)

    // 방어: data가 null이면 빈 배열로 처리
    const universityData = university.data ?? [];

    // countryName을 "country" 필드로 추가 (fieldId: 0, 프론트 전용)
    const countryMetadata = getUniversityFieldByKey("country");
    if (countryMetadata) {
      const countryName = university.countryName ?? "기타";
      const countryField: UniversityFieldValue = {
        fieldId: 0,
        key: "country",
        label: "나라",
        value: countryName,
        displayValue: countryName,
        numericValue: undefined,
        type: "string",
        sortable: true,
        displayOrder: countryMetadata.displayOrder,
        renderConfig: countryMetadata.renderConfig,
      };
      fields.set("country", countryField);
    }

    // API data 필드들 변환
    universityData.forEach((field) => {
      // fieldId로 메타데이터 조회
      const metadata = getUniversityFieldMetadata(field.fieldId);

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

      const enrichedField: UniversityFieldValue = {
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

    // isFilled 계산: 나라와 대륙을 제외한 필드 중 하나라도 값이 있는지 체크
    // 원본 API 데이터(universityData)에서 체크해야 함!
    const isFilled = universityData.some((field) => {
      const metadata = getUniversityFieldMetadata(field.fieldId);
      // continent 제외하고 값이 있는 필드가 있으면 true (country는 프론트 전용이라 여기서 체크 안함)
      return metadata && metadata.key !== "continent" && field.value !== null && field.value !== "";
    });

    return {
      univId: university.univId,
      name: university.name ?? `대학교 #${university.univId}`,
      countryName: university.countryName ?? "기타",
      continent,
      isFavorite: university.isFavorite ?? false,
      logoUrl: university.logoUrl ?? "",
      fields,
      isFilled,
      rawData: universityData,
    };
  });
}

/**
 * 표시용 값 변환
 */
function transformDisplayValue(value: string | null, metadata: FieldMetadata): string {
  // null 처리
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
    if (isNaN(num)) return value;
    return num.toLocaleString();
  }

  // STRING 타입: 그대로 반환
  return value;
}

/**
 * 정렬용 숫자 추출
 */
function extractNumericValue(value: string | null, type: FieldMetadata["type"]): number | undefined {
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
