"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SearchIcon from "@/components/icons/SearchIcon";
import DragHandleIcon from "@/components/icons/DragHandleIcon";
import CTAButton from "@/components/common/CTAButton";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import SortableChoiceCard from "@/components/application/SortableChoiceCard";
import type { Slot } from "@/types/slot";

interface UniversitySelectionStepProps {
  selectedUniversities: SelectedUniversity[]; // 선택된 대학 목록 (read-only)
  onOpenSearch: () => void; // 모달 열기 요청 (파라미터 없음)
  onDelete: (choice: number) => void; // 개별 삭제
  onReorder: (universities: SelectedUniversity[]) => void; // 드래그앤드롭 결과 전달
  onReset: () => void; // 초기화 버튼 클릭
  onSubmit: () => void; // 완료 버튼 클릭
  displayLanguage?: string; // 화면에 표시할 어학 성적 문자열
  mode?: "new" | "edit"; // new: 신규 등록, edit: 수정
  extraScore?: string; // new 모드일 때만
  onExtraScoreChange?: (value: string) => void; // new 모드일 때만
  isSubmitting?: boolean; // CTA 버튼 로딩 표시용
}

interface SelectedUniversity {
  choice: number; // 1~5지망
  slot: Slot;
}

export default function UniversitySelectionStep({
  selectedUniversities,
  onOpenSearch,
  onDelete,
  onReorder,
  onReset,
  onSubmit,
  displayLanguage,
  mode = "new",
  extraScore = "",
  onExtraScoreChange,
  isSubmitting = false,
}: UniversitySelectionStepProps) {
  // 드래그 오버레이용 state만 유지 (순수 UI state)
  const [activeId, setActiveId] = useState<number | string | null>(null);

  // 센서 설정 - 마우스, 터치, 키보드 모두 지원
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동 후 드래그 활성화
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // 100ms 누르고 있으면 드래그 활성화
        tolerance: 8, // 8px 허용 오차
      },
    }),
    useSensor(KeyboardSensor)
  );

  // 드래그 시작 핸들러
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    // 드래그한 대학 찾기
    const draggedUniversity = selectedUniversities.find((u) => {
      const slotIdStr = `slot-${u.slot.slotId}`;
      return slotIdStr === activeIdStr;
    });

    if (!draggedUniversity) return;

    // 목표 choice 찾기
    let targetChoice: number;

    if (overIdStr.startsWith("empty-")) {
      // 빈 슬롯으로 드래그한 경우
      targetChoice = parseInt(overIdStr.replace("empty-", ""));
    } else if (overIdStr.startsWith("slot-")) {
      // 다른 대학이 있는 슬롯으로 드래그한 경우
      const overSlotId = parseInt(overIdStr.replace("slot-", ""));
      const overUniversity = selectedUniversities.find((u) => u.slot.slotId === overSlotId);
      if (!overUniversity) return;
      targetChoice = overUniversity.choice;
    } else {
      return;
    }

    const oldChoice = draggedUniversity.choice;

    if (oldChoice === targetChoice) return;

    // 새로운 배열 생성
    const updated = selectedUniversities.map((u) => {
      if (u.slot.slotId === draggedUniversity.slot.slotId) {
        // 드래그한 대학을 목표 choice로 이동
        return { ...u, choice: targetChoice };
      } else if (oldChoice < targetChoice && u.choice > oldChoice && u.choice <= targetChoice) {
        // 드래그한 대학보다 뒤에 있던 대학들을 앞으로 한 칸씩 이동
        return { ...u, choice: u.choice - 1 };
      } else if (oldChoice > targetChoice && u.choice >= targetChoice && u.choice < oldChoice) {
        // 드래그한 대학보다 앞에 있던 대학들을 뒤로 한 칸씩 이동
        return { ...u, choice: u.choice + 1 };
      }
      return u;
    });

    onReorder(updated);
  };

  // 1~5지망 배열 생성
  const choices = [1, 2, 3, 4, 5];

  return (
    <div className="flex-1">
      <div className="px-[20px] pt-[24px] pb-[100px]">
        {/* Step 타이틀 */}
        <div className="mb-[24px]">
          {mode === "new" && <p className="caption-1 text-primary-blue mb-[8px]">Step 02</p>}
          <div className="flex items-center justify-between">
            <h1 className="head-4">{mode === "edit" ? "지망 대학 변경하기" : "지망 대학 등록하기"}</h1>
            {/* 대학 검색 버튼 */}
            <button
              onClick={onOpenSearch}
              className="flex flex-shrink-0 cursor-pointer items-center gap-[6px] rounded-full bg-blue-50 px-[12px] py-[6px] transition-colors hover:bg-blue-100"
            >
              <SearchIcon size={16} className="text-primary-blue" />
              <span className="caption-1 text-primary-blue font-semibold whitespace-nowrap">대학 검색하기</span>
            </button>
          </div>
        </div>

        {/* 지망 카드 리스트 */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={choices.map((choice) => {
              const selected = selectedUniversities.find((u) => u.choice === choice);
              return selected ? `slot-${selected.slot.slotId}` : `empty-${choice}`;
            })}
            strategy={verticalListSortingStrategy}
          >
            <section className="mb-[32px] flex flex-col gap-[8px]">
              {choices.map((choice) => {
                const selected = selectedUniversities.find((u) => u.choice === choice);

                return (
                  <SortableChoiceCard
                    key={choice}
                    choice={choice}
                    selected={selected}
                    displayLanguage={displayLanguage}
                    onDelete={onDelete}
                  />
                );
              })}
            </section>
          </SortableContext>
          <DragOverlay>
            {activeId
              ? (() => {
                  // ID에서 슬롯 ID 추출 (slot- prefix 제거)
                  const getSlotId = (id: string | number): number => {
                    const idStr = String(id);
                    return idStr.startsWith("slot-") ? parseInt(idStr.replace("slot-", "")) : parseInt(idStr);
                  };

                  const activeSlotId = getSlotId(activeId);
                  const draggedUniversity = selectedUniversities.find((u) => u.slot.slotId === activeSlotId);
                  if (!draggedUniversity) return null;

                  const draggedChoice = draggedUniversity.choice;

                  return (
                    <div className="flex items-center gap-[12px] opacity-90">
                      <span className="medium-body-3">{draggedChoice}지망</span>
                      <div className="flex flex-1 items-center gap-[12px] rounded-[4px] border border-gray-300 bg-white p-[12px] shadow-lg">
                        <div className="relative h-[32px] w-[32px] flex-shrink-0 overflow-hidden rounded-full">
                          <SchoolLogoWithFallback
                            src={draggedUniversity.slot.logoUrl}
                            alt={draggedUniversity.slot.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <span className="medium-body-3 w-0 flex-1 truncate text-left">
                          {draggedUniversity.slot.name}
                        </span>
                        {displayLanguage && (
                          <span className="caption-2 bg-primary-blue rounded-[4px] px-[8px] py-[4px] text-white">
                            {displayLanguage}
                          </span>
                        )}
                      </div>
                      <div className="p-[4px]">
                        <DragHandleIcon size={20} />
                      </div>
                    </div>
                  );
                })()
              : null}
          </DragOverlay>
        </DndContext>

        <div className="flex items-center justify-center">
          {/* 지망 대학 초기화 버튼 */}
          <button
            onClick={onReset}
            className="caption-1 text-primary-blue mb-[32px] flex cursor-pointer items-center gap-[8px]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 4V10H7M19 16V10H13M18.364 14C17.6762 15.5026 16.5677 16.7759 15.1661 17.6666C13.7645 18.5574 12.1315 19.0291 10.4662 19.0267C8.80095 19.0242 7.16932 18.548 5.77026 17.6535C4.3712 16.7589 3.26658 15.4827 2.583 14M1.636 6C2.32379 4.49738 3.43231 3.22411 4.83391 2.33336C6.23551 1.44261 7.86849 0.970868 9.53383 0.973316C11.1992 0.975765 12.8308 1.45198 14.2299 2.34652C15.6289 3.24107 16.7336 4.51729 17.417 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            지망 대학 초기화
          </button>
        </div>
        {/* 가산점 입력 */}
        {mode === "new" && (
          <section>
            <label className="body-2 mb-[12px] block font-semibold">가산점</label>
            <input
              type="number"
              step="0.1"
              placeholder="가산점을 입력하세요 (선택)"
              value={extraScore}
              onChange={(e) => onExtraScoreChange?.(e.target.value)}
              className="body-2 focus:border-primary-blue w-full rounded-[8px] border border-gray-300 px-[16px] py-[14px] focus:outline-none"
            />
          </section>
        )}
      </div>

      <CTAButton message={mode === "edit" ? "수정 완료하기" : "완료하기"} onClick={onSubmit} isLoading={isSubmitting} />
    </div>
  );
}
