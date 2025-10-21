interface PencilIconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export default function PencilIcon({ className, size = 20, strokeWidth = 1.2 }: PencilIconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.3335 18.3333H16.6668" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M12.1915 2.43452L11.5736 3.05245L5.89271 8.73325C5.50794 9.118 5.31555 9.31042 5.1501 9.52259C4.95492 9.77275 4.78759 10.0435 4.65106 10.33C4.53532 10.5728 4.44928 10.831 4.27721 11.3473L3.54804 13.5348L3.3698 14.0694C3.28511 14.3235 3.35123 14.6036 3.54058 14.7929C3.72994 14.9823 4.01001 15.0484 4.26406 14.9637L4.79878 14.7855L6.98628 14.0563C7.50248 13.8843 7.76063 13.7982 8.00348 13.6824C8.28996 13.5459 8.56075 13.3786 8.81091 13.1834C9.02308 13.0179 9.21541 12.8256 9.60025 12.4408L15.2811 6.75996L15.899 6.14204C16.9227 5.11824 16.9227 3.45833 15.899 2.43452C14.8752 1.41072 13.2152 1.41072 12.1915 2.43452Z" stroke="currentColor" strokeWidth={strokeWidth}/>
      <path d="M11.5733 3.05339C11.5733 3.05339 11.6506 4.36647 12.8092 5.52507C13.9678 6.68367 15.2809 6.76091 15.2809 6.76091M4.79859 14.7864L3.54785 13.5357" stroke="currentColor" strokeWidth={strokeWidth}/>
    </svg>
  );
}
