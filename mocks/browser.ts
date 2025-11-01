import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// MSW 브라우저 워커 설정
export const worker = setupWorker(...handlers);

// 개발 환경에서만 MSW 활성화
export async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  return worker.start({
    onUnhandledRequest: "warn", // 처리되지 않은 요청에 대해 경고
  });
}
