"use client";

import { useMemo } from "react";
import { Season } from "@/types/season";
import { useAuthStore } from "@/stores/authStore";
import StrategyRoomCard from "./StrategyRoomCard";

interface StrategyRoomEntrancesProps {
  initialSeasons: Season[];
}

export default function StrategyRoomEntrances({ initialSeasons }: StrategyRoomEntrancesProps) {
  const { user } = useAuthStore();

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

  return (
    <div id="strategy-room-entrances" className="relative flex flex-col gap-[40px] px-[20px] pb-[100px]">
      <div className="flex flex-col items-center gap-[12px]">
        <h2 className="head-4">교환학생 모집 중인 대학</h2>
        <p className="g-head-2 text-primary-blue">{sortedSeasons.length}개 대학</p>
      </div>
      <div className="grid grid-cols-1 gap-[12px]">
        {sortedSeasons.map((season) => (
          <StrategyRoomCard key={season.seasonId} data={season} />
        ))}
      </div>
    </div>
  );
}
