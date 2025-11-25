interface DownIconProps {
  className?: string;
  size?: number;
}

export default function DownIcon({ className, size = 24 }: DownIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 16L6 10L7.4 8.6L12 13.2L16.6 8.6L18 10L12 16Z"
        fill="currentColor"
      />
    </svg>
  );
}
