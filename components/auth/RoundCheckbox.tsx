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
          {checked && (
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span>{label}</span>
    </label>
  );
}
