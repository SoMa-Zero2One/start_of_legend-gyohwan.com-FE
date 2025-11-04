import { useMemo, useState } from "react";
import { EnrichedUniversity, Continent, CONTINENTS } from "@/types/community";
import { getDefaultVisibleUniversityFields } from "@/lib/metadata/universityFields";

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export function useUniversityTable(universities: EnrichedUniversity[]) {
  // 정렬 상태
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // 표시할 필드 키 목록 (초기값: 메타데이터의 defaultVisible)
  const [visibleFieldKeys, setVisibleFieldKeys] = useState(() => getDefaultVisibleUniversityFields());

  // 대륙 활성화 상태 (초기값: 모든 대륙 활성화)
  const [activeContinents, setActiveContinents] = useState<Continent[]>(CONTINENTS);

  // 나라 필터 상태 (초기값: 모든 나라 선택)
  // 전체 나라 목록 추출
  const allCountries = useMemo(() => {
    const countrySet = new Set<string>();
    universities.forEach((univ) => {
      countrySet.add(univ.countryName);
    });
    return Array.from(countrySet).sort((a, b) => a.localeCompare(b, "ko"));
  }, [universities]);

  const [selectedCountries, setSelectedCountries] = useState<string[]>(allCountries);

  // 대륙 활성화 + 나라로 필터링된 대학 목록
  const filteredUniversities = useMemo(() => {
    return universities.filter(
      (univ) =>
        activeContinents.includes(univ.continent as Continent) && selectedCountries.includes(univ.countryName)
    );
  }, [universities, activeContinents, selectedCountries]);

  // 정렬된 대학 목록
  const sortedUniversities = useMemo(() => {
    if (!sortConfig) return filteredUniversities;

    return [...filteredUniversities].sort((a, b) => {
      const aField = a.fields.get(sortConfig.key);
      const bField = b.fields.get(sortConfig.key);

      if (!aField || !bField) return 0;

      // numericValue가 있으면 (level, number) 숫자 비교
      if (aField.numericValue !== undefined && bField.numericValue !== undefined) {
        const diff = aField.numericValue - bField.numericValue;
        return sortConfig.direction === "asc" ? diff : -diff;
      }

      // numericValue 없으면 (string) 문자열 비교
      const comparison = aField.displayValue.localeCompare(bField.displayValue, "ko");
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredUniversities, sortConfig]);

  // 정렬 토글 핸들러
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        // 같은 컬럼 클릭: asc → desc → null (정렬 해제)
        if (prev.direction === "asc") {
          return { key, direction: "desc" };
        }
        return null; // 정렬 해제
      }
      // 다른 컬럼 클릭: asc로 시작
      return { key, direction: "asc" };
    });
  };

  return {
    sortedUniversities,
    sortConfig,
    handleSort,
    visibleFieldKeys,
    setVisibleFieldKeys,
    selectedCountries,
    setSelectedCountries,
    allCountries,
    activeContinents,
    setActiveContinents,
  };
}
