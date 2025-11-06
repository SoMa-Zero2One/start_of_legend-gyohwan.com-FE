"use client";

import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";

interface UniversityListItemProps {
  nameKo: string | null;
  nameEn: string;
  logoUrl: string | null;
  onClick: () => void;
}

export default function UniversityListItem({ nameKo, nameEn, logoUrl, onClick }: UniversityListItemProps) {
  const displayName = nameKo || nameEn;

  return (
    <button
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-between px-[20px] py-[16px] hover:bg-gray-50"
    >
      <div className="flex items-center gap-[12px]">
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
          <div className="text-[16px] font-semibold text-black">{displayName}</div>
          {nameKo && nameKo !== nameEn && <div className="text-[14px] text-gray-600">{nameEn}</div>}
        </div>
      </div>

      {/* 오른쪽 화살표 */}
      <ChevronRightIcon size={20} className="text-gray-400" />
    </button>
  );
}
