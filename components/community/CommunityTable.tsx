"use client";

import { CommunityCountry, CommunityUniversity } from "@/types/community";
import CountryFlag from "@/components/common/CountryFlag";
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
    name: "나라명",
    visaDifficulty: "비자 발급 난이도",
    cost: "물가",
    language: "사용 언어",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {visibleColumns.map((col) => (
              <th key={col} className="caption-1 whitespace-nowrap px-4 py-3 text-left text-gray-700">
                {columnLabels[col]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {countries.map((country, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              {visibleColumns.map((col) => (
                <td key={col} className="body-3 whitespace-nowrap px-4 py-4">
                  {col === "name" ? (
                    <div className="flex items-center gap-2">
                      <CountryFlag country={country.name} size={24} />
                      <span className="medium-body-3">{country.name}</span>
                    </div>
                  ) : (
                    <span>{country[col as keyof CommunityCountry]}</span>
                  )}
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
    name: "대학명",
    budget: "예산",
    travel: "여행",
    cost: "물가",
    program: "교환학생 프로그램",
    cityType: "도시/시골",
    safety: "지안",
    transportation: "교통",
    dorm: "기숙사 유무",
    dormCost: "기숙사 가격",
    qsRanking: "Qs 랭킹",
    schoolType: "국공립 여부",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {visibleColumns.map((col, index) => (
              <th
                key={col}
                className={`caption-1 whitespace-nowrap px-4 py-3 text-left text-gray-700 ${
                  index === 0 ? "sticky left-0 z-10 bg-gray-50" : ""
                }`}
              >
                {columnLabels[col]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {universities.map((university) => (
            <tr key={university.id} className="border-b border-gray-100 hover:bg-gray-50">
              {visibleColumns.map((col, index) => (
                <td
                  key={col}
                  className={`body-3 whitespace-nowrap px-4 py-4 ${
                    index === 0 ? "sticky left-0 z-10 bg-white group-hover:bg-gray-50" : ""
                  }`}
                >
                  {col === "name" ? (
                    <div className="flex items-center gap-2">
                      <SchoolLogoWithFallback
                        src={university.logoUrl}
                        alt={`${university.name} 로고`}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="medium-body-3">{university.name}</span>
                        <span className="caption-2 text-gray-600">{university.country}</span>
                      </div>
                    </div>
                  ) : (
                    <span>{university[col as keyof CommunityUniversity]}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
