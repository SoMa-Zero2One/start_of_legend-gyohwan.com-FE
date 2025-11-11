interface PaginationNextIconProps {
  size?: number;
  className?: string;
}

export default function PaginationNextIcon({ size = 24, className = "" }: PaginationNextIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14.9201 12.202L9.46546 17.9165C9.41429 17.97 9.34494 18 9.27264 18C9.20034 18 9.13101 17.9699 9.07989 17.9163C9.02876 17.8628 9.00003 17.7901 9 17.7144C8.99997 17.6386 9.02865 17.566 9.07973 17.5124L14.3416 12L9.07973 6.48762C9.02865 6.43402 8.99997 6.36136 9 6.28562C9.00003 6.20988 9.02876 6.13725 9.07989 6.08369C9.13101 6.03013 9.20034 6.00003 9.27264 6C9.34494 5.99997 9.41429 6.03001 9.46546 6.08352L14.9201 11.798C14.9713 11.8515 15 11.9242 15 12C15 12.0758 14.9713 12.1485 14.9201 12.202Z"
        fill="currentColor"
      />
    </svg>
  );
}
