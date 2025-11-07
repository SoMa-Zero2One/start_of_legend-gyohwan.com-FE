import Link from "next/link";

interface NavigationCardProps {
  href: string;
  label: string;
  children: React.ReactNode;
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

  return (
    <Link href={href} className="group flex flex-col items-center justify-between gap-[8px]" {...linkProps}>
      <div className="relative rounded-[10px] bg-white p-[12px] shadow-[0_0_8px_0_rgba(0,0,0,0.06)] group-hover:shadow-md">
        {children}
        {showNewBadge && (
          <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 rounded-[4px] bg-[#FF2D62] px-[4px] py-[2px] text-[10px] font-bold text-white">
            NEW
          </div>
        )}
      </div>
      <span className="medium-caption-1">{label}</span>
    </Link>
  );
}
