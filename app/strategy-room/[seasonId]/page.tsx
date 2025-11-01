import type { Metadata } from "next";
import { getSeasonSlots } from "@/lib/api/slot";
import StrategyRoomClient from "@/components/strategy-room/StrategyRoomClient";

type Props = {
  params: Promise<{ seasonId: string }>;
};

// 동적 메타데이터 생성 (경쟁률 페이지 SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seasonId } = await params;

  try {
    // 서버에서 시즌 정보 가져오기
    const data = await getSeasonSlots(parseInt(seasonId));

    // seasonName 파싱: "인천대학교 2026-1 모집" -> "인천대학교", "2026-1"
    const universityName = data.seasonName.split(" ")[0];
    const match = data.seasonName.match(/(\d{4})-(\d)/);
    const semester = match ? `${match[1]}-${match[2]}` : "";

    const title = `${universityName} ${semester} 교환학생 실시간 경쟁률`;
    const description = `${universityName} ${semester} 교환학생 지원 현황을 실시간으로 확인하세요. 총 ${data.applicantCount}명이 성적을 공유하며 경쟁률을 분석 중입니다. GPA, 어학 점수 비교로 합격 가능성을 높이세요.`;

    return {
      title,
      description,
      keywords: [
        `${universityName} 교환학생`,
        `${universityName} 교환학생 경쟁률`,
        "교환학생 경쟁률",
        "교환학생 실시간 경쟁률",
        "교환학생 지원 현황",
        "교환학생 GPA",
        "교환학생 어학 점수",
      ],
      openGraph: {
        title,
        description,
        url: `https://gyohwan.com/strategy-room/${seasonId}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      alternates: {
        canonical: `/strategy-room/${seasonId}`,
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);

    // API 실패 시 기본 메타데이터
    return {
      title: "교환학생 실시간 경쟁률 - 교환닷컴",
      description: "교환학생 지원 현황을 실시간으로 확인하고, 성적을 비교하며 합격 전략을 세워보세요.",
      alternates: {
        canonical: `/strategy-room/${seasonId}`,
      },
    };
  }
}

export default async function StrategyRoomPage() {
  return <StrategyRoomClient />;
}
