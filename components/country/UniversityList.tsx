"use client";

import { useRouter } from "next/navigation";
import UniversityListItem from "./UniversityListItem";
import type { UniversitySimple } from "@/types/country";

interface UniversityListProps {
  universities: UniversitySimple[];
}

export default function UniversityList({ universities }: UniversityListProps) {
  const router = useRouter();

  const handleUniversityClick = (univId: number) => {
    router.push(`/community/university/${univId}`);
  };

  // Empty state 처리
  if (!universities || universities.length === 0) {
    return (
      <>
        <div className="px-[20px] pt-[24px] pb-[20px]">
          <h2 className="head-4">대학 목록</h2>
        </div>
        <div className="flex items-center justify-center py-[60px]">
          <p className="text-gray-500">대학 정보가 없습니다</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="px-[20px] pb-[20px]">
        <h2 className="head-4">대학 목록</h2>
      </div>
      <div className="flex flex-col gap-[8px] px-[20px]">
        {universities.map((university) => (
          <UniversityListItem
            key={university.univId}
            nameKo={university.nameKo}
            nameEn={university.nameEn}
            logoUrl={university.logoUrl}
            onClick={() => handleUniversityClick(university.univId)}
          />
        ))}
      </div>
    </>
  );
}
