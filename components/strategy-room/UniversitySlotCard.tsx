import Link from "next/link";
import { useParams } from "next/navigation";
import { Slot } from "@/types/slot";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import CountryFlag from "@/components/common/CountryFlag";

interface UniversitySlotCardProps {
  slot: Slot;
}

export default function UniversitySlotCard({ slot }: UniversitySlotCardProps) {
  const params = useParams();
  const seasonId = params.seasonId as string;

  return (
    <Link href={`/strategy-room/${seasonId}/slots/${slot.slotId}`}>
      <div className="flex cursor-pointer flex-col items-end gap-[16px] rounded-[10px] border border-gray-100 p-[16px] shadow-[0_0_8px_rgba(0,0,0,0.06)] hover:bg-gray-100">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center justify-center gap-[8px]">
            {/* 학교 로고 */}
            <div className="relative h-[20px] w-[20px] overflow-hidden">
              <SchoolLogoWithFallback
                src={slot.logoUrl}
                alt={`${slot.name} 로고`}
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div className="subhead-3 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{slot.name}</div>
          </div>
          <div className="flex items-center gap-[4px]">
            <CountryFlag country={slot.country} size={20} />
            <div className="caption-1">{slot.country}</div>
          </div>
        </div>
        <div className="flex w-[286px] justify-between">
          <div className="flex w-[130px] justify-between">
            <span className="caption-1 text-gray-700">지원자 수</span>
            <span className="medium-body-3">{slot.choiceCount}명</span>
          </div>
          <div className="flex w-[130px] justify-between">
            <span className="caption-1 text-gray-700">모집인원</span>
            <span className="medium-body-3">{slot.slotCount}명</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
