import Link from "next/link";
import { useParams } from "next/navigation";
import { Slot } from "@/types/slot";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import CountryFlag from "@/components/common/CountryFlag";
import { getSlotSafeDefaults, getChoiceCountDisplay, getSlotCountDisplay } from "@/lib/utils/slot";

interface UniversitySlotCardProps {
  slot: Slot;
  variant?: "responsive" | "mobile";
}

export default function UniversitySlotCard({ slot, variant = "responsive" }: UniversitySlotCardProps) {
  const params = useParams();
  const seasonId = params.seasonId as string;
  const isMobileVariant = variant === "mobile";

  // 방어적 기본값 적용
  const { name, country, choiceCount, slotCount, logoUrl } = getSlotSafeDefaults(slot);

  // 표시용 문자열
  const choiceCountDisplay = getChoiceCountDisplay(choiceCount);
  const slotCountDisplay = getSlotCountDisplay(slotCount);

  return (
    <Link href={`/strategy-room/${seasonId}/slots/${slot.slotId}`}>
      <div
        className={`flex cursor-pointer flex-col items-end gap-[16px] rounded-[10px] border border-gray-100 p-[16px] shadow-[0_0_8px_rgba(0,0,0,0.06)] hover:bg-gray-100 ${
          isMobileVariant ? "" : "xl:items-center xl:gap-[20px]"
        }`}
      >
        <div
          className={`flex w-full items-center justify-between ${isMobileVariant ? "" : "xl:flex-col xl:gap-[8px]"}`}
        >
          <div
            className={`flex items-center justify-center gap-[8px] ${
              isMobileVariant ? "" : "xl:flex-col xl:gap-[12px]"
            }`}
          >
            <div
              className={`relative h-[20px] w-[20px] overflow-hidden rounded-full ${
                isMobileVariant ? "" : "xl:h-[60px] xl:w-[60px]"
              }`}
            >
              {/* 학교 로고 */}
              <SchoolLogoWithFallback
                src={logoUrl}
                alt={`${name} 로고`}
                fill
                sizes={isMobileVariant ? "20px" : "(min-width:1280px) 60px, 20px"}
                className={`h-[20px] w-[20px] object-contain ${isMobileVariant ? "" : "xl:h-[60px] xl:w-[60px]"}`}
              />
            </div>
            <h3
              className={`subhead-2 line-clamp-1 max-w-[200px] leading-[24px] ${
                isMobileVariant ? "" : "xl:line-clamp-2 xl:min-h-[48px] xl:text-center"
              }`}
            >
              {name}
            </h3>
          </div>
          <div className="flex items-center gap-[4px]">
            <CountryFlag country={country} size={20} />
            <div className="caption-1">{country}</div>
          </div>
        </div>
        <div
          className={`flex w-[286px] justify-between ${isMobileVariant ? "" : "xl:w-full xl:flex-col xl:items-center"}`}
        >
          <div className={`flex w-[130px] justify-between ${isMobileVariant ? "" : "xl:w-full"}`}>
            <span className="caption-1 text-gray-700">지원자 수</span>
            <span className={`medium-body-3 ${isMobileVariant ? "" : "xl:!font-bold"}`}>{choiceCountDisplay}</span>
          </div>
          <div className={`flex w-[130px] justify-between ${isMobileVariant ? "" : "xl:w-full"}`}>
            <span className="caption-1 text-gray-700">모집인원</span>
            <span className={`medium-body-3 ${isMobileVariant ? "" : "xl:!font-bold"}`}>{slotCountDisplay}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
