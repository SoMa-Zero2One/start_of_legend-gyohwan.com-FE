export default function InfoBox() {
  return (
    <div className="body-2 border-primary-blue text-primary-blue relative w-fit rounded-[10px] border p-[16px]">
      <span className="g-subhead-3 absolute -top-3 left-[12px] bg-white px-[8px]">Point!</span>
      개인 정보는 공개되지 않으며,
      <br />
      <span>공유용 닉네임이 자동으로 생성돼요!</span>
    </div>
  );
}
