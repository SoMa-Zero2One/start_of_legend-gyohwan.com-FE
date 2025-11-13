/**
 * 백엔드에서 받은 날짜 문자열을 KST 기준으로 파싱
 * @param dateString - ISO 8601 형식의 날짜 문자열 (타임존 정보 있거나 없거나)
 * @returns KST로 파싱된 Date 객체
 */
export const parseKstDate = (dateString: string): Date => {
  // 이미 타임존 정보가 있는지 체크 (Z, +XX:XX, -XX:XX 형태)
  const hasTimezone = /[+-]\d{2}:\d{2}|Z$/.test(dateString);

  if (hasTimezone) {
    // 타임존이 이미 있으면 그대로 파싱
    return new Date(dateString);
  }

  // 타임존이 없으면 KST(+09:00)로 간주하여 파싱
  return new Date(dateString + "+09:00");
};

/**
 * KST 기준 자정(00:00:00)을 나타내는 Date 객체 반환 (환경 독립적)
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns KST 기준 자정의 UTC 타임스탬프를 가진 Date 객체
 */
export const getKstMidnight = (dateString: string): Date => {
  const kstDate = parseKstDate(dateString);

  // KST 시각으로 변환 (UTC 타임스탬프 + 9시간)
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
  const kstTime = kstDate.getTime() + KST_OFFSET_MS;

  // KST 기준 날짜 추출 (UTC 메서드로 읽음)
  const temp = new Date(kstTime);
  const year = temp.getUTCFullYear();
  const month = temp.getUTCMonth();
  const date = temp.getUTCDate();

  // KST 자정을 UTC 타임스탬프로 변환하여 반환
  return new Date(Date.UTC(year, month, date) - KST_OFFSET_MS);
};

/**
 * D-Day 계산 (목표 날짜까지 남은 일수) - 한국 시간(KST) 기준
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 남은 일수 (음수일 경우 지난 일수)
 */
export const calculateDDay = (dateString: string): number => {
  // KST 기준 자정으로 정규화 (환경 독립적)
  const targetMidnight = getKstMidnight(dateString);
  const todayMidnight = getKstMidnight(new Date().toISOString());

  // 두 자정 사이의 일수 차이 계산
  const diffTime = targetMidnight.getTime() - todayMidnight.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * ISO 8601 날짜를 yyyy.mm.dd 형식으로 포맷 - 한국 시간(KST) 기준
 * @param dateString - ISO 8601 형식의 날짜 문자열 (백엔드에서 KST로 전송)
 * @returns yyyy.mm.dd 형식의 문자열
 */
export const formatDate = (dateString: string): string => {
  // KST 기준 자정 기준으로 날짜 추출 (환경 독립적)
  const midnight = getKstMidnight(dateString);

  // UTC 메서드로 KST 날짜 추출 (KST 오프셋을 더해줌)
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
  const midnightKst = new Date(midnight.getTime() + KST_OFFSET_MS);
  const year = midnightKst.getUTCFullYear();
  const month = String(midnightKst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(midnightKst.getUTCDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

/**
 * ISO 8601 날짜를 yyyy-mm-dd hh:mm 형식으로 포맷 - 한국 시간(KST) 기준
 *
 * USAGE: 댓글/게시글 작성 시간 표시
 * WHAT: ISO 8601 날짜를 "2025-01-05 12:34" 형식으로 변환
 * WHY: KST 기준 시간 표시, 환경 독립적 (Vercel UTC 환경에서도 동일)
 *
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns yyyy-mm-dd hh:mm 형식의 문자열 (빈 값이면 빈 문자열)
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
  // falsy 값 체크 (빈 문자열, null, undefined)
  if (!dateString) return "";

  try {
    const kstDate = parseKstDate(dateString);

    // Invalid Date 체크
    if (isNaN(kstDate.getTime())) return "";

    // KST 시간 추출 (UTC+9)
    const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
    const kstTime = kstDate.getTime() + KST_OFFSET_MS;
    const date = new Date(kstTime);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch {
    return "";
  }
};
