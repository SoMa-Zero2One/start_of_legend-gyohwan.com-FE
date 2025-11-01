import Image from "next/image";
import DefaultProfileIcon from "./DefaultProfileIcon";

interface ProfileIconProps {
  profileUrl?: string | null;
  size?: number;
  className?: string;
}

export default function ProfileIcon({ profileUrl, size = 32, className = "" }: ProfileIconProps) {
  // profileUrl이 있으면 이미지를, 없으면 기본 아이콘을
  if (profileUrl) {
    return (
      <div className={`relative overflow-hidden rounded-full ${className}`} style={{ width: size, height: size }}>
        <Image src={profileUrl} alt="Profile" fill className="object-cover" />
      </div>
    );
  }

  // 기본 아이콘 (bg-[#ECECEC] rounded-full 포함)
  const iconSize = size * 0.625; // 아이콘은 컨테이너의 62.5% 크기 (20/32)

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[#ECECEC] ${className}`}
      style={{ width: size, height: size }}
    >
      <DefaultProfileIcon size={iconSize} />
    </div>
  );
}
