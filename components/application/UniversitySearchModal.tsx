"use client";

import { useState, useEffect } from "react";
import PrevIcon from "@/components/icons/PrevIcon";
import UniversitySearchList from "@/components/application/UniversitySearchList";
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

  const selectedChoiceMap = selectedUniversities.reduce<Record<number, number>>((acc, item) => {
    acc[item.slotId] = item.choice;
    return acc;
  }, {});

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
        <UniversitySearchList
          slots={filteredSlots}
          selectedSlotChoices={selectedChoiceMap}
          onSelectUniversity={onSelectUniversity}
          maxSelectable={5}
          variant="modal"
          emptyMessage={slots.length === 0 ? "등록된 대학이 없습니다." : "검색 결과가 없습니다."}
        />
      </div>
    </div>
  );
}
