import { authHandlers } from "./auth";
import { userHandlers } from "./user";
import { seasonHandlers } from "./season";
import { slotHandlers } from "./slot";
import { communityHandlers } from "./community";
import { countryHandlers } from "./country";

// 모든 MSW 핸들러를 하나로 합침
export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...seasonHandlers,
  ...slotHandlers,
  ...communityHandlers,
  ...countryHandlers,
];
