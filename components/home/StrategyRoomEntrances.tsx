"use client";

import { useEffect, useState } from "react";
import { getSeasons } from "@/lib/api/season";
import { Season } from "@/types/season";
import { useAuthStore } from "@/stores/authStore";
import StrategyRoomCard from "./StrategyRoomCard";
import StrategyRoomCardSkeleton from "./StrategyRoomCardSkeleton";

export default function StrategyRoomEntrances() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        setIsLoading(true);
        const data = await getSeasons();

        // 사용자의 학교를 우선 정렬 + 나머지는 가나다순
        const sortedSeasons = [...data.seasons].sort((a, b) => {
          const userUniversity = user?.domesticUniversity;

          if (userUniversity) {
            const aMatch = a.domesticUniversity === userUniversity;
            const bMatch = b.domesticUniversity === userUniversity;

            // 사용자 학교가 맞으면 최상위로
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
          }

          // 둘 다 사용자 학교가 아니거나, 둘 다 사용자 학교면 가나다순
          return a.domesticUniversity.localeCompare(b.domesticUniversity, "ko-KR");
        });

        setSeasons(sortedSeasons);
      } catch (err) {
        setError(err instanceof Error ? err.message : "시즌 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasons();
  }, [user?.domesticUniversity]);

  if (isLoading) {
    return (
      <div className="relative flex flex-col gap-[40px] p-[20px]">
        {/* 헤더 스켈레톤 */}
        <div className="flex flex-col items-center gap-[12px]">
          <div className="h-[24px] w-[240px] animate-pulse rounded bg-gray-200" />
          <div className="h-[36px] w-[100px] animate-pulse rounded bg-gray-200" />
        </div>

        {/* 카드 스켈레톤 3개 */}
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3].map((i) => (
            <StrategyRoomCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex flex-col gap-[40px] p-[20px] text-center">
        <div>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-[40px] p-[20px]">
      <div className="flex flex-col items-center gap-[12px]">
        <p className="head-4">교환 프로그램 진행 중인 대학</p>
        <p className="g-head-2 text-primary-blue">{seasons.length}개 대학</p>
      </div>
      <div className="grid grid-cols-1 gap-[12px]">
        {seasons.map((season) => (
          <StrategyRoomCard key={season.seasonId} data={season} />
        ))}
      </div>
    </div>
  );
}
