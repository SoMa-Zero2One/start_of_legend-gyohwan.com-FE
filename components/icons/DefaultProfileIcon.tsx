interface DefaultProfileIconProps {
  size?: number;
  className?: string;
}

export default function DefaultProfileIcon({ size = 20, className = "" }: DefaultProfileIconProps) {
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
        d="M10 9C12.2091 9 14 7.20914 14 5C14 2.79086 12.2091 1 10 1C7.79086 1 6 2.79086 6 5C6 7.20914 7.79086 9 10 9Z"
        fill="#7F7F7F"
      />
      <path
        d="M17.002 14.5C17.002 16.985 17.002 19 10.002 19C3.00201 19 3.00201 16.985 3.00201 14.5C3.00201 12.015 6.13601 10 10.002 10C13.868 10 17.002 12.015 17.002 14.5Z"
        fill="#7F7F7F"
      />
    </svg>
  );
}
