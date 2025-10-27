/**
 * D-Day 계산 (목표 날짜까지 남은 일수) - 한국 시간(KST) 기준
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 남은 일수 (음수일 경우 지난 일수)
 */
export const calculateDDay = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const today = new Date();

  // 한국 시간(KST, UTC+9)으로 변환
  const KST_OFFSET = 9 * 60; // 9시간을 분 단위로
  const toKST = (date: Date) => {
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    return new Date(utcTime + KST_OFFSET * 60000);
  };

  const targetKST = toKST(targetDate);
  const todayKST = toKST(today);

  // 시간 제거 (자정으로 설정)
  targetKST.setHours(0, 0, 0, 0);
  todayKST.setHours(0, 0, 0, 0);

  const diffTime = targetKST.getTime() - todayKST.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * ISO 8601 날짜를 yyyy.mm.dd 형식으로 포맷
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns yyyy.mm.dd 형식의 문자열
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};
