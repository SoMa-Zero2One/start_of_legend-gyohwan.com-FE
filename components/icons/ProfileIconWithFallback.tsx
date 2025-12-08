import { useState } from "react";
import Image from "next/image";
import DefaultProfileIcon from "./DefaultProfileIcon";

interface ProfileIconWithFallbackProps {
  profileUrl?: string | null;
  size?: number;
  className?: string;
}

export default function ProfileIconWithFallback({
  profileUrl,
  size = 32,
  className = "",
}: ProfileIconWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  const showFallback = !profileUrl || hasError;
  const iconSize = size * 0.625; // 기본 아이콘 크기 조정

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-[#ECECEC] ${className}`}
        style={{ width: size, height: size }}
      >
        <DefaultProfileIcon size={iconSize} />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-full ${className}`} style={{ width: size, height: size }}>
      <Image
        src={profileUrl}
        alt="Profile"
        fill
        className="object-cover"
        onError={() => setHasError(true)}
        sizes={`${size}px`}
      />
    </div>
  );
}
