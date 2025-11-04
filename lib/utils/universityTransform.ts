import {
  UniversityApiResponse,
  EnrichedUniversity,
  UniversityFieldValue,
  FieldMetadata,
} from "@/types/community";
import { getUniversityFieldMetadata, getUniversityFieldByKey } from "@/lib/metadata/universityFields";

/**
 * API 응답을 EnrichedUniversity로 변환
 */
export function enrichUniversityData(apiData: UniversityApiResponse[]): EnrichedUniversity[] {
  return apiData.map((university) => {
    const fields = new Map<string, UniversityFieldValue>();

    // "대륙" 필드 찾기 (fieldName 기준)
    const continentField = university.data.find((f) => f.fieldName === "대륙");
    const continent = continentField?.value || "미분류";

    // countryName을 "country" 필드로 추가 (fieldId: 0, 프론트 전용)
    const countryMetadata = getUniversityFieldByKey("country");
    if (countryMetadata) {
      const countryField: UniversityFieldValue = {
        fieldId: 0,
        key: "country",
        label: "나라",
        value: university.countryName,
        displayValue: university.countryName,
        numericValue: undefined,
        type: "string",
        sortable: true,
        displayOrder: countryMetadata.displayOrder,
        renderConfig: countryMetadata.renderConfig,
      };
      fields.set("country", countryField);
    }

    // API data 필드들 변환 ("대륙" 필드는 제외)
    university.data
      .filter((f) => f.fieldName !== "대륙") // 대륙은 별도 속성으로
      .forEach((field) => {
        const metadata = getUniversityFieldMetadata(field.fieldId);

        if (!metadata) {
          // 메타데이터 없는 필드는 무시하거나 경고
          console.warn(`Unknown field: ${field.fieldId} - ${field.fieldName}`);
          return;
        }

        const enrichedField: UniversityFieldValue = {
          fieldId: field.fieldId,
          key: metadata.key,
          label: metadata.label,
          value: field.value,
          displayValue: transformDisplayValue(field.value, metadata),
          numericValue: extractNumericValue(field.value, metadata.type),
          type: metadata.type,
          sortable: metadata.sortable,
          displayOrder: metadata.displayOrder,
          renderConfig: metadata.renderConfig,
        };

        fields.set(metadata.key, enrichedField);
      });

    return {
      univId: university.univId,
      name: university.name,
      countryName: university.countryName,
      continent, // fieldName으로 찾은 대륙 값
      isFavorite: university.isFavorite,
      logoUrl: university.logoUrl,
      fields,
      rawData: university.data,
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
