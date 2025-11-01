interface TrashIconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export default function TrashIcon({ className, size = 20, strokeWidth = 1.5 }: TrashIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.5 5H17.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8.33333 8.33333V13.3333" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M11.6667 8.33333V13.3333" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path
        d="M3.33333 5L4.16667 16.6667C4.16667 17.5871 4.91286 18.3333 5.83333 18.3333H14.1667C15.0871 18.3333 15.8333 17.5871 15.8333 16.6667L16.6667 5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 5V3.33333C7.5 2.41286 8.24619 1.66667 9.16667 1.66667H10.8333C11.7538 1.66667 12.5 2.41286 12.5 3.33333V5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
