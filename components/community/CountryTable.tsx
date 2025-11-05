"use client";

import { EnrichedCountry, CountryFieldValue } from "@/types/community";
import SortIcon from "@/components/icons/SortIcon";
import ChevronUpIcon from "@/components/icons/ChevronUpIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import CountryFlag from "@/components/common/CountryFlag";
import { useRouter } from "next/navigation";

interface CountryTableProps {
  countries: EnrichedCountry[];
  visibleFieldKeys: string[];
  onSort?: (fieldKey: string) => void;
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
}

export default function CountryTable({ countries, visibleFieldKeys, onSort, sortConfig }: CountryTableProps) {
  const router = useRouter();

  const handleCountryClick = (countryCode: string) => {
    router.push(`/community/country/${countryCode}`);
  };

  // Empty state 처리
  if (!countries || countries.length === 0) {
    return (
      <div className="overflow-x-auto">
        <div className="flex items-center justify-center py-[60px]">
          <p className="body-2 text-gray-500">선택한 조건에 해당하는 나라가 없습니다</p>
        </div>
      </div>
    );
  }

  // 첫 번째 나라에서 표시할 필드 정보 가져오기 (displayOrder 순서대로)
  const firstCountry = countries[0];
  const visibleFields = visibleFieldKeys
    .map((key) => firstCountry?.fields.get(key))
    .filter(Boolean)
    .sort((a, b) => a!.displayOrder - b!.displayOrder) as CountryFieldValue[];

  // 3개 이하면 flex-1, 4개 이상이면 w-[90px]
  const fieldWidthClass = visibleFields.length <= 3 ? "flex-1" : "w-[90px]";

  return (
    <div className="scrollbar-hide overflow-x-auto pb-[60px]">
      <table className="w-full border-collapse">
        <thead className="caption-1">
          <tr className="flex border-t border-gray-300 text-gray-700">
            <th className="sticky left-0 z-10 flex w-[150px] items-center bg-white px-[16px] py-[12px]">나라명</th>
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
          {countries.map((country) => (
            <tr
              key={country.countryCode}
              className="group interactive-row flex border-t border-gray-100"
              onClick={() => handleCountryClick(country.countryCode)}
            >
              <td className="interactive-row-child sticky left-0 z-10 flex w-[150px] items-center gap-[8px] bg-white px-[16px] py-[20px]">
                <CountryFlag country={country.name} size={20} />
                <span className="text-[13px] font-bold">{country.name}</span>
              </td>
              {visibleFields.map((field) => {
                const countryField = country.fields.get(field.key);
                return (
                  <td
                    key={field.key}
                    className={`flex ${fieldWidthClass} ${countryField?.value ? "pl-[10px]" : ""} items-center text-left break-keep`}
                  >
                    {countryField && <FieldRenderer field={countryField} />}
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
function FieldRenderer({ field }: { field: CountryFieldValue }) {
  // Empty state 처리 (null 또는 빈 값)
  if (!field?.value) {
    return <div className="h-full w-full bg-gray-500" />;
  }
  // 배지 스타일로 렌더링 (사용 언어)
  if (field.renderConfig?.badge) {
    return <span className="caption-1 truncate rounded-full bg-gray-300 px-[8px]">{field.displayValue}</span>;
  }

  // 일반 텍스트 렌더링 (레벨은 이미 "상/중상/중/중하/하"로 변환됨, 숫자는 포맷팅됨)
  return <span>{field.displayValue}</span>;
}
