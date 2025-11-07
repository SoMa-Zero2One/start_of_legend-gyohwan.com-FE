// import CommunityIcon from "@/components/icons/CommunityIcon";
import CommunityIcon from "../icons/CommunityIcon";
import NavigationCard from "./NavigationCard";

export default function NavigationTab() {
  return (
    <div className="flex items-center gap-[16px] bg-gradient-to-b from-[#F7F8FA] to-white px-[20px] py-[16px]">
      {/* 커뮤니티 버튼 */}
      <NavigationCard href="/community" label="커뮤니티" showNewBadge>
        <CommunityIcon />
      </NavigationCard>

      {/* 피드백 버튼 */}
      <NavigationCard href="http://pf.kakao.com/_xaxdQLn/" label="피드백" openInNewTab>
        <CommunityIcon />
      </NavigationCard>
    </div>
  );
}
