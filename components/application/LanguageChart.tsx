interface LanguageChartProps {
  testType: string;
  score: string;
  grade?: string | null; // languageGrade (예: N1, N2, 4급 등)
}

export default function LanguageChart({ testType, score, grade }: LanguageChartProps) {
  // 각 시험별 최대 점수 (languageTest 기준)
  const maxScores: Record<string, number> = {
    TOEIC: 990,
    "TOEFL IBT": 120,
    "TOEFL ITP": 677,
    IELTS: 9,
    JLPT: 180, // N1/N2/N3 모두 동일
    HSK: 300, // 4급/5급/6급 모두 동일
    기타: 100, // 기타는 0~100 스케일로 가정
  };

  // languageTest별 색상 (7가지)
  const colorMap: Record<string, string> = {
    TOEIC: "#004B8E", // 네이비 블루
    "TOEFL IBT": "#FFB433", // 오렌지
    "TOEFL ITP": "#056DFF", // Primary 블루
    IELTS: "#10B981", // 그린
    JLPT: "#8B5CF6", // 보라
    HSK: "#029EFA", // 라이트 블루
    기타: "#6B7280", // 회색
  };

  const numericScore = parseFloat(score);
  const maxScore = maxScores[testType] || 100;
  const heightPercentage = (numericScore / maxScore) * 100;
  const barColor = colorMap[testType] || "#6B7280"; // 기본 회색

  // 최대 높이 150px 기준
  const barHeight = Math.min((heightPercentage / 100) * 150, 150);

  // 표시명: testType + grade (있으면)
  const displayName = grade ? `${testType} ${grade}` : testType;

  return (
    <div className="flex flex-col items-center gap-[8px]">
      {/* 바 차트 컨테이너 */}
      <div className="relative flex h-[170px] w-[60px] flex-col items-center justify-end">
        {/* 점수 표시 */}
        <div className="mb-[4px]">
          <span className="text-[18px] font-bold" style={{ color: barColor }}>
            {score}
          </span>
        </div>

        {/* 바 */}
        <div
          className="w-[16px] rounded-t-[4px] transition-all"
          style={{
            height: `${barHeight}px`,
            backgroundColor: barColor,
          }}
        />

        {/* 시험 종류 */}
        <span className="text-center text-[12px] text-gray-600">{displayName}</span>
      </div>
    </div>
  );
}
