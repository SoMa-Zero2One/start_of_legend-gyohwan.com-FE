"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import RoundCheckbox from "@/components/common/RoundCheckbox";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useAuthStore } from "@/stores/authStore";
import { withdrawAccount } from "@/lib/api/user";
import { saveRedirectUrl } from "@/lib/utils/redirect";
import { useModalHistory } from "@/hooks/useModalHistory";

function DeleteAccountContent() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuthStore();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // 모달 히스토리 관리
  const { isOpen: showConfirmModal, openModal, closeModal } = useModalHistory({ modalKey: "confirm" });

  // 로그인 체크 - Hard-gate
  useEffect(() => {
    if (authLoading || isWithdrawing) return;

    if (!user) {
      saveRedirectUrl("/delete-account");
      router.push("/log-in-or-create-account");
    }
  }, [authLoading, user, router, isWithdrawing]);

  // 로딩 중이거나 리다이렉트 진행 중
  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="회원탈퇴" showPrevButton showBorder />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 회원 탈퇴 버튼 클릭
  const handleDeleteClick = () => {
    if (!isAgreed) return;
    setError(""); // 에러 초기화
    openModal();
  };

  // 최종 확인 후 회원 탈퇴 처리
  const handleConfirmDelete = async () => {
    // 보안: URL로 모달을 강제로 열어도 동의 체크
    if (!isAgreed) {
      closeModal();
      setError("회원 탈퇴에 동의해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");
    setIsWithdrawing(true); // 탈퇴 진행 중 플래그 설정

    try {
      await withdrawAccount();

      // 탈퇴 성공 - 로그아웃 처리
      logout();

      // isWithdrawing 플래그로 인해 useEffect가 간섭하지 않음
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "회원 탈퇴에 실패했습니다.");
      closeModal();
      setIsWithdrawing(false); // 실패 시 플래그 해제
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="회원탈퇴" showPrevButton showBorder />

      <div className="flex flex-1 flex-col items-center pt-[30px] pb-[36px]">
        <div className="flex w-full flex-col items-center px-[20px]">
          <div className="flex w-[330px] flex-col gap-[20px]">
            {/* 헤더 */}
            <div>
              <h1 className="head-4">탈퇴 전 다시 한번 확인하세요.</h1>
            </div>

            {/* 안내사항 */}
            <ul className="flex flex-col gap-[12px]">
              <li className="body-3 flex gap-[8px] text-gray-700">
                <span className="shrink-0">•</span>
                <span>탈퇴 신청 후 30일이 지나면 모든 데이터가 완전히 삭제되며 복구가 불가능합니다.</span>
              </li>
              <li className="body-3 flex gap-[8px] text-gray-700">
                <span className="shrink-0">•</span>
                <span>단, 성적 공유 기록은 개인 정보와 분리되어 통계 목적으로만 보관됩니다.</span>
              </li>
              <li className="body-3 flex gap-[8px] text-gray-700">
                <span className="shrink-0">•</span>
                <span>탈퇴 후 30일 동안은 동일 이메일로 재가입이 제한됩니다.</span>
              </li>
            </ul>

            {/* 동의 체크박스 */}
            <div className="body-3 mb-[20px]">
              <RoundCheckbox checked={isAgreed} onChange={setIsAgreed} label="다음 사항에 모두 동의합니다" />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="body-3 text-red-600">{error}</p>
              </div>
            )}

            {/* 회원 탈퇴 버튼 */}
            <button
              onClick={handleDeleteClick}
              disabled={!isAgreed || isLoading}
              className="medium-body-3 w-full cursor-pointer rounded-lg bg-black px-4 py-3 text-white disabled:cursor-default disabled:bg-gray-300 disabled:text-gray-700"
            >
              {isLoading ? "처리 중..." : "회원 탈퇴"}
            </button>
          </div>
        </div>
      </div>

      {/* 최종 확인 모달 */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="정말 탈퇴하시겠습니까?"
        message="탈퇴 신청 후 30일이 지나면 모든 데이터가 완전히 삭제되며 복구가 불가능합니다."
        confirmText="탈퇴하기"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={closeModal}
      />
    </div>
  );
}

export default function DeleteAccountPage() {
  return (
    <Suspense fallback={null}>
      <DeleteAccountContent />
    </Suspense>
  );
}
