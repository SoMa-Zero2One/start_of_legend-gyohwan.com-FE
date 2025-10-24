"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import ProgressBar from "@/components/common/ProgressBar";
import GradeRegistrationStep from "@/components/application/GradeRegistrationStep";
import UniversitySelectionStep from "@/components/application/UniversitySelectionStep";
import { getSeasonSlots } from "@/lib/api/slot";
import { getGpas } from "@/lib/api/gpa";
import { getLanguages } from "@/lib/api/language";
import type { Gpa, Language } from "@/types/application";
import type { Slot } from "@/types/slot";

type Step = "grade-registration" | "university-selection";

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

  // 초기 데이터 로드 및 isApplied 확인
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        setIsLoading(true);

        // 1. isApplied 확인 및 slots 데이터 저장
        const slotsData = await getSeasonSlots(seasonId);
        setSlots(slotsData.slots);

        if (slotsData.isApplied) {
          // 이미 지원한 경우 -> 실시간 경쟁률 페이지로 리다이렉트
          // TODO: 실시간 경쟁률 페이지 URL 확정 후 수정 필요
          router.push(`/strategy-room/${seasonId}`);
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
  }, [seasonId, router]);

  const handleGradeSubmit = (newGpaId: number, newLanguageId: number) => {
    setGpaId(newGpaId);
    setLanguageId(newLanguageId);
    router.push(`/strategy-room/${seasonId}/applications/new?step=university-selection`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="성적 공유" showPrevButton />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="성적 공유" showPrevButton showBorder={false} />
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
        <UniversitySelectionStep
          seasonId={seasonId}
          gpaId={gpaId}
          languageId={languageId}
          languageTest={existingLanguage?.testType}
          languageScore={existingLanguage?.score}
          languageGrade={existingLanguage?.grade}
          slots={slots}
        />
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
