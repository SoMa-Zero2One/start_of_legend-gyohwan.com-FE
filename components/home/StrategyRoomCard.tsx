"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Season } from "@/types/season";
import { calculateDDay } from "@/lib/utils/date";
import { useAuthStore } from "@/stores/authStore";
import { saveRedirectUrl } from "@/lib/utils/redirect";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";

interface StrategyRoomCardProps {
  data: Season;
}

export default function StrategyRoomCard({ data }: StrategyRoomCardProps) {
  const { seasonId, domesticUniversity, domesticUniversityLogoUri, startDate, endDate } = data;
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();

  // 날짜 포맷
  const formattedDate = startDate && endDate ? `${startDate} ~ ${endDate}` : "일정 미정";

  // D-Day 계산
  const dDay = startDate ? calculateDDay(startDate) : null;

  const handleShareClick = () => {
    const targetUrl = `/strategy-room/${seasonId}/applications/new`;

    // 로그인 확인
    if (!isLoggedIn || !user) {
      // 리다이렉트 URL 저장 후 로그인 페이지로 이동
      saveRedirectUrl(targetUrl);
      router.push("/log-in-or-create-account");
      return;
    }

    // 학교 인증 확인
    if (!user.schoolVerified) {
      // 리다이렉트 URL 저장 후 학교 인증 페이지로 이동
      saveRedirectUrl(targetUrl);
      router.push("/school-verification");
      return;
    }

    // 모두 완료된 경우 바로 이동
    router.push(targetUrl);
  };

  return (
    <div className="flex w-full flex-col gap-[20px] rounded-[16px] border border-gray-300 p-[20px]">
      {/* 상단: 로고 + 학교명 + 날짜 + D-Day */}
      <div className="flex items-center gap-[12px]">
        <div className="relative h-[80px] w-[80px]">
          <SchoolLogoWithFallback
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
          <button className="w-full cursor-pointer rounded-full bg-black py-[8px] text-white">
            실시간 경쟁률 보기
          </button>
        </Link>
        <button
          onClick={handleShareClick}
          className="bg-primary-blue/15 text-primary-blue flex-1 cursor-pointer rounded-full py-[8px]"
        >
          성적 공유하기
        </button>
      </div>
    </div>
  );
}
