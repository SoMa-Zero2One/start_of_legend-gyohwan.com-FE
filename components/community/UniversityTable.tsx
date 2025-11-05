"use client";

import { EnrichedUniversity, UniversityFieldValue } from "@/types/community";
import SortIcon from "@/components/icons/SortIcon";
import ChevronUpIcon from "@/components/icons/ChevronUpIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import StarIcon from "@/components/icons/StarIcon";
import { useRouter } from "next/navigation";

interface UniversityTableProps {
  universities: EnrichedUniversity[];
  visibleFieldKeys: string[];
  isLoggedIn: boolean;
  onSort?: (fieldKey: string) => void;
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
  onFavoriteToggle?: (univId: number, currentState: boolean) => Promise<void>;
}

export default function UniversityTable({
  universities,
  visibleFieldKeys,
  isLoggedIn,
  onSort,
  sortConfig,
  onFavoriteToggle,
}: UniversityTableProps) {
  const router = useRouter();

  const handleUniversityClick = (univId: number) => {
    router.push(`/community/university/${univId}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent, univId: number, isFavorite: boolean) => {
    e.stopPropagation(); // 행 클릭 이벤트 방지
    if (onFavoriteToggle) {
      await onFavoriteToggle(univId, isFavorite);
    }
  };

  // Empty state 처리
  if (!universities || universities.length === 0) {
    return (
      <div className="overflow-x-auto">
        <div className="flex items-center justify-center py-[60px]">
          <p className="body-2 text-gray-500">선택한 조건에 해당하는 대학이 없습니다</p>
        </div>
      </div>
    );
  }

  // 첫 번째 대학에서 표시할 필드 정보 가져오기 (displayOrder 순서대로)
  const firstUniversity = universities[0];
  const visibleFields = visibleFieldKeys
    .map((key) => firstUniversity?.fields.get(key))
    .filter(Boolean)
    .sort((a, b) => a!.displayOrder - b!.displayOrder) as UniversityFieldValue[];

  // 3개 이하면 flex-1, 4개 이상이면 w-[90px]
  const fieldWidthClass = visibleFields.length <= 3 ? "flex-1" : "w-[90px]";

  return (
    <div className="scrollbar-hide overflow-x-auto pb-[60px]">
      <table className="w-full border-collapse">
        <thead className="caption-1">
          <tr className="flex border-t border-gray-300 text-gray-700">
            <th className="sticky left-0 z-10 flex w-[120px] items-center bg-white px-[16px] py-[12px]">대학명</th>
            {visibleFields.map((field) => (
              <th
                key={field.key}
                className={`flex ${fieldWidthClass} items-center justify-between px-[10px] py-[8px] text-left break-keep ${
                  field.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                }`}
                onClick={field.sortable ? () => onSort?.(field.key) : undefined}
              >
                <span>{field.label}</span>
                {/* 정렬 아이콘 (sortable인 경우만) */}
                {field.sortable && (
                  <>
                    {sortConfig?.key === field.key ? (
                      sortConfig.direction === "asc" ? (
                        <ChevronUpIcon size={16} />
                      ) : (
                        <ChevronDownIcon size={16} />
                      )
                    ) : (
                      <SortIcon size={16} />
                    )}
                  </>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {universities.map((university) => (
            <tr
              key={university.univId}
              className="group interactive-row flex border-t border-gray-100"
              onClick={() => handleUniversityClick(university.univId)}
            >
              <td
                className={`interactive-row-child sticky left-0 z-10 flex h-[120px] w-[150px] items-center gap-[8px] bg-white ${isLoggedIn ? "pr-[16px]" : "px-[16px]"}`}
              >
                {/* 즐겨찾기 버튼 (로그인 유저만 표시) */}
                {isLoggedIn && (
                  <div
                    onClick={(e) => handleFavoriteClick(e, university.univId, university.isFavorite)}
                    className="relative z-20 flex h-full cursor-pointer items-center justify-center pl-[16px]"
                  >
                    <StarIcon size={16} filled={university.isFavorite} />
                  </div>
                )}
                <SchoolLogoWithFallback
                  src={university.logoUrl}
                  alt={`${university.name} 로고`}
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[13px] font-bold">{university.name}</p>
                </div>
              </td>
              {visibleFields.map((field) => {
                const univField = university.fields.get(field.key);
                return (
                  <td
                    key={field.key}
                    className={`flex ${fieldWidthClass} ${univField?.value ? "pl-[10px]" : ""} items-center text-left break-keep`}
                  >
                    {univField && <FieldRenderer field={univField} />}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 필드 타입별 렌더링
function FieldRenderer({ field }: { field: UniversityFieldValue }) {
  // Empty state 처리 (null 또는 빈 값)
  if (!field?.value) {
    return <div className="h-full w-full bg-gray-500" />;
  }

  // 배지 스타일로 렌더링 (필요한 경우)
  if (field.renderConfig?.badge) {
    return <span className="caption-1 truncate rounded-full bg-gray-300 px-[8px]">{field.displayValue}</span>;
  }

  // 일반 텍스트 렌더링 (레벨은 이미 "상/중상/중/중하/하"로 변환됨, 숫자는 포맷팅됨)
  return <span className="caption-1">{field.displayValue}</span>;
}
