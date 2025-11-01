/**
 * 백엔드 언어 시험 타입을 UI용 형식으로 변환
 * @param testType - 백엔드에서 받은 언어 시험 타입 (예: "TOEFL_IBT")
 * @returns UI에 표시할 언어 시험 타입 (예: "TOEFL IBT")
 */
export function formatLanguageTest(testType: string): string {
  const formatMap: Record<string, string> = {
    TOEFL_IBT: "TOEFL IBT",
    TOEFL_ITP: "TOEFL ITP",
    TOEIC: "TOEIC",
    IELTS: "IELTS",
  };

  return formatMap[testType] || testType;
}
