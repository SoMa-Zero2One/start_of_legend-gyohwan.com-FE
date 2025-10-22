interface StrategyTabsProps {
  selectedTab: "지망한 대학" | "지원자가 있는 대학" | "모든 대학";
  onTabChange: (tab: "지망한 대학" | "지원자가 있는 대학" | "모든 대학") => void;
  counts: {
    "지망한 대학": number;
    "지원자가 있는 대학": number;
    "모든 대학": number;
  };
}

export default function StrategyTabs({ selectedTab, onTabChange, counts }: StrategyTabsProps) {
  const tabs = ["지망한 대학", "지원자가 있는 대학", "모든 대학"] as const;

  return (
    <div className="relative flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`relative flex flex-1 cursor-pointer flex-col items-center py-[12px] text-[15px] font-medium ${
            selectedTab === tab ? "text-black" : "text-gray-700"
          }`}
        >
          <span>{tab}</span>
          <span className="mt-[2px] text-[12px]">({counts[tab]})</span>
        </button>
      ))}
      {/* 애니메이션 적용된 탭 인디케이터 */}
      <span
        className="absolute bottom-0 h-[2px] rounded-full bg-black transition-all duration-300 ease-in-out"
        style={{
          width: "33.333%",
          left: selectedTab === "지망한 대학" ? "0%" : selectedTab === "지원자가 있는 대학" ? "33.333%" : "66.666%",
        }}
      />
    </div>
  );
}
