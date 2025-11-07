interface HeartIconProps {
  className?: string;
  size?: number;
  filled?: boolean;
}

export default function HeartIcon({ className, size = 18, filled = false }: HeartIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_370_12965)">
        <path
          d="M11.6961 3.16799C12.7586 3.23111 13.7551 3.70419 14.4756 4.48754C15.1962 5.27089 15.5846 6.30335 15.5589 7.36739C15.5589 11.4714 9.1149 14.832 8.9979 14.832C8.8809 14.832 2.4387 11.4714 2.4387 7.36739C2.41303 6.30335 2.8014 5.27089 3.52196 4.48754C4.24252 3.70419 5.23902 3.23111 6.30149 3.16799C6.81578 3.16332 7.32469 3.27278 7.79158 3.48848C8.25846 3.70418 8.67169 4.02075 9.00149 4.41539C9.33072 4.02146 9.74308 3.70531 10.209 3.48964C10.6749 3.27397 11.1827 3.16412 11.6961 3.16799Z"
          fill={filled ? "#FC507B" : "none"}
          stroke={filled ? "#FC507B" : "#7F7F7F"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_370_12965">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
