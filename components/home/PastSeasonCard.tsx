"use client";

import { Season } from "@/types/season";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";

interface PastSeasonCardProps {
  data: Season;
}

export default function PastSeasonCard({ data }: PastSeasonCardProps) {
  const { domesticUniversity, domesticUniversityLogoUri, name, applicationCount } = data;

  // null 안전 처리
  const safeDomesticUniversity = domesticUniversity ?? "대학교";
  // "모집" 제거 + "2026-1" → "26-1 파견"으로 변환
  const safeName = name
    ? name.replace(" 모집", "").replace(/(\d{4})-(\d)/, (_, year, semester) => {
        const shortYear = year.slice(2); // 2026 → 26
        return `${shortYear}-${semester} 파견`;
      })
    : "모집 정보 없음";

  return (
    <div className="flex w-full items-center gap-[12px] rounded-[16px] border border-gray-300 p-[16px]">
      {/* 로고 */}
      <div className="relative h-[60px] w-[60px] flex-shrink-0">
        <SchoolLogoWithFallback
          src={domesticUniversityLogoUri}
          alt={`${safeDomesticUniversity} 로고`}
          fill
          sizes="60px"
          className="object-contain"
        />
      </div>

      {/* 학교명, 참여 인원 */}
      <div className="flex flex-1 flex-col gap-[4px]">
        <span className="subhead-2">{safeName}</span>
        {/* 참여 인원 */}
        {applicationCount !== null && applicationCount > 0 && (
          <span className="body-1 font-bold text-primary-blue">{applicationCount}명 참여</span>
        )}
      </div>
    </div>
  );
}
