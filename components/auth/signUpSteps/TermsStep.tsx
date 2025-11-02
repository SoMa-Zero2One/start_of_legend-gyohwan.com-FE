"use client";

import RoundCheckbox from "@/components/common/RoundCheckbox";

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
      <div className="flex flex-col gap-[12px]">
        {/* 이용약관 */}
        <div className="flex flex-col gap-[20px]">
          {/* 전체 동의 */}
          <RoundCheckbox checked={allChecked} onChange={handleAllAgreeChange} label="다음 사항에 모두 동의합니다" />

          <hr className="border-t border-gray-300" />

          {/* 이용약관 */}
          <RoundCheckbox checked={agreeTerms} onChange={onAgreeTermsChange} label="이용약관 (필수)" />

          {/* 개인정보 수집 및 이용 */}
          <RoundCheckbox checked={agreePrivacy} onChange={onAgreePrivacyChange} label="개인정보 수집 및 이용 (필수)" />
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && <p className="caption-2">{error}</p>}

      {/* 계속 버튼 */}
      <button
        onClick={onSubmit}
        disabled={!agreeTerms || !agreePrivacy || isLoading}
        className="btn-secondary w-full rounded-[4px] p-[12px]"
      >
        {isLoading ? "처리 중..." : "계속"}
      </button>
    </div>
  );
}
