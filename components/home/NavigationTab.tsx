"use client";

import CommunityIcon from "../icons/CommunityIcon";
import GradeIcon from "../icons/GradeIcon";
import WriteIcon from "../icons/WriteIcon";
import { useGradeShareAction } from "@/hooks/useGradeShareAction";
import NavigationCard from "./NavigationCard";

export default function NavigationTab() {
  const handleGradeShareClick = useGradeShareAction();

  return (
    <div className="flex items-center gap-[16px] bg-gradient-to-b from-[#F7F8FA] to-white px-[20px] py-[16px] xl:hidden">
      {/* 커뮤니티 버튼 */}
      <NavigationCard href="/community" label="커뮤니티" showNewBadge>
        <CommunityIcon />
      </NavigationCard>

      {/* 성적 공유 버튼 */}
      <NavigationCard label="성적 공유" onClick={handleGradeShareClick}>
        <GradeIcon />
      </NavigationCard>

      {/* 건의/문의하기 버튼 */}
      <NavigationCard href="https://pf.kakao.com/_xaxdQLn" label="건의/문의하기" openInNewTab>
        <WriteIcon />
      </NavigationCard>
    </div>
  );
}
