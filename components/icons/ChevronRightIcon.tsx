interface ChevronRightIconProps {
  className?: string;
  size?: number;
}

export default function ChevronRightIcon({ className, size = 18 }: ChevronRightIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
