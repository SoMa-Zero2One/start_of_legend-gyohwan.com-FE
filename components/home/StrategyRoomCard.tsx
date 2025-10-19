import Image from 'next/image';
import { Season } from '@/types/season';
import { calculateDDay } from '@/lib/utils/date';

interface StrategyRoomCardProps {
  data: Season;
}

export default function StrategyRoomCard({ data }: StrategyRoomCardProps) {
  const { domesticUniversity, domesticUniversityLogoUri, startDate, endDate } = data;

  // 날짜 포맷
  const formattedDate =
    startDate && endDate
      ? `${startDate} ~ ${endDate}`
      : '일정 미정';

  // D-Day 계산
  const dDay = startDate ? calculateDDay(startDate) : null;

  return (
    <div className="w-full rounded-[16px] p-[20px] flex flex-col gap-[20px]">
      {/* 상단: 로고 + 학교명 + 날짜 + D-Day */}
        <div className="flex items-center gap-3">
          <div className="relative w-[80px] h-[80px]">
            <Image
              src={domesticUniversityLogoUri}
              alt={`${domesticUniversity} 로고`}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[18px]">
              {domesticUniversity}
            </span>
            <span>
              <span className="text-[14px] mr-[5px]">
                {formattedDate}
              </span>
              {/* 오른쪽 D-Day */}
              {dDay !== null && (
                <span className="text-[12px] font-bold rounded-[4px] px-[8px] py-[4px] bg-[#FC507B] text-[#FFFFFF]">
                  D-{dDay}
                </span>
              )}
            </span>
          </div>
        </div>

      {/* 하단 버튼 2개 */}
      <div className="flex gap-[10px]">
        <button className="flex-1 bg-[#000000] text-[#FFFFFF] py-[8px] rounded-[50px] text-[14px]">
          실시간 경쟁률 보기
        </button>
        <button className="flex-1 bg-[#056DFF]/15 text-[#056DFF] py-[8px] rounded-[50px] text-[14px]">
          성적 공유하기
        </button>
      </div>
    </div>
  );
}