interface PaginationPrevIconProps {
  size?: number;
  className?: string;
}

export default function PaginationPrevIcon({ size = 24, className = "" }: PaginationPrevIconProps) {
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
        d="M9.07988 12.202L14.5345 17.9165C14.5857 17.97 14.6551 18 14.7274 18C14.7997 18 14.869 17.9699 14.9201 17.9163C14.9712 17.8628 15 17.7901 15 17.7144C15 17.6386 14.9714 17.566 14.9203 17.5124L9.65844 12L14.9203 6.48762C14.9714 6.43402 15 6.36136 15 6.28562C15 6.20988 14.9712 6.13725 14.9201 6.08369C14.869 6.03013 14.7997 6.00003 14.7274 6C14.6551 5.99997 14.5857 6.03001 14.5345 6.08352L9.07988 11.798C9.02873 11.8515 9 11.9242 9 12C9 12.0758 9.02873 12.1485 9.07988 12.202Z"
        fill="currentColor"
      />
    </svg>
  );
}
