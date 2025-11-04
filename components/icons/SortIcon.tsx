interface SortIconProps {
  className?: string;
  size?: number;
}

export default function SortIcon({ className, size = 14 }: SortIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 위 화살표 */}
      <g clipPath="url(#clip0_sort_up)">
        <path
          d="M7.263 2.01804C7.11204 1.86052 6.88796 1.86052 6.737 2.01804L3.63955 5.24998C3.35837 5.54337 3.53058 6.0999 3.90255 6.0999L10.0975 6.0999C10.4694 6.0999 10.6416 5.54337 10.3605 5.24998L7.263 2.01804Z"
          fill="currentColor"
        />
      </g>
      {/* 아래 화살표 */}
      <g clipPath="url(#clip1_sort_down)">
        <path
          d="M7.263 13.982C7.11204 14.1395 6.88796 14.1395 6.737 13.982L3.63955 10.75C3.35837 10.4566 3.53058 9.9001 3.90255 9.9001L10.0975 9.9001C10.4694 9.9001 10.6416 10.4566 10.3605 10.75L7.263 13.982Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_sort_up">
          <rect width="14" height="6" fill="white" transform="translate(0 0)" />
        </clipPath>
        <clipPath id="clip1_sort_down">
          <rect width="14" height="6" y="10" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
