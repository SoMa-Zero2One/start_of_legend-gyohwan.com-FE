import { Suspense } from "react";
import OAuthCallbackClient from "./OAuthCallbackClient";

interface OAuthCallbackPageProps {
  params: Promise<{ provider: string }>;
}

export default async function OAuthCallback({ params }: OAuthCallbackPageProps) {
  const { provider } = await params;

  // Provider 유효성 검사 (타입 가드)
  const isValidProvider = (provider: string): provider is "google" | "kakao" => {
    return provider === "google" || provider === "kakao";
  };

  if (!isValidProvider(provider)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center text-red-500">
          <p className="body-1">지원하지 않는 로그인 방식입니다.</p>
        </div>
      </div>
    );
  }

  // 여기서는 params.provider가 "google" | "kakao" 타입으로 좁혀짐
  return (
    <Suspense fallback={null}>
      <OAuthCallbackClient provider={provider} />
    </Suspense>
  );
}
