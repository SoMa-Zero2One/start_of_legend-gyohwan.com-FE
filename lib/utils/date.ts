/**
 * D-Day 계산 (목표 날짜까지 남은 일수)
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 남은 일수 (음수일 경우 지난 일수)
 */
export const calculateDDay = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
