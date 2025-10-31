import { getSeasons } from "@/lib/api/season";
import HomePage from "@/components/home/HomePage";

// 24시간(86400초)마다 자동 재생성
export const revalidate = 86400;

export default async function Page() {
  // 서버에서 시즌 목록만 가져오기 (인증 불필요)
  const seasonsData = await getSeasons();

  return <HomePage initialSeasons={seasonsData.seasons} />;
}
