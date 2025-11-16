interface ToastProps {
  message: string | null;
  type?: "error" | "info";
  isExiting?: boolean;
  onClose?: () => void;
}

export default function Toast({ message, type = "error", isExiting = false, onClose }: ToastProps) {
  if (!message) return null;

  // type에 따라 스타일 결정
  // error: btn-secondary 스타일 (검정 배경)
  // info: btn-primary 스타일 (파란 배경)
  const bgStyle = type === "info" ? "bg-primary-blue" : "bg-black";

  return (
    <div
      className={`fixed top-[180px] left-1/2 z-50 -translate-x-1/2 cursor-pointer ${isExiting ? "animate-fade-out" : "animate-fade-in"}`}
      onClick={onClose}
    >
      <div className={`caption-2 rounded-md ${bgStyle} px-4 py-2 text-white`}>{message}</div>
    </div>
  );
}
