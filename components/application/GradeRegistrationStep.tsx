"use client";

import { useState, useEffect } from "react";
import { createGpa } from "@/lib/api/gpa";
import { createLanguage } from "@/lib/api/language";
import type { Gpa, Language, CreateLanguageRequest } from "@/types/application";

interface GradeRegistrationStepProps {
  seasonId: number;
  existingGpa: Gpa | null;
  existingLanguage: Language | null;
  onSubmit: (gpaId: number, languageId: number) => void;
}

const GPA_CRITERIA_OPTIONS = [4.5, 4.3, 4.0];

const LANGUAGE_TEST_TYPES = [
  "TOEIC",
  "TOEFL IBT",
  "TOEFL ITP",
  "IELTS",
  "JLPT N1",
  "JLPT N2",
  "JLPT N3",
  "HSK 4급",
  "HSK 5급",
  "HSK 6급",
  "기타",
];

export default function GradeRegistrationStep({
  seasonId,
  existingGpa,
  existingLanguage,
  onSubmit,
}: GradeRegistrationStepProps) {
  // GPA 상태
  const [gpaScore, setGpaScore] = useState("");
  const [gpaCriteria, setGpaCriteria] = useState<number>(4.5);

  // 어학 성적 상태
  const [testType, setTestType] = useState("");
  const [score, setScore] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 기존 데이터로 초기화
  useEffect(() => {
    if (existingGpa) {
      setGpaScore(existingGpa.score.toString());
      setGpaCriteria(parseFloat(existingGpa.criteria));
    }

    if (existingLanguage) {
      // JLPT N1, HSK 1급 형태로 합쳐서 저장
      const displayTestType = existingLanguage.grade
        ? `${existingLanguage.testType} ${existingLanguage.grade}`
        : existingLanguage.testType;
      setTestType(displayTestType);
      setScore(existingLanguage.score || "");
    }
  }, [existingGpa, existingLanguage]);

  const handleSubmit = async () => {
    setError("");

    // 유효성 검사
    if (!gpaScore || parseFloat(gpaScore) <= 0) {
      setError("학점을 입력해주세요.");
      return;
    }

    if (!testType) {
      setError("어학 시험 종류를 선택해주세요.");
      return;
    }

    if (testType === "기타") {
      if (!score) {
        setError("어학 시험과 점수를 입력해주세요.");
        return;
      }
    } else {
      if (!score) {
        setError("점수를 입력해주세요.");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // GPA POST
      const gpaResponse = await createGpa({
        score: parseFloat(gpaScore),
        criteria: gpaCriteria,
      });

      // testType 파싱: "JLPT N1" -> testType: "JLPT", grade: "N1"
      let finalTestType = testType;
      let finalGrade: string | undefined = undefined;

      if (testType.startsWith("JLPT ")) {
        finalTestType = "JLPT";
        finalGrade = testType.replace("JLPT ", "");
      } else if (testType.startsWith("HSK ")) {
        finalTestType = "HSK";
        finalGrade = testType.replace("HSK ", "");
      }

      // Language POST
      const languageRequest: CreateLanguageRequest = {
        testType: finalTestType,
        score,
      };

      if (finalGrade) {
        languageRequest.grade = finalGrade;
      }

      const languageResponse = await createLanguage(languageRequest);

      // 성공 시 부모 컴포넌트로 ID 전달
      onSubmit(gpaResponse.gpaId, languageResponse.languageId);
    } catch (error) {
      console.error("Submit error:", error);
      setError("성적 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-[20px] pt-[24px] pb-[100px]">
        {/* Step 타이틀 */}
        <p className="caption-1 text-primary-blue mb-[8px]">Step 01</p>
        <h1 className="head-4 mb-[32px]">성적 등록하기</h1>

        {/* 학점 입력 */}
        <section className="mb-[32px]">
          <label className="body-2 mb-[12px] block font-semibold">학점</label>
          <div className="flex gap-[12px]">
            <input
              type="number"
              placeholder="점수를 입력하세요."
              value={gpaScore}
              onChange={(e) => setGpaScore(e.target.value)}
              className="body-2 focus:border-primary-blue flex-1 rounded-[8px] border border-gray-300 px-[16px] py-[14px] focus:outline-none"
            />
            <select
              value={gpaCriteria}
              onChange={(e) => setGpaCriteria(parseFloat(e.target.value))}
              className="body-2 focus:border-primary-blue flex-1 rounded-[8px] border border-gray-300 px-[16px] py-[14px] focus:outline-none"
            >
              {GPA_CRITERIA_OPTIONS.map((criteria) => (
                <option key={criteria} value={criteria}>
                  {criteria} 만점
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* 어학 성적 입력 */}
        <section>
          <label className="body-2 mb-[12px] block font-semibold">어학</label>
          <div className="flex flex-col gap-[12px]">
            {/* 시험 종류 선택 */}
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="body-2 focus:border-primary-blue flex-1 rounded-[8px] border border-gray-300 px-[16px] py-[14px] focus:outline-none"
            >
              <option value="">선택하세요</option>
              {LANGUAGE_TEST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* 점수 입력 */}
            {testType && (
              <input
                type="text"
                placeholder={testType === "기타" ? "어학 시험과 점수를 입력해주세요" : "점수를 입력하세요"}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="body-2 focus:border-primary-blue rounded-[8px] border border-gray-300 px-[16px] py-[14px] focus:outline-none"
              />
            )}
          </div>
        </section>

        {/* 에러 메시지 */}
        {error && <p className="caption-2 text-error-red mt-[16px]">{error}</p>}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[420px] -translate-x-1/2 px-[20px] pb-[20px]">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-primary body-1 w-full rounded-[4px] p-[12px]"
        >
          {isSubmitting ? "등록 중..." : "다음"}
        </button>
      </div>
    </div>
  );
}
