"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PrevIcon from "@/components/icons/PrevIcon";

interface HeaderProps {
  children?: React.ReactNode;
  title?: string;
  showPrevButton?: boolean;
  showHomeButton?: boolean; // 홈 버튼 (전략실 메인으로)
  homeHref?: string; // 홈 버튼 링크
  showSearchButton?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showBorder?: boolean;
}

export default function Header({
  children,
  title,
  showPrevButton = false,
  showHomeButton = false,
  homeHref = "/",
  showSearchButton = false,
  searchQuery = "",
  onSearchChange,
  showBorder = true,
}: HeaderProps) {
  const [isSearchMode, setIsSearchMode] = useState(false);

  const handleSearchClick = () => {
    setIsSearchMode(true);
  };

  const handleSearchCancel = () => {
    setIsSearchMode(false);
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  // 검색 모드 Header
  if (isSearchMode && showSearchButton) {
    return (
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onCancel={handleSearchCancel}
        showBorder={showBorder}
        showHomeButton={showHomeButton}
        showPrevButton={showPrevButton}
        homeHref={homeHref}
      />
    );
  }

  // 일반 모드 Header
  return (
    <NormalHeader
      title={title}
      showPrevButton={showPrevButton}
      showHomeButton={showHomeButton}
      homeHref={homeHref}
      showSearchButton={showSearchButton}
      onSearchClick={handleSearchClick}
      showBorder={showBorder}
    >
      {children}
    </NormalHeader>
  );
}

// 검색 모드 Header 컴포넌트
function SearchHeader({
  searchQuery,
  onSearchChange,
  onCancel,
  showBorder,
  showHomeButton,
  showPrevButton,
  homeHref,
}: {
  searchQuery: string;
  onSearchChange?: (query: string) => void;
  onCancel: () => void;
  showBorder: boolean;
  showHomeButton: boolean;
  showPrevButton: boolean;
  homeHref: string;
}) {
  const router = useRouter();

  return (
    <header
      className={`flex h-[50px] items-center gap-3 px-[20px] ${showBorder ? "border-b-[1px] border-b-gray-500" : ""}`}
    >
      {/* 왼쪽: 홈 또는 뒤로 가기 버튼 유지 */}
      {showHomeButton ? (
        <Link href={homeHref} className="flex h-[20px] w-[20px] flex-shrink-0 cursor-pointer items-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
      ) : showPrevButton ? (
        <button
          onClick={() => router.back()}
          className="flex h-[20px] w-[20px] flex-shrink-0 cursor-pointer items-center"
        >
          <PrevIcon size={14} />
        </button>
      ) : null}

      {/* 검색 입력창 */}
      <div className="relative flex flex-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="대학명 또는 국가로 검색..."
          className="w-full rounded-[4px] bg-gray-100 px-4 py-2 pr-14 pl-10 text-[14px] focus:outline-none"
          autoFocus
        />
        <svg
          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
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

// 일반 모드 Header 컴포넌트
function NormalHeader({
  children,
  title,
  showPrevButton,
  showHomeButton,
  homeHref,
  showSearchButton,
  onSearchClick,
  showBorder,
}: {
  children?: React.ReactNode;
  title?: string;
  showPrevButton: boolean;
  showHomeButton: boolean;
  homeHref: string;
  showSearchButton: boolean;
  onSearchClick: () => void;
  showBorder: boolean;
}) {
  const router = useRouter();

  return (
    <header
      className={`flex h-[50px] items-center justify-between px-[20px] ${showBorder ? "border-b-[1px] border-b-gray-500" : ""}`}
    >
      {title ? (
        <div className="relative flex flex-1 items-center justify-center">
          {/* 왼쪽: 뒤로 가기 또는 홈 버튼 */}
          {showHomeButton ? (
            <Link href={homeHref} className="absolute left-0 flex h-[20px] w-[20px] cursor-pointer items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </Link>
          ) : showPrevButton ? (
            <button
              onClick={() => router.back()}
              className="absolute left-0 flex h-[20px] w-[20px] cursor-pointer items-center"
            >
              <PrevIcon size={14} />
            </button>
          ) : null}

          {/* 중앙: 제목 */}
          <h1 className="body-2">{title}</h1>

          {/* 오른쪽: 검색 버튼 */}
          {showSearchButton && (
            <button
              onClick={onSearchClick}
              className="absolute right-0 flex h-[20px] w-[20px] cursor-pointer items-center justify-center"
              aria-label="검색"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <>
          <Link href="/">
            <Image src="/logos/logo-blue-full.svg" alt="Logo" width={96} height={20} priority />
          </Link>
          {children}
        </>
      )}
    </header>
  );
}
