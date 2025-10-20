"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserMe } from "@/lib/api/user";
import Header from "@/components/layout/Header";

export default function CreateAccountComplete() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getUserMe();
        setNickname(user.nickname);
      } catch (err) {
        console.error("User info fetch error:", err);
        setError("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleGoHome = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-error-red">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col items-center px-[20px]">
        <div className="flex w-[330px] flex-col items-center gap-[60px] pt-[60px]">
          {/* 헤더 */}
          <div className="flex flex-col items-center gap-[12px] text-center">
            <h1 className="head-4">
              {nickname}님<br /> 환영합니다
            </h1>
            <p className="body-2 text-gray-900">교환학생 준비, 교환닷컴과 함께하세요.</p>
          </div>

          {/* 홈으로 버튼 */}
          <button onClick={handleGoHome} className="btn-primary">
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
