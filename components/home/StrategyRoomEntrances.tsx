'use client';

import { useEffect, useState } from 'react';
import { getSeasons } from '@/lib/api/season';
import { Season } from '@/types/season';
import { useAuthStore } from '@/stores/authStore';
import StrategyRoomCard from './StrategyRoomCard';

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
          return a.domesticUniversity.localeCompare(b.domesticUniversity, 'ko-KR');
        });

        setSeasons(sortedSeasons);
      } catch (err) {
        setError(err instanceof Error ? err.message : '시즌 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasons();
  }, [user]);

  if (isLoading) {
    return (
      <div className="relative py-[20px] flex flex-col px-[20px] gap-[40px] overflow-hidden">
        <div>
          <p className="h-6 bg-gray-200 rounded animate-pulse w-48"></p>
          <p className="h-8 bg-gray-200 rounded animate-pulse w-24 mt-2"></p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative py-[20px] flex flex-col px-[20px] gap-[40px] overflow-hidden">
        <div>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-[20px] flex flex-col px-[20px] gap-[40px] overflow-hidden">
      <div className="flex flex-col items-center gap-[12px]">
        <p className='text-[24px] font-bold leading-none'>
          교환 프로그램 진행 중인 대학
        </p>
        <p className='text-[36px] font-bold text-[#056DFF] leading-none'>
          {seasons.length}개 대학
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {seasons.map((season) => (
          <StrategyRoomCard key={season.seasonId} data={season} />
        ))}
      </div>
    </div>
  );
}
