"use client";

import { useEffect, useMemo, useState } from "react";
import { Season } from "@/types/season";
import { useAuthStore } from "@/stores/authStore";
import StrategyRoomCard from "./StrategyRoomCard";
import PastSeasonCard from "./PastSeasonCard";

interface StrategyRoomEntrancesProps {
  initialSeasons: Season[];
  initialPastSeasons: Season[];
}

export default function StrategyRoomEntrances({
  initialSeasons,
  initialPastSeasons,
}: StrategyRoomEntrancesProps) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");
  const [pastSeasons, setPastSeasons] = useState<Season[]>(initialPastSeasons);

  useEffect(() => {
    if (initialPastSeasons.length > 0) {
      setPastSeasons(initialPastSeasons);
      return;
    }

    let isCancelled = false;

    const loadPastSeasons = async () => {
      try {
        const response = await fetch("/data/pastSeasons.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch fallback past seasons: ${response.status}`);
        }
        const data = (await response.json()) as { seasons?: Season[] | null };
        if (!isCancelled) {
          setPastSeasons(data.seasons ?? []);
        }
      } catch (error) {
        console.error("Failed to load past seasons:", error);
        if (!isCancelled) {
          setPastSeasons([]);
        }
      }
    };

    loadPastSeasons();

    return () => {
      isCancelled = true;
    };
  }, [initialPastSeasons]);

  // 서버에서 받은 시즌을 사용자 기준으로 정렬
  const sortedSeasons = useMemo(() => {
    return [...initialSeasons].sort((a, b) => {
      const userUniversity = user?.domesticUniversity;

      if (userUniversity) {
        const aMatch = a.domesticUniversity === userUniversity;
        const bMatch = b.domesticUniversity === userUniversity;

        // 사용자 학교가 맞으면 최상위로
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
      }

      // 둘 다 사용자 학교이거나 둘 다 아닐 경우, 마감일 기준으로 정렬
      const aHasDate = a.endDate !== null;
      const bHasDate = b.endDate !== null;

      // 일정이 없는 경우 가장 뒤로
      if (!aHasDate && bHasDate) return 1;
      if (aHasDate && !bHasDate) return -1;
      if (!aHasDate && !bHasDate) {
        // 둘 다 일정이 없으면 가나다순 (null 안전 처리)
        const aName = a.domesticUniversity ?? "";
        const bName = b.domesticUniversity ?? "";
        return aName.localeCompare(bName, "ko-KR");
      }

      // 둘 다 일정이 있으면 마감일이 가까운 순서 (오름차순)
      return new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime();
    });
  }, [initialSeasons, user?.domesticUniversity]);

  const sortedPastSeasons = useMemo(() => {
    return [...pastSeasons].sort((a, b) => {
      const countA = a.applicationCount ?? 0;
      const countB = b.applicationCount ?? 0;
      return countB - countA;
    });
  }, [pastSeasons]);

  // 과거 시즌 총 참여 인원 계산
  const totalPastParticipants = sortedPastSeasons.reduce((sum, season) => {
    return sum + (season.applicationCount ?? 0);
  }, 0);

  return (
    <div id="strategy-room-entrances" className="relative flex flex-col gap-[40px] px-[20px] pb-[100px]">
      {/* 헤더 */}
      <div className="flex flex-col items-center gap-[12px]">
        <h2 className="head-4 lg:!text-[36px]">
          {activeTab === "current" ? "교환학생 모집 중인 대학" : "과거 진행한 대학"}
        </h2>

        {/* 탭 UI */}
        <div className="flex gap-[24px] border-b border-gray-300">
          <button
            onClick={() => setActiveTab("current")}
            className={`g-body-1 cursor-pointer pb-[8px] transition-colors ${
              activeTab === "current" ? "border-primary-blue text-primary-blue border-b-2 font-bold" : "text-gray-500"
            }`}
          >
            모집 중
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`g-body-1 cursor-pointer pb-[8px] transition-colors ${
              activeTab === "past" ? "border-primary-blue text-primary-blue border-b-2 font-bold" : "text-gray-500"
            }`}
          >
            과거 진행
          </button>
        </div>

        {/* 개수 표시 */}
        {activeTab === "current" ? (
          <p className="g-head-2 text-primary-blue lg:text-[48px]">{sortedSeasons.length}개 대학</p>
        ) : (
          <div className="flex flex-col items-center gap-[4px]">
            <p className="g-head-2 text-primary-blue">{sortedPastSeasons.length}개 대학</p>
            <p className="g-body-1 text-primary-blue">총 {totalPastParticipants}명 참여</p>
          </div>
        )}
      </div>

      {/* 카드 리스트 */}
      <div className="grid grid-cols-1 gap-[12px] lg:grid-cols-3">
        {activeTab === "current"
          ? sortedSeasons.map((season) => <StrategyRoomCard key={season.seasonId} data={season} />)
          : sortedPastSeasons.map((season) => <PastSeasonCard key={season.seasonId} data={season} />)}
      </div>
    </div>
  );
}
