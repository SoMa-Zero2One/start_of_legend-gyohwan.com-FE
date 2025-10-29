import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SearchIcon from "@/components/icons/SearchIcon";
import DragHandleIcon from "@/components/icons/DragHandleIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import SchoolLogoWithFallback from "@/components/common/SchoolLogoWithFallback";
import type { Slot } from "@/types/slot";

interface SelectedUniversity {
  choice: number; // 1~5지망
  slot: Slot;
}

interface SortableChoiceCardProps {
  choice: number;
  selected: SelectedUniversity | undefined;
  displayLanguage?: string;
  onDelete: (choice: number) => void;
  onOpenSearch: () => void;
}

export default function SortableChoiceCard({
  choice,
  selected,
  displayLanguage,
  onDelete,
  onOpenSearch,
}: SortableChoiceCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: selected ? `slot-${selected.slot.slotId}` : `empty-${choice}`,
    disabled: !selected, // 빈 카드는 드래그 불가
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-[12px]">
      <span className="medium-body-3">{choice}지망</span>

      {selected ? (
        <div className="flex flex-1 items-center gap-[12px] rounded-[4px] border border-gray-300 p-[12px]">
          {/* 대학 로고 */}
          <div className="relative h-[32px] w-[32px] flex-shrink-0 overflow-hidden rounded-full">
            <SchoolLogoWithFallback
              src={selected.slot.logoUrl}
              alt={selected.slot.name}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <span className="medium-body-3 w-0 flex-1 truncate text-left">{selected.slot.name}</span>
          {/* 어학 시험 태그 */}
          {displayLanguage && (
            <span className="caption-2 bg-primary-blue rounded-[4px] px-[8px] py-[4px] text-white">
              {displayLanguage}
            </span>
          )}
          {/* 삭제 버튼 */}
          <button
            onClick={() => onDelete(choice)}
            className="flex-shrink-0 cursor-pointer p-[4px] text-gray-500 transition-colors hover:text-red-500"
            aria-label="삭제"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={onOpenSearch}
          className="flex-1 cursor-pointer rounded-[4px] border border-gray-300 p-[16px] transition-colors hover:bg-blue-50"
        >
          <span className="body-3 hover:text-primary-blue flex items-center gap-[6px] text-gray-400 transition-colors">
            <SearchIcon size={14} className="flex-shrink-0" />
            <span>클릭하여 추가</span>
          </span>
        </button>
      )}

      {/* 드래그 핸들 */}
      <div
        {...attributes}
        {...listeners}
        className={`p-[4px] ${selected ? "cursor-grab active:cursor-grabbing" : "opacity-30"}`}
      >
        <DragHandleIcon size={20} />
      </div>
    </div>
  );
}
