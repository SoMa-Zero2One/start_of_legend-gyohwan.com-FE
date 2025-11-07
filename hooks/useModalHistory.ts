"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface UseModalHistoryOptions {
  /**
   * URL 쿼리에 사용할 모달 키
   * @example 'confirm', 'university-search', 'submit'
   */
  modalKey: string;
}

/**
 * 브라우저 히스토리와 동기화되는 모달 상태 관리 hook
 *
 * @example
 * ```tsx
 * // 단일 모달 사용
 * const { isOpen, openModal, closeModal } = useModalHistory({ modalKey: 'confirm' });
 *
 * <button onClick={openModal}>모달 열기</button>
 * <Modal isOpen={isOpen} onClose={closeModal} />
 * ```
 *
 * @example
 * ```tsx
 * // 여러 모달 사용 (applications/new)
 * const universitySearch = useModalHistory({ modalKey: 'university-search' });
 * const submit = useModalHistory({ modalKey: 'submit' });
 *
 * <UniversitySearchModal isOpen={universitySearch.isOpen} onClose={universitySearch.closeModal} />
 * <SubmitModal isOpen={submit.isOpen} onClose={submit.closeModal} />
 * ```
 *
 * 동작 방식:
 * 1. 모달 열기: router.push로 ?modal=xxx 추가 (히스토리 스택에 추가)
 * 2. 모달 닫기:
 *    - push로 열었던 경우: router.back() (방금 추가한 히스토리 제거)
 *    - URL 직접 진입: router.replace() (현재 URL만 수정)
 * 3. 브라우저 뒤로가기 감지: searchParams 변경으로 자동 동기화
 */
export function useModalHistory({ modalKey }: UseModalHistoryOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 모달 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);

  // 이번에 openModal()로 push 했는지 추적
  const pushedHistoryRef = useRef(false);

  // URL 변경 감지 및 모달 상태 동기화
  useEffect(() => {
    const hasModalParam = searchParams.get("modal") === modalKey;
    setIsOpen(hasModalParam);

    // 뒤로가기로 모달이 닫혔으면 pushed 플래그 초기화
    if (!hasModalParam) {
      pushedHistoryRef.current = false;
    }
  }, [searchParams, modalKey]);

  /**
   * 모달 열기
   * - URL에 ?modal=xxx 추가
   * - 히스토리 스택에 새 항목 추가
   */
  const openModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", modalKey);

    // 현재 경로에 쿼리스트링 추가 (shallow routing)
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    pushedHistoryRef.current = true;
    setIsOpen(true);
  };

  /**
   * 모달 닫기
   * - push로 열었던 경우: router.back() (히스토리 제거)
   * - URL 직접 진입: router.replace() (URL만 수정)
   * - Optimistic UI: 즉시 상태 업데이트로 빠른 피드백
   */
  const closeModal = () => {
    // 즉시 모달 닫기 (Optimistic UI)
    setIsOpen(false);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");

    // 케이스 1: openModal()로 push 했던 경우 → back으로 히스토리 제거
    if (pushedHistoryRef.current) {
      router.back();
      pushedHistoryRef.current = false;
    }
    // 케이스 2: URL 직접 진입 (처음부터 ?modal=xxx로 진입) → replace로 URL만 수정
    else {
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    }
  };

  return {
    /**
     * 모달 열림 상태
     */
    isOpen,

    /**
     * 모달 열기 함수
     */
    openModal,

    /**
     * 모달 닫기 함수
     */
    closeModal,
  };
}
