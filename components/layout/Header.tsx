"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PrevIcon from "@/components/icons/PrevIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import NavigationCard from "@/components/home/NavigationCard";
import CommunityIcon from "@/components/icons/CommunityIcon";
import WriteIcon from "@/components/icons/WriteIcon";

interface HeaderProps {
  children?: React.ReactNode;
  title?: string;
  showLogo?: boolean;
  showPrevButton?: boolean;
  showHomeButton?: boolean;
  showSearchButton?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showBorder?: boolean;
  fallbackUrl?: string; // 뒤로가기 히스토리 없을 때 이동할 경로
  showDesktopNav?: boolean; // 데스크탑 글로벌 네비게이션 표시 (HomePage 전용)
}

export default function Header({
  children,
  title,
  showLogo = false,
  showPrevButton = false,
  showHomeButton = false,
  showSearchButton = false,
  searchQuery = "",
  onSearchChange,
  showBorder = false,
  fallbackUrl,
  showDesktopNav = false,
}: HeaderProps) {
  const [isSearchMode, setIsSearchMode] = useState(false);

  const handleSearchClick = () => {
    setIsSearchMode(true);
  };

  const handleSearchCancel = () => {
    setIsSearchMode(false);
    onSearchChange?.("");
  };

  // 검색 모드
  if (isSearchMode && showSearchButton) {
    return (
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onCancel={handleSearchCancel}
        showBorder={showBorder}
        showPrevButton={showPrevButton}
        fallbackUrl={fallbackUrl}
      />
    );
  }

  // 데스크탑 네비게이션 모드 (HomePage 전용)
  if (showDesktopNav) {
    return (
      <>
        {/* 모바일 헤더 (기존) */}
        <div className="2xl:hidden">
          <NormalHeader
            title={title}
            showLogo={showLogo}
            showPrevButton={showPrevButton}
            showHomeButton={showHomeButton}
            showSearchButton={showSearchButton}
            onSearchClick={handleSearchClick}
            showBorder={showBorder}
            fallbackUrl={fallbackUrl}
          >
            {children}
          </NormalHeader>
        </div>

        {/* 데스크탑 헤더 */}
        <DesktopNavHeader showBorder={showBorder}>{children}</DesktopNavHeader>
      </>
    );
  }

  // 일반 모드
  return (
    <NormalHeader
      title={title}
      showLogo={showLogo}
      showPrevButton={showPrevButton}
      showHomeButton={showHomeButton}
      showSearchButton={showSearchButton}
      onSearchClick={handleSearchClick}
      showBorder={showBorder}
      fallbackUrl={fallbackUrl}
    >
      {children}
    </NormalHeader>
  );
}

// 🔍 검색 모드 Header
function SearchHeader({
  searchQuery,
  onSearchChange,
  onCancel,
  showBorder,
  showPrevButton,
  fallbackUrl,
}: {
  searchQuery: string;
  onSearchChange?: (query: string) => void;
  onCancel: () => void;
  showBorder: boolean;
  showPrevButton: boolean;
  fallbackUrl?: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else if (fallbackUrl) {
      router.replace(fallbackUrl); // push → replace: 현재 페이지를 히스토리에서 제거
    }
  };

  return (
    <header
      className={`flex h-[50px] items-center gap-3 px-[20px] ${showBorder ? "border-b-[1px] border-b-gray-300" : ""}`}
    >
      {showPrevButton && (
        <button
          onClick={handleBack}
          className="flex h-[20px] w-[20px] flex-shrink-0 cursor-pointer items-center"
        >
          <PrevIcon size={14} />
        </button>
      )}

      <div className="relative flex flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="대학명 또는 국가로 검색..."
          className="w-full rounded-[4px] bg-gray-100 py-2 pr-14 pl-10 text-[14px] focus:outline-none"
          autoFocus
        />
        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
          <SearchIcon size={16} />
        </div>
        <button
          onClick={onCancel}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[14px] text-gray-600 hover:text-gray-900"
        >
          취소
        </button>
      </div>
    </header>
  );
}

// 🧭 일반 모드 Header
function NormalHeader({
  children,
  title,
  showLogo,
  showPrevButton,
  showHomeButton,
  showSearchButton,
  onSearchClick,
  showBorder,
  fallbackUrl,
}: {
  children?: React.ReactNode;
  title?: string;
  showLogo: boolean;
  showPrevButton: boolean;
  showHomeButton: boolean;
  showSearchButton: boolean;
  onSearchClick: () => void;
  showBorder: boolean;
  fallbackUrl?: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else if (fallbackUrl) {
      router.replace(fallbackUrl); // push → replace: 현재 페이지를 히스토리에서 제거
    }
  };

  return (
    <header
      className={`relative flex h-[50px] items-center justify-between px-[20px] ${
        showBorder ? "border-b-[1px] border-b-gray-300" : ""
      }`}
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
}

// 🖥️ 데스크탑 네비게이션 Header (HomePage 전용)
function DesktopNavHeader({
  children,
  showBorder,
}: {
  children?: React.ReactNode;
  showBorder: boolean;
}) {
  return (
    <header
      className={`hidden h-[70px] items-center bg-white px-[80px] 2xl:flex ${
        showBorder ? "border-b-[1px] border-b-gray-300" : ""
      }`}
    >
      <div className="flex w-full items-center justify-between">
        {/* 로고 */}
        <Link href="/">
          <Image src="/logos/logo-blue-full.svg" alt="Logo" width={120} height={24} priority />
        </Link>

        <div className="flex items-center gap-[80px]">
          {/* 네비게이션 메뉴 */}
          <nav className="flex items-center gap-[40px]" aria-label="주요 메뉴">
            <NavigationCard href="https://pf.kakao.com/_xaxdQLn" label="문의하기" openInNewTab>
              <WriteIcon />
            </NavigationCard>

            <NavigationCard href="/community" label="커뮤니티" showNewBadge>
              <CommunityIcon />
            </NavigationCard>
          </nav>

          {/* 로그인/회원가입 또는 프로필 */}
          <div className="flex items-center">{children}</div>
        </div>
      </div>
    </header>
  );
}
