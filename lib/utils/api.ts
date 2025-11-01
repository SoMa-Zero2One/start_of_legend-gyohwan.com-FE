/**
 * 백엔드 API Base URL 가져오기
 * @throws {Error} 환경변수가 설정되지 않은 경우
 */
export const getBackendUrl = (): string => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL 환경변수가 설정되지 않았습니다.");
  }
  return backendUrl;
};
