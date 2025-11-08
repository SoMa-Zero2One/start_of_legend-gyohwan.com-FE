"use client";

import { useState, useEffect } from "react";
import PrevIcon from "@/components/icons/PrevIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import type { Slot } from "@/types/slot";

interface SelectedUniversity {
  choice: number;
  slotId: number;
}

interface UniversitySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: Slot[];
  selectedUniversities: SelectedUniversity[];
  onSelectUniversity: (slot: Slot) => void;
}

export default function UniversitySearchModal({
  isOpen,
  onClose,
  slots,
  selectedUniversities,
  onSelectUniversity,
}: UniversitySearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트에서만 렌더링
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isOpen) return null;

  // 검색어로 필터링
  const filteredSlots = slots.filter((slot) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const name = slot.name ? String(slot.name).toLowerCase() : "";
    const country = slot.country ? String(slot.country).toLowerCase() : "";
    return name.includes(query) || country.includes(query);
  });

  // 선택된 대학과 선택되지 않은 대학 분리
  const selectedSlots = filteredSlots
    .filter((slot) => selectedUniversities.some((u) => u.slotId === slot.slotId))
    .sort((a, b) => {
      const aChoice = selectedUniversities.find((u) => u.slotId === a.slotId)?.choice || 0;
      const bChoice = selectedUniversities.find((u) => u.slotId === b.slotId)?.choice || 0;
      return aChoice - bChoice;
    });

  const unselectedSlots = filteredSlots.filter((slot) => !selectedUniversities.some((u) => u.slotId === slot.slotId));

  const handleSlotClick = (slot: Slot) => {
    onSelectUniversity(slot);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* 상단 헤더 */}
      <div className="flex items-center gap-[12px] border-b border-gray-200 px-[20px] py-[16px]">
        {/* 뒤로가기 버튼 */}
        <button onClick={onClose} className="cursor-pointer p-[4px]">
          <PrevIcon size={24} />
        </button>

        {/* 검색 입력 */}
        <input
          type="text"
          placeholder="대학교 이름 또는 국가를 검색하세요."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          className="body-2 flex-1 py-[8px] focus:outline-none"
        />

        {/* 닫기 버튼 */}
        <button onClick={onClose} className="body-2 text-primary-blue cursor-pointer font-semibold">
          닫기
        </button>
      </div>

      {/* 대학 리스트 */}
      <div className="flex-1 overflow-y-auto">
        {filteredSlots.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* 선택된 대학 먼저 표시 */}
            {selectedSlots.map((slot) => {
              const selected = selectedUniversities.find((u) => u.slotId === slot.slotId);

              const name = slot.name ?? "정보 없음";
              const country = slot.country ?? "기타";

              return (
                <button
                  key={slot.slotId}
                  onClick={() => handleSlotClick(slot)}
                  className="flex items-center gap-[12px] border-b border-gray-100 px-[20px] py-[16px] text-left transition-colors cursor-pointer hover:bg-gray-50"
                >
                  {/* 대학 로고 */}
                  <div className="relative h-[40px] w-[40px] flex-shrink-0 overflow-hidden rounded-full">
                    <SchoolLogoWithFallback
                      src={slot.logoUrl}
                      alt={name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>

                  {/* 대학 정보 */}
                  <div className="flex-1">
                    <p className="body-2 font-semibold text-primary-blue">{name}</p>
                    <p className="caption-2 text-gray-600">{country}</p>
                  </div>

                  {/* 선택 표시 */}
                  {selected && (
                    <div className="flex items-center gap-[8px]">
                      <span className="caption-1 text-primary-blue font-semibold">{selected.choice}지망</span>
                      <CheckIcon size={24} className="text-primary-blue" />
                    </div>
                  )}
                </button>
              );
            })}

            {/* 구분선 (선택된 대학이 있을 때만) */}
            {selectedSlots.length > 0 && unselectedSlots.length > 0 && <div className="border-t-4 border-gray-200" />}

            {/* 선택되지 않은 대학들 */}
            {unselectedSlots.map((slot) => {
              // 5개 이상 선택 시 미선택 대학 비활성화
              const isFull = selectedUniversities.length >= 5;
              const name = slot.name ?? "정보 없음";
              const country = slot.country ?? "기타";

              return (
                <button
                  key={slot.slotId}
                  onClick={() => handleSlotClick(slot)}
                  disabled={isFull}
                  className={`flex items-center gap-[12px] border-b border-gray-100 px-[20px] py-[16px] text-left transition-colors ${
                    isFull ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-50"
                  }`}
                >
                  {/* 대학 로고 */}
                  <div className="relative h-[40px] w-[40px] flex-shrink-0 overflow-hidden rounded-full">
                    <SchoolLogoWithFallback
                      src={slot.logoUrl}
                      alt={name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>

                  {/* 대학 정보 */}
                  <div className="flex-1">
                    <p className={`body-2 font-semibold ${isFull ? "text-gray-400" : ""}`}>{name}</p>
                    <p className="caption-2 text-gray-600">{country}</p>
                  </div>

                  {/* 5개 초과 메시지 */}
                  {isFull && <span className="caption-2 text-gray-400">최대 5지망</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
