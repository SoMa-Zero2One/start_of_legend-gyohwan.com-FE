"use client";

import { useState, useEffect } from "react";
import RoundCheckbox from "@/components/common/RoundCheckbox";
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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // 애니메이션 시간과 동일
  };

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
    handleClose();
  };

  const toggleContinent = (continent: Continent | null) => {
    setFilters({ ...filters, continent });
  };

  const toggleFilter = (key: string, value: boolean) => {
    setFilters({ ...filters, [key]: value });
  };

  if (!isOpen) return null;

  // 필터 옵션 타입
  type FilterOption = {
    key: string;
    label: string;
    isContinent?: boolean;
    continent?: Continent;
  };

  // 나라 탭 필터 옵션
  const countryOptions: FilterOption[] = [
    { key: "showVisaDifficulty", label: "비자 발급 난이도" },
    { key: "showCost", label: "물가" },
    { key: "showLanguage", label: "사용 언어" },
    { key: "continent_아시아", label: "아시아", isContinent: true, continent: "아시아" },
    { key: "continent_유럽", label: "유럽", isContinent: true, continent: "유럽" },
    { key: "continent_북아메리카", label: "북아메리카", isContinent: true, continent: "북아메리카" },
    { key: "continent_남아메리카", label: "남아메리카", isContinent: true, continent: "남아메리카" },
    { key: "continent_아프리카", label: "아프리카", isContinent: true, continent: "아프리카" },
    { key: "continent_오세아니아", label: "오세아니아", isContinent: true, continent: "오세아니아" },
  ];

  // 대학 탭 필터 옵션
  const universityOptions: FilterOption[] = [
    { key: "showBudget", label: "예산" },
    { key: "showTravel", label: "여행" },
    { key: "showCost", label: "물가" },
    { key: "showProgram", label: "교환학생 프로그램" },
    { key: "showCityType", label: "도시/시골" },
    { key: "showSafety", label: "치안" },
    { key: "showTransportation", label: "교통" },
    { key: "showDorm", label: "기숙사 유무" },
    { key: "showDormCost", label: "기숙사 가격" },
    { key: "showQsRanking", label: "Qs 랭킹" },
    { key: "showSchoolType", label: "국공립 여부" },
  ];

  const options = type === "country" ? countryOptions : universityOptions;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isAnimating ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed right-0 bottom-0 left-0 z-50 rounded-t-[20px] bg-white transition-transform duration-300 ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        <div className="flex flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b border-gray-200 px-[20px] py-[16px]">
            <h2 className="heading-2">필터</h2>
            <button onClick={handleReset} className="caption-1 text-blue-500">
              선택 초기화
            </button>
          </div>

          {/* 필터 옵션 그리드 */}
          <div className="overflow-y-auto p-[20px]" style={{ maxHeight: "calc(80vh - 140px)" }}>
            <div className="grid grid-cols-2 gap-y-4">
              {options.map((option) => {
                let isChecked = false;
                if (option.isContinent) {
                  isChecked = filters.continent === option.continent;
                } else {
                  isChecked = filters[option.key as keyof typeof filters] === true;
                }

                return (
                  <RoundCheckbox
                    key={option.key}
                    checked={isChecked}
                    onChange={(checked) => {
                      if (option.isContinent) {
                        toggleContinent(checked ? option.continent! : null);
                      } else {
                        toggleFilter(option.key, checked);
                      }
                    }}
                    label={option.label}
                  />
                );
              })}
            </div>
          </div>

          {/* 적용 버튼 */}
          <div className="border-t border-gray-200 p-[20px]">
            <button onClick={handleApply} className="btn-primary body-1 w-full rounded-[4px] py-[12px]">
              결과 보기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
