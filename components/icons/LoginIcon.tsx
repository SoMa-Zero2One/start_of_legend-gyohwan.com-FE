interface LoginIconProps {
  className?: string;
  size?: number;
}

export default function LoginIcon({ className, size = 20 }: LoginIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 6.5C8.00838 4.97748 8.07517 4.15294 8.60719 3.61508C9.21561 3 10.1948 3 12.1532 3H12.8456C14.804 3 15.7832 3 16.3916 3.61508C17 4.23015 17 5.2201 17 7.2V12.8C17 14.7799 17 15.7698 16.3916 16.3849C15.7832 17 14.804 17 12.8456 17H12.1532C10.1948 17 9.21561 17 8.60719 16.3849C8.07517 15.847 8.00838 15.0225 8 13.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M3 10L12 10M12 10L9.57692 12M12 10L9.57692 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
