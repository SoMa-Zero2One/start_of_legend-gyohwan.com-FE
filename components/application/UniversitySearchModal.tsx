"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PrevIcon from "@/components/icons/PrevIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import CheckIcon from "@/components/icons/CheckIcon";
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
  onSelectUniversity: (slot: Slot, shouldCloseModal?: boolean) => void;
  isQuickAdd?: boolean; // 돋보기 버튼으로 연 경우
  currentChoice?: number | null; // 수정 중인 지망 번호 (1~5)
  onSave?: () => void; // 저장 버튼 핸들러
}

export default function UniversitySearchModal({
  isOpen,
  onClose,
  slots,
  selectedUniversities,
  onSelectUniversity,
  isQuickAdd = false,
  currentChoice = null,
  onSave,
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
    const query = searchQuery.toLowerCase().trim();
    return (
      slot.name.toLowerCase().includes(query) ||
      slot.country.toLowerCase().includes(query)
    );
  });

  // 선택된 대학과 선택되지 않은 대학 분리
  const selectedSlots = filteredSlots.filter((slot) =>
    selectedUniversities.some((u) => u.slotId === slot.slotId)
  ).sort((a, b) => {
    const aChoice = selectedUniversities.find((u) => u.slotId === a.slotId)?.choice || 0;
    const bChoice = selectedUniversities.find((u) => u.slotId === b.slotId)?.choice || 0;
    return aChoice - bChoice;
  });

  const unselectedSlots = filteredSlots.filter((slot) =>
    !selectedUniversities.some((u) => u.slotId === slot.slotId)
  );

  const handleSlotClick = (slot: Slot) => {
    // 빠른 추가 모드: shouldCloseModal = false
    // 지망 카드 클릭: shouldCloseModal = true
    onSelectUniversity(slot, !isQuickAdd);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    onClose();
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
          placeholder={
            isQuickAdd
              ? "대학교 이름 또는 국가를 검색하세요."
              : `${currentChoice}지망 학교를 검색하세요.`
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          className="body-2 flex-1 py-[8px] focus:outline-none"
        />

        {/* 검색 아이콘 or 저장 버튼 */}
        {isQuickAdd ? (
          <button
            onClick={handleSave}
            className="body-2 cursor-pointer font-semibold text-primary-blue"
          >
            저장
          </button>
        ) : (
          <SearchIcon size={24} />
        )}
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
              const isCurrentChoice = selected?.choice === currentChoice;
              const isOtherChoice = selected && !isCurrentChoice && !isQuickAdd;

              return (
                <button
                  key={slot.slotId}
                  onClick={() => handleSlotClick(slot)}
                  disabled={isOtherChoice}
                  className={`flex items-center gap-[12px] border-b border-gray-100 px-[20px] py-[16px] text-left transition-colors ${
                    isOtherChoice
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-gray-50"
                  }`}
                >
                  {/* 대학 로고 */}
                  <div className="relative h-[40px] w-[40px] flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/icons/ico_profile.svg"
                      alt={slot.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>

                  {/* 대학 정보 */}
                  <div className="flex-1">
                    <p className={`body-2 font-semibold ${isCurrentChoice ? "text-primary-blue" : isOtherChoice ? "text-gray-400" : "text-primary-blue"}`}>
                      {slot.name}
                    </p>
                    <p className="caption-2 text-gray-600">{slot.country}</p>
                  </div>

                  {/* 선택 표시 */}
                  {selected && (
                    <div className="flex items-center gap-[8px]">
                      {isCurrentChoice && !isQuickAdd ? (
                        <span className="caption-1 font-semibold text-red-500">선택 취소</span>
                      ) : isOtherChoice ? (
                        <span className="caption-1 font-semibold text-gray-400">{selected.choice}지망 (수정 불가)</span>
                      ) : (
                        <>
                          <span className="caption-1 text-primary-blue font-semibold">{selected.choice}지망</span>
                          <CheckIcon size={24} className="text-primary-blue" />
                        </>
                      )}
                    </div>
                  )}
                </button>
              );
            })}

            {/* 구분선 (선택된 대학이 있을 때만) */}
            {selectedSlots.length > 0 && unselectedSlots.length > 0 && (
              <div className="border-t-4 border-gray-200" />
            )}

            {/* 선택되지 않은 대학들 */}
            {unselectedSlots.map((slot) => {
              // 빠른 추가 모드에서 5개 이상 선택 시 미선택 대학 비활성화
              const isFull = isQuickAdd && selectedUniversities.length >= 5;

              return (
                <button
                  key={slot.slotId}
                  onClick={() => handleSlotClick(slot)}
                  disabled={isFull}
                  className={`flex items-center gap-[12px] border-b border-gray-100 px-[20px] py-[16px] text-left transition-colors ${
                    isFull
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-gray-50"
                  }`}
                >
                  {/* 대학 로고 */}
                  <div className="relative h-[40px] w-[40px] flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/icons/ico_profile.svg"
                      alt={slot.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>

                  {/* 대학 정보 */}
                  <div className="flex-1">
                    <p className={`body-2 font-semibold ${isFull ? "text-gray-400" : ""}`}>
                      {slot.name}
                    </p>
                    <p className="caption-2 text-gray-600">{slot.country}</p>
                  </div>

                  {/* 5개 초과 메시지 */}
                  {isFull && (
                    <span className="caption-2 text-gray-400">최대 5지망</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
