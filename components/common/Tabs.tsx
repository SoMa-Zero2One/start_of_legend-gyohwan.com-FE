interface Tab {
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  tabs: readonly T[] | T[];
  selectedTab: T;
  onTabChange: (tab: T) => void;
  counts?: Record<T, number>;
}

export default function Tabs<T extends string>({ tabs, selectedTab, onTabChange, counts }: TabsProps<T>) {
  return (
    <div className="relative flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`relative flex flex-1 cursor-pointer flex-col items-center py-[12px] ${
            selectedTab === tab ? "medium-body-3 text-black" : "text-gray-700"
          }`}
        >
          <span>{tab}</span>
          {counts && <span className="mt-[2px] text-[12px]">({counts[tab]})</span>}
        </button>
      ))}
      {/* 애니메이션 적용된 탭 인디케이터 */}
      <span
        className="absolute bottom-0 h-[2px] rounded-full bg-black transition-all duration-300 ease-in-out"
        style={{
          width: `${100 / tabs.length}%`,
          left: `${tabs.indexOf(selectedTab) * (100 / tabs.length)}%`,
        }}
      />
    </div>
  );
}
