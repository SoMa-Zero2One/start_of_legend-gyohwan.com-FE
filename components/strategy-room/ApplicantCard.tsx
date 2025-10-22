import Image from "next/image";
import { Choice } from "@/types/slot";

interface ApplicantCardProps {
  choice: Choice;
  onClick?: () => void;
}

export default function ApplicantCard({ choice, onClick }: ApplicantCardProps) {
  // 지망 순위에 따른 이미지 경로 (5지망 이상은 5지망 이미지 사용)
  const priorityImage = choice.choice <= 5 ? `/images/priority-${choice.choice}.png` : "/images/priority-5.png";

  // 어학성적 표시 (languageTest languageGrade languageScore 형식)
  const languageDisplay =
    choice.languageTest && choice.languageGrade
      ? [choice.languageTest, choice.languageGrade, choice.languageScore].filter(Boolean).join(' ')
      : choice.languageTest
        ? choice.languageTest
        : "-";

  // 환산점수 표시
  const scoreDisplay = choice.score !== null ? choice.score.toFixed(2) : "-";

  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-col gap-[16px] rounded-[8px] bg-white p-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:bg-gray-50"
    >
      {/* 닉네임 */}
      <h3 className="subhead-3">{choice.nickname}</h3>

      {/* 정보 그리드 */}
      <div className="grid grid-cols-2 gap-x-[24px] gap-y-[12px]">
        {/* 왼쪽 열 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">지망</span>
          <div className="flex items-center gap-[4px]">
            <Image src={priorityImage} alt={`${choice.choice}지망`} width={16} height={16} />
            <span>
              <span className="font-bold">{choice.choice}</span> 지망
            </span>
          </div>
        </div>

        {/* 오른쪽 열 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">환산점수</span>
          <span>
            <span className="font-bold">{scoreDisplay}</span> {choice.score !== null ? "점" : ""}
          </span>
        </div>

        {/* 왼쪽 열 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">학점</span>
          <span>
            <span className="font-bold">{choice.gpaScore !== null ? choice.gpaScore : "-"}</span>
            {choice.gpaCriteria !== null ? `/${choice.gpaCriteria} 점` : ""}
          </span>
        </div>

        {/* 오른쪽 열 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">어학성적</span>
          <span>
            <span className="font-bold">{languageDisplay}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
