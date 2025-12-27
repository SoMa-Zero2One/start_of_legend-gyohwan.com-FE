"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PrevIcon from "@/components/icons/PrevIcon";
import SearchIcon from "@/components/icons/SearchIcon";

interface SearchHeaderDialogProps {
  isOpen: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  placeholder?: string;
  showBackButton?: boolean;
}

export default function SearchHeaderDialog({
  isOpen,
  value,
  onChange,
  onClose,
  placeholder = "검색어를 입력하세요",
  showBackButton = true,
}: SearchHeaderDialogProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastFocusedElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    lastFocusedElement.current = document.activeElement;
    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const previous = lastFocusedElement.current;
      if (previous instanceof HTMLElement) {
        previous.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center bg-white xl:hidden">
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        className="flex h-[50px] w-full max-w-[440px] items-center gap-3 border-b border-gray-300 px-5 md:max-w-[880px]"
      >
        {showBackButton && (
          <button
            type="button"
            aria-label="뒤로가기"
            className="flex h-5 w-5 items-center justify-center"
            onClick={onClose}
          >
            <PrevIcon size={14} />
          </button>
        )}
        <div className="relative flex flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-[4px] bg-gray-100 py-2 pr-14 pl-10 text-[14px] focus:outline-none"
          />
          <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
            <SearchIcon size={16} />
          </div>
        </div>
        <button type="button" className="cursor-pointer text-[14px] text-gray-700" onClick={onClose}>
          취소
        </button>
      </div>
    </div>,
    document.body
  );
}
