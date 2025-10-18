'use client';

interface TermsStepProps {
  agreeTerms: boolean;
  agreePrivacy: boolean;
  onAgreeTermsChange: (checked: boolean) => void;
  onAgreePrivacyChange: (checked: boolean) => void;
  onSubmit: () => void;
  error: string;
  isLoading: boolean;
}

export default function TermsStep({
  agreeTerms,
  agreePrivacy,
  onAgreeTermsChange,
  onAgreePrivacyChange,
  onSubmit,
  error,
  isLoading,
}: TermsStepProps) {
    // 전체 동의 체크 상태
  const allChecked = agreeTerms && agreePrivacy;

  // 전체 동의 토글 핸들러
  const handleAllAgreeChange = (checked: boolean) => {
    onAgreeTermsChange(checked);
    onAgreePrivacyChange(checked);
  };
  return (
    <div className="flex flex-col gap-[20px]">
      {/* 약관 체크박스 */}
      <div className="space-y-4">
        {/* 이용약관 */}
        <div className="flex flex-col gap-[20px]">
          {/* 전체 동의 */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => handleAllAgreeChange(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-[20px] h-[20px] rounded-full border-2 border-gray-300 peer-checked:border-[#056DFF] peer-checked:bg-[#056DFF] transition-all flex items-center justify-center">
                {allChecked && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-[15px] font-medium">
              다음 사항에 모두 동의합니다
            </span>
          </label>

          <hr className="border-t border-[#E5E5E5]" />

          {/* 이용약관 */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => onAgreeTermsChange(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-[20px] h-[20px] rounded-full border-2 border-gray-300 peer-checked:border-[#056DFF] peer-checked:bg-[#056DFF] transition-all flex items-center justify-center">
                {agreeTerms && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-[15px]">이용약관 (필수)</span>
          </label>

          {/* 개인정보 수집 및 이용 */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => onAgreePrivacyChange(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-[20px] h-[20px] rounded-full border-2 border-gray-300 peer-checked:border-[#056DFF] peer-checked:bg-[#056DFF] transition-all flex items-center justify-center">
                {agreePrivacy && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-[15px]">개인정보 수집 및 이용 (필수)</span>
          </label>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-[#FF4242] text-sm">{error}</p>
      )}

      {/* 계속 버튼 */}
      <button
        onClick={onSubmit}
        disabled={!agreeTerms || !agreePrivacy || isLoading}
        className="w-full py-3 px-4 bg-[#000000] text-[#FFFFFF] disabled:bg-[#ECECEC] disabled:text-[#7F7F7F]
                   font-medium rounded-lg
                   transition-colors cursor-pointer disabled:cursor-default"
      >
        {isLoading ? '처리 중...' : '계속'}
      </button>
    </div>
  );
}
