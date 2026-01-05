"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import ProgressBar from "@/components/common/ProgressBar";
import GradeRegistrationStep from "@/components/application/GradeRegistrationStep";
import UniversitySelectionStep from "@/components/application/UniversitySelectionStep";
import UniversitySearchModal from "@/components/application/UniversitySearchModal";
import ApplicationSubmitModal from "@/components/application/ApplicationSubmitModal";
import { getSeasonSlots } from "@/lib/api/slot";
import { getGpas } from "@/lib/api/gpa";
import { getLanguages } from "@/lib/api/language";
import { checkEligibility } from "@/lib/api/season";
import { submitApplication } from "@/lib/api/application";
import { revalidateHomePage } from "@/app/actions/home";
import { handleApiError } from "@/lib/utils/apiError";
import { trackEvent } from "@/lib/analytics/gtag";
import { useFormErrorHandler } from "@/hooks/useFormErrorHandler";
import { useModalHistory } from "@/hooks/useModalHistory";
import type { Gpa, Language } from "@/types/grade";
import type { Slot } from "@/types/slot";
import type { SubmitApplicationRequest } from "@/types/application";

type Step = "grade-registration" | "university-selection";

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
  const [seasonName, setSeasonName] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState<boolean | null>(null);

  // 모달 히스토리 관리
  const universitySearch = useModalHistory({ modalKey: "university-search" });
  const submit = useModalHistory({ modalKey: "submit" });

  // 대학 선택 관리
  const [selectedUniversities, setSelectedUniversities] = useState<SelectedUniversity[]>([]);
  const [extraScore, setExtraScore] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTrackedStartRef = useRef(false);
  const gradeShareStartSessionKey = `gyohwan_grade_share_start_${seasonId}`;

  // 폼 에러 핸들러
  const { tooltipMessage, shouldShake, showMessage } = useFormErrorHandler();
  const reportValidationError = (field: string, reason: string) => {
    trackEvent("grade_share_validation_error", {
      season_id: seasonId,
      season_name: seasonName,
      step: "university_selection",
      field,
      reason,
    });
  };

  const reportSubmitError = (errorCode: string) => {
    trackEvent("grade_share_error", {
      season_id: seasonId,
      season_name: seasonName,
      step: "university_selection",
      error_code: errorCode,
    });
  };

  // 초기 데이터 로드 및 hasApplied 확인
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        setIsLoading(true);

        // 1. 지원 가능 여부 확인 (eligibility)
        try {
          await checkEligibility(seasonId);
        } catch (error) {
          const errorMessage = handleApiError(error) || "해당 시즌은 귀하의 학교에서 지원할 수 없습니다.";
          router.replace(`/strategy-room/${seasonId}?reason=not-eligible`);
          return;
        }

        // 2. hasApplied 확인 및 slots 데이터 저장
        const slotsData = await getSeasonSlots(seasonId);
        setSlots(slotsData.slots);
        setSeasonName(slotsData.seasonName ?? null);
        setHasApplied(slotsData.hasApplied);

        if (slotsData.hasApplied) {
          // 이미 지원한 경우 -> 실시간 경쟁률 페이지로 리다이렉트
          router.replace(`/strategy-room/${seasonId}`);
          return;
        }

        // 2. 기존 성적 데이터 확인 (배열의 마지막 값이 최신 값)
        try {
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
          console.error("Failed to fetch GPA or language data:", error);
          const errorMessage = handleApiError(error);
          showMessage(errorMessage);
          return;
        }
      } catch (error) {
        console.error("Application status check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkApplicationStatus();
    // showMessage는 커스텀 훅에서 생성된 함수라 dependency에 추가하지 않음.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasonId, router, step]);

  useEffect(() => {
    if (isLoading) return;
    if (step !== "grade-registration") return;
    if (hasApplied === null) return;
    if (hasApplied) return;
    if (hasTrackedStartRef.current) return;
    if (typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem(gradeShareStartSessionKey)) return;
      } catch {
        // sessionStorage may be unavailable
      }
    }

    const didTrack = trackEvent("grade_share_start", {
      season_id: seasonId,
      season_name: seasonName,
    });
    if (didTrack) {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(gradeShareStartSessionKey, "1");
        } catch {
          // sessionStorage may be unavailable
        }
      }
      hasTrackedStartRef.current = true;
    }
  }, [hasApplied, isLoading, seasonId, seasonName, gradeShareStartSessionKey, step]);

  // sessionStorage 키
  const STORAGE_KEY = `gyohwan_selected_universities_${seasonId}`;

  // sessionStorage에서 초기값 로드
  useEffect(() => {
    if (step === "university-selection" && typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);

          // 타입 검증: SelectedUniversity[] 형태인지 확인
          if (
            Array.isArray(parsed) &&
            parsed.every(
              (item) =>
                typeof item === "object" &&
                item !== null &&
                typeof item.choice === "number" &&
                typeof item.slot === "object" &&
                item.slot !== null &&
                typeof item.slot.slotId === "number"
            )
          ) {
            setSelectedUniversities(parsed);
          } else {
            // 잘못된 데이터 형식이면 sessionStorage 클리어
            console.warn("Invalid data format in sessionStorage, clearing...");
            sessionStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Failed to load selections from sessionStorage:", error);
        // JSON 파싱 실패 시에도 sessionStorage 클리어
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
    // Warning: exhaustive-deps 경고 해결 (방법 C 선택)
    // STORAGE_KEY는 seasonId로부터 파생되는 문자열이므로 seasonId가 dependency에 있으면 충분
    // STORAGE_KEY를 dependency에 추가하면 매 렌더링마다 새 문자열이 생성되어 불필요한 재실행 발생
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Warning: exhaustive-deps 경고 해결 (방법 C 선택)
    // STORAGE_KEY는 seasonId로부터 파생되는 문자열이므로 seasonId가 dependency에 있으면 충분
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUniversities, step, seasonId]);

  const handleGradeSubmit = (newGpaId: number, newLanguageId: number) => {
    setGpaId(newGpaId);
    setLanguageId(newLanguageId);
    router.push(`/strategy-room/${seasonId}/applications/new?step=university-selection`);
  };

  // 모달 열기 핸들러
  const handleOpenSearch = () => {
    universitySearch.openModal();
  };

  // 자동 정렬 함수 - 1번부터 연속되게 정렬
  const reorderChoices = (universities: SelectedUniversity[]): SelectedUniversity[] => {
    return universities.sort((a, b) => a.choice - b.choice).map((u, index) => ({ ...u, choice: index + 1 }));
  };

  // 대학 선택 핸들러 (항상 빠른 추가 모드)
  // Warning: no-unused-vars 경고 해결 - shouldCloseModal 파라미터 제거
  // 이유: 이 페이지에서는 항상 빠른 추가 모드로 동작하여 shouldCloseModal을 사용하지 않음
  // UniversitySearchModal의 onSelectUniversity는 optional 파라미터이므로 제거해도 타입 안전
  const handleSelectUniversity = (slot: Slot) => {
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
      reportValidationError("gpa_language", "missing_gpa_language");
      showMessage("성적 정보가 없습니다. Step 1부터 다시 진행해주세요.");
      return;
    }

    if (selectedUniversities.length === 0) {
      reportValidationError("choices", "empty");
      showMessage("최소 1개 이상의 지망 대학을 선택해주세요.");
      return;
    }

    // 1지망부터 순서대로 채워졌는지 확인
    const sortedChoices = selectedUniversities.map((u) => u.choice).sort((a, b) => a - b);
    for (let i = 0; i < sortedChoices.length; i++) {
      if (sortedChoices[i] !== i + 1) {
        reportValidationError("choices", "non_sequential");
        showMessage("1지망부터 순서대로 채워주세요.");
        return;
      }
    }

    trackEvent("grade_share_step_submit", {
      season_id: seasonId,
      season_name: seasonName,
      step: "university_selection",
      has_extra_score: Boolean(extraScore),
    });
    submit.openModal();
  };

  // 최종 제출 실행
  const handleConfirmSubmit = async () => {
    // 보안: URL 조작으로 모달을 열었을 경우를 대비한 재검증
    if (!gpaId || !languageId) {
      submit.closeModal({ skipNavigation: true });
      reportValidationError("gpa_language", "missing_gpa_language");
      showMessage("성적 정보가 없습니다. 다시 입력해주세요.");
      router.replace(`/strategy-room/${seasonId}/applications/new?step=grade-registration`);
      return;
    }

    if (selectedUniversities.length === 0) {
      submit.closeModal({ skipNavigation: true });
      reportValidationError("choices", "empty");
      showMessage("최소 1개 이상의 지망 대학을 선택해주세요.");
      return;
    }

    // 1지망부터 순서대로 채워졌는지 확인
    const sortedChoices = selectedUniversities.map((u) => u.choice).sort((a, b) => a - b);
    for (let i = 0; i < sortedChoices.length; i++) {
      if (sortedChoices[i] !== i + 1) {
        submit.closeModal({ skipNavigation: true });
        reportValidationError("choices", "non_sequential");
        showMessage("1지망부터 순서대로 채워주세요.");
        return;
      }
    }

    submit.closeModal();

    try {
      setIsSubmitting(true);

      const choices = selectedUniversities.map((u) => ({
        choice: u.choice,
        slotId: u.slot.slotId,
      }));

      const requestData: SubmitApplicationRequest = {
        extraScore: extraScore ? parseFloat(extraScore) : 0,
        gpaId: gpaId,
        languageId: languageId,
        choices,
      };

      await submitApplication(seasonId, requestData);
      trackEvent("grade_share_complete", {
        season_id: seasonId,
        season_name: seasonName,
        choices_count: selectedUniversities.length,
        has_extra_score: Boolean(extraScore),
      });

      try {
        await revalidateHomePage();
      } catch (revalidateError) {
        console.warn("Home revalidate failed:", revalidateError);
      }

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
      const errorMessage = handleApiError(error);
      reportSubmitError("submit_application_failed");
      showMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 다시 입력하기 (ApplicationSubmitModal에서 호출)
  const handleCancelSubmit = () => {
    submit.closeModal({ skipNavigation: true });
    router.replace(`/strategy-room/${seasonId}/applications/new?step=grade-registration`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="성적 공유" showPrevButton showHomeButton showBorder fallbackUrl={`/strategy-room/${seasonId}`} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Step 2 접근 시 성적 정보 검증
  if (step === "university-selection" && (!gpaId || !languageId)) {
    // 성적 정보가 없으면 Step 1로 리다이렉트
    router.replace(`/strategy-room/${seasonId}/applications/new?step=grade-registration`);
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="성적 공유" showPrevButton showHomeButton fallbackUrl={`/strategy-room/${seasonId}`} />
      <ProgressBar currentStep={step === "university-selection" ? 2 : 1} totalSteps={2} />

      {/* Step 1: 성적 등록 */}
      {step === "grade-registration" && (
        <GradeRegistrationStep
          seasonId={seasonId}
          seasonName={seasonName}
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
            slots={slots}
            onSelectUniversity={handleSelectUniversity}
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
            isOpen={universitySearch.isOpen}
            onClose={universitySearch.closeModal}
            slots={slots}
            selectedUniversities={selectedUniversities.map((u) => ({
              choice: u.choice,
              slotId: u.slot.slotId,
            }))}
            onSelectUniversity={handleSelectUniversity}
          />

          {/* 제출 확인 모달 */}
          {existingGpa && existingLanguage && (
            <ApplicationSubmitModal
              isOpen={submit.isOpen}
              gpa={existingGpa}
              language={existingLanguage}
              onConfirm={handleConfirmSubmit}
              onCancel={handleCancelSubmit}
            />
          )}
        </>
      )}
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
