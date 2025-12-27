"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PrevIcon from "@/components/icons/PrevIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import NavigationCard from "@/components/home/NavigationCard";
import CommunityIcon from "@/components/icons/CommunityIcon";
import WriteIcon from "@/components/icons/WriteIcon";
import GradeIcon from "@/components/icons/GradeIcon";
import { useGradeShareAction } from "@/hooks/useGradeShareAction";

interface HeaderProps {
  children?: React.ReactNode;
  title?: string;
  showLogo?: boolean;
  showPrevButton?: boolean;
  showHomeButton?: boolean;
  showSearchButton?: boolean;
  onSearchClick?: () => void;
  showBorder?: boolean;
  fallbackUrl?: string; // 뒤로가기 히스토리 없을 때 이동할 경로
}

export default function Header({
  children,
  title,
  showLogo = false,
  showPrevButton = false,
  showHomeButton = false,
  showSearchButton = false,
  onSearchClick,
  showBorder = false,
  fallbackUrl,
}: HeaderProps) {
  const router = useRouter();
  const handleGradeShareClick = useGradeShareAction();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else if (fallbackUrl) {
      router.replace(fallbackUrl); // push → replace: 현재 페이지를 히스토리에서 제거
    }
  };

  const mobileHeader = (
    <header
      className={`relative flex h-[50px] items-center justify-between px-[20px] ${
        showBorder ? "border-b-[1px] border-b-gray-300" : ""
      } xl:hidden`}
    >
      {/* 왼쪽: 로고 또는 뒤로가기/홈 버튼 */}
      <div className="flex items-center gap-[12px]">
        {showLogo && (
          <Link href="/">
            <Image src="/logos/logo-blue-full.svg" alt="Logo" width={96} height={20} priority />
          </Link>
        )}
        {showPrevButton && (
          <button onClick={handleBack} className="flex h-[20px] w-[20px] cursor-pointer items-center">
            <PrevIcon size={14} />
          </button>
        )}
        {showHomeButton && (
          <Link href="/" className="flex h-[20px] w-[20px] cursor-pointer items-center">
            <HomeIcon size={20} />
          </Link>
        )}
      </div>

      {/* 중앙: 제목 */}
      {title && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="body-2 truncate">{title}</h1>
        </div>
      )}

      {/* 오른쪽: 검색 버튼 또는 children */}
      <div className="flex items-center gap-[12px]">
        {showSearchButton && (
          <button
            onClick={onSearchClick}
            className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center"
            aria-label="검색"
          >
            <SearchIcon size={18} />
          </button>
        )}
        {children}
      </div>
    </header>
  );

  const desktopHeader = (
    <header
      className={`hidden h-[70px] items-center bg-white px-[20px] xl:flex ${
        showBorder ? "border-b-[1px] border-b-gray-300" : ""
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <Link href="/">
          <Image src="/logos/logo-blue-full.svg" alt="Logo" width={120} height={24} priority />
        </Link>

        <div className="flex items-center gap-[80px]">
          <nav className="flex items-center gap-[40px]" aria-label="주요 메뉴">
            <NavigationCard href="https://pf.kakao.com/_xaxdQLn" label="문의하기" openInNewTab>
              <WriteIcon />
            </NavigationCard>

            <NavigationCard label="성적 공유" onClick={handleGradeShareClick}>
              <GradeIcon />
            </NavigationCard>

            <NavigationCard href="/community" label="커뮤니티" showNewBadge>
              <CommunityIcon />
            </NavigationCard>
          </nav>

          <div className="flex items-center">{children}</div>
        </div>
      </div>
    </header>
  );

  return (
    <>
      {mobileHeader}
      {desktopHeader}
    </>
  );
}
