interface MoreIconProps {
  className?: string;
  size?: number;
}

export default function MoreIcon({ className, size = 20 }: MoreIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
      <circle cx="5" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}
