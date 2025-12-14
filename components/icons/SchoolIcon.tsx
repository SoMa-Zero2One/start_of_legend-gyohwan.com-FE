interface SchoolIconProps {
  size?: number;
  className?: string;
}

export default function SchoolIcon({ size = 18, className = "" }: SchoolIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1.125 6.75L9 2.25L16.875 6.75L9 11.25L1.125 6.75Z"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.9375 8.4375V12.9375L9 15.75L14.0625 12.9375V8.4375"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.875 12.9375V6.75"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 11.25V15.75"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
