interface CheckIconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export default function CheckIcon({ className, size = 20, strokeWidth = 2 }: CheckIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
