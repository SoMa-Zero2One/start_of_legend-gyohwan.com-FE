"use client";

import BaseModal from "@/components/common/BaseModal";
import type { Gpa, Language } from "@/types/grade";

interface ApplicationSubmitModalProps {
  isOpen: boolean;
  gpa: Gpa;
  language: Language;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ApplicationSubmitModal({
  isOpen,
  gpa,
  language,
  onConfirm,
  onCancel,
}: ApplicationSubmitModalProps) {
  // 어학 점수 포맷팅
  const formatLanguageScore = () => {
    if (language.score) {
      return `${language.testType} ${language.score}`;
    }
    if (language.grade) {
      return `${language.testType} ${language.grade}`;
    }
    return language.testType;
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onCancel} maxWidth="350px">
      {/* 제목 */}
      <h3 className="subhead-2 mb-[16px] text-center">입력하신 성적을 확인하세요</h3>

      {/* GPA 정보 박스 */}
      <div className="mb-[12px] rounded-[8px] bg-gray-100 py-[16px] text-center">
        <p className="medium-body-1 text-gray-900">
          {gpa.score} / {gpa.criteria}
        </p>
      </div>

      {/* 어학 점수 정보 박스 */}
      <div className="mb-[20px] rounded-[8px] bg-gray-100 py-[16px] text-center">
        <p className="medium-body-1 text-gray-900">{formatLanguageScore()}</p>
      </div>

      {/* 안내 문구 */}
      <p className="body-2 mb-[24px] text-center text-gray-700">
        지원서를 제출하시겠습니까?
        <br />
        제출 후 성적 정보는 수정할 수 없습니다.
        <br />
        (지망 대학은 변경 가능)
      </p>

      {/* 제출 버튼 */}
      <button onClick={onConfirm} className="btn-primary medium-body-2 mb-[12px] w-full rounded-[8px] py-[14px]">
        제출
      </button>

      {/* 다시 입력하기 버튼 */}
      <button
        onClick={onCancel}
        className="medium-body-2 w-full cursor-pointer rounded-[8px] bg-gray-400 py-[14px] text-white transition-colors hover:bg-gray-500"
      >
        다시 입력하기
      </button>
    </BaseModal>
  );
}
