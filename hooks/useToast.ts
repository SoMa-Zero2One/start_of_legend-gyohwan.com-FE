import { useState, useRef, useEffect } from "react";

/**
 * Toast 에러 메시지 처리 커스텀 훅
 * 에러 메시지 표시와 자동 숨김을 관리합니다.
 * 메모리 누수 방지를 위해 타이머를 자동으로 cleanup 합니다.
 */
export function useToast() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 컴포넌트 언마운트 시 타이머 정리
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  /**
   * 에러 Toast를 표시하고 일정 시간 후 자동으로 숨깁니다.
   * 이전 타이머가 있으면 취소하고 새로운 타이머를 시작합니다.
   * @param message - 표시할 에러 메시지
   * @param duration - 메시지 표시 시간 (밀리초, 기본값: 1500ms)
   */
  const showError = (message: string, duration = 1500) => {
    // 이전 타이머가 있으면 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
    }

    setIsExiting(false);
    setErrorMessage(message);

    // fade-out 시작 타이머
    timeoutRef.current = setTimeout(() => {
      setIsExiting(true);
      // fade-out 애니메이션 후 제거
      exitTimeoutRef.current = setTimeout(() => {
        setErrorMessage(null);
        setIsExiting(false);
        timeoutRef.current = null;
        exitTimeoutRef.current = null;
      }, 300); // fade-out 애니메이션 시간
    }, duration);
  };

  /**
   * Toast를 즉시 숨깁니다.
   * 진행 중인 타이머도 취소합니다.
   */
  const hideToast = () => {
    // 진행 중인 타이머 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsExiting(true);
    // fade-out 애니메이션 후 제거
    exitTimeoutRef.current = setTimeout(() => {
      setErrorMessage(null);
      setIsExiting(false);
      exitTimeoutRef.current = null;
    }, 300);
  };

  return {
    errorMessage,
    isExiting,
    showError,
    hideToast,
  };
}
