import CheckIcon from "@/components/icons/CheckIcon";

interface ProfileFieldProps {
  label: string;
  value: string;
  buttonText?: string;
  onButtonClick?: () => void;
  showCheckIcon?: boolean;
}

export default function ProfileField({
  label,
  value,
  buttonText,
  onButtonClick,
  showCheckIcon = false,
}: ProfileFieldProps) {
  const isActionVisible = Boolean(buttonText && onButtonClick);

  return (
    <div className="flex flex-col gap-[8px] lg:gap-[10px]">
      <div className="medium-body-3 flex items-center justify-between lg:text-[16px] lg:leading-[24px]">
        <label>{label}</label>
        {isActionVisible && (
          <button onClick={onButtonClick} className="text-primary-blue cursor-pointer hover:underline">
            {buttonText}
          </button>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          value={value}
          disabled
          className="w-full rounded-[8px] border border-gray-200 bg-gray-50 px-3 py-3 text-gray-900 lg:rounded-[12px] lg:px-5 lg:py-4"
        />
        {showCheckIcon && <CheckIcon size={20} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500" />}
      </div>
    </div>
  );
}
