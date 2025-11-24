import { cloneElement } from "react";
import type { ReactElement } from "react";
import Link from "next/link";

interface NavigationCardProps {
  href: string;
  label: string;
  children: ReactElement<{ className?: string }>;
  showNewBadge?: boolean;
  openInNewTab?: boolean;
}

export default function NavigationCard({
  href,
  label,
  children,
  showNewBadge = false,
  openInNewTab = false,
}: NavigationCardProps) {
  const linkProps = openInNewTab
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  const desktopIconClassName = [children.props.className, "h-[28px] w-[28px] shrink-0"].filter(Boolean).join(" ");
  const desktopIcon = cloneElement(children, {
    className: desktopIconClassName,
  });
  const shouldShowDesktopIcon = !showNewBadge;

  return (
    <Link href={href} className="group" {...linkProps}>
      {/* 모바일 레이아웃: 세로 카드 */}
      <div className="flex flex-col items-center justify-between gap-[8px] 2xl:hidden">
        <div className="relative rounded-[10px] bg-white p-[12px] shadow-[0_0_8px_0_rgba(0,0,0,0.06)] group-hover:shadow-md">
          {children}
          {showNewBadge && (
            <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 rounded-[4px] bg-[#FF2D62] px-[4px] py-[2px] text-[10px] font-bold text-white">
              NEW
            </div>
          )}
        </div>
        <span className="medium-caption-1">{label}</span>
      </div>

      {/* 데스크탑 레이아웃: 텍스트 링크 */}
      <div className="hover:text-primary-blue relative hidden items-center gap-[8px] text-gray-900 transition-colors duration-200 2xl:flex">
        {shouldShowDesktopIcon && <span className="flex items-center justify-center">{desktopIcon}</span>}
        {showNewBadge && (
          <div className="flex h-[16px] w-[32px] items-center justify-center rounded-[4px] bg-[#FF2D62] text-[10px] leading-none font-bold text-white">
            NEW
          </div>
        )}
        <span className="subhead-2">{label}</span>
      </div>
    </Link>
  );
}
