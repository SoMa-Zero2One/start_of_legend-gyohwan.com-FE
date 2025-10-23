"use client";

interface UniversitySelectionStepProps {
  seasonId: number;
  gpaId: number | null;
  languageId: number | null;
}

export default function UniversitySelectionStep({
  seasonId,
  gpaId,
  languageId,
}: UniversitySelectionStepProps) {
  return (
    <div className="flex flex-1 flex-col p-[20px]">
      <p className="caption-1 text-primary-blue mb-[8px]">Step 02</p>
      <h1 className="head-4 mb-[32px]">지망 대학 등록하기</h1>
      <p className="body-2 text-gray-600">
        지망 대학 등록 화면 (구현 예정)
      </p>
      <p className="caption-2 mt-[12px] text-gray-500">
        GPA ID: {gpaId}, Language ID: {languageId}
      </p>
    </div>
  );
}
