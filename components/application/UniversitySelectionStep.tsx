"use client";

import { useMemo, useState } from "react";
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
import UniversitySearchList from "@/components/application/UniversitySearchList";
import { useIsDesktop } from "@/lib/hooks/useMediaQuery";
import type { Slot } from "@/types/slot";

interface UniversitySelectionStepProps {
  selectedUniversities: SelectedUniversity[];
  slots: Slot[];
  onSelectUniversity: (slot: Slot) => void;
  onOpenSearch: () => void;
  onDelete: (choice: number) => void;
  onReorder: (universities: SelectedUniversity[]) => void;
  onReset: () => void;
  onSubmit: () => void;
  displayLanguage?: string;
  mode?: "new" | "edit";
  extraScore?: string;
  onExtraScoreChange?: (value: string) => void;
  isSubmitting?: boolean;
  tooltipMessage?: string;
  shouldShake?: boolean;
}

interface SelectedUniversity {
  choice: number;
  slot: Slot;
}

export default function UniversitySelectionStep({
  selectedUniversities,
  slots,
  onSelectUniversity,
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
  tooltipMessage = "",
  shouldShake = false,
}: UniversitySelectionStepProps) {
  const [activeId, setActiveId] = useState<number | string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isDesktop = useIsDesktop();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    const draggedUniversity = selectedUniversities.find((u) => `slot-${u.slot.slotId}` === activeIdStr);
    if (!draggedUniversity) return;

    let targetChoice: number;

    if (overIdStr.startsWith("empty-")) {
      targetChoice = parseInt(overIdStr.replace("empty-", ""), 10);
    } else if (overIdStr.startsWith("slot-")) {
      const overSlotId = parseInt(overIdStr.replace("slot-", ""), 10);
      const overUniversity = selectedUniversities.find((u) => u.slot.slotId === overSlotId);
      if (!overUniversity) return;
      targetChoice = overUniversity.choice;
    } else {
      return;
    }

    const oldChoice = draggedUniversity.choice;
    if (oldChoice === targetChoice) return;

    const updated = selectedUniversities.map((u) => {
      if (u.slot.slotId === draggedUniversity.slot.slotId) {
        return { ...u, choice: targetChoice };
      } else if (oldChoice < targetChoice && u.choice > oldChoice && u.choice <= targetChoice) {
        return { ...u, choice: u.choice - 1 };
      } else if (oldChoice > targetChoice && u.choice >= targetChoice && u.choice < oldChoice) {
        return { ...u, choice: u.choice + 1 };
      }
      return u;
    });

    onReorder(updated);
  };

  const choices = [1, 2, 3, 4, 5];

  const filteredSlots = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return slots;
    return slots.filter((slot) => {
      const name = slot.name?.toLowerCase() ?? "";
      const country = slot.country?.toLowerCase() ?? "";
      return name.includes(query) || country.includes(query);
    });
  }, [slots, searchQuery]);

  const selectedChoiceMap = useMemo(() => {
    const map: Record<number, number> = {};
    selectedUniversities.forEach((selected) => {
      map[selected.slot.slotId] = selected.choice;
    });
    return map;
  }, [selectedUniversities]);

  const renderChoiceList = (sectionClassName = "mb-[32px] flex flex-col gap-[8px]") => (
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
        <section className={sectionClassName}>
          {choices.map((choice) => {
            const selected = selectedUniversities.find((u) => u.choice === choice);

            return (
              <SortableChoiceCard
                key={choice}
                choice={choice}
                selected={selected}
                displayLanguage={displayLanguage}
                onDelete={onDelete}
                onOpenSearch={onOpenSearch}
              />
            );
          })}
        </section>
      </SortableContext>
      <DragOverlay>
        {activeId
          ? (() => {
              const slotIdFromId = (id: string | number): number => {
                const idStr = String(id);
                return idStr.startsWith("slot-") ? parseInt(idStr.replace("slot-", ""), 10) : parseInt(idStr, 10);
              };

              const activeSlotId = slotIdFromId(activeId);
              const draggedUniversity = selectedUniversities.find((u) => u.slot.slotId === activeSlotId);
              if (!draggedUniversity) return null;

              const draggedChoice = draggedUniversity.choice;
              const draggedName = draggedUniversity.slot.name ?? "정보 없음";

              return (
                <div className="flex items-center gap-[12px] opacity-90">
                  <span className="medium-body-3">{draggedChoice}지망</span>
                  <div className="flex flex-1 items-center gap-[12px] rounded-[4px] border border-gray-300 bg-white p-[12px] shadow-lg">
                    <div className="relative h-[32px] w-[32px] flex-shrink-0 overflow-hidden rounded-full">
                      <SchoolLogoWithFallback
                        src={draggedUniversity.slot.logoUrl}
                        alt={draggedName}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="medium-body-3 w-0 flex-1 truncate text-left">{draggedName}</span>
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
  );

  const renderMobileLayout = () => (
    <div className="flex-1">
      <div className="px-[20px] pt-[24px] pb-[100px]">
        <div className="mb-[24px]">
          {mode === "new" && <p className="caption-1 text-primary-blue mb-[8px]">Step 02</p>}
          <div className="flex items-center justify-between">
            <h1 className="head-4">{mode === "edit" ? "지망 대학 변경하기" : "지망 대학 등록하기"}</h1>
            <button
              onClick={onOpenSearch}
              className="flex flex-shrink-0 cursor-pointer items-center gap-[6px] rounded-full bg-blue-50 px-[12px] py-[6px] transition-colors hover:bg-blue-100"
            >
              <SearchIcon size={16} className="text-primary-blue" />
              <span className="caption-1 text-primary-blue font-semibold whitespace-nowrap">대학 검색하기</span>
            </button>
          </div>
        </div>

        {renderChoiceList()}

        <div className="flex items-center justify-center">
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

      <CTAButton
        message={mode === "edit" ? "수정 완료하기" : "완료하기"}
        onClick={onSubmit}
        isLoading={isSubmitting}
        tooltipMessage={tooltipMessage}
        shouldShake={shouldShake}
      />
    </div>
  );

  const desktopButtonLabel = mode === "edit" ? "수정 완료하기" : "완료하기";

  const renderDesktopLayout = () => (
    <div className="flex flex-1 flex-col">
      <div className="px-[40px] pt-[32px] pb-[40px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[24px]">
          <div>
            <p className="caption-1 text-primary-blue mb-[8px] text-[20px] font-bold">Step 02</p>
            <h1 className="head-4 mb-[16px] text-[36px]">
              {mode === "edit" ? "지망 대학 변경하기" : "지망 대학 등록하기"}
            </h1>
          </div>
          <div className="flex items-start gap-[32px]">
            <div className="flex-1 rounded-[16px] border border-gray-200 bg-white p-[32px] shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
              <div className="mb-[24px] flex items-center justify-between">
                <p className="subhead-2">지망 대학</p>
                <button
                  onClick={onReset}
                  className="caption-1 text-primary-blue flex cursor-pointer items-center gap-[6px]"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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

              {renderChoiceList("mb-[32px] flex flex-col gap-[16px]")}

              {mode === "new" && (
                <section className="mt-[16px]">
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

              <div className="mt-[24px] flex justify-end">
                <button
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className={`btn-primary body-1 min-w-[180px] rounded-[8px] px-[24px] py-[12px] font-semibold shadow-[0_12px_24px_rgba(5,109,255,0.3)] ${
                    shouldShake ? "animate-shake" : ""
                  }`}
                >
                  {isSubmitting ? "처리 중..." : desktopButtonLabel}
                </button>
              </div>
              {tooltipMessage && <p className="text-error-red mt-[8px] text-right text-sm">{tooltipMessage}</p>}
            </div>

            <div className="flex w-full max-w-[360px] flex-col rounded-[16px] border border-gray-200 bg-white p-[24px] shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <h3 className="subhead-2">지망 대학</h3>
                <span className="caption-2 text-gray-500">{selectedUniversities.length}/5 선택</span>
              </div>
              <div className="relative mt-[16px]">
                <SearchIcon size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="대학명 또는 국가로 검색"
                  className="body-3 w-full rounded-full border border-gray-300 py-[10px] pr-[16px] pl-[38px] focus:border-black focus:outline-none"
                />
              </div>
              <div className="mt-[16px] max-h-[60vh] min-h-0 flex-1 overflow-y-auto pr-[4px]">
                <UniversitySearchList
                  slots={filteredSlots}
                  selectedSlotChoices={selectedChoiceMap}
                  onSelectUniversity={onSelectUniversity}
                  variant="panel"
                  emptyMessage={slots.length === 0 ? "등록된 대학이 없습니다." : "검색 결과가 없습니다."}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return isDesktop ? renderDesktopLayout() : renderMobileLayout();
}
