export default function InfoBox() {
  return (
    <div className="relative border border-[#056DFF] text-[#056DFF] rounded-[10px] p-[16px] w-fit">
      <span className="absolute -top-3 left-[12px] bg-white font-bold text-[14px] px-[8px]">
        Point!
      </span>
      개인 정보는 공개되지 않으며,<br />
      <span>공유용 닉네임이 자동으로 생성돼요!</span>
    </div>
  );
}
