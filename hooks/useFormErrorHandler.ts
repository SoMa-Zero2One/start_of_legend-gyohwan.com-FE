import { useState, useRef, useEffect } from "react";

/**
 * 폼 에러 처리 커스텀 훅
 * 에러 메시지 표시와 shake 애니메이션을 관리합니다.
 * 메모리 누수 방지를 위해 타이머를 자동으로 cleanup 합니다.
 */
export function useFormErrorHandler() {
  const [tooltipMessage, setTooltipMessage] = useState("");
  const [shouldShake, setShouldShake] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 컴포넌트 언마운트 시 타이머 정리
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * 에러 메시지를 표시하고 일정 시간 후 자동으로 숨깁니다.
   * 이전 타이머가 있으면 취소하고 새로운 타이머를 시작합니다.
   * @param message - 표시할 에러 메시지
   * @param duration - 메시지 표시 시간 (밀리초, 기본값: 2000ms)
   */
  const showError = (message: string, duration = 2000) => {
    // 이전 타이머가 있으면 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setTooltipMessage(message);
    setShouldShake(true);

    // 새로운 타이머 시작
    timeoutRef.current = setTimeout(() => {
      setTooltipMessage("");
      setShouldShake(false);
      timeoutRef.current = null;
    }, duration);
  };

  /**
   * 에러 메시지와 shake 상태를 즉시 초기화합니다.
   * 진행 중인 타이머도 취소합니다.
   */
  const clearError = () => {
    // 진행 중인 타이머 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setTooltipMessage("");
    setShouldShake(false);
  };

  return {
    tooltipMessage,
    shouldShake,
    showError,
    clearError,
  };
}
