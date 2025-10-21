import Image from "next/image";
import Link from "next/link";
import { Season } from "@/types/season";
import { calculateDDay } from "@/lib/utils/date";

interface StrategyRoomCardProps {
  data: Season;
}

export default function StrategyRoomCard({ data }: StrategyRoomCardProps) {
  const { seasonId, domesticUniversity, domesticUniversityLogoUri, startDate, endDate } = data;

  // 날짜 포맷
  const formattedDate = startDate && endDate ? `${startDate} ~ ${endDate}` : "일정 미정";

  // D-Day 계산
  const dDay = startDate ? calculateDDay(startDate) : null;

  return (
    <div className="flex w-full flex-col gap-[20px] rounded-[16px] border border-gray-300 p-[20px]">
      {/* 상단: 로고 + 학교명 + 날짜 + D-Day */}
      <div className="flex items-center gap-[12px]">
        <div className="relative h-[80px] w-[80px]">
          <Image
            src={domesticUniversityLogoUri}
            alt={`${domesticUniversity} 로고`}
            fill
            sizes="80px"
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="subhead-2">{domesticUniversity}</span>
          <span>
            <span className="mr-[5px]">{formattedDate}</span>
            {/* 오른쪽 D-Day */}
            {dDay !== null && (
              <span className="rounded-[4px] bg-[#FC507B] px-[8px] py-[4px] text-[12px] font-bold text-white">
                {dDay > 0 ? `D-${dDay}` : dDay === 0 ? "D-Day" : `D+${Math.abs(dDay)}`}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* 하단 버튼 2개 */}
      <div className="flex gap-[10px]">
        <Link href={`/strategy-room/${seasonId}`} className="flex-1 cursor-pointer">
          <button className="w-full rounded-[50px] bg-black py-[8px] text-white">실시간 경쟁률 보기</button>
        </Link>
        <button className="bg-primary-blue/15 text-primary-blue flex-1 rounded-[50px] py-[8px]">성적 공유하기</button>
      </div>
    </div>
  );
}
