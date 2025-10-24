"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PrevIcon from "@/components/icons/PrevIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import HomeIcon from "@/components/icons/HomeIcon";

interface HeaderProps {
  children?: React.ReactNode;
  title?: string;
  showPrevButton?: boolean;
  showHomeButton?: boolean;
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
      />
    );
  }

  // 일반 모드
  return (
    <NormalHeader
      title={title}
      showPrevButton={showPrevButton}
      showHomeButton={showHomeButton}
      showSearchButton={showSearchButton}
      onSearchClick={handleSearchClick}
      showBorder={showBorder}
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
}: {
  searchQuery: string;
  onSearchChange?: (query: string) => void;
  onCancel: () => void;
  showBorder: boolean;
  showPrevButton: boolean;
}) {
  const router = useRouter();

  return (
    <header
      className={`flex h-[50px] items-center gap-3 px-[20px] ${showBorder ? "border-b-[1px] border-b-gray-500" : ""}`}
    >
      {showPrevButton && (
        <button
          onClick={() => router.back()}
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
  showPrevButton,
  showHomeButton,
  showSearchButton,
  onSearchClick,
  showBorder,
}: {
  children?: React.ReactNode;
  title?: string;
  showPrevButton: boolean;
  showHomeButton: boolean;
  showSearchButton: boolean;
  onSearchClick: () => void;
  showBorder: boolean;
}) {
  const router = useRouter();

  return (
    <header
      className={`flex h-[50px] items-center justify-between px-[20px] ${
        showBorder ? "border-b-[1px] border-b-gray-500" : ""
      }`}
    >
      {title ? (
        <div className="relative flex flex-1 items-center justify-center">
          {/* 왼쪽: 뒤로가기 + 홈 버튼 */}
          <div className="absolute left-0 flex items-center gap-[12px]">
            {showPrevButton && (
              <button onClick={() => router.back()} className="flex h-[20px] w-[20px] cursor-pointer items-center">
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
          <h1 className="body-2">{title}</h1>

          {/* 오른쪽: 검색 버튼 */}
          {showSearchButton && (
            <button
              onClick={onSearchClick}
              className="absolute right-0 flex h-[20px] w-[20px] cursor-pointer items-center justify-center"
              aria-label="검색"
            >
              <SearchIcon size={18} />
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
