import { useMemo, useState } from "react";
import { EnrichedCountry } from "@/types/community";
import { getDefaultVisibleFields } from "@/lib/metadata/countryFields";
import { CONTINENTS } from "@/types/community";

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export function useCountryTable(countries: EnrichedCountry[]) {
  // 정렬 상태
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // 표시할 필드 키 목록 (초기값: 메타데이터의 defaultVisible)
  const [visibleFieldKeys, setVisibleFieldKeys] = useState<string[]>(() => getDefaultVisibleFields());

  // 대륙 필터 상태 (초기값: 모든 대륙 선택)
  const [selectedContinents, setSelectedContinents] = useState<string[]>(CONTINENTS);

  // 대륙으로 필터링된 나라 목록
  const filteredCountries = useMemo(() => {
    return countries.filter((country) => selectedContinents.includes(country.continent));
  }, [countries, selectedContinents]);

  // 정렬된 나라 목록
  const sortedCountries = useMemo(() => {
    if (!sortConfig) return filteredCountries;

    return [...filteredCountries].sort((a, b) => {
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
  }, [filteredCountries, sortConfig]);

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
    sortedCountries,
    sortConfig,
    handleSort,
    visibleFieldKeys,
    setVisibleFieldKeys,
    selectedContinents,
    setSelectedContinents,
  };
}
