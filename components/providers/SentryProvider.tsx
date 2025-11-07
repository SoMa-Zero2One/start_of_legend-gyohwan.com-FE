"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Sentry 클라이언트 초기화 Provider
 * 브라우저에서 발생하는 에러를 추적합니다.
 */
export function SentryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Sentry 클라이언트 초기화
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

      // 클라이언트 사이드 에러 추적 설정
      integrations: [
        Sentry.replayIntegration({
          // 에러 발생 시 세션 리플레이 캡처
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],

      // 성능 모니터링 샘플링 비율 (0.0 ~ 1.0)
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

      // 세션 리플레이 샘플링 비율
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      // 환경 설정
      environment: process.env.NODE_ENV,

      // 디버그 모드 (개발 환경에서만)
      debug: process.env.NODE_ENV === "development",

      // 에러 필터링
      beforeSend(event, hint) {
        if (process.env.NODE_ENV === "development") {
          console.error("Sentry Error:", hint.originalException || hint.syntheticException);
        }

        const error = hint.originalException;
        if (error instanceof Error) {
          // MSW 관련 에러 무시
          if (error.message.includes("MSW")) {
            return null;
          }
          // 취소된 요청 무시
          if (error.message.includes("aborted")) {
            return null;
          }
        }

        return event;
      },
    });
  }, []);

  return <>{children}</>;
}
