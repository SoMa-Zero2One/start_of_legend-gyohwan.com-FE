type ToastMessage = {
  message: string;
  type?: "error" | "info";
  seasonId?: number;
};

const TOAST_STORAGE_KEY = "gyohwan_toast_message";

export function setToastMessage(payload: ToastMessage) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(TOAST_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage failures
  }
}

export function consumeToastMessage(): ToastMessage | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(TOAST_STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(TOAST_STORAGE_KEY);
    const parsed = JSON.parse(raw) as ToastMessage;
    if (!parsed || typeof parsed.message !== "string") {
      return null;
    }
    return parsed;
  } catch {
    try {
      sessionStorage.removeItem(TOAST_STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
    return null;
  }
}
