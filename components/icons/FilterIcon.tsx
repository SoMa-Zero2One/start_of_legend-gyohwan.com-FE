interface FilterIconProps {
  className?: string;
  size?: number;
}

export default function FilterIcon({ className, size = 20 }: FilterIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_300_1803)">
        <path
          d="M2.99609 5H16.9961M5.62124 10H14.3709M7.37094 15H12.6212"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_300_1803">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
