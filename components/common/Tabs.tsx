import { useIsDesktop } from "@/lib/hooks/useMediaQuery";

interface TabsProps<T extends string> {
  tabs: readonly T[] | T[];
  selectedTab: T;
  onTabChange: (tab: T) => void;
  counts?: Record<T, number>;
  className?: string;
}

export default function Tabs<T extends string>({
  tabs,
  selectedTab,
  onTabChange,
  counts,
  className = "",
}: TabsProps<T>) {
  const isDesktop = useIsDesktop();

  const renderUnderlineTabs = () => (
    <div className="relative flex border-b border-gray-100">
      {tabs.map((tab) => {
        const isActive = selectedTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`relative flex flex-1 cursor-pointer flex-col items-center py-[12px] ${
              isActive ? "medium-body-3 text-black" : "text-gray-700"
            }`}
          >
            <span>{tab}</span>
            {counts && <span className="mt-[2px] text-[12px]">({counts[tab]})</span>}
          </button>
        );
      })}
      <span
        className="absolute bottom-0 h-[2px] rounded-full bg-black transition-all duration-300 ease-in-out"
        style={{
          width: `${100 / tabs.length}%`,
          left: `${tabs.indexOf(selectedTab) * (100 / tabs.length)}%`,
        }}
      />
    </div>
  );

  const renderPillTabs = () => (
    <div className="flex flex-wrap gap-[12px]">
      {tabs.map((tab) => {
        const isActive = selectedTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`cursor-pointer rounded-full border px-[18px] py-[10px] transition-colors ${
              isActive
                ? "medium-body-3 border-black bg-black text-white"
                : "border-gray-100 bg-white text-gray-700 hover:border-black/40"
            }`}
          >
            {tab}
            {counts && <span className="ml-[4px] text-xs font-normal text-gray-400">({counts[tab]})</span>}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={`flex w-full flex-col gap-[12px] ${className}`}>
      {!isDesktop && <div>{renderUnderlineTabs()}</div>}
      {isDesktop && <div>{renderPillTabs()}</div>}
    </div>
  );
}
