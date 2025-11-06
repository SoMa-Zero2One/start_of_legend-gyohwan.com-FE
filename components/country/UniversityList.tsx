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
      <div className="flex items-center justify-center py-[60px]">
        <p className="body-2 text-gray-500">대학 정보가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
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
  );
}
