"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import PasswordInput from "@/components/auth/PasswordInput";
import { useAuthStore } from "@/stores/authStore";
import { changePassword } from "@/lib/api/user";
import { saveRedirectUrl } from "@/lib/utils/redirect";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 포커스 상태 관리
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [newPasswordConfirmFocused, setNewPasswordConfirmFocused] = useState(false);

  // 로그인 체크 - Hard-gate
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      saveRedirectUrl("/change-password");
      router.push("/log-in-or-create-account");
      return;
    }

    // BASIC 로그인 사용자만 접근 가능
    if (user.loginType === "SOCIAL") {
      alert("소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다.");
      router.push("/my-page");
    }
  }, [authLoading, user, router]);

  // 로딩 중이거나 리다이렉트 진행 중
  if (authLoading || !user || user.loginType === "SOCIAL") {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="비밀번호 변경" showPrevButton />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 새 비밀번호 유효성 검증
  const isNewPasswordValid = newPassword.length >= 12;

  // 비밀번호 확인 일치 여부
  const isPasswordMatch = newPassword === newPasswordConfirm && newPasswordConfirm.length > 0;

  // 모든 필드 입력 완료 및 검증 통과 여부
  const isFormValid =
    currentPassword.length > 0 && newPassword.length >= 12 && newPasswordConfirm.length > 0 && isPasswordMatch;

  // 비밀번호 변경 처리
  const handleChangePassword = async () => {
    setError("");

    // 추가 검증
    if (!isNewPasswordValid) {
      setError("새 비밀번호는 12자 이상이어야 합니다.");
      return;
    }

    if (!isPasswordMatch) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(currentPassword, newPassword);

      // 성공 시 마이페이지로 리다이렉트
      alert("비밀번호가 성공적으로 변경되었습니다.");
      router.push("/my-page");
    } catch (error) {
      if (error instanceof Error) {
        // 에러 메시지에서 HTTP 상태 코드 확인
        if (error.message.includes("401") || error.message.includes("403")) {
          setError("현재 비밀번호가 올바르지 않습니다.");
        } else {
          setError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
        }
      } else {
        setError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isFormValid && !isLoading) {
      handleChangePassword();
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="비밀번호 변경" showPrevButton />

      <div className="flex flex-1 flex-col items-center pt-[60px] pb-[36px]">
        <div className="flex w-full flex-col items-center px-[10px]">
          <div className="flex w-[330px] flex-col gap-[12px]">
            {/* 현재 비밀번호 */}
            <div className="flex flex-col gap-[8px]">
              <label className="medium-body-3">현재 비밀번호</label>
              <PasswordInput
                value={currentPassword}
                onChange={setCurrentPassword}
                onKeyDown={handleKeyDown}
                placeholder="기존 비밀번호를 입력하세요."
                disabled={isLoading}
                showValidation={false}
                showTooltip={false}
              />
            </div>

            {/* 변경할 비밀번호 */}
            <div className="flex flex-col gap-[8px]">
              <label className="medium-body-3">변경할 비밀번호</label>
              <PasswordInput
                value={newPassword}
                onChange={setNewPassword}
                onFocus={() => setNewPasswordFocused(true)}
                onBlur={() => setNewPasswordFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="변경할 비밀번호를 입력하세요."
                disabled={isLoading}
                showValidation={newPassword.length > 0 && (!isNewPasswordValid || newPasswordFocused)}
                isValid={isNewPasswordValid}
                validationMessage={isNewPasswordValid ? "사용 가능한 비밀번호입니다" : "12자 이상 입력해주세요"}
                showTooltip={true}
                tooltipMessage="12자 이상"
              />
            </div>

            {/* 한 번 더 입력 */}
            <div className="flex flex-col gap-[8px]">
              <label className="medium-body-3">한 번 더 입력</label>
              <PasswordInput
                value={newPasswordConfirm}
                onChange={setNewPasswordConfirm}
                onFocus={() => setNewPasswordConfirmFocused(true)}
                onBlur={() => setNewPasswordConfirmFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="변경할 비밀번호를 한 번 더 입력하세요."
                disabled={isLoading}
                showValidation={newPasswordConfirm.length > 0 && (!isPasswordMatch || newPasswordConfirmFocused)}
                isValid={isPasswordMatch}
                validationMessage={isPasswordMatch ? "비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다"}
                showTooltip={false}
              />
            </div>

            {/* 에러 메시지 */}
            {error && <p className="text-error-red body-3">{error}</p>}

            {/* 변경하기 버튼 */}
            <button
              onClick={handleChangePassword}
              disabled={!isFormValid || isLoading}
              className="medium-body-3 w-full cursor-pointer rounded-lg bg-black px-4 py-3 text-white disabled:cursor-default disabled:bg-gray-300 disabled:text-gray-700"
            >
              {isLoading ? "변경 중..." : "변경하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
