"use client";

import ShareIcon from "@/components/icons/ShareIcon";

interface FloatingActionButtonProps {
  label: string;
  onClick: () => void;
  isVisible: boolean;
}

export default function FloatingActionButton({ label, onClick, isVisible }: FloatingActionButtonProps) {
  return (
    <div
      className={`fixed right-6 bottom-8 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* 툴팁 */}
      <div className="absolute -top-[45px] right-0 z-10 whitespace-nowrap">
        <div className="caption-2 inline-block rounded-md bg-black px-4 py-2 text-white">{label}</div>
        <div className="absolute right-[20px] -bottom-[5px] h-0 w-0 border-t-8 border-r-8 border-l-8 border-t-black border-r-transparent border-l-transparent" />
      </div>

      {/* 버튼 */}
      <button
        onClick={onClick}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95 cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #00D0FF 0%, #029EFA 50%, #056DFF 100%)",
        }}
        aria-label={label}
      >
        <ShareIcon />
      </button>
    </div>
  );
}
