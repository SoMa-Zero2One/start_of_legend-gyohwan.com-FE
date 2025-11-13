import CommunityIcon from "../icons/CommunityIcon";
import WriteIcon from "../icons/WriteIcon";
import NavigationCard from "./NavigationCard";

export default function NavigationTab() {
  return (
    <div className="flex items-center gap-[16px] bg-gradient-to-b from-[#F7F8FA] to-white px-[20px] py-[16px]">
      {/* 커뮤니티 버튼 */}
      <NavigationCard href="/community" label="커뮤니티" showNewBadge>
        <CommunityIcon />
      </NavigationCard>

      {/* 건의/문의하기 버튼 */}
      <NavigationCard href="https://open.kakao.com/o/sOeiKL1h" label="건의/문의하기" openInNewTab>
        <WriteIcon />
      </NavigationCard>
    </div>
  );
}
