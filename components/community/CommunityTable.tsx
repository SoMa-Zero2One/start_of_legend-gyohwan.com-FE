"use client";

import { CommunityCountry, CommunityUniversity } from "@/types/community";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";

interface CommunityTableProps {
  type: "country" | "university";
  countries?: CommunityCountry[];
  universities?: CommunityUniversity[];
  visibleColumns: string[]; // 표시할 컬럼 키 목록
}

export default function CommunityTable({ type, countries, universities, visibleColumns }: CommunityTableProps) {
  if (type === "country" && countries) {
    return <CountryTable countries={countries} visibleColumns={visibleColumns} />;
  }

  if (type === "university" && universities) {
    return <UniversityTable universities={universities} visibleColumns={visibleColumns} />;
  }

  return null;
}

// 나라 탭 테이블
function CountryTable({ countries, visibleColumns }: { countries: CommunityCountry[]; visibleColumns: string[] }) {
  // 컬럼 정의 매핑
  const columnLabels: Record<string, string> = {
    visaDifficulty: "비자 발급 난이도",
    cost: "물가",
    language: "사용 언어",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="caption-1">
          <tr className="flex border-t border-gray-300 text-gray-700">
            <th className="flex w-[120px] items-center px-[16px] py-[12px]">나라명</th>
            {visibleColumns.map((col) => (
              <th
                key={col + 1}
                className="flex flex-1 items-center px-[10px] py-[8px] text-left break-keep text-gray-700"
              >
                {columnLabels[col]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {countries.map((country, index) => (
            <tr key={index} className="flex border-t border-gray-100">
              <td className="flex w-[120px] items-center px-[16px] py-[20px]">
                <span className="text-[13px] font-bold">{country.name}</span>
              </td>
              {visibleColumns.map((col) => (
                <td key={col} className="flex flex-1 items-center px-[10px] py-[20px] text-left break-keep">
                  <span className={col === "language" ? "rounded-full bg-gray-300 px-[8px]" : ""}>
                    {country[col as keyof CommunityCountry]}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 대학 탭 테이블
function UniversityTable({
  universities,
  visibleColumns,
}: {
  universities: CommunityUniversity[];
  visibleColumns: string[];
}) {
  // 컬럼 정의 매핑
  const columnLabels: Record<string, string> = {
    budget: "예산",
    travel: "여행",
    cost: "물가",
    program: "교환학생 프로그램",
    cityType: "도시/시골",
    safety: "치안",
    transportation: "교통",
    dorm: "기숙사 유무",
    dormCost: "기숙사 가격",
    qsRanking: "Qs 랭킹",
    schoolType: "국공립 여부",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="caption-1">
          <tr className="flex border-t border-gray-300 text-gray-700">
            <th className="sticky left-0 z-10 flex w-[120px] items-center bg-white px-[16px] py-[12px]">대학명</th>
            {visibleColumns.map((col) => (
              <th key={col} className="flex w-[80px] items-center px-[10px] py-[8px] text-left break-keep">
                {columnLabels[col]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {universities.map((university) => (
            <tr key={university.id} className="flex border-t border-gray-100">
              <td className="sticky left-0 z-10 flex w-[120px] items-center gap-2 bg-white px-[16px] py-[20px]">
                <SchoolLogoWithFallback
                  src={university.logoUrl}
                  alt={`${university.name} 로고`}
                  width={24}
                  height={24}
                  className="shrink-0 rounded-full"
                />
                <span className="truncate text-[13px] font-bold">{university.name}</span>
              </td>
              {visibleColumns.map((col) => (
                <td key={col} className="flex w-[80px] items-center px-[10px] py-[20px] text-left break-keep">
                  <span>{university[col as keyof CommunityUniversity]}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
