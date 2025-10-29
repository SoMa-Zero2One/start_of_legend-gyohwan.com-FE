"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import ProgressBar from "@/components/common/ProgressBar";
import ConfirmModal from "@/components/common/ConfirmModal";
import GradeRegistrationStep from "@/components/application/GradeRegistrationStep";
import UniversitySelectionStep from "@/components/application/UniversitySelectionStep";
import UniversitySearchModal from "@/components/application/UniversitySearchModal";
import ApplicationSubmitModal from "@/components/application/ApplicationSubmitModal";
import { getSeasonSlots } from "@/lib/api/slot";
import { getGpas } from "@/lib/api/gpa";
import { getLanguages } from "@/lib/api/language";
import { checkEligibility } from "@/lib/api/season";
import { submitApplication } from "@/lib/api/application";
import { useFormErrorHandler } from "@/hooks/useFormErrorHandler";
import type { Gpa, Language } from "@/types/grade";
import type { Slot } from "@/types/slot";
import type { SubmitApplicationRequest } from "@/types/application";

type Step = "grade-registration" | "university-selection";

type ModalType = "university-search" | "submit" | "eligibility" | null;

interface SelectedUniversity {
  choice: number; // 1~5지망
  slot: Slot;
}

function ApplicationNewContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const seasonId = parseInt(params.seasonId as string);

  // URL 쿼리 파라미터에서 step 읽기
  const step = (searchParams.get("step") as Step) || "grade-registration";

  const [isLoading, setIsLoading] = useState(true);
  const [gpaId, setGpaId] = useState<number | null>(null);
  const [languageId, setLanguageId] = useState<number | null>(null);
  const [existingGpa, setExistingGpa] = useState<Gpa | null>(null);
  const [existingLanguage, setExistingLanguage] = useState<Language | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);

  // 모달 관리
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [eligibilityErrorMessage, setEligibilityErrorMessage] = useState("");

  // 대학 선택 관리
  const [selectedUniversities, setSelectedUniversities] = useState<SelectedUniversity[]>([]);
  const [extraScore, setExtraScore] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 에러 핸들러
  const { tooltipMessage, shouldShake, showError } = useFormErrorHandler();

  // 초기 데이터 로드 및 hasApplied 확인
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        setIsLoading(true);

        // 1. 지원 가능 여부 확인 (eligibility)
        try {
          await checkEligibility(seasonId);
        } catch (err) {
          // 403 에러 시 모달 표시
          const errorMessage = (err as { detail?: string }).detail || "해당 시즌은 귀하의 학교에서 지원할 수 없습니다.";
          setEligibilityErrorMessage(errorMessage);
          setActiveModal("eligibility");
          return;
        }

        // 2. hasApplied 확인 및 slots 데이터 저장
        const slotsData = await getSeasonSlots(seasonId);
        setSlots(slotsData.slots);

        if (slotsData.hasApplied) {
          // 이미 지원한 경우 -> 실시간 경쟁률 페이지로 리다이렉트
          router.replace(`/strategy-room/${seasonId}`);
          return;
        }

        // 2. 기존 성적 데이터 확인 (배열의 마지막 값이 최신 값)
        const [gpasData, languagesData] = await Promise.all([getGpas(), getLanguages()]);

        if (gpasData.gpas.length > 0) {
          const gpa = gpasData.gpas[gpasData.gpas.length - 1];
          setGpaId(gpa.gpaId);
          setExistingGpa(gpa);
        }

        if (languagesData.languages.length > 0) {
          const language = languagesData.languages[languagesData.languages.length - 1];
          setLanguageId(language.languageId);
          setExistingLanguage(language);
        }
      } catch (error) {
        console.error("Application status check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkApplicationStatus();
  }, [seasonId, router, step]);

  // sessionStorage 키
  const STORAGE_KEY = `gyohwan_selected_universities_${seasonId}`;

  // sessionStorage에서 초기값 로드
  useEffect(() => {
    if (step === "university-selection" && typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSelectedUniversities(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load selections from sessionStorage:", error);
      }
    }
  }, [step, seasonId]);

  // selectedUniversities 변경 시 sessionStorage에 저장
  useEffect(() => {
    if (step === "university-selection" && typeof window !== "undefined") {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedUniversities));
      } catch (error) {
        console.error("Failed to save selections to sessionStorage:", error);
      }
    }
  }, [selectedUniversities, step, seasonId]);

  const handleGradeSubmit = (newGpaId: number, newLanguageId: number) => {
    setGpaId(newGpaId);
    setLanguageId(newLanguageId);
    router.push(`/strategy-room/${seasonId}/applications/new?step=university-selection`);
  };

  // 모달 열기 핸들러
  const handleOpenSearch = () => {
    setActiveModal("university-search");
  };

  // 자동 정렬 함수 - 1번부터 연속되게 정렬
  const reorderChoices = (universities: SelectedUniversity[]): SelectedUniversity[] => {
    return universities.sort((a, b) => a.choice - b.choice).map((u, index) => ({ ...u, choice: index + 1 }));
  };

  // 대학 선택 핸들러 (항상 빠른 추가 모드)
  const handleSelectUniversity = (slot: Slot, shouldCloseModal: boolean = true) => {
    // 이미 선택된 대학인지 확인
    const existingIndex = selectedUniversities.findIndex((u) => u.slot.slotId === slot.slotId);

    if (existingIndex !== -1) {
      // 이미 선택됨 → 토글(제거)
      const updated = selectedUniversities.filter((u) => u.slot.slotId !== slot.slotId);
      const reordered = reorderChoices(updated);
      setSelectedUniversities(reordered);
      return;
    }

    // 새로운 대학 선택 → 다음 빈 지망에 자동 배치
    if (selectedUniversities.length >= 5) {
      return;
    }

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
  };

  // 개별 삭제 핸들러
  const handleDelete = (choice: number) => {
    const updated = selectedUniversities.filter((u) => u.choice !== choice);
    const reordered = reorderChoices(updated);
    setSelectedUniversities(reordered);
  };

  // 지망 대학 초기화
  const handleReset = () => {
    setSelectedUniversities([]);
  };

  // 드래그앤드롭 순서 변경
  const handleReorder = (reordered: SelectedUniversity[]) => {
    setSelectedUniversities(reordered);
  };

  // 제출 버튼 핸들러
  const handleSubmit = () => {
    // Validation
    if (!gpaId || !languageId) {
      showError("성적 정보가 없습니다. Step 1부터 다시 진행해주세요.");
      return;
    }

    if (selectedUniversities.length === 0) {
      showError("최소 1개 이상의 지망 대학을 선택해주세요.");
      return;
    }

    // 1지망부터 순서대로 채워졌는지 확인
    const sortedChoices = selectedUniversities.map((u) => u.choice).sort((a, b) => a - b);
    for (let i = 0; i < sortedChoices.length; i++) {
      if (sortedChoices[i] !== i + 1) {
        showError("1지망부터 순서대로 채워주세요.");
        return;
      }
    }

    setActiveModal("submit");
  };

  // 최종 제출 실행
  const handleConfirmSubmit = async () => {
    setActiveModal(null);

    try {
      setIsSubmitting(true);

      const choices = selectedUniversities.map((u) => ({
        choice: u.choice,
        slotId: u.slot.slotId,
      }));

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

      // 성공 후 실시간 경쟁률 페이지로 이동
      router.push(`/strategy-room/${seasonId}`);
    } catch (error) {
      console.error("Application submission error:", error);
      showError("지원서 제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 다시 입력하기 (ApplicationSubmitModal에서 호출)
  const handleCancelSubmit = () => {
    setActiveModal(null);
    router.push(`/strategy-room/${seasonId}/applications/new?step=grade-registration`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="성적 공유" showPrevButton showBorder />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="성적 공유" showPrevButton />
      <ProgressBar currentStep={step === "university-selection" ? 2 : 1} totalSteps={2} />

      {/* Step 1: 성적 등록 */}
      {step === "grade-registration" && (
        <GradeRegistrationStep
          seasonId={seasonId}
          existingGpa={existingGpa}
          existingLanguage={existingLanguage}
          onSubmit={handleGradeSubmit}
        />
      )}

      {/* Step 2: 지망 대학 등록 */}
      {step === "university-selection" && (
        <>
          <UniversitySelectionStep
            selectedUniversities={selectedUniversities}
            onOpenSearch={handleOpenSearch}
            onDelete={handleDelete}
            onReorder={handleReorder}
            onReset={handleReset}
            onSubmit={handleSubmit}
            displayLanguage={
              existingLanguage
                ? `${existingLanguage.testType} ${existingLanguage.grade || ""} ${existingLanguage.score || ""}`.trim()
                : undefined
            }
            mode="new"
            extraScore={extraScore}
            onExtraScoreChange={setExtraScore}
            isSubmitting={isSubmitting}
            tooltipMessage={tooltipMessage}
            shouldShake={shouldShake}
          />

          {/* 대학 검색 모달 */}
          <UniversitySearchModal
            isOpen={activeModal === "university-search"}
            onClose={() => {
              setActiveModal(null);
            }}
            slots={slots}
            selectedUniversities={selectedUniversities.map((u) => ({
              choice: u.choice,
              slotId: u.slot.slotId,
            }))}
            onSelectUniversity={handleSelectUniversity}
            isQuickAdd={true}
            currentChoice={null}
            onSave={() => {
              setActiveModal(null);
            }}
          />

          {/* 제출 확인 모달 */}
          {existingGpa && existingLanguage && (
            <ApplicationSubmitModal
              isOpen={activeModal === "submit"}
              gpa={existingGpa}
              language={existingLanguage}
              onConfirm={handleConfirmSubmit}
              onCancel={handleCancelSubmit}
            />
          )}
        </>
      )}

      {/* 지원 불가 모달 */}
      <ConfirmModal
        isOpen={activeModal === "eligibility"}
        title="지원할 수 없습니다"
        message={eligibilityErrorMessage}
        confirmText="확인"
        onConfirm={() => {
          setActiveModal(null);
          router.replace(`/strategy-room/${seasonId}`);
        }}
        onCancel={() => {
          setActiveModal(null);
          router.replace(`/strategy-room/${seasonId}`);
        }}
      />
    </div>
  );
}

export default function ApplicationNewPage() {
  return (
    <Suspense fallback={null}>
      <ApplicationNewContent />
    </Suspense>
  );
}
