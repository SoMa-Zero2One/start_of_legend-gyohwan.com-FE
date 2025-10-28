"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormErrorHandler } from "@/hooks/useFormErrorHandler";
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
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SearchIcon from "@/components/icons/SearchIcon";
import DragHandleIcon from "@/components/icons/DragHandleIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import CTAButton from "@/components/common/CTAButton";
import ConfirmModal from "@/components/common/ConfirmModal";
import ApplicationSubmitModal from "@/components/application/ApplicationSubmitModal";
import UniversitySearchModal from "@/components/application/UniversitySearchModal";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import { submitApplication, updateApplication } from "@/lib/api/application";
import type { Slot } from "@/types/slot";
import type { SubmitApplicationRequest } from "@/types/application";
import type { Gpa, Language } from "@/types/grade";

interface UniversitySelectionStepProps {
  seasonId: number;
  gpaId?: number | null; // new 모드에서만 필수
  languageId?: number | null; // new 모드에서만 필수
  selectedGpa?: Gpa | null; // ApplicationSubmitModal에 표시할 GPA 정보
  selectedLanguage?: Language | null; // ApplicationSubmitModal에 표시할 어학 점수 정보
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
              src={selected.slot.logoUrl}
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
  selectedGpa,
  selectedLanguage,
  displayLanguage,
  slots,
  mode = "new",
  initialSelections = [],
}: UniversitySelectionStepProps) {
  const router = useRouter();
  const { tooltipMessage, shouldShake, showError, clearError } = useFormErrorHandler();

  // sessionStorage 키
  const STORAGE_KEY = `gyohwan_selected_universities_${seasonId}`;

  // sessionStorage에서 초기값 로드 (new 모드일 때만)
  const getInitialSelections = (): SelectedUniversity[] => {
    if (mode !== "new" || typeof window === "undefined") {
      return initialSelections;
    }

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load selections from sessionStorage:", error);
    }

    return initialSelections;
  };

  const [selectedUniversities, setSelectedUniversities] = useState<SelectedUniversity[]>(getInitialSelections);
  const [extraScore, setExtraScore] = useState<string>("");
  const [showSearch, setShowSearch] = useState(false);
  const [currentChoice, setCurrentChoice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [activeId, setActiveId] = useState<number | string | null>(null);

  // selectedUniversities 변경 시 sessionStorage에 저장 (new 모드일 때만)
  useEffect(() => {
    if (mode === "new" && typeof window !== "undefined") {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedUniversities));
      } catch (error) {
        console.error("Failed to save selections to sessionStorage:", error);
      }
    }
  }, [selectedUniversities, mode, seasonId]);

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

    setSelectedUniversities(updated);
  };

  // 저장 버튼 핸들러
  const handleSubmit = async () => {
    // 이전 에러 메시지 초기화
    clearError();

    // Validation (new 모드에서만 성적 정보 체크)
    if (mode === "new" && (!gpaId || !languageId)) {
      showError("성적 정보가 없습니다. Step 1부터 다시 진행해주세요.");
      return;
    }

    if (selectedUniversities.length === 0) {
      showError("최소 1개 이상의 지망 대학을 선택해주세요.");
      return;
    }

    // Check for sequential choices (1 → 2 → 3...)
    const sortedChoices = selectedUniversities.map((u) => u.choice).sort((a, b) => a - b);

    for (let i = 0; i < sortedChoices.length; i++) {
      if (sortedChoices[i] !== i + 1) {
        showError("1지망부터 순서대로 채워주세요.");
        return;
      }
    }

    // new 모드: ApplicationSubmitModal, edit 모드: ConfirmModal
    if (mode === "new") {
      setShowSubmitModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  // 최종 제출 실행
  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setShowSubmitModal(false);

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

        // 제출 성공 시 sessionStorage 클리어
        if (typeof window !== "undefined") {
          try {
            sessionStorage.removeItem(STORAGE_KEY);
          } catch (error) {
            console.error("Failed to clear sessionStorage:", error);
          }
        }
      }

      // 성공 후 실시간 경쟁률 페이지로 이동
      router.push(`/strategy-room/${seasonId}`);
    } catch (error) {
      console.error("Application submission error:", error);
      const errorMessage =
        mode === "edit"
          ? "지망 대학 수정에 실패했습니다. 다시 시도해주세요."
          : "지원서 제출에 실패했습니다. 다시 시도해주세요.";
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 다시 입력하기 (ApplicationSubmitModal에서 호출)
  const handleCancelSubmit = () => {
    setShowSubmitModal(false);
    // TODO: Step 1로 이동하는 로직은 부모에서 처리해야 함 (현재는 URL 변경으로 임시 처리)
    router.push(`/strategy-room/${seasonId}/applications/new?step=grade-registration`);
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
            {/* 빠른 추가 버튼 */}
            <button
              onClick={() => {
                setCurrentChoice(null); // null = 빠른 추가 모드
                setShowSearch(true);
              }}
              className="flex flex-shrink-0 cursor-pointer items-center gap-[6px] rounded-full bg-blue-50 px-[12px] py-[6px] transition-colors hover:bg-blue-100"
            >
              <SearchIcon size={16} className="text-primary-blue" />
              <span className="caption-1 text-primary-blue font-semibold whitespace-nowrap">대학 한 번에 선택하기</span>
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

      {/* 확인 모달 (edit 모드용) */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="지망 대학 수정"
        message="지망 대학을 수정하시겠습니까?"
        confirmText="수정하기"
        cancelText="취소"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* 제출 확인 모달 (new 모드용) */}
      {selectedGpa && selectedLanguage && (
        <ApplicationSubmitModal
          isOpen={showSubmitModal}
          gpa={selectedGpa}
          language={selectedLanguage}
          onConfirm={handleConfirmSubmit}
          onCancel={handleCancelSubmit}
        />
      )}
    </div>
  );
}
