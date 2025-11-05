interface ToastProps {
  message: string | null;
  isExiting?: boolean;
  onClose?: () => void;
}

export default function Toast({ message, isExiting = false, onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div
      className={`fixed top-[180px] left-1/2 z-50 -translate-x-1/2 ${isExiting ? "animate-fade-out" : "animate-fade-in"}`}
      onClick={onClose}
    >
      <div className="caption-2 cursor-pointer rounded-md bg-black px-4 py-2 text-white">{message}</div>
    </div>
  );
}
