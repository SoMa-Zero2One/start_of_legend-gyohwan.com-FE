"use server";

import { revalidatePath } from "next/cache";

/**
 * 커뮤니티 페이지 캐시 무효화 Server Action
 *
 * USAGE: 글 작성/수정/삭제 후 페이지 갱신 시
 *
 * WHAT: Next.js 15 revalidatePath를 사용한 서버 캐시 무효화
 *
 * WHY:
 * - Server Component 데이터를 갱신하기 위해 필요
 * - window.location.reload() 대신 사용 (깜빡임 없음)
 * - Next.js 15 권장 방식
 *
 * @param univId 대학 ID (대학 커뮤니티)
 * @param countryCode 국가 코드 (국가 커뮤니티)
 */
export async function revalidateCommunityPage(univId?: number, countryCode?: string) {
  if (univId) {
    revalidatePath(`/community/university/${univId}`);
  } else if (countryCode) {
    revalidatePath(`/community/country/${countryCode}`);
  }
}
