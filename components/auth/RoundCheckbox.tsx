import CheckIcon from "@/components/icons/CheckIcon";

interface RoundCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export default function RoundCheckbox({ checked, onChange, label }: RoundCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 select-none">
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
