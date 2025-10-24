"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import UniversitySelectionStep from "@/components/application/UniversitySelectionStep";
import { getMyApplication } from "@/lib/api/slot";
import { getSeasonSlots } from "@/lib/api/slot";
import type { Slot } from "@/types/slot";
import type { MyApplicationResponse } from "@/types/slot";

interface SelectedUniversity {
  choice: number;
  slot: Slot;
}

function ApplicationEditContent() {
  const params = useParams();
  const seasonId = parseInt(params.seasonId as string);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myApplication, setMyApplication] = useState<MyApplicationResponse | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [myAppResult, slotsResult] = await Promise.all([
          getMyApplication(seasonId),
          getSeasonSlots(seasonId),
        ]);

        setMyApplication(myAppResult);
        setSlots(slotsResult.slots);
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [seasonId]);

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

  // MyApplicationResponse의 choices를 SelectedUniversity 형식으로 변환
  const initialSelections: SelectedUniversity[] = myApplication.choices.map((choiceItem) => ({
    choice: choiceItem.choice,
    slot: {
      slotId: choiceItem.slot.slotId,
      name: choiceItem.slot.name,
      country: choiceItem.slot.country,
      choiceCount: choiceItem.slot.choiceCount,
      slotCount: choiceItem.slot.slotCount,
      duration: choiceItem.slot.duration,
    },
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="지망 대학 변경하기" showPrevButton showHomeButton />

      <UniversitySelectionStep
        seasonId={seasonId}
        languageTest={myApplication.language.testType}
        languageScore={myApplication.language.score}
        languageGrade={myApplication.language.grade}
        slots={slots}
        mode="edit"
        initialSelections={initialSelections}
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
