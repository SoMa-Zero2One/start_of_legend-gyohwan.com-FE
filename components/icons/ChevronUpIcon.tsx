interface ChevronUpIconProps {
  className?: string;
  size?: number;
}

export default function ChevronUpIcon({ className, size = 14 }: ChevronUpIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_chevron_up)">
        <path
          d="M7.263 5.01804C7.11204 4.86052 6.88796 4.86052 6.737 5.01804L3.63955 8.24998C3.35837 8.54337 3.53058 9.0999 3.90255 9.0999L10.0975 9.0999C10.4694 9.0999 10.6416 8.54337 10.3605 8.24998L7.263 5.01804Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_chevron_up">
          <rect width="14" height="14" fill="white" transform="matrix(1 0 0 -1 0 14)" />
        </clipPath>
      </defs>
    </svg>
  );
}
