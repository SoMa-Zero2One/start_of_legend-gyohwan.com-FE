import { http, passthrough } from "msw";
import { authHandlers } from "./auth";
import { userHandlers } from "./user";
import { seasonHandlers } from "./season";
import { slotHandlers } from "./slot";
import { communityHandlers } from "./community";
import { countryHandlers } from "./country";
import { communityPostsHandlers } from "./communityPosts";
import { universityHandlers } from "./university";

// 모든 MSW 핸들러를 하나로 합침
export const handlers = [
  // Google Maps/Street View 요청은 MSW 거치지 않고 직접 통과
  http.get("https://lh3.googleusercontent.com/*", () => passthrough()),
  http.get("https://lh3.ggpht.com/*", () => passthrough()),
  http.get("https://maps.googleapis.com/*", () => passthrough()),

  ...authHandlers,
  ...userHandlers,
  ...seasonHandlers,
  ...slotHandlers,
  ...communityHandlers,
  ...countryHandlers,
  ...communityPostsHandlers,
  ...universityHandlers,
];
