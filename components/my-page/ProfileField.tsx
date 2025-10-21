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
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="medium-body-3 flex items-center justify-between">
        <label>{label}</label>
        {buttonText && onButtonClick && (
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
          className="w-full rounded-[4px] bg-gray-100 px-4 py-3 text-gray-700"
        />
        {showCheckIcon && (
          <CheckIcon size={20} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500" />
        )}
      </div>
    </div>
  );
}
