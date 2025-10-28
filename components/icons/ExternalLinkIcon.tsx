interface ExternalLinkIconProps {
  className?: string;
  size?: number;
}

export default function ExternalLinkIcon({ className, size = 12 }: ExternalLinkIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 6.66667V10C10 10.1768 9.92976 10.3464 9.80474 10.4714C9.67971 10.5964 9.51014 10.6667 9.33333 10.6667H2C1.82319 10.6667 1.65362 10.5964 1.5286 10.4714C1.40357 10.3464 1.33333 10.1768 1.33333 10V2.66667C1.33333 2.48986 1.40357 2.32029 1.5286 2.19526C1.65362 2.07024 1.82319 2 2 2H5.33333M8 1.33333H10.6667V4M5 7L10.6667 1.33333" />
    </svg>
  );
}
