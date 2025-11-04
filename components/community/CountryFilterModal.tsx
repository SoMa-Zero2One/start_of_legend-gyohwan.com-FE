"use client";

import { useState, useEffect } from "react";
import RoundCheckbox from "@/components/common/RoundCheckbox";
import { COUNTRY_FIELDS } from "@/lib/metadata/countryFields";

// 대륙 타입 (6개 대륙)
export type Continent = "아시아" | "유럽" | "북아메리카" | "남아메리카" | "아프리카" | "오세아니아";

// 대륙 목록
export const CONTINENTS: Continent[] = ["아시아", "유럽", "북아메리카", "남아메리카", "아프리카", "오세아니아"];

interface CountryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedContinents: Continent[];
  visibleFieldKeys: string[];
  onApply: (continents: Continent[], fieldKeys: string[]) => void;
}

export default function CountryFilterModal({
  isOpen,
  onClose,
  selectedContinents: initialContinents,
  visibleFieldKeys: initialFieldKeys,
  onApply,
}: CountryFilterModalProps) {
  const [selectedContinents, setSelectedContinents] = useState<Continent[]>(initialContinents);
  const [selectedFieldKeys, setSelectedFieldKeys] = useState<string[]>(initialFieldKeys);
  const [isAnimating, setIsAnimating] = useState(false);

  // 모든 필드 메타데이터 (displayOrder 순서대로)
  const allFields = Object.values(COUNTRY_FIELDS).sort((a, b) => a.displayOrder - b.displayOrder);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setSelectedContinents(initialContinents);
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
  }, [isOpen, initialContinents, initialFieldKeys]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleReset = () => {
    // 모든 대륙 선택 + 모든 필드 선택
    setSelectedContinents([...CONTINENTS]);
    setSelectedFieldKeys(allFields.map((f) => f.key));
  };

  const handleApply = () => {
    onApply(selectedContinents, selectedFieldKeys);
    handleClose();
  };

  // 대륙 다중 선택 토글
  const toggleContinent = (continent: Continent) => {
    setSelectedContinents((prev) =>
      prev.includes(continent) ? prev.filter((c) => c !== continent) : [...prev, continent]
    );
  };

  // 필드 다중 선택 토글
  const toggleField = (fieldKey: string) => {
    setSelectedFieldKeys((prev) =>
      prev.includes(fieldKey) ? prev.filter((k) => k !== fieldKey) : [...prev, fieldKey]
    );
  };

  if (!isOpen) return null;

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
        style={{ maxHeight: "80vh" }}
      >
        <div className="flex flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b border-gray-200 px-[20px] py-[16px]">
            <h2 className="heading-2">필터</h2>
            <button onClick={handleReset} className="caption-1 cursor-pointer text-blue-500">
              선택 초기화
            </button>
          </div>

          {/* 필터 옵션 */}
          <div className="overflow-y-auto p-[20px]" style={{ maxHeight: "calc(80vh - 140px)" }}>
            {/* 속성 선택 섹션 (위로 이동) */}
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

            {/* 대륙 섹션 (아래로 이동) */}
            <div>
              <h3 className="subhead-2 mb-1 text-gray-900">대륙 선택</h3>
              <p className="caption-1 mb-3 text-gray-600">선택한 대륙에 속한 나라만 표시됩니다</p>
              <div className="grid grid-cols-2 gap-y-4">
                {CONTINENTS.map((continent) => (
                  <RoundCheckbox
                    key={continent}
                    checked={selectedContinents.includes(continent)}
                    onChange={() => toggleContinent(continent)}
                    label={continent}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 적용 버튼 */}
          <div className="border-t border-gray-200 p-[20px]">
            <button onClick={handleApply} className="btn-primary body-1 w-full cursor-pointer rounded-[4px] py-[12px]">
              결과 보기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
