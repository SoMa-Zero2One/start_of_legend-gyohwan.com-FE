interface GradeProgressBarProps {
  score: number;
  criteria: string;
}

export default function GradeProgressBar({ score, criteria }: GradeProgressBarProps) {
  const criteriaNum = parseFloat(criteria);
  const percentage = (score / criteriaNum) * 100;

  return (
    <div className="flex items-center gap-[12px]">
      {/* 진행 바 */}
      <div className="relative h-[8px] flex-1 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[#056DFF]"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* 점수 표시 */}
      <div className="flex items-baseline gap-[4px]">
        <span className="text-[20px] font-bold text-[#056DFF]">{score.toFixed(2)}</span>
        <span className="text-[16px] text-gray-500">{criteria}</span>
      </div>
    </div>
  );
}
