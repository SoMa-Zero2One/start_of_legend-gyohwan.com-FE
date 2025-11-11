"use client";

import Link from "next/link";
import PaginationFirstIcon from "@/components/icons/PaginationFirstIcon";
import PaginationPrevIcon from "@/components/icons/PaginationPrevIcon";
import PaginationNextIcon from "@/components/icons/PaginationNextIcon";
import PaginationLastIcon from "@/components/icons/PaginationLastIcon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string; // 예: "/community/country/US/talks"
  // TODO: searchParams 보존 기능 추가
  // 검색/필터 기능 추가 시, 기존 쿼리 파라미터를 유지하도록 개선 필요
  // searchParams?: Record<string, string>;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // 페이지 번호 생성 (현재 페이지 기준 앞뒤 2개씩 = 총 5개)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // 버튼 표시 여부
  const showFirstLast = totalPages > 10; // 맨 처음/끝 버튼 (총 페이지 10개 초과 시)
  const showPrev = currentPage > 10; // 10개 이전 버튼 (<)
  const showNext = currentPage + 10 <= totalPages; // 10개 다음 버튼 (>)

  // TODO: 현재 searchParams를 복사하여 page만 변경하도록 개선
  // 예: const params = new URLSearchParams(searchParams);
  //     params.set('page', page.toString());
  //     href={`${baseUrl}?${params.toString()}`}

  return (
    <nav
      className="flex items-center justify-center gap-[8px] py-[20px]"
      role="navigation"
      aria-label="페이지 네비게이션"
    >
      {/* 맨 처음 (<<) - 총 페이지 10개 초과 시만 표시 */}
      {showFirstLast && (
        <Link
          href={`${baseUrl}?page=1`}
          className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[4px] transition-colors hover:bg-gray-100"
          aria-label="첫 페이지"
        >
          <PaginationFirstIcon size={24} />
        </Link>
      )}

      {/* 10개 이전 (<) - 조건부 렌더링 */}
      {showPrev && (
        <Link
          href={`${baseUrl}?page=${Math.max(1, currentPage - 10)}`}
          className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[4px] transition-colors hover:bg-gray-100"
          aria-label="10개 이전 페이지"
        >
          <PaginationPrevIcon size={24} />
        </Link>
      )}

      {/* 페이지 번호들 */}
      {pageNumbers.map((page) => {
        const isActive = page === currentPage;

        return (
          <Link
            key={page}
            href={`${baseUrl}?page=${page}`}
            className={`flex h-[32px] min-w-[32px] cursor-pointer items-center justify-center rounded-[4px] px-[8px] body-3 transition-colors ${
              isActive
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
            aria-label={`${page}페이지`}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </Link>
        );
      })}

      {/* 10개 다음 (>) - 조건부 렌더링 */}
      {showNext && (
        <Link
          href={`${baseUrl}?page=${Math.min(totalPages, currentPage + 10)}`}
          className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[4px] transition-colors hover:bg-gray-100"
          aria-label="10개 다음 페이지"
        >
          <PaginationNextIcon size={24} />
        </Link>
      )}

      {/* 맨 끝 (>>) - 총 페이지 10개 초과 시만 표시 */}
      {showFirstLast && (
        <Link
          href={`${baseUrl}?page=${totalPages}`}
          className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[4px] transition-colors hover:bg-gray-100"
          aria-label="마지막 페이지"
        >
          <PaginationLastIcon size={24} />
        </Link>
      )}
    </nav>
  );
}
