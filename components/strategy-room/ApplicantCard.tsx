import Image from "next/image";
import { Choice } from "@/types/slot";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";

interface ApplicantCardProps {
  choice: Choice;
  onClick?: () => void;
  isBlurred?: boolean; // hasApplied=false일 때 blur 처리
  isMe?: boolean; // 내 정보인지 여부
}

export default function ApplicantCard({ choice, onClick, isBlurred = false, isMe = false }: ApplicantCardProps) {
  // 지망 순위에 따른 이미지 경로 (5지망 이상은 5지망 이미지 사용)
  const priorityImage = choice.choice <= 5 ? `/images/priority-${choice.choice}.png` : "/images/priority-5.png";

  // 어학성적 표시 (languageTest languageGrade languageScore 형식)
  const languageDisplay = isBlurred
    ? "TOEFL 110"
    : choice.languageTest
      ? [choice.languageTest, choice.languageGrade, choice.languageScore].filter(Boolean).join(" ")
      : "-";

  // 환산점수 표시
  const scoreDisplay = isBlurred ? "95.50" : choice.score !== null ? choice.score.toFixed(2) : "-";

  // 학점 표시
  const gpaDisplay = isBlurred ? "4.3" : choice.gpaScore !== null ? choice.gpaScore : "-";
  const gpaCriteriaDisplay = isBlurred ? "4.5" : choice.gpaCriteria;

  // 가산점 표시
  const extraScoreDisplay = isBlurred ? "5.0" : choice.extraScore !== null ? choice.extraScore : "-";

  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer flex-col gap-[16px] rounded-[8px] bg-white p-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-150 hover:bg-gray-100 active:scale-[0.98] active:bg-gray-300 ${isMe ? "ring-2 ring-[#056DFF] ring-offset-2" : ""}`}
    >
      {/* 닉네임 + ME 배지 + 자세히 보기 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[8px]">
          <h3 className="subhead-3">{choice.nickname}</h3>
          {isMe && (
            <span className="bg-primary-blue rounded-[4px] px-[6px] py-[2px] text-[11px] font-bold text-white">ME</span>
          )}
        </div>
        <div className="text-primary-blue flex items-center gap-[4px]">
          <span className="caption-2">자세히 보기</span>
          <ChevronRightIcon size={14} />
        </div>
      </div>

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
          <span className={isBlurred ? "blur-sm select-none" : ""}>
            <span className="font-bold">{scoreDisplay}</span> {(isBlurred || choice.score !== null) && "점"}
          </span>
        </div>

        {/* 왼쪽 열 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">학점</span>
          <span className={isBlurred ? "blur-sm select-none" : ""}>
            <span className="font-bold">{gpaDisplay}</span>
            {gpaCriteriaDisplay && `/${gpaCriteriaDisplay} 점`}
          </span>
        </div>

        {/* 오른쪽 열 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">어학성적</span>
          <span className={isBlurred ? "blur-sm select-none" : ""}>
            <span className="font-bold">{languageDisplay}</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">가산점</span>
          <span className={isBlurred ? "blur-sm select-none" : ""}>
            <span className="font-bold">{extraScoreDisplay}</span> {(isBlurred || choice.extraScore !== null) && "점"}
          </span>
        </div>
      </div>
    </div>
  );
}
