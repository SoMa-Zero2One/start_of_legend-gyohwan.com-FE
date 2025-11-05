"use client";

interface FavoriteFilterToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function FavoriteFilterToggle({ checked, onChange }: FavoriteFilterToggleProps) {
  return (
    <div className="fixed bottom-0 left-1/2 z-100 w-full max-w-[430px] -translate-x-1/2 bg-white px-[20px] pb-[20px]">
      {/* 그라데이션 */}
      <div className="pointer-events-none absolute -top-[60px] left-0 h-[60px] w-full bg-gradient-to-t from-white to-transparent" />

      <div className="flex items-center justify-between rounded-[8px] bg-gray-50 px-[16px] py-[12px]">
        <span className="subhead-3">즐겨찾기만 보기</span>
        <button
          onClick={() => onChange(!checked)}
          className={`relative h-[24px] w-[44px] cursor-pointer rounded-full transition-colors ${
            checked ? "bg-primary-blue" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-[2px] h-[20px] w-[20px] rounded-full bg-white transition-transform ${
              checked ? "translate-x-[22px]" : "translate-x-[2px]"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
