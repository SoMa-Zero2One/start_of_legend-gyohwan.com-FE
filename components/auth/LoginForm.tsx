"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginWithEmail } from "@/lib/api/auth";
import { getRedirectUrl, clearRedirectUrl } from "@/lib/utils/redirect";
import { useAuthStore } from "@/stores/authStore";
import { handleApiError } from "@/lib/utils/apiError";
import PasswordInput from "./PasswordInput";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selector를 사용하여 fetchUser만 구독 (함수는 안 바뀌므로 리렌더링 방지)
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 가져오기 (URL 파라미터 우선, 없으면 SessionStorage)
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const emailFromStorage = sessionStorage.getItem("pendingEmail");
    const finalEmail = emailFromUrl || emailFromStorage || "";

    if (!finalEmail) {
      // 이메일이 없으면 처음 페이지로 리다이렉트
      router.push("/log-in-or-create-account");
      return;
    }

    setEmail(finalEmail);
  }, [searchParams, router]);

  // 이메일 편집
  const handleEdit = () => {
    sessionStorage.removeItem("pendingEmail");
    router.push("/log-in-or-create-account");
  };

  // 로그인 처리
  const handleLogin = async () => {
    setError("");

    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 이메일 로그인 API 호출
      await loginWithEmail(email, password);

      // 성공 시 세션 정리
      sessionStorage.removeItem("pendingEmail");

      // 사용자 정보 가져오기
      await fetchUser();

      // 리다이렉트 URL 확인
      const redirectUrl = getRedirectUrl();

      if (redirectUrl) {
        clearRedirectUrl();
        router.push(redirectUrl);
      } else {
        // redirectUrl 없으면 홈으로
        router.push("/");
      }
    } catch (error) {
      // 모든 에러 타입 처리 (네트워크 에러, API 에러 등)
      const errorMessage = handleApiError(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && password && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="flex flex-col gap-[10px]">
      {/* 이메일 표시 */}
      <div className="mb-[10px] flex items-center gap-2 rounded-[4px] bg-gray-100 p-3">
        <input type="email" value={email} disabled className="flex-1 bg-transparent text-gray-700 outline-none" />
        <button onClick={handleEdit} className="text-primary-blue cursor-pointer hover:text-blue-700">
          편집
        </button>
      </div>

      {/* 비밀번호 입력 */}
      <PasswordInput
        value={password}
        onChange={setPassword}
        onKeyDown={handleKeyDown}
        placeholder="비밀번호를 입력하세요"
        disabled={isLoading}
        showTooltip={false}
        showValidation={false}
        autoFocus={true}
      />

      {/* 에러 메시지 */}
      {error && <p className="text-error-red">{error}</p>}

      {/* 비밀번호 찾기 */}
      <button
        type="button"
        onClick={() => router.push(`/find-password?email=${encodeURIComponent(email)}`)}
        className="body-2 mb-[10px] cursor-pointer text-left hover:underline"
      >
        비밀번호를 잊으셨나요?
      </button>

      {/* 계속 버튼 */}
      <button
        onClick={handleLogin}
        disabled={!password || isLoading}
        className="medium-body-3 w-full cursor-pointer rounded-lg bg-black px-4 py-3 text-white disabled:cursor-default disabled:bg-gray-300 disabled:text-gray-700"
      >
        {isLoading ? "로그인 중..." : "계속"}
      </button>
    </div>
  );
}
