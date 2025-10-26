"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SearchIcon from "@/components/icons/SearchIcon";
import DragHandleIcon from "@/components/icons/DragHandleIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import CTAButton from "@/components/common/CTAButton";
import ConfirmModal from "@/components/common/ConfirmModal";
import UniversitySearchModal from "@/components/application/UniversitySearchModal";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import { submitApplication, updateApplication } from "@/lib/api/application";
import type { Slot } from "@/types/slot";
import type { SubmitApplicationRequest } from "@/types/application";

interface UniversitySelectionStepProps {
  seasonId: number;
  gpaId?: number | null; // new 모드에서만 필수
  languageId?: number | null; // new 모드에서만 필수
  displayLanguage?: string; // 화면에 표시할 어학 성적 문자열 (예: "TOEIC 920")
  slots: Slot[];
  mode?: "new" | "edit"; // new: 신규 등록, edit: 수정
  initialSelections?: SelectedUniversity[]; // edit 모드일 때 초기 선택값
}

interface SelectedUniversity {
  choice: number; // 1~5지망
  slot: Slot;
}

interface SortableChoiceCardProps {
  choice: number;
  selected: SelectedUniversity | undefined;
  displayLanguage?: string;
  onChoiceCardClick: (choice: number) => void;
}

function SortableChoiceCard({ choice, selected, displayLanguage, onChoiceCardClick }: SortableChoiceCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: selected ? `slot-${selected.slot.slotId}` : `empty-${choice}`,
    disabled: !selected, // 빈 카드는 드래그 불가
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-[12px]">
      <span className="medium-body-3">{choice}지망</span>

      {selected ? (
        <button
          onClick={() => onChoiceCardClick(choice)}
          className="flex flex-1 cursor-pointer items-center gap-[12px] rounded-[4px] border border-gray-300 p-[12px] transition-colors hover:bg-gray-50"
        >
          {/* 대학 로고 */}
          <div className="relative h-[32px] w-[32px] flex-shrink-0 overflow-hidden rounded-full">
            <SchoolLogoWithFallback
              src={selected.slot.logoImageUrl}
              alt={selected.slot.name}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <span className="medium-body-3 w-0 flex-1 truncate text-left">{selected.slot.name}</span>
          {/* 어학 시험 태그 */}
          {displayLanguage && (
            <span className="caption-2 bg-primary-blue rounded-[4px] px-[8px] py-[4px] text-white">
              {displayLanguage}
            </span>
          )}
          {/* 수정 아이콘 */}
          <PencilIcon size={16} className="text-gray-500" />
        </button>
      ) : (
        <button
          onClick={() => onChoiceCardClick(choice)}
          className="flex-1 cursor-pointer rounded-[4px] border border-gray-300 p-[16px] text-left text-gray-700"
        >
          지망 대학을 추가하세요
        </button>
      )}

      {/* 드래그 핸들 */}
      <div
        {...attributes}
        {...listeners}
        className={`p-[4px] ${selected ? "cursor-grab active:cursor-grabbing" : "cursor-not-allowed opacity-30"}`}
      >
        <DragHandleIcon size={20} />
      </div>
    </div>
  );
}

export default function UniversitySelectionStep({
  seasonId,
  gpaId,
  languageId,
  displayLanguage,
  slots,
  mode = "new",
  initialSelections = [],
}: UniversitySelectionStepProps) {
  const router = useRouter();
  const [selectedUniversities, setSelectedUniversities] = useState<SelectedUniversity[]>(initialSelections);
  const [extraScore, setExtraScore] = useState<string>("");
  const [showSearch, setShowSearch] = useState(false);
  const [currentChoice, setCurrentChoice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState<string>("");
  const [shouldShake, setShouldShake] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  // 지망 카드 클릭 핸들러
  const handleChoiceCardClick = (choice: number) => {
    setCurrentChoice(choice);
    setShowSearch(true);
  };

  // 자동 정렬 함수 - 1번부터 연속되게 정렬
  const reorderChoices = (universities: SelectedUniversity[]): SelectedUniversity[] => {
    return universities.sort((a, b) => a.choice - b.choice).map((u, index) => ({ ...u, choice: index + 1 }));
  };

  // 대학 선택/토글 핸들러
  const handleSelectUniversity = (slot: Slot, shouldCloseModal: boolean = true) => {
    // 이미 선택된 대학인지 확인
    const existingIndex = selectedUniversities.findIndex((u) => u.slot.slotId === slot.slotId);

    if (existingIndex !== -1) {
      // 이미 선택됨 → 토글(제거)
      const updated = selectedUniversities.filter((u) => u.slot.slotId !== slot.slotId);
      const reordered = reorderChoices(updated);
      setSelectedUniversities(reordered);

      // 빠른 추가 모드(shouldCloseModal=false)가 아닐 때만 모달 닫기
      // 지망 수정 모드에서는 연쇄 삭제 방지를 위해 모달 닫음
      if (shouldCloseModal) {
        setShowSearch(false);
        setCurrentChoice(null);
      }
      return;
    }

    // 새로운 대학 선택
    if (currentChoice !== null) {
      // 특정 지망 카드 클릭 → 해당 지망에 배치
      const existingChoiceIndex = selectedUniversities.findIndex((u) => u.choice === currentChoice);

      if (existingChoiceIndex !== -1) {
        // 기존 choice에 이미 대학이 있으면 교체
        const updated = [...selectedUniversities];
        updated[existingChoiceIndex] = { choice: currentChoice, slot };
        setSelectedUniversities(updated);
      } else {
        // 새로운 선택 추가
        setSelectedUniversities([...selectedUniversities, { choice: currentChoice, slot }]);
      }

      // 특정 지망 카드 클릭했을 때만 모달 닫기
      if (shouldCloseModal) {
        setShowSearch(false);
        setCurrentChoice(null);
      }
    } else {
      // 돋보기 클릭 (빠른 추가) → 다음 빈 지망에 자동 배치
      // 이미 5개 선택된 경우 추가 불가
      if (selectedUniversities.length >= 5) {
        return;
      }

      // 1지망부터 확인하여 비어있는 첫 번째 지망 찾기
      let nextChoice = 1;
      for (let i = 1; i <= 5; i++) {
        const isOccupied = selectedUniversities.some((u) => u.choice === i);
        if (!isOccupied) {
          nextChoice = i;
          break;
        }
      }

      if (nextChoice <= 5) {
        setSelectedUniversities([...selectedUniversities, { choice: nextChoice, slot }]);
      }
      // 빠른 추가 모드에서는 모달 안 닫음
    }
  };

  // 지망 대학 초기화
  const handleReset = () => {
    setSelectedUniversities([]);
  };

  // 드래그 시작 핸들러
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id) return;

    // choice 순서대로 정렬된 배열
    const sortedUniversities = [...selectedUniversities].sort((a, b) => a.choice - b.choice);

    // ID에서 슬롯 ID 추출 (slot- prefix 제거)
    const getSlotId = (id: string | number): number => {
      const idStr = String(id);
      return idStr.startsWith("slot-") ? parseInt(idStr.replace("slot-", "")) : parseInt(idStr);
    };

    const activeSlotId = getSlotId(active.id);
    const overSlotId = getSlotId(over.id);

    const oldIndex = sortedUniversities.findIndex((u) => u.slot.slotId === activeSlotId);
    const newIndex = sortedUniversities.findIndex((u) => u.slot.slotId === overSlotId);

    if (oldIndex === -1 || newIndex === -1) return;

    // arrayMove로 배열 순서 변경
    const reordered = arrayMove(sortedUniversities, oldIndex, newIndex);

    // choice 값 재계산 (배열 인덱스 기반으로 1, 2, 3, 4, 5 부여)
    const withUpdatedChoices = reordered.map((u, index) => ({
      ...u,
      choice: index + 1,
    }));

    setSelectedUniversities(withUpdatedChoices);
  };

  // 저장 버튼 핸들러
  const handleSubmit = async () => {
    // Validation (new 모드에서만 성적 정보 체크)
    if (mode === "new" && (!gpaId || !languageId)) {
      setTooltipMessage("성적 정보가 없습니다. Step 1부터 다시 진행해주세요.");
      setShouldShake(true);
      setTimeout(() => {
        setTooltipMessage("");
        setShouldShake(false);
      }, 2000);
      return;
    }

    if (selectedUniversities.length === 0) {
      setTooltipMessage("최소 1개 이상의 지망 대학을 선택해주세요.");
      setShouldShake(true);
      setTimeout(() => {
        setTooltipMessage("");
        setShouldShake(false);
      }, 2000);
      return;
    }

    // Check for sequential choices (1 → 2 → 3...)
    const sortedChoices = selectedUniversities.map((u) => u.choice).sort((a, b) => a - b);

    for (let i = 0; i < sortedChoices.length; i++) {
      if (sortedChoices[i] !== i + 1) {
        setTooltipMessage("1지망부터 순서대로 채워주세요.");
        setShouldShake(true);
        setTimeout(() => {
          setTooltipMessage("");
          setShouldShake(false);
        }, 2000);
        return;
      }
    }

    // 최종 확인 모달 표시
    setShowConfirmModal(true);
  };

  // 최종 제출 실행
  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);

    try {
      setIsSubmitting(true);

      const choices = selectedUniversities.map((u) => ({
        choice: u.choice,
        slotId: u.slot.slotId,
      }));

      if (mode === "edit") {
        // 지망 대학 수정 API 호출 (choices만 전송)
        await updateApplication(seasonId, { choices });
      } else {
        // 신규 지원서 제출
        const requestData: SubmitApplicationRequest = {
          extraScore: extraScore ? parseFloat(extraScore) : 0,
          gpaId: gpaId!,
          languageId: languageId!,
          choices,
        };
        await submitApplication(seasonId, requestData);
      }

      // 성공 후 실시간 경쟁률 페이지로 이동
      router.push(`/strategy-room/${seasonId}`);
    } catch (error) {
      console.error("Application submission error:", error);
      const errorMessage =
        mode === "edit"
          ? "지망 대학 수정에 실패했습니다. 다시 시도해주세요."
          : "지원서 제출에 실패했습니다. 다시 시도해주세요.";
      setTooltipMessage(errorMessage);
      setShouldShake(true);
      setTimeout(() => {
        setTooltipMessage("");
        setShouldShake(false);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1~5지망 배열 생성
  const choices = [1, 2, 3, 4, 5];

  return (
    <div className="flex-1">
      <div className="px-[20px] pt-[24px] pb-[100px]">
        {/* Step 타이틀 */}
        <div className="mb-[24px] flex items-center justify-between gap-[12px]">
          <div className="flex-1">
            {mode === "new" && <p className="caption-1 text-primary-blue mb-[8px]">Step 02</p>}
            <h1 className="head-4">{mode === "edit" ? "지망 대학 변경하기" : "지망 대학 등록하기"}</h1>
          </div>
          {/* 빠른 추가 버튼 */}
          <button
            onClick={() => {
              setCurrentChoice(null); // null = 빠른 추가 모드
              setShowSearch(true);
            }}
            className="bg-primary-blue/15 flex flex-shrink-0 cursor-pointer items-center gap-[6px] rounded-[8px] px-[12px] py-[8px] transition-colors hover:bg-blue-100"
          >
            <SearchIcon size={18} className="text-primary-blue" />
            <span className="caption-1 text-primary-blue font-semibold">
              한번에 {mode === "edit" ? "변경" : "추가"}하기
            </span>
          </button>
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
                    onChoiceCardClick={handleChoiceCardClick}
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
                            src={draggedUniversity.slot.logoImageUrl}
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
                        <PencilIcon size={16} className="text-gray-500" />
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
            onClick={handleReset}
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
              onChange={(e) => setExtraScore(e.target.value)}
              className="body-2 focus:border-primary-blue w-full rounded-[8px] border border-gray-300 px-[16px] py-[14px] focus:outline-none"
            />
          </section>
        )}
      </div>

      <CTAButton
        message={mode === "edit" ? "수정 완료하기" : "완료하기"}
        onClick={handleSubmit}
        isLoading={isSubmitting}
        tooltipMessage={tooltipMessage}
        shouldShake={shouldShake}
      />

      {/* 검색 모달 */}
      <UniversitySearchModal
        isOpen={showSearch}
        onClose={() => {
          setShowSearch(false);
          setCurrentChoice(null);
        }}
        slots={slots}
        selectedUniversities={selectedUniversities.map((u) => ({
          choice: u.choice,
          slotId: u.slot.slotId,
        }))}
        onSelectUniversity={handleSelectUniversity}
        isQuickAdd={currentChoice === null}
        currentChoice={currentChoice}
        onSave={() => {
          // 저장 버튼 클릭 시 아무 작업 없이 모달만 닫기
          setShowSearch(false);
          setCurrentChoice(null);
        }}
      />

      {/* 확인 모달 */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title={mode === "edit" ? "지망 대학 수정" : "지원서 제출"}
        message={
          mode === "edit"
            ? "지망 대학을 수정하시겠습니까?"
            : "지원서를 제출하시겠습니까?\n제출 후에는 성적 정보를 수정할 수 없습니다."
        }
        confirmText={mode === "edit" ? "수정하기" : "제출하기"}
        cancelText="취소"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}
