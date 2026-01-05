"use client";
import Link from "next/link";
import { Season } from "@/types/season";
import { calculateDDay, formatDate } from "@/lib/utils/date";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";

interface StrategyRoomCardProps {
  data: Season;
  onShareClick: (season: Season) => void;
}

export default function StrategyRoomCard({ data, onShareClick }: StrategyRoomCardProps) {
  const { seasonId, domesticUniversity, domesticUniversityLogoUri, applicationCount, startDate, endDate } = data;

  // null 안전 처리
  const safeDomesticUniversity = domesticUniversity ?? "대학교";

  // 날짜 포맷 (yyyy.mm.dd ~ yyyy.mm.dd)
  const formattedDate = startDate && endDate ? `${formatDate(startDate)} ~ ${formatDate(endDate)}` : "일정 미정";

  // D-Day 계산 (마감일 기준)
  const dDay = endDate ? calculateDDay(endDate) : null;

  return (
    <div className="flex w-full flex-col gap-[20px] rounded-[16px] border border-gray-300 p-[20px]">
      {/* 상단: 로고 + 학교명 + 날짜 + D-Day */}
      <div className="flex items-center gap-[12px]">
        <div className="relative h-[80px] w-[80px] flex-shrink-0">
          <SchoolLogoWithFallback
            src={domesticUniversityLogoUri}
            alt={`${safeDomesticUniversity} 로고`}
            fill
            sizes="80px"
            className="object-contain"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-[6px]">
            <span className="subhead-2">{safeDomesticUniversity}</span>
            {/* 참여 인원 배지 */}
            {applicationCount !== null && applicationCount > 0 && (
              <span className="caption-2 text-primary-blue">🔥 {applicationCount}명 참여 중!</span>
            )}
          </div>
          <span>
            <span className="mr-[5px]">{formattedDate}</span>
            {/* D-Day */}
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
          <button className="w-full cursor-pointer rounded-full bg-black py-[8px] text-white">
            실시간 경쟁률 보기
          </button>
        </Link>
        <button
          onClick={() => onShareClick(data)}
          className="bg-primary-blue/15 text-primary-blue flex-1 cursor-pointer rounded-full py-[8px]"
        >
          성적 공유하기
        </button>
      </div>
    </div>
  );
}
