"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import UniversitySelectionStep from "@/components/application/UniversitySelectionStep";
import UniversitySearchModal from "@/components/application/UniversitySearchModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { getMyApplication } from "@/lib/api/slot";
import { getSeasonSlots } from "@/lib/api/slot";
import { updateApplication } from "@/lib/api/application";
import { useFormErrorHandler } from "@/hooks/useFormErrorHandler";
import { useModalHistory } from "@/hooks/useModalHistory";
import type { Slot } from "@/types/slot";
import type { MyApplicationResponse } from "@/types/slot";

interface SelectedUniversity {
  choice: number;
  slot: Slot;
}

function ApplicationEditContent() {
  const params = useParams();
  const router = useRouter();
  const seasonId = parseInt(params.seasonId as string);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myApplication, setMyApplication] = useState<MyApplicationResponse | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);

  // 모달 히스토리 관리
  const universitySearch = useModalHistory({ modalKey: "university-search" });
  const confirm = useModalHistory({ modalKey: "confirm" });

  // 대학 선택 관리
  const [selectedUniversities, setSelectedUniversities] = useState<SelectedUniversity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 에러 핸들러
  const { tooltipMessage, shouldShake, showError } = useFormErrorHandler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [myAppResult, slotsResult] = await Promise.all([getMyApplication(seasonId), getSeasonSlots(seasonId)]);

        setMyApplication(myAppResult);
        setSlots(slotsResult.slots);

        // MyApplicationResponse의 choices를 SelectedUniversity 형식으로 변환
        const initialSelections: SelectedUniversity[] = myAppResult.choices.map((choiceItem) => ({
          choice: choiceItem.choice,
          slot: {
            slotId: choiceItem.slot.slotId,
            name: choiceItem.slot.name,
            country: choiceItem.slot.country,
            choiceCount: choiceItem.slot.choiceCount,
            slotCount: choiceItem.slot.slotCount,
            duration: choiceItem.slot.duration,
            logoUrl: choiceItem.slot.logoUrl,
            homepageUrl: choiceItem.slot.homepageUrl,
            universityId: choiceItem.slot.universityId,
          },
        }));

        setSelectedUniversities(initialSelections);
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [seasonId]);

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

    confirm.openModal();
  };

  // 최종 제출 실행
  const handleConfirmSubmit = async () => {
    // 보안: URL 조작으로 모달을 열었을 경우를 대비한 재검증
    if (selectedUniversities.length === 0) {
      confirm.closeModal();
      showError("최소 1개 이상의 지망 대학을 선택해주세요.");
      return;
    }

    // 1지망부터 순서대로 채워졌는지 확인
    const sortedChoices = selectedUniversities.map((u) => u.choice).sort((a, b) => a - b);
    for (let i = 0; i < sortedChoices.length; i++) {
      if (sortedChoices[i] !== i + 1) {
        confirm.closeModal();
        showError("1지망부터 순서대로 채워주세요.");
        return;
      }
    }

    confirm.closeModal();

    try {
      setIsSubmitting(true);

      const choices = selectedUniversities.map((u) => ({
        choice: u.choice,
        slotId: u.slot.slotId,
      }));

      await updateApplication(seasonId, { choices });

      // 성공 후 실시간 경쟁률 페이지로 이동
      router.push(`/strategy-room/${seasonId}`);
    } catch (error) {
      console.error("Application update error:", error);
      showError("지망 대학 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="지망 대학 변경하기" showPrevButton showHomeButton />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !myApplication) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="지망 대학 변경하기" showPrevButton showHomeButton />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-red-500">{error || "데이터를 불러올 수 없습니다."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="지망 대학 변경하기" showPrevButton showHomeButton />

      <UniversitySelectionStep
        selectedUniversities={selectedUniversities}
        onOpenSearch={handleOpenSearch}
        onDelete={handleDelete}
        onReorder={handleReorder}
        onReset={handleReset}
        onSubmit={handleSubmit}
        displayLanguage={`${myApplication.language.testType} ${myApplication.language.grade || ""} ${myApplication.language.score || ""}`.trim()}
        mode="edit"
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

      {/* 확인 모달 */}
      <ConfirmModal
        isOpen={confirm.isOpen}
        title="지망 대학 수정"
        message="지망 대학을 수정하시겠습니까?"
        confirmText="수정하기"
        cancelText="취소"
        onConfirm={handleConfirmSubmit}
        onCancel={confirm.closeModal}
      />
    </div>
  );
}

export default function ApplicationEditPage() {
  return (
    <Suspense fallback={null}>
      <ApplicationEditContent />
    </Suspense>
  );
}
