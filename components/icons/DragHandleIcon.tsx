interface DragHandleIconProps {
  className?: string;
  size?: number;
}

export default function DragHandleIcon({ className, size = 20 }: DragHandleIconProps) {
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
        d="M8 5H8.01M8 10H8.01M8 15H8.01M12 5H12.01M12 10H12.01M12 15H12.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
