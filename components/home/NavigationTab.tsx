import CommunityIcon from "@/components/icons/CommunityIcon";
import NavigationCard from "./NavigationCard";

export default function NavigationTab() {
  return (
    <div className="flex items-center bg-gradient-to-b from-[#F7F8FA] to-white px-[20px] py-[16px]">
      <NavigationCard href="/community" label="커뮤니티" showNewBadge>
        <CommunityIcon />
      </NavigationCard>
    </div>
  );
}
