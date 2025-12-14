"use client";

import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import CheckIcon from "@/components/icons/CheckIcon";
import type { Slot } from "@/types/slot";

type UniversitySearchVariant = "panel" | "modal";

interface UniversitySearchListProps {
  slots: Slot[];
  selectedSlotChoices: Record<number, number>;
  onSelectUniversity: (slot: Slot) => void;
  maxSelectable?: number;
  className?: string;
  emptyMessage?: string;
  variant?: UniversitySearchVariant;
}

export default function UniversitySearchList({
  slots,
  selectedSlotChoices,
  onSelectUniversity,
  maxSelectable = 5,
  className = "",
  emptyMessage = "검색 결과가 없습니다.",
  variant = "panel",
}: UniversitySearchListProps) {
  const selectedSlots = slots
    .filter((slot) => slot.slotId !== undefined && selectedSlotChoices[slot.slotId] !== undefined)
    .sort((a, b) => {
      const aChoice = a.slotId !== undefined ? selectedSlotChoices[a.slotId] : 0;
      const bChoice = b.slotId !== undefined ? selectedSlotChoices[b.slotId] : 0;
      return aChoice - bChoice;
    });

  const unselectedSlots = slots.filter(
    (slot) => slot.slotId === undefined || selectedSlotChoices[slot.slotId] === undefined
  );
  const currentSelectedCount = Object.keys(selectedSlotChoices).length;
  const isFull = currentSelectedCount >= maxSelectable;

  if (slots.length === 0) {
    return <p className="caption-1 py-[40px] text-center text-gray-500">{emptyMessage}</p>;
  }

  const selectedButtonBaseClass =
    variant === "panel"
      ? "flex w-full items-center gap-[12px] rounded-[12px] border border-primary-blue/30 bg-primary-blue/5 p-[12px] text-left transition hover:bg-primary-blue/10"
      : "flex items-center gap-[12px] border-b border-gray-100 px-[20px] py-[16px] text-left transition-colors cursor-pointer hover:bg-gray-50";

  const unselectedButtonBaseClass =
    variant === "panel"
      ? "flex w-full items-center gap-[12px] rounded-[12px] border border-gray-100 p-[12px] text-left transition"
      : "flex items-center gap-[12px] border-b border-gray-100 px-[20px] py-[16px] text-left transition-colors";

  const dividerClass = variant === "panel" ? "border-t border-dashed border-gray-200" : "border-t-4 border-gray-200";

  return (
    <div className={`flex flex-col ${variant === "panel" ? "space-y-[12px]" : ""} ${className}`.trim()}>
      {selectedSlots.map((slot) => {
        const slotId = slot.slotId ?? 0;
        const choice = selectedSlotChoices[slotId];
        const name = slot.name ?? "정보 없음";
        const country = slot.country ?? "기타";

        return (
          <button
            key={`selected-${slotId}`}
            onClick={() => onSelectUniversity(slot)}
            className={`${selectedButtonBaseClass} cursor-pointer`}
          >
            <div className="relative h-[40px] w-[40px] overflow-hidden rounded-full">
              <SchoolLogoWithFallback src={slot.logoUrl} alt={name} width={40} height={40} className="object-cover" />
            </div>
            <div className="flex-1">
              <p className={`body-3 font-semibold ${variant === "panel" ? "text-primary-blue" : "text-black"}`}>
                {name}
              </p>
              <p className="caption-2 text-gray-600">{country}</p>
            </div>
            {variant === "panel" ? (
              <div className="text-primary-blue flex items-center gap-[6px]">
                <span className="caption-2 font-semibold">{choice}지망</span>
                <CheckIcon size={20} />
              </div>
            ) : (
              <div className="flex items-center gap-[8px]">
                <span className="caption-1 text-primary-blue font-semibold">{choice}지망</span>
                <CheckIcon size={24} className="text-primary-blue" />
              </div>
            )}
          </button>
        );
      })}

      {selectedSlots.length > 0 && unselectedSlots.length > 0 && <div className={dividerClass} />}

      {unselectedSlots.map((slot) => {
        const slotId = slot.slotId ?? 0;
        const name = slot.name ?? "정보 없음";
        const country = slot.country ?? "기타";

        return (
          <button
            key={`unselected-${slotId}`}
            onClick={() => onSelectUniversity(slot)}
            disabled={isFull}
            className={`cursor-pointer ${unselectedButtonBaseClass} ${
              isFull
                ? "cursor-not-allowed opacity-50"
                : variant === "panel"
                  ? "hover:border-primary-blue hover:bg-blue-50/30"
                  : "hover:bg-gray-50"
            }`}
          >
            <div className="relative h-[40px] w-[40px] overflow-hidden rounded-full">
              <SchoolLogoWithFallback src={slot.logoUrl} alt={name} width={40} height={40} className="object-cover" />
            </div>
            <div className="flex-1">
              <p className={`body-3 font-semibold ${variant === "modal" && isFull ? "text-gray-400" : ""}`}>{name}</p>
              <p className="caption-2 text-gray-600">{country}</p>
            </div>
            {isFull && (
              <span className="caption-2 text-gray-500">
                {variant === "panel" ? `최대 ${maxSelectable}지망` : "최대 5지망"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
