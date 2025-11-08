import Link from "next/link";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import type { UniversitySimple } from "@/types/country";

export default function UniversityListItem({ univId, nameKo, nameEn, logoUrl }: UniversitySimple) {
  // 방어적 기본값: nameKo > nameEn > "대학교"
  const displayName = nameKo || nameEn || "대학교";

  return (
    <Link
      href={`/community/university/${univId}`}
      className="interactive-card flex w-full items-center justify-between rounded-[12px] border border-gray-100 bg-white p-[16px] shadow-[0_0_8px_0_rgba(0,0,0,0.06)] hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-center gap-[8px]">
        {/* 대학 로고 */}
        <SchoolLogoWithFallback
          src={logoUrl}
          alt={`${displayName} 로고`}
          width={40}
          height={40}
          className="rounded-full object-contain"
        />

        {/* 대학 이름 */}
        <div className="text-left">
          <div className="subhead-3">{displayName}</div>
          {nameKo && nameKo !== nameEn && <div className="caption-2 text-gray-700">{nameEn}</div>}
        </div>
      </div>

      {/* 오른쪽 화살표 */}
      <ChevronRightIcon size={20} />
    </Link>
  );
}
