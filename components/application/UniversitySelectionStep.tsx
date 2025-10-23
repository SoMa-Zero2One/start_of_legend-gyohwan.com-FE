"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchIcon from "@/components/icons/SearchIcon";
import DragHandleIcon from "@/components/icons/DragHandleIcon";
import CTAButton from "@/components/common/CTAButton";
import { submitApplication } from "@/lib/api/application";
import type { Slot } from "@/types/slot";
import type { SubmitApplicationRequest } from "@/types/application";

interface UniversitySelectionStepProps {
  seasonId: number;
  gpaId: number | null;
  languageId: number | null;
  slots: Slot[];
}

interface SelectedUniversity {
  choice: number; // 1~5지망
  slot: Slot;
}

export default function UniversitySelectionStep({ seasonId, gpaId, languageId, slots }: UniversitySelectionStepProps) {
  const router = useRouter();
  const [selectedUniversities, setSelectedUniversities] = useState<SelectedUniversity[]>([]);
  const [extraScore, setExtraScore] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState<string>("");
  const [shouldShake, setShouldShake] = useState(false);

  // 지망 카드 클릭 핸들러
  const handleChoiceCardClick = (choice: number) => {
    setShowSearch(true);
    // TODO: 검색 모달 열기
  };

  // 지망 대학 초기화
  const handleReset = () => {
    setSelectedUniversities([]);
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

    // TODO: 최종 확인 모달 표시
    const confirmed = confirm(
      "지원서를 제출하시겠습니까?\n제출 후에는 성적 정보를 수정할 수 없습니다."
    );

    if (!confirmed) return;

    try {
      setIsSubmitting(true);

      const requestData: SubmitApplicationRequest = {
        extraScore: extraScore ? parseFloat(extraScore) : 0,
        gpaId,
        languageId,
        choices: selectedUniversities.map((u) => ({
          choice: u.choice,
          slotId: u.slot.slotId,
        })),
      };

      await submitApplication(seasonId, requestData);

      // TODO: 성공 후 실시간 경쟁률 페이지로 이동
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
          {/* 검색 아이콘 */}
          <button onClick={() => setShowSearch(true)} className="p-[8px]">
            <SearchIcon size={24} />
          </button>
        </div>

        {/* 지망 카드 리스트 */}
        <section className="mb-[32px] flex flex-col gap-[8px]">
          {choices.map((choice) => {
            const selected = selectedUniversities.find((u) => u.choice === choice);

            return (
              <div key={choice} className="flex items-center gap-[12px]">
                <span className="medium-body-3">{choice}지망</span>

                {selected ? (
                  <div className="flex flex-1 items-center gap-[12px] border border-gray-300">
                    {/* 대학 로고 (임시) */}
                    <div className="h-[24px] w-[24px] rounded-full bg-gray-300" />
                    <span className="flex-1">{selected.slot.name}</span>
                    {/* 어학 시험 태그 (임시) */}
                    <span className="caption-2 bg-primary-blue rounded-[4px] px-[8px] py-[4px] text-white">
                      TOEIC 850
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleChoiceCardClick(choice)}
                    className="flex-1 rounded-[4px] border border-gray-300 p-[16px] text-left text-gray-700"
                  >
                    지망 대학을 추가하세요
                  </button>
                )}

                {/* 드래그 핸들 */}
                <button className="p-[4px]">
                  <DragHandleIcon size={20} />
                </button>
              </div>
            );
          })}
        </section>

        <div className="flex items-center justify-center">
          {/* 지망 대학 초기화 버튼 */}
          <button onClick={handleReset} className="caption-1 text-primary-blue mb-[32px] flex items-center gap-[8px]">
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
    </div>
  );
}
