interface LanguageChartProps {
  testType: string;
  score: string;
}

export default function LanguageChart({ testType, score }: LanguageChartProps) {
  // 각 시험별 최대 점수 (바 차트 높이 계산용)
  const maxScores: Record<string, number> = {
    TOEIC: 990,
    "TOEFL IBT": 120,
    "TOEFL ITP": 677,
    IELTS: 9,
  };

  const numericScore = parseFloat(score);
  const maxScore = maxScores[testType] || 100;
  const heightPercentage = (numericScore / maxScore) * 100;

  return (
    <div className="flex flex-col items-center gap-[12px]">
      {/* 바 차트 */}
      <div className="relative flex h-[200px] w-[80px] items-end">
        <div className="relative w-full overflow-hidden rounded-t-[8px]">
          <div
            className="w-full bg-[#056DFF] transition-all"
            style={{ height: `${heightPercentage * 2}px` }} // 200px 기준
          />
          {/* 점수 표시 */}
          <div className="absolute top-[-32px] left-1/2 -translate-x-1/2">
            <span className="text-[20px] font-bold text-[#056DFF]">{score}</span>
          </div>
        </div>
      </div>

      {/* 시험 종류 */}
      <span className="text-[14px] text-gray-600">{testType}</span>
    </div>
  );
}
