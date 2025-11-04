"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import RoundCheckbox from "@/components/common/RoundCheckbox";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import { UNIVERSITY_FIELDS } from "@/lib/metadata/universityFields";
import { Continent, CONTINENTS, EnrichedUniversity } from "@/types/community";

type FunnelStep = "main" | "country";

interface UniversityFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountries: string[];
  visibleFieldKeys: string[];
  onApply: (countries: string[], fieldKeys: string[]) => void;
  universities: EnrichedUniversity[];
}

export default function UniversityFilterModal({
  isOpen,
  onClose,
  selectedCountries: initialCountries,
  visibleFieldKeys: initialFieldKeys,
  onApply,
  universities,
}: UniversityFilterModalProps) {
  const [currentStep, setCurrentStep] = useState<FunnelStep>("main");
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(initialCountries);
  const [selectedFieldKeys, setSelectedFieldKeys] = useState<string[]>(initialFieldKeys);
  const [isAnimating, setIsAnimating] = useState(false);

  // 스크롤 위치 저장용
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const savedScrollPosition = useRef<number>(0);

  // 모든 필드 메타데이터 (displayOrder 순서대로)
  const allFields = Object.values(UNIVERSITY_FIELDS).sort((a, b) => a.displayOrder - b.displayOrder);

  // 대륙별 나라 목록 추출
  const countriesByContinent = useMemo(() => {
    const map = new Map<Continent, Set<string>>();
    CONTINENTS.forEach((continent) => map.set(continent, new Set()));

    universities.forEach((univ) => {
      const continent = univ.continent as Continent;
      if (map.has(continent)) {
        map.get(continent)!.add(univ.countryName);
      }
    });

    // Set을 배열로 변환하고 정렬
    const result = new Map<Continent, string[]>();
    map.forEach((countries, continent) => {
      result.set(continent, Array.from(countries).sort((a, b) => a.localeCompare(b, "ko")));
    });

    return result;
  }, [universities]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setCurrentStep("main");
      setSelectedContinent(null);
      setSelectedCountries(initialCountries);
      setSelectedFieldKeys(initialFieldKeys);
      // 배경 스크롤 차단
      document.body.style.overflow = "hidden";
    } else {
      // 배경 스크롤 복원
      document.body.style.overflow = "unset";
    }

    // cleanup: 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialCountries, initialFieldKeys]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleReset = () => {
    if (currentStep === "main") {
      // 메인 단계: 모든 나라 선택 + 모든 필드 선택
      const allCountries = Array.from(new Set(universities.map((u) => u.countryName))).sort((a, b) =>
        a.localeCompare(b, "ko")
      );
      setSelectedCountries(allCountries);
      setSelectedFieldKeys(allFields.map((f) => f.key));
    } else if (currentStep === "country" && selectedContinent) {
      // 나라 단계: 현재 대륙의 모든 나라 선택
      const continentCountries = countriesByContinent.get(selectedContinent) || [];
      setSelectedCountries((prev) => {
        const otherCountries = prev.filter((c) => !continentCountries.includes(c));
        return [...otherCountries, ...continentCountries];
      });
    }
  };

  const handleApply = () => {
    onApply(selectedCountries, selectedFieldKeys);
    handleClose();
  };

  // 대륙 클릭 -> 나라 선택 단계로 이동
  const handleContinentClick = (continent: Continent) => {
    // 현재 스크롤 위치 저장
    if (scrollContainerRef.current) {
      savedScrollPosition.current = scrollContainerRef.current.scrollTop;
    }
    setSelectedContinent(continent);
    setCurrentStep("country");
  };

  // 나라 토글
  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  // 필드 토글
  const toggleField = (fieldKey: string) => {
    setSelectedFieldKeys((prev) =>
      prev.includes(fieldKey) ? prev.filter((k) => k !== fieldKey) : [...prev, fieldKey]
    );
  };

  // 뒤로가기 (나라 선택 -> 메인)
  const handleBack = () => {
    setCurrentStep("main");
    setSelectedContinent(null);
    // 다음 렌더링 후 스크롤 위치 복원
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = savedScrollPosition.current;
      }
    }, 0);
  };

  if (!isOpen) return null;

  const currentStepCountries = selectedContinent ? countriesByContinent.get(selectedContinent) || [] : [];

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
        className={`fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-[20px] bg-white transition-transform duration-300 ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "80vh" }}
      >
        <div className="flex h-full flex-col">
          {/* 헤더 */}
          <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-[20px] py-[16px]">
            <div className="flex items-center gap-2">
              {currentStep === "country" && (
                <button onClick={handleBack} className="cursor-pointer text-gray-700">
                  ←
                </button>
              )}
              <h2 className="heading-2">
                {currentStep === "main" && "필터"}
                {currentStep === "country" && selectedContinent}
              </h2>
            </div>
            <button onClick={handleReset} className="caption-1 cursor-pointer text-blue-500">
              선택 초기화
            </button>
          </div>

          {/* 필터 옵션 */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-[20px]">
            {/* Step 1: 속성 선택 + 대륙 선택 */}
            {currentStep === "main" && (
              <>
                {/* 속성 선택 섹션 */}
                <div className="mb-6">
                  <h3 className="subhead-2 mb-1 text-gray-900">속성 선택</h3>
                  <p className="caption-1 mb-3 text-gray-600">선택한 속성만 표에 표시됩니다</p>
                  <div className="grid grid-cols-2 gap-y-4">
                    {allFields.map((field) => (
                      <RoundCheckbox
                        key={field.key}
                        checked={selectedFieldKeys.includes(field.key)}
                        onChange={() => toggleField(field.key)}
                        label={field.label}
                      />
                    ))}
                  </div>
                </div>

                {/* 구분선 */}
                <div className="my-6 border-t border-gray-200" />

                {/* 나라 선택 섹션 */}
                <div>
                  <h3 className="subhead-2 mb-1 text-gray-900">나라 선택</h3>
                  <p className="caption-1 mb-3 text-gray-600">대륙을 선택하여 나라를 필터링하세요</p>
                  <div className="space-y-2">
                    {CONTINENTS.map((continent) => {
                      const countries = countriesByContinent.get(continent) || [];
                      const count = countries.length;
                      const selectedCount = countries.filter((c) => selectedCountries.includes(c)).length;

                      return (
                        <button
                          key={continent}
                          onClick={() => handleContinentClick(continent)}
                          className="flex h-[52px] w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="body-2">{continent}</span>
                            {selectedCount > 0 && (
                              <span className="caption-1 text-blue-500">
                                ({selectedCount}/{count})
                              </span>
                            )}
                          </div>
                          <ChevronRightIcon size={20} className="text-gray-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: 나라 선택 */}
            {currentStep === "country" && (
              <div>
                <p className="caption-1 mb-3 text-gray-600">선택한 나라의 대학만 표시됩니다</p>
                <div className="grid grid-cols-2 gap-y-4">
                  {currentStepCountries.map((country) => (
                    <RoundCheckbox
                      key={country}
                      checked={selectedCountries.includes(country)}
                      onChange={() => toggleCountry(country)}
                      label={country}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 적용 버튼 */}
          <div className="flex-shrink-0 border-t border-gray-200 p-[20px]">
            <button onClick={handleApply} className="btn-primary body-1 w-full cursor-pointer rounded-[4px] py-[12px]">
              결과 보기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
