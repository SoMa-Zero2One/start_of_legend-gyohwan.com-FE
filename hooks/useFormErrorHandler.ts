import { useState } from "react";

/**
 * 폼 에러 처리 커스텀 훅
 * 에러 메시지 표시와 shake 애니메이션을 관리합니다.
 */
export function useFormErrorHandler() {
  const [tooltipMessage, setTooltipMessage] = useState("");
  const [shouldShake, setShouldShake] = useState(false);

  /**
   * 에러 메시지를 표시하고 일정 시간 후 자동으로 숨깁니다.
   * @param message - 표시할 에러 메시지
   * @param duration - 메시지 표시 시간 (밀리초, 기본값: 2000ms)
   */
  const showError = (message: string, duration = 2000) => {
    setTooltipMessage(message);
    setShouldShake(true);
    setTimeout(() => {
      setTooltipMessage("");
      setShouldShake(false);
    }, duration);
  };

  /**
   * 에러 메시지와 shake 상태를 즉시 초기화합니다.
   */
  const clearError = () => {
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
