import type { Metadata } from "next";
import { getSeasons } from "@/lib/api/season";
import HomePage from "@/components/home/HomePage";

// 24시간(86400초)마다 자동 재생성
export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Page() {
  // 서버에서 시즌 목록만 가져오기 (인증 불필요)
  try {
    const seasonsData = await getSeasons();
    return <HomePage initialSeasons={seasonsData.seasons} />;
  } catch (error) {
    console.error('Failed to fetch seasons:', error);
    // API 실패 시 빈 배열로 fallback (빌드/재생성 중 에러 방지)
    return <HomePage initialSeasons={[]} />;
  }
}
