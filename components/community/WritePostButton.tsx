"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useModalHistory } from "@/hooks/useModalHistory";
import { revalidateCommunityPage } from "@/app/actions/community";
import PostCreateModal from "./PostCreateModal";

const MODAL_KEY = "write";

interface WritePostButtonProps {
  countryCode?: string; // 국가 커뮤니티
  outgoingUnivId?: number; // 대학 커뮤니티
}

/**
 * 글쓰기 버튼 컴포넌트
 *
 * USAGE:
 * - 국가 커뮤니티 페이지: "커뮤니티" 제목 옆
 * - 대학 커뮤니티 페이지: "커뮤니티" 제목 옆
 *
 * WHAT: PostCreateModal을 여는 버튼 (URL 기반 모달)
 *
 * WHY:
 * - useModalHistory로 브라우저 뒤로가기와 동기화
 * - URL에 ?modal=write 파라미터로 모달 상태 관리
 * - Server Action (revalidatePath)으로 서버 캐시 무효화
 * - 대학 페이지에서는 ?tab=커뮤니티 유지하여 탭 상태 보존
 *
 * @param countryCode 국가 코드 (국가 커뮤니티)
 * @param outgoingUnivId 대학 ID (대학 커뮤니티)
 */
export default function WritePostButton({ countryCode, outgoingUnivId }: WritePostButtonProps) {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModalHistory({ modalKey: MODAL_KEY });

  const handleSuccess = async () => {
    // 1. Server Action으로 캐시 무효화
    await revalidateCommunityPage(outgoingUnivId, countryCode);

    // 2. 모달 닫기
    closeModal();

    // 3. 대학 커뮤니티인 경우 커뮤니티 탭으로 이동
    if (outgoingUnivId) {
      router.push(`${window.location.pathname}?tab=커뮤니티`);
    } else {
      // 국가 커뮤니티는 현재 페이지 유지 (revalidate만 실행됨)
      router.refresh();
    }
  };

  return (
    <>
      <button onClick={openModal} className="cursor-pointer rounded-full bg-gray-300 px-[12px] py-[6px] text-[12px]">
        글 쓰러 가기
      </button>

      <PostCreateModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccess={handleSuccess}
        countryCode={countryCode}
        outgoingUnivId={outgoingUnivId}
      />
    </>
  );
}
