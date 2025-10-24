"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SearchIcon from "@/components/icons/SearchIcon";
import DragHandleIcon from "@/components/icons/DragHandleIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import CTAButton from "@/components/common/CTAButton";
import ConfirmModal from "@/components/common/ConfirmModal";
import UniversitySearchModal from "@/components/application/UniversitySearchModal";
import { submitApplication } from "@/lib/api/application";
import type { Slot } from "@/types/slot";
import type { SubmitApplicationRequest } from "@/types/application";

interface UniversitySelectionStepProps {
  seasonId: number;
  gpaId: number | null;
  languageId: number | null;
  languageTest?: string | null;
  languageScore?: string | null;
  languageGrade?: string | null;
  slots: Slot[];
}

interface SelectedUniversity {
  choice: number; // 1~5지망
  slot: Slot;
}

export default function UniversitySelectionStep({
  seasonId,
  gpaId,
  languageId,
  languageTest,
  languageScore,
  languageGrade,
  slots,
}: UniversitySelectionStepProps) {
  const router = useRouter();
  const [selectedUniversities, setSelectedUniversities] = useState<SelectedUniversity[]>([]);
  const [extraScore, setExtraScore] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [currentChoice, setCurrentChoice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState<string>("");
  const [shouldShake, setShouldShake] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  // 드래그 앤 드롭 핸들러
  const handleDragStart = (e: React.DragEvent, choice: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", choice.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetChoice: number) => {
    e.preventDefault();
    const sourceChoice = parseInt(e.dataTransfer.getData("text/plain"));

    if (sourceChoice === targetChoice) return;

    // 두 지망의 대학을 교환
    const sourceUniv = selectedUniversities.find((u) => u.choice === sourceChoice);
    const targetUniv = selectedUniversities.find((u) => u.choice === targetChoice);

    if (!sourceUniv) return;

    const updated = selectedUniversities
      .map((u) => {
        if (u.choice === sourceChoice) {
          return targetUniv ? { ...targetUniv, choice: sourceChoice } : null;
        }
        if (u.choice === targetChoice) {
          return { ...sourceUniv, choice: targetChoice };
        }
        return u;
      })
      .filter((u): u is SelectedUniversity => u !== null);

    // targetChoice에 아무것도 없었던 경우
    if (!targetUniv) {
      const newUpdated = selectedUniversities
        .filter((u) => u.choice !== sourceChoice)
        .concat({ choice: targetChoice, slot: sourceUniv.slot });
      setSelectedUniversities(newUpdated);
    } else {
      setSelectedUniversities(updated);
    }
  };

  // 저장 버튼 핸들러
  const handleSubmit = async () => {
    // Validation
    if (!gpaId || !languageId) {
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

      const requestData: SubmitApplicationRequest = {
        extraScore: extraScore ? parseFloat(extraScore) : 0,
        gpaId: gpaId!,
        languageId: languageId!,
        choices: selectedUniversities.map((u) => ({
          choice: u.choice,
          slotId: u.slot.slotId,
        })),
      };

      await submitApplication(seasonId, requestData);

      // 성공 후 실시간 경쟁률 페이지로 이동
      router.push(`/strategy-room/${seasonId}`);
    } catch (error) {
      console.error("Application submission error:", error);
      setTooltipMessage("지원서 제출에 실패했습니다. 다시 시도해주세요.");
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
        <div className="mb-[24px] flex items-center justify-between">
          <div>
            <p className="caption-1 text-primary-blue mb-[8px]">Step 02</p>
            <h1 className="head-4">지망 대학 등록하기</h1>
          </div>
          {/* 검색 아이콘 - 빠른 추가용 */}
          <button
            onClick={() => {
              setCurrentChoice(null); // null = 빠른 추가 모드
              setShowSearch(true);
            }}
            className="cursor-pointer p-[8px]"
          >
            <SearchIcon size={24} />
          </button>
        </div>

        {/* 지망 카드 리스트 */}
        <section className="mb-[32px] flex flex-col gap-[8px]">
          {choices.map((choice) => {
            const selected = selectedUniversities.find((u) => u.choice === choice);

            return (
              <div
                key={choice}
                className="flex items-center gap-[12px]"
                draggable={!!selected}
                onDragStart={(e) => handleDragStart(e, choice)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, choice)}
              >
                <span className="medium-body-3">{choice}지망</span>

                {selected ? (
                  <button
                    onClick={() => handleChoiceCardClick(choice)}
                    className="flex flex-1 cursor-pointer items-center gap-[12px] rounded-[4px] border border-gray-300 p-[12px] transition-colors hover:bg-gray-50"
                  >
                    {/* 대학 로고 */}
                    <div className="relative h-[32px] w-[32px] flex-shrink-0 overflow-hidden rounded-full">
                      <Image
                        src="/icons/ico_profile.svg"
                        alt={selected.slot.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="medium-body-3 w-0 flex-1 truncate text-left">{selected.slot.name}</span>
                    {/* 어학 시험 태그 */}
                    {languageTest && (
                      <span className="caption-2 bg-primary-blue rounded-[4px] px-[8px] py-[4px] text-white">
                        {`${languageTest} ${languageGrade || ""} ${languageScore || ""}`.trim()}
                      </span>
                    )}
                    {/* 수정 아이콘 */}
                    <PencilIcon size={16} className="text-gray-500" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleChoiceCardClick(choice)}
                    className="flex-1 cursor-pointer rounded-[4px] border border-gray-300 p-[16px] text-left text-gray-700"
                  >
                    지망 대학을 추가하세요
                  </button>
                )}

                {/* 드래그 핸들 */}
                <div
                  className={`p-[4px] ${selected ? "cursor-grab active:cursor-grabbing" : "cursor-not-allowed opacity-30"}`}
                >
                  <DragHandleIcon size={20} />
                </div>
              </div>
            );
          })}
        </section>

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
      </div>

      <CTAButton
        message="완료하기"
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
        title="지원서 제출"
        message={"지원서를 제출하시겠습니까?\n제출 후에는 성적 정보를 수정할 수 없습니다."}
        confirmText="제출하기"
        cancelText="취소"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}
