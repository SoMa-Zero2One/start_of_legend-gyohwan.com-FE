interface ChevronDownIconProps {
  className?: string;
  size?: number;
}

export default function ChevronDownIcon({ className, size = 14 }: ChevronDownIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_chevron_down)">
        <path
          d="M7.263 8.98196C7.11204 9.13948 6.88796 9.13948 6.737 8.98196L3.63955 5.75002C3.35837 5.45663 3.53058 4.9001 3.90255 4.9001L10.0975 4.9001C10.4694 4.9001 10.6416 5.45663 10.3605 5.75002L7.263 8.98196Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_chevron_down">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
