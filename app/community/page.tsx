"use client";

import { Suspense } from "react";
import CommunityClient from "./CommunityClient";

/**
 * Community 페이지 (Client-side Fetching)
 *
 * 전략:
 * - 모든 데이터 fetching을 클라이언트에서 수행
 * - credentials: "include"로 쿠키 포함 → 정확한 isFavorite 값 수신
 * - 즐겨찾기 추가/제거 시 즉시 UI 반영
 *
 * 장점:
 * - 로그인 유저의 즐겨찾기 정보 정확히 표시
 * - 즐겨찾기 토글 후 즉시 반영 (refetch 시)
 * - 코드 단순화 (서버/클라이언트 분리 불필요)
 */
export default function CommunityPage() {
  return (
    <Suspense fallback={null}>
      <CommunityClient />
    </Suspense>
  );
}
