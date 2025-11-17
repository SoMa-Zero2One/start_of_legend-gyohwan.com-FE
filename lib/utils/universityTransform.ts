import {
  UniversityApiResponse,
  EnrichedUniversity,
  UniversityFieldValue,
  FieldMetadata,
} from "@/types/community";
import { UNIVERSITY_FIELDS, getUniversityFieldByKey } from "@/lib/metadata/universityFields";

/**
 * API 응답을 EnrichedUniversity로 변환 (방어적 코딩)
 */
export function enrichUniversityData(apiData: UniversityApiResponse[]): EnrichedUniversity[] {
  return apiData.map(transformUniversity);
}

type UniversityDataField = NonNullable<UniversityApiResponse["data"]>[number];

const DEFAULT_CONTINENT = "미분류";
const UNIVERSITY_FIELD_METADATA_BY_ID = new Map<number, FieldMetadata>(
  Object.values(UNIVERSITY_FIELDS).map((field) => [field.fieldId, field])
);

const CONTINENT_LABEL_BY_CODE: Record<string, string> = {
  ASIA: "아시아",
  EUROPE: "유럽",
  NORTH_AMERICA: "북아메리카",
  SOUTH_AMERICA: "남아메리카",
  AFRICA: "아프리카",
  OCEANIA: "오세아니아",
};

function transformUniversity(university: UniversityApiResponse): EnrichedUniversity {
  const fields = new Map<string, UniversityFieldValue>();
  const universityData: UniversityDataField[] = university.data ?? [];

  addCountryField(fields, university);
  populateDynamicFields(fields, universityData);

  const continent = resolveContinent(university);
  const isFilled = hasAnyContent(universityData);

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
}

function addCountryField(fields: Map<string, UniversityFieldValue>, university: UniversityApiResponse) {
  const countryMetadata = getUniversityFieldByKey("country");
  if (!countryMetadata) return;

  const countryName = sanitizeText(university.countryName) ?? "기타";
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

function populateDynamicFields(fields: Map<string, UniversityFieldValue>, universityData: UniversityDataField[]) {
  universityData.forEach((field) => {
    const metadata = getMetadataByFieldId(field.fieldId);

    if (!metadata) {
      console.warn(`Unknown field: ${field.fieldId} - ${field.fieldName}`);
      return;
    }

    fields.set(metadata.key, createFieldValue(field, metadata));
  });
}

function resolveContinent(university: UniversityApiResponse): string {
  const continentName = sanitizeText(university.continentName);
  if (continentName) return continentName;

  const continentFromCode = mapContinentCode(university.continentCode);
  if (continentFromCode) return continentFromCode;

  return DEFAULT_CONTINENT;
}

function hasAnyContent(universityData: UniversityDataField[]): boolean {
  return universityData.some((field) => {
    const metadata = getMetadataByFieldId(field.fieldId);
    return metadata && hasValue(field.value);
  });
}

function createFieldValue(field: UniversityDataField, metadata: FieldMetadata): UniversityFieldValue {
  return {
    fieldId: field.fieldId,
    key: metadata.key,
    label: metadata.label,
    value: field.value ?? "",
    displayValue: transformDisplayValue(field.value, metadata),
    numericValue: extractNumericValue(field.value, metadata.type),
    type: metadata.type,
    sortable: metadata.sortable,
    displayOrder: metadata.displayOrder,
    renderConfig: metadata.renderConfig,
  };
}

function getMetadataByFieldId(fieldId: number): FieldMetadata | undefined {
  return UNIVERSITY_FIELD_METADATA_BY_ID.get(fieldId);
}

function sanitizeText(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function hasValue(value: string | null | undefined): value is string {
  return sanitizeText(value) !== null;
}

function mapContinentCode(code: string | null | undefined): string | null {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  return CONTINENT_LABEL_BY_CODE[normalized] ?? null;
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
