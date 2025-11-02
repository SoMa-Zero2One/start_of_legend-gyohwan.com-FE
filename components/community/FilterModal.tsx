"use client";

import { useState } from "react";
import BaseModal from "@/components/common/BaseModal";
import { CountryFilterOptions, UniversityFilterOptions, Continent } from "@/types/community";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "country" | "university";
  currentFilters: CountryFilterOptions | UniversityFilterOptions;
  onApply: (filters: CountryFilterOptions | UniversityFilterOptions) => void;
}

export default function FilterModal({ isOpen, onClose, type, currentFilters, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState(currentFilters);

  const handleReset = () => {
    if (type === "country") {
      setFilters({
        continent: null,
        showVisaDifficulty: true,
        showCost: true,
        showLanguage: true,
      } as CountryFilterOptions);
    } else {
      setFilters({
        continent: null,
        showBudget: true,
        showTravel: true,
        showCost: true,
        showProgram: true,
        showCityType: true,
        showSafety: true,
        showTransportation: true,
        showDorm: true,
        showDormCost: true,
        showQsRanking: true,
        showSchoolType: true,
      } as UniversityFilterOptions);
    }
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6 p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="heading-2">필터</h2>
          <button onClick={handleReset} className="caption-1 text-blue-500">
            선택 초기화
          </button>
        </div>

        {/* 필터 옵션들 */}
        <div className="flex flex-col gap-4">
          {/* 대륙 선택 (분류 필터) */}
          <div>
            <h3 className="medium-body-3 mb-3">대륙</h3>
            <div className="grid grid-cols-2 gap-2">
              {(["아시아", "유럽", "북아메리카", "남아메리카", "아프리카", "오세아니아"] as Continent[]).map(
                (continent) => (
                  <label key={continent} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="continent"
                      checked={filters.continent === continent}
                      onChange={() => setFilters({ ...filters, continent })}
                      className="h-4 w-4"
                    />
                    <span className="body-3">{continent}</span>
                  </label>
                )
              )}
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="continent"
                  checked={filters.continent === null}
                  onChange={() => setFilters({ ...filters, continent: null })}
                  className="h-4 w-4"
                />
                <span className="body-3">전체</span>
              </label>
            </div>
          </div>

          {/* 나라 탭 필터 */}
          {type === "country" && (
            <div>
              <h3 className="medium-body-3 mb-3">표시 항목</h3>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(filters as CountryFilterOptions).showVisaDifficulty}
                    onChange={(e) =>
                      setFilters({ ...filters, showVisaDifficulty: e.target.checked } as CountryFilterOptions)
                    }
                    className="h-4 w-4 rounded"
                  />
                  <span className="body-3">비자 발급 난이도</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(filters as CountryFilterOptions).showCost}
                    onChange={(e) => setFilters({ ...filters, showCost: e.target.checked } as CountryFilterOptions)}
                    className="h-4 w-4 rounded"
                  />
                  <span className="body-3">물가</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(filters as CountryFilterOptions).showLanguage}
                    onChange={(e) =>
                      setFilters({ ...filters, showLanguage: e.target.checked } as CountryFilterOptions)
                    }
                    className="h-4 w-4 rounded"
                  />
                  <span className="body-3">사용 언어</span>
                </label>
              </div>
            </div>
          )}

          {/* 대학 탭 필터 */}
          {type === "university" && (
            <div>
              <h3 className="medium-body-3 mb-3">표시 항목</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "showBudget", label: "예산" },
                  { key: "showTravel", label: "여행" },
                  { key: "showCost", label: "물가" },
                  { key: "showProgram", label: "교환학생 프로그램" },
                  { key: "showCityType", label: "도시/시골" },
                  { key: "showSafety", label: "지안" },
                  { key: "showTransportation", label: "교통" },
                  { key: "showDorm", label: "기숙사 유무" },
                  { key: "showDormCost", label: "기숙사 가격" },
                  { key: "showQsRanking", label: "Qs 랭킹" },
                  { key: "showSchoolType", label: "국공립 여부" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(filters as UniversityFilterOptions)[key as keyof UniversityFilterOptions] as boolean}
                      onChange={(e) =>
                        setFilters({ ...filters, [key]: e.target.checked } as UniversityFilterOptions)
                      }
                      className="h-4 w-4 rounded"
                    />
                    <span className="body-3">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 적용 버튼 */}
        <button onClick={handleApply} className="btn-primary body-1 w-full rounded-[4px] py-3">
          결과 보기
        </button>
      </div>
    </BaseModal>
  );
}
