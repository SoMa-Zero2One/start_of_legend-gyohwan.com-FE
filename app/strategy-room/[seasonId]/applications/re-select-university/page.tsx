"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import UniversitySelectionStep from "@/components/application/UniversitySelectionStep";
import type { Slot } from "@/types/slot";

// MOCK 데이터
const MOCK_SLOTS: Slot[] = [
  {
    slotId: 1,
    name: "University of California, Berkeley",
    country: "미국",
    duration: "1학기",
    choiceCount: 45,
    slotCount: "15명",
  },
  {
    slotId: 2,
    name: "University of Tokyo",
    country: "일본",
    duration: "1년",
    choiceCount: 32,
    slotCount: "10명",
  },
  {
    slotId: 3,
    name: "National University of Singapore",
    country: "싱가포르",
    duration: "1학기",
    choiceCount: 28,
    slotCount: "8명",
  },
  {
    slotId: 4,
    name: "University of Hong Kong",
    country: "홍콩",
    duration: "1학기",
    choiceCount: 20,
    slotCount: "6명",
  },
  {
    slotId: 5,
    name: "Peking University",
    country: "중국",
    duration: "1년",
    choiceCount: 15,
    slotCount: "12명",
  },
];

const MOCK_INITIAL_SELECTIONS = [
  { choice: 1, slot: MOCK_SLOTS[0] },
  { choice: 2, slot: MOCK_SLOTS[1] },
  { choice: 3, slot: MOCK_SLOTS[2] },
];

const MOCK_LANGUAGE_TEST = "TOEIC";
const MOCK_LANGUAGE_SCORE = "920";
const MOCK_EXTRA_SCORE = "0.3";

function ApplicationEditContent() {
  const params = useParams();
  const seasonId = parseInt(params.seasonId as string);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="지망 대학 변경하기" showPrevButton showHomeButton />

      <UniversitySelectionStep
        seasonId={seasonId}
        gpaId={1} // MOCK
        languageId={1} // MOCK
        languageTest={MOCK_LANGUAGE_TEST}
        languageScore={MOCK_LANGUAGE_SCORE}
        languageGrade={null}
        slots={MOCK_SLOTS}
        mode="edit"
        initialSelections={MOCK_INITIAL_SELECTIONS}
        initialExtraScore={MOCK_EXTRA_SCORE}
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
