import CheckIcon from "@/components/icons/CheckIcon";

interface RoundCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  wrapperClassName?: string;
}

/**
 * 접근성을 고려한 체크박스 컴포넌트
 *
 * @note 내부적으로 <label> 요소를 사용하여 스크린 리더와 키보드 접근성을 보장합니다.
 * @note 이벤트 위임이 필요한 경우, 부모 요소의 onClick이 아닌 onChange prop을 사용하세요.
 *
 * @example
 * // ✅ 올바른 사용
 * <RoundCheckbox checked={value} onChange={setValue} />
 *
 * @example
 * // ❌ 작동 안 함 (label이 클릭 이벤트 가로챔)
 * <div onClick={handleClick}>
 *   <RoundCheckbox checked={value} />
 * </div>
 *
 * @param checked - 체크박스의 체크 상태
 * @param onChange - 체크 상태 변경 시 호출되는 핸들러 (필수)
 * @param label - 체크박스 옆에 표시할 라벨 텍스트 (선택)
 */
export default function RoundCheckbox({ checked, onChange, label, wrapperClassName = "" }: RoundCheckboxProps) {
  return (
    <label className={`flex cursor-pointer items-center ${wrapperClassName} ${label ? "gap-[12px]" : ""} select-none`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="peer-checked:border-primary-blue peer-checked:bg-primary-blue flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-gray-300">
          {checked && <CheckIcon className="text-white" size={12} strokeWidth={3} />}
        </div>
      </div>
      <span>{label}</span>
    </label>
  );
}
